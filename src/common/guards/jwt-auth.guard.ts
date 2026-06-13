import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//Aqui eu encapsulei o AuthGuard padrão do Passport ('jwt') em uma classe
//para deixar os Controllers mais limpos e facilitar manutenções futuras
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}