import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './common/auth/auth.module';
import { ImoveisModule } from './modules/imoveis/imoveis.module';

@Module({
  //Importei o DatabaseModule (que contém o Prisma) e o HealthModule.
  //Como o DatabaseModule é @Global(), o HealthService já consegue usar o Prisma automaticamente.
  imports: [DatabaseModule, HealthModule, AuthModule, ImoveisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}