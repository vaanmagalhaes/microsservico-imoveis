import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DespesasCronService {
    //Esse Logger é usado só pra conseguirmos ver as mensagens coloridas no terminal
    //e saber que o robô acordou sem precisar olhar o banco de dados
    //ou seja, é só pra debug
    private readonly logger = new Logger(DespesasCronService.name);

    //Aqui é onde eu vou injetar o prisma porque o robô vai precisar
    //ler os contratos e salvar as despesas no banco de dados
    constructor(private prisma: PrismaService) {}

    //O @Cron é que faz o robô acordar todo dia 1 do mês às 00:00
    //porém, para a apresentação, vou colocar a cada 30 segundos,
    //pra gente ver o robô acordando e salvando as despesas no banco de dados
    @Cron(CronExpression.EVERY_30_MINUTES)
    async gerarAlugueisMensais() {
        this.logger.log('O robô acordou e vai gerar as despesas de aluguel do mês...');

        try{
            //O primeiro passo é pedir para o Prisma buscar na tabela de contratos
            //somente os contratos que estão valendo (status ATIVO)
            const contratosAtivos = await this.prisma.contratolocacao.findMany({
                where: {status: 'ATIVO'}
            });

            //Se não tiver nenhum, o robô avisa e volta a dormir
            if (contratosAtivos.length === 0) {
                this.logger.log('Não há contratos ativos no momento');
                return;
            }

            //Aqui é pra descobrir o dia e mês que estamos hoje
            const dataAtual = new Date();
            const primeiroDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

            //Agora o robô vai percorrer os contratos ativos, um de cada vez
            for (const contrato of contratosAtivos){
                
                //TRAVA DE SEGURANÇA: pra evitar que o robô crie dois aluguéis no mesmo mês
                //por engano se o servidor reiniciar, ele primeiro vai verificar se já existe
                //uma despesa de aluguel para o contrato e para o mês atual
                const despesaExistente = await this.prisma.despesa.findFirst({
                    where: {
                        idContratoLocacao: contrato.id,
                        tipo: 'ALUGUEL',
                        dataVencimento: {
                            gte: primeiroDiaDoMes //gte (greater than or equal) significa "maior ou igual a"
                        }
                    }
                });

                //Se ele não achar a despesa, então, ele vai criar uma
                if (!despesaExistente) {
                    //Aqui eu vou definir o vencimento que vai ser sempre até o dia 10 do mês
                    const dataVencimento = new Date();
                    dataVencimento.setDate(10);

                    //Agora o Prisma vai criar a despesa no banco de dados
                    await this.prisma.despesa.create({
                        data: {
                            idContratoLocacao: contrato.id,
                            descricao: `Aluguel referente ao mês ${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`,
                            valor: contrato.valorAluguel,
                            tipo: 'ALUGUEL',
                            status: 'EM_ABERTO',
                            dataVencimento: dataVencimento,
                        }
                    });

                    this.logger.log(`Fatura de aluguel gerada para o contrato ID: ${contrato.id}`);
                }
            }
             this.logger.log('Varredura realizada com sucesso!');
        } catch (error) {
            //Se o banco cair, o robô não vai travar a aplicação toda
            this.logger.error('Erro ao gerar despesas de aluguel:', error);
        }
    }
}