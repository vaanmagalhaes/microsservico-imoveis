import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import 'dotenv/config'; // Garanto a leitura do .env logo na montagem da classe
import { PrismaClient } from '../generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    //Aqui eu extraio as informações da string de conexão (URL) do .env
    const dbUrl = new URL(process.env.DATABASE_URL || 'mysql://root@localhost:3307/catalogo_imoveis');
    
    //Instancio o "Driver Adapter" nativo do Prisma 7, passando os dados desmembrados
    //É ele quem assume a responsabilidade de conversar com o banco de dados
    const adapter = new PrismaMariaDb({
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.replace('/', ''), // Tira a barra inicial do nome do banco
    });

    //Aqui eu injeto o adaptador no motor do PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    //Aqui eu me conecto ao banco de dados assim que a API sobe, garantindo que a conexão esteja pronta para as requisições
    await this.$connect();
  }

  async onModuleDestroy() {
    //Aqui eu me desconecto do banco de dados quando a API for desligada, garantindo que não haja conexões pendentes ou vazamentos de recursos
    await this.$disconnect();
  }
}