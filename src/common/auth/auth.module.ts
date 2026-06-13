import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';

//Esse módulo foi criado para encapsular a configuração do Passport e
//provê a estratégia de validação para o resto da aplicação
@Module({
    imports: [PassportModule],
    providers: [JwtStrategy],
    exports: [PassportModule],
})

export class AuthModule {}