import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  valorPromocao: number;

  @ApiProperty()
  percentual_desconto: number;

  @ApiProperty()
  promocao: boolean;

  @ApiProperty()
  url_imagem: string;
}
