import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { inspect } from "util";

export class CriarContratoDto {
    @ApiProperty({ example: 1, description: 'ID do Imóvel no banco local (Catálogo)'})
    @IsNumber()
    @IsNotEmpty()
    idImovel: number;

    @ApiProperty({ example: 5, description: 'ID do Locador'})
    @IsNumber()
    @IsNotEmpty()
    idLocador: number;

    @ApiProperty({ example: 12, description: 'ID do Locatário'})
    @IsNumber()
    @IsNotEmpty()
    idLocatario: number;

    @ApiProperty({ example: '2026-07-01', description: 'Data de início da vigência do contrato'})
    //O @Type(() => Date) serve para converter a string 'YYYY-MM-DD' que chega no JSON para um objeto Date real no JavaScript
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    dataInicio: Date;

    @ApiPropertyOptional({ example: '2027-07-01', description: 'Data prevista para o fim do contrato'})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dataFim?: Date;

    @ApiPropertyOptional({ example: '2027-01-01', description: 'Data prevista para o reajuste anual'})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dataReajuste?: Date;

    @ApiProperty({example: 2500.50, description: 'Valor mensal do aluguel'})
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    valorAluguel: number;
}