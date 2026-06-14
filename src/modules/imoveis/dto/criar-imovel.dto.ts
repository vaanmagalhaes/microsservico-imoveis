import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { classificacao_enum, status_imovel_enum, tipologia_enum } from '../../../generated/prisma';

//Criei essa classe auxiliar para validar o bloco de endereço que vem aninhado no JSON
class EnderecoDto {
    @ApiProperty({example: 'Rua das Abelhas'})
    @IsString()
    @IsNotEmpty()
    rua: string;

    @ApiPropertyOptional({example: '123A'})
    @IsString()
    @IsOptional()
    numero?: string;

    @ApiProperty ({example: 'Centro'})
    @IsString()
    @IsNotEmpty()
    bairro: string;

    @ApiProperty({example: 'Rio de Janeiro'})
    @IsString()
    @IsNotEmpty()
    cidade: string;

    @ApiProperty({example: 'RJ', description: 'Sigla do Estado (UF)'})
    @IsString()
    @IsNotEmpty()
    estado: string;

    @ApiProperty({example: '20000-000'})
    @IsString()
    @IsNotEmpty()
    cep: string;
}

export class CriarImovelDto {
    @ApiPropertyOptional({example: 'IPTU-999888'})
    @IsString()
    @IsOptional()
    inscricaoIPTU?: string;

    @ApiPropertyOptional({example: 'BOMB-123'})
    @IsString()
    @IsOptional()
    inscricaoBombeiro?: string;

    @ApiPropertyOptional({example: '150m2'})
    @IsString()
    @IsOptional()
    metragem?: string;

    //Aqui utilizo o @IsEnum para garantir que o front-end só envie opções válidas do banco
    @ApiProperty({enum: classificacao_enum, example: 'RESIDENCIAL'})
    @IsEnum(classificacao_enum)
    classificacao: classificacao_enum;

    @ApiProperty({enum: tipologia_enum, example: 'CASA'})
    @IsEnum(tipologia_enum)
    tipologia: tipologia_enum;

    @ApiProperty({enum: status_imovel_enum, example: 'DISPONIVEL'})
    @IsEnum(status_imovel_enum)
    status: status_imovel_enum;

    //Aqui eu valido o objeto de endereço garantindo a criação em cascata (Nested Create)
    @ApiProperty({type: EnderecoDto})
    @ValidateNested()
    @Type(() => EnderecoDto)
    endereco: EnderecoDto;
}