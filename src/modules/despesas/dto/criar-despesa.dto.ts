import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { tipo_despesa_enum } from '../../../generated/prisma';

export class CriarDespesaDto {
    @ApiProperty({example: 1, description: 'ID do contrato de locação vinculado'})
    @IsNumber()
    @IsNotEmpty()
    idContratoLocacao: number;

    @ApiProperty({example: 'Conserto de infiltração no banheiro social', description: 'Descrição detalhada da despesa'})
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    descricao: string;

    @ApiProperty({example: 350.00, description: 'Valor da despesa'})
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    valor: number;

    @ApiProperty({
        enum: tipo_despesa_enum,
        example: 'MANUTENCAO',
        description: 'Tipo de despesa conforme mapeamento do sistema'
    })
    @IsEnum(tipo_despesa_enum)
    @IsNotEmpty()
    tipo: tipo_despesa_enum;

    @ApiProperty({example: '2026-07-10', description: 'Data de vencimento do boleto/fatura'})
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    dataVencimento: Date;
}