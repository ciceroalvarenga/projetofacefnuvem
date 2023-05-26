/* eslint-disable no-console */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { InjectModel } from '@nestjs/azure-database';
import { Container } from '@azure/cosmos';
import { ProductDTO } from './products.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productsContainer: Container,
  ) {}

  async findAll(): Promise<Product[]> {
    const sqlQuery = 'select * from c';

    const cosmosResults = await this.productsContainer.items
      .query<Product>(sqlQuery)
      .fetchAll();

    return cosmosResults?.resources;
  }

  async findOne(id: string): Promise<Product> {
    try {
      const querySpec = {
        query: 'SELECT * FROM c r WHERE r.id=@id',
        parameters: [
          {
            name: '@id',
            value: id,
          },
        ],
      };
      const { resources } = await this.productsContainer.items
        .query<Product>(querySpec)
        .fetchAll();
      return resources[0];
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async create(product: Product): Promise<Product> {
    const validationErrors = await validate(plainToClass(Product, product));
    if (validationErrors.length > 0) {
      throw new BadRequestException(validationErrors);
    }

    product.valorPromocao = parseFloat(
      (
        product.valor -
        product.valor * (product.percentual_desconto / 100)
      ).toFixed(2),
    );

    const { resource } = await this.productsContainer.items.create(product);
    return resource;
  }

  async update(id: string, product: ProductDTO): Promise<Product> {
    try {
      const { resource } = await this.productsContainer
        .item(id, id)
        .read<Product>();

      Object.assign(resource, product);
      const { resource: replaced } = await this.productsContainer
        .item(id, id)
        .replace<Product>(resource);

      return replaced;
    } catch (error) {
      throw new NotFoundException('Produto não encontrado');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.productsContainer.item(id, id).delete<Product>();
      return 'Produto excluido com sucesso';
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
