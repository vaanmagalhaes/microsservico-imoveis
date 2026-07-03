import { Module } from '@nestjs/common';
import { DespesasController } from './controllers/despesas.controller';
import { DespesasService } from './services/despesas.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
    controllers: [DespesasController],
    providers: [DespesasService, PrismaService],
})

export class DespesasModule {}