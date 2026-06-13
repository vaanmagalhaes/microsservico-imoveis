import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioAutenticado } from '../interfaces/usuario-autenticado.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        //Aqui eu configuro a estratégia JWT para procurar o token no formato "Bearer" no header da requisição
        //e uso a mesma JWT_SECRET definida no .env para validar o token
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'nossa_chave_secreta',
        });
    }

    //Se o token for autêntico e estiver no prazo de validade, o NestJS chama automaticamente
    //o método validate() injetando o payload decodificado
    async validate(payload: any): Promise<UsuarioAutenticado> {
        //Aqui eu vou padronizar o retorno.
        //Se o Gateway mandou o ID no campo 'sub' ou 'id', eu garanto que a nossa
        //aplicação sempre lerá como 'id', no formato numérico
        return {
            id: Number(payload.sub || payload.id),
            email: payload.email,
            role: payload.role,
        };
    }
}