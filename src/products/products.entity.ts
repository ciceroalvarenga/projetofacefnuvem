import { CosmosPartitionKey } from '@nestjs/azure-database';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsString,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsEmpty,
} from 'class-validator';

@CosmosPartitionKey('id')
export class Product {
  id?: string;

  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  @MaxLength(100, { message: 'Maximo de 100 caracteres' })
  @ApiProperty()
  nome: string;

  @IsNotEmpty({ message: 'O descricao não pode estar vazio.' })
  @MaxLength(500, { message: 'Maximo de 500 caracteres' })
  @ApiProperty()
  descricao: string;

  @IsDecimal({ decimal_digits: '0,2' })
  @ApiProperty()
  valor: number;

  @IsEmpty()
  @ApiProperty()
  valorPromocao: number;

  @IsNumber()
  @ApiProperty()
  percentual_desconto: number;

  @IsBoolean({ message: 'O promocao deve ser boleano.' })
  @ApiProperty()
  promocao: boolean;

  @IsString({ message: 'A url_imagem deve ser uma string.' })
  @ApiProperty()
  url_imagem: string;
}
