import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import 'dotenv/config'; // Garanto a leitura do .env logo na montagem da classe
import { PrismaClient } from '../generated/prisma';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Aqui eu recupero as configurações do banco diretamente das variáveis
    // de ambiente, evitando a necessidade de interpretar uma URL de conexão.
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Aqui eu injeto o adapter no PrismaClient para que ele utilize
    // o driver nativo do MariaDB durante toda a execução da aplicação.
    super({ adapter });
  }

  async onModuleInit() {
    // Aqui eu me conecto ao banco de dados assim que a API sobe,
    // garantindo que a conexão esteja pronta para atender às requisições.
    await this.$connect();
  }

  async onModuleDestroy() {
    // Aqui eu encerro a conexão com o banco quando a aplicação é finalizada,
    // evitando conexões pendentes e liberando os recursos utilizados.
    await this.$disconnect();
  }
}