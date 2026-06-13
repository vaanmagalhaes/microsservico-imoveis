import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';

//Esse módulo foi criado para isolar a responsabilidade de monitoramento
//Ele vai encapsular toda a lógica relacionada à saúde do sistema, como checagem de dependências, status dos serviços, etc.
@Module({
    controllers: [HealthController],
    providers: [HealthService],
})

export class HealthModule {}