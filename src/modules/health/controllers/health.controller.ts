import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';

//Aqui defini a rota raiz desse controller como 'health'
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    //Criei um endpoint GET público (sem guards de autenticação) para verificar
    //o status do serviço. Ele chama o método check() do HealthService e retorna o resultado.
    @Get()
    async check() {
        return await this.healthService.check();
    }
}