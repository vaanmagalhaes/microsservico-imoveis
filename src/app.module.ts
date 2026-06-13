import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  //Importei o DatabaseModule (que contém o Prisma) e o HealthModule.
  //Como o DatabaseModule é @Global(), o HealthService já consegue usar o Prisma automaticamente.
  imports: [DatabaseModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}