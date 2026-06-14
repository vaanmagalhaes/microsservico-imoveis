import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CriarImovelDto } from '../dto/criar-imovel.dto';
import { AtualizarImovelDto } from '../dto/atualizar-imovel.dto';

@Injectable()
export class ImoveisService {
    //Aqui é onde eu injeto o banco de dados
    constructor(private readonly prisma: PrismaService) { }

    async listarTodos() {
        //Aqui eu faço uma busca de todos os imóveis, trazendo os dados do endereço relacionado
        return await this.prisma.imovel.findMany({
            include: {
                endereco: true
            }
        });
    }

    async buscarPorId(id: number) {
        const imovel = await this.prisma.imovel.findUnique({
            where: {id},
            include: {endereco: true}
        });

        //Se o banco não char o ID, vai ser disparado um erro 404 padronizado
        if (!imovel) {
            throw new NotFoundException(`Imóvel com ID {id} não encontrado no catálogo.`);
        }

        return imovel;
    }

    async criar(dados: CriarImovelDto) {
        //Utilizo o recurso de 'Nested Writes' do Prisma para salvar o endereço
        //e o Imóvel na mesma transação
        //Assim, se um falhar, o outro sofre o rollback automático
        return await this.prisma.imovel.create({
            data: {
                inscricaoIPTU: dados.inscricaoIPTU,
                inscricaoBombeiro: dados.inscricaoBombeiro,
                metragem: dados.metragem,
                classificacao: dados.classificacao,
                tipologia: dados.tipologia,
                status: dados.status,
                endereco: {
                    create: dados.endereco 
                }, //O Prisma cria o endereço e já vincula o ID automaticamente
            },

            include:{
                endereco: true
            }, //Retorno o objeto completo montado para o front-end
        });
    }

    async atualizar(id: number, dados: AtualizarImovelDto) {
        //Primeiro, garanto que o imóvel existe (se ele não existir, o buscarPorId já trava aqui)
        await this.buscarPorId(id);

        //Separo o bloco de endereço do resto dos dados para o Prisma atualizar corretamente
        const { endereco, ...dadosImovel } = dados;

        return await this.prisma.imovel.update({
            where: {id},
            data: {
                ...dadosImovel,
                //Se o corretor enviou dados de endereço na atualização, o sistema atualiza também
                ...(endereco && {
                    endereco:{
                        update: endereco
                    }
                })
            },
            include: { endereco: true }
        });
    }

    async remover(id: number) {
        //Valido se existe antes de tentar apagar
        await this.buscarPorId(id);

        return await this.prisma.imovel.update({
            where: {id},
            data:{
                status: 'INATIVO' as any //O Prisma vai mapear o valor do enum correspondente
            },
            include: {
                endereco: true //Aqui vai retornar o objeto com o endereço para confirmação visual no front-end
            }
        });
    }
}