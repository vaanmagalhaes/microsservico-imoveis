import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class HealthService {
    //Aqui eu injeto meu PrismaService pra poder testar a conexão real com o banco de dados
    constructor(private readonly prisma: PrismaService) {}

    async check(){
        let databaseStatus = 'OFF';

        try {
            //Faço uma query extremamente leve (SELECT 1) pra garantir que o banco está respondendo.
            //Se não der erro, o banco está "ON".
            await this.prisma.$queryRaw`SELECT 1`;
            databaseStatus = 'ON';
        } catch (error) {
            //Se o banco estiver "OFF", ele cai no catch e o status continua "OFF".
            console.error('Erro no HealthCheck do Banco de Dados:', error);
        }

        //Aqui retorno o objeto exatamente no formato que o API Gateway espera.
        return {
            status: 'ON', //Se chegamos até aqui, a API está no ar.
            servico: 'catalogo-imoveis-service',
            database: databaseStatus,
            timestamp: new Date().toISOString(),
        };
    }
}