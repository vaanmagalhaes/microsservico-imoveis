import { SetMetadata } from '@nestjs/common';

//Criei esse decorador para poder etiquetar as rotas informando quais perfis
//tem permissão de acesso (apenas ADMIN ou USER e ADMIN)
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);