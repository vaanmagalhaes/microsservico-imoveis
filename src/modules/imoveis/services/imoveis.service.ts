import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ImoveisService {
    //Aqui é onde eu injeto o banco de dados
    constructor(private readonly prisma: PrismaService) {}

    async listarTodos() {
        //Aqui eu faço uma busca de todos os imóveis, trazendo os dados do endereço relacionado
        return await this.prisma.imovel.findMany({
            include: {
                endereco: true,
            },
        });
    }
}