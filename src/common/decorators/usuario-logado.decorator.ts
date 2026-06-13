import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UsuarioAutenticado } from "../interfaces/usuario-autenticado.interface";

//Criei esse decorador customizado para abstrair a complexidade de buscar o usuário
//dentro do objeto de Request do Express/Fastify
//Agora basta usar @UsuarioLogado() nos Controllers
export const UsuarioLogado = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UsuarioAutenticado =>{
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);