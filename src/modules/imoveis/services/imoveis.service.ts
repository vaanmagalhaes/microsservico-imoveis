import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CriarImovelDto } from '../dto/criar-imovel.dto';
import { AtualizarImovelDto } from '../dto/atualizar-imovel.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImoveisService {
    //Aqui é onde eu injeto o banco de dados
    constructor(private readonly prisma: PrismaService, private readonly httpService: HttpService) {}

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

    async buscarEnderecoPorCep(cep: string) {
        //Aqui eu faço uma remoção de caracteres que não são números,
        //caso o corretor envie o CEP com traços ou pontos
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8){
            throw new BadRequestException('Cep inválido. O formato correto deve conter 8 dígitos numéricos.');
        }

        try {
            //O firstValueFrom é necessário para transformar a resposta do Axios
            //em uma Promise, já que o NestJS trabalha com Promises
            const resposta = await firstValueFrom(
                this.httpService.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            );

            const dados = resposta.data;

            //O ViaCep não dá erro se o CEP não existir, ele apenas retorna
            //um objeto com a propriedade 'erro' como true. Então, aqui vou
            //tratar isso para que o front-end receba um erro 404 de verdade
            if (dados.erro){
                throw new NotFoundException('CEP não encontrado na base dos Correios.');
            }

            //Aqui vou mapear a resposta do ViaCep para o formato que o sistema espera,
            //que é o mesmo do DTO de endereço
            return {
                cep: dados.cep,
                logradouros: dados.logradouro,
                bairro: dados.bairro,
                cidade: dados.localidade,
                estado: dados.uf
            };
            } catch (erro) {
                //Se o erro já for nosso (NotFound ou BadRequest),
                //apenas repasso para o front-end
                if (erro instanceof NotFoundException || erro instanceof BadRequestException) {
                    throw erro;
                }

                //Se a API dos correios cair, aqui vou tratar o erro
                //e avisar o front-end que não foi possível buscar o CEP
                throw new BadRequestException('Serviço de busca de CEP temporariamente indisponível.');
            }
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

<<<<<<< HEAD
async removerDefinitivo(id: number) {
        // O buscarPorId já valida se existe e traz os dados (incluindo o idEndereco)
        const imovel = await this.buscarPorId(id);

        await this.prisma.$transaction(async (prisma) => {
            // 1. Apagamos o imóvel primeiro
=======
    async removerDefinitivo(id: number) {
        const imovel = await this.buscarPorId(id);

        await this.prisma.$transaction(async (prisma) => {
>>>>>>> cf4651375116ffadc9e74ca2467e52173a1a7cc4
            await prisma.imovel.delete({
                where: { id }
            });

<<<<<<< HEAD
            // 2. Agora apagamos o endereço que ficou "órfão"
            // Usamos prisma.endereco em vez do inventado "enderecoImovel"
            await prisma.endereco.delete({
                where: { id: imovel.idEndereco }
            });
=======
            if (imovel.idEndereco) {
                await prisma.endereco.delete({
                    where: { id: imovel.idEndereco }
                });
            }
>>>>>>> cf4651375116ffadc9e74ca2467e52173a1a7cc4
        });

        return { message: 'Imóvel e endereço removidos definitivamente com sucesso.' };
    }
}