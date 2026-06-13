import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//Aqui uso o decorador @Global() pra não ter que importar o DatabaseModule em cada módulo que for usar o PrismaService,
//já que ele vai ser global e disponível em toda a aplicação
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService], //Aqui eu exporto o PrismaService para que os outros services possam injetá-lo e usá-lo
})

export class DatabaseModule {}