import 'dotenv/config'; //Garante o carregamento das variáveis de ambiente na inicialização
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Aqui é onde eu ativo a validação global
  //Se o Gateway mandar um dado errado, o NestJS vai retornar um erro 400 (Bad Request) automaticamente
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true}));

  //CONFIGURAÇÃO DA DOCUMENTAÇÃO (SWAGGER)
  //Configurei o OpenAPI para espelhar o nosso domínio de negócios,
  //facilitando a vida na hora conectar o front-end e realizar o QA
  const config = new DocumentBuilder()
    .setTitle('API Catálogo de Imóveis')
    .setDescription('Microsserviço responsável pelo gerenciamento de Imóveis, Contratos e Despesas do ecossistema.')
    .setVersion('1.0')

    //Configurei múltiplos servidores para garantir a interoperabilidade
    //Assim, posso testar as rotas de forma isolada na porta local (3003)
    //ou rotear o tráfego simulando o ambiente real através do API Gateway.
    .addServer('http://localhost:3003', 'Ambiente Local (Isolado)')
    .addServer('http://localhost:3000/imoveis', 'API Gateway (Integrado)')

    //Adicionei a autenticação via token JWT diretamente na interface visual
    .addBearerAuth()
    .build();

  //Aqui eu mando o  NestJS compilar o documento com base nas minhas configurações
  const document = SwaggerModule.createDocument(app, config);
  
  //Aqui eu defino  a rota /api/docs como o endereço oficial da documentação, 
  //mantendo o padrão estabelecido pelo microsserviço Locador (visto no READme)
  SwaggerModule.setup('api/docs', app, document);

  //Aqui o projeto vai ser a porta do .env ou vai usar a 3003 como fallback seguro
  await app.listen(process.env.PORT || 3003);
}
bootstrap();