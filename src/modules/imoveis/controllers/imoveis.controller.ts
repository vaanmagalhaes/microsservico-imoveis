import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImoveisService } from '../services/imoveis.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

//Etiquetando o controller para o swagger agrupar tudo na aba "Imóveis"
@ApiTags('Imóveis')

//Avisando ao swagger que todas as todas aqui dentro precisam do cateado do JWT
@ApiBearerAuth()

//Blindando o controller inteiro com a nossa segurança configurada anteriormente
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Imóveis')
export class ImoveisController {
    constructor(private readonly imoveisService: ImoveisService) {}

    @Get()
    @Roles('USER', 'ADMIN') //Apenas corretores logados e administradores podem listar os imóveis
    @ApiOperation({summary: 'Listar todos os imóveis', description: 'Retorna o catálogo completo de imóveis com seus endereços.'})
    @ApiResponse({status: 200, description: 'Lista retornada com sucesso.'})
    @ApiResponse({status: 401, description: 'Token JWT ausente ou inválido'})
    async listarImoveis() {
        //Aqui estou delegando a busca para a camada de serviço
        return await this.imoveisService.listarTodos()
    }
}