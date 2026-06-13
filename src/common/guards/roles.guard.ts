import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate{
    //Aqui eu injeto o Reflector do NestJS para conseguir ler os metadados (etiquetas) que colocamos nas rotas
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        //Se a rota não tiver o decorador @Roles, ela é pública para qualquer pessoa logada
        if (!requiredRoles){
            return true;
        }

        //Aqui eu pego o usuário que a JwtStrategy acabou de validar e injetar na requisição
        const { user } = context.switchToHttp().getRequest();

        //Aqui eu verifico se a "role" do usuário está dentro do array de "roles" permitidas para essa rota
        return requiredRoles.some((role) => user.role?.includes(role));
    }
}