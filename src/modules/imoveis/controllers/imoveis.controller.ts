import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImoveisService } from '../services/imoveis.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CriarImovelDto } from '../dto/criar-imovel.dto';
import { AtualizarImovelDto  } from '../dto/atualizar-imovel.dto';

//Etiquetando o controller para o swagger agrupar tudo na aba "Imóveis"
@ApiTags('Imoveis')

//Avisando ao swagger que todas as todas aqui dentro precisam do cateado do JWT
@ApiBearerAuth()

//Blindando o controller inteiro com a nossa segurança configurada anteriormente
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('imoveis')
export class ImoveisController {
    constructor(private readonly imoveisService: ImoveisService) {}

    @Post()
    @Roles('USER', 'ADMIN')
    @ApiOperation({summary: 'Cadastrar novo imóvel', description: 'Cadastra um imóvel criando automaticamente seu endereço'})
    @ApiBody({type: CriarImovelDto}) //Aqui eu aviso ao swagger qual é o formato esperado
    @ApiResponse({status: 201, description: 'Imóvel criado com sucesso.'})
    @ApiResponse({status: 400, description: 'Dados inválidos.'})
    async criarImovel(@Body() criarImovelDto: CriarImovelDto){
        return await this.imoveisService.criar(criarImovelDto);
    }

    @Get()
    @Roles('USER', 'ADMIN') //Apenas corretores logados e administradores podem listar os imóveis
    @ApiOperation({summary: 'Listar todos os imóveis', description: 'Retorna o catálogo completo de imóveis com seus endereços.'})
    @ApiResponse({status: 200, description: 'Lista retornada com sucesso.'})
    @ApiResponse({status: 401, description: 'Token JWT ausente ou inválido'})
    async listarImoveis() {
        //Aqui estou delegando a busca para a camada de serviço
        return await this.imoveisService.listarTodos()
    }

    @Get(':id')
    @Roles('USER', 'ADMIN')
    @ApiOperation({summary: 'Buscar imóvel específico por ID'})
    //O ParseIntPipe transforma a string da URL em um number automaticamente
    async buscarUmImovel(@Param('id', ParseIntPipe) id: number){
        return await this.imoveisService.buscarPorId(id);
    }

    @Patch(':id')
    @Roles('USER', 'ADMIN')
    @ApiOperation({summary: 'Atualizar dados de um imóvel'})
    @ApiBody({type: AtualizarImovelDto})
    async atualizarImovel(
        @Param('id', ParseIntPipe) id: number,
        @Body() atualizarImovelDto: AtualizarImovelDto
    ) {
        return await this.imoveisService.atualizar(id, atualizarImovelDto)
    }

    @Delete(':id')
    @Roles('USER', 'ADMIN')
    @ApiOperation({summary: 'Excluir um imóvel do catálogo'})
    async removerImovel(@Param('id', ParseIntPipe) id: number){
        return await this.imoveisService.remover(id);
    }
}