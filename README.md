# 🏢 API Catálogo e Gestão de Imóveis

Microsserviço central responsável pelo cadastro de imóveis, acompanhamento do ciclo de vida de contratos de locação e gestão financeira (lançamento, liquidação e arquivamento de comprovantes de despesas).

O sistema foi desenvolvido como parte de um projeto acadêmico de ADS, seguindo uma arquitetura baseada em microsserviços. Cada microsserviço possui seu próprio banco de dados e configuração independente.

---

## 🎯 Visão Geral

O Microsserviço de Imóveis é responsável por gerenciar:
*   **Imóveis:** Catálogo de propriedades disponíveis para locação. Integração direta com ViaCEP para preenchimento automático de endereços.
*   **Contratos:** Vínculo jurídico entre o Locador, o Inquilino e o Imóvel, controlando status (ATIVO, ENCERRADO, RESCINDIDO) e vigência.
*   **Despesas:** Motor transacional financeiro, permitindo lançamentos avulsos, faturas e liquidação com upload de comprovantes (PDF/Imagens).
*   **Automação (Robô):** Cron Job que roda em segundo plano para gerar faturas mensais de aluguel automaticamente para contratos ativos.

**Nota de Arquitetura:** Por decisão do grupo, a responsabilidade de *Contratos* e *Imóveis* ficou centralizada neste microsserviço, enquanto os dados sensíveis dos proprietários ficam no Microsserviço Locador (evitando duplicidade de responsabilidades).

---

## 🚀 Tecnologias Utilizadas

*   **Node.js (v20+)** & **TypeScript**
*   **NestJS** (Framework progressivo)
*   **Prisma ORM (v7.8.0)** & **MariaDB / MySQL**
*   **@nestjs/schedule:** Agendador de tarefas em background (Cron Jobs).
*   **Axios:** Cliente HTTP para consumo de APIs externas (ViaCEP).
*   **Multer:** Manipulação de upload de arquivos binários.
*   **JWT & RBAC:** Segurança baseada em perfis de acesso (`USER`, `ADMIN`).
*   **Swagger / OpenAPI:** Documentação interativa.
*   **Docker:** Containerização (Multi-stage build).

---

## 🏗️ Arquitetura da Aplicação

A API foi organizada seguindo a estrutura padrão do NestJS, com forte separação por domínios.

**Fluxo básico de uma requisição protegida:**
Requisição HTTP → Controller → JwtAuthGuard → RolesGuard → Service → PrismaService → Banco MySQL

**Estrutura Principal do Projeto:**
```text
src/
 ├── generated/
 │    └── prisma/
 │
 ├── modules/
 │    ├── imoveis/
 │    ├── contratos/
 │    └── despesas/
 │         ├── controllers/
 │         ├── dto/
 │         └── services/ (Incluindo o despesas-cron.service.ts)
 │
 ├── app.module.ts
 └── main.ts

```

---

## 🗄️ Banco de Dados e Tabelas Principais

O banco de dados está hospedado no servidor da faculdade e é acessado através da variável `DATABASE_URL`. O Docker encapsula apenas a API.

**1. Tabela `imovel**`

* Campos: `id`, `titulo`, `descricao`, `endereco`, `valorAluguel`, `criadoEm`

**2. Tabela `contrato_locacao**`

* Campos: `id`, `idImovel`, `idInquilino`, `dataInicio`, `dataVencimento`, `status`

**3. Tabela `despesa**`

* Campos: `id`, `idContratoLocacao`, `descricao`, `valor`, `tipo`, `status`, `dataPagamento`, `comprovantePagamento` (LongBlob)

---

## ⚙️ Regras de Negócio

* **Autenticação:** O corretor (Role `USER`) tem permissão total para operar o fluxo diário (cadastrar imóveis, buscar CEP, gerar contratos e baixar pagamentos).
* **Upload de Comprovantes:** A liquidação de uma despesa exige o envio de um arquivo binário, que é convertido e armazenado diretamente no banco de dados.
* **Robô de Aluguéis:** Uma rotina agendada roda diariamente verificando contratos `ATIVOS` e gerando as despesas de aluguel do mês atual de forma autônoma.
* **Trava Financeira (Segurança):** O sistema impede a exclusão (`DELETE`) de qualquer despesa que já esteja com o status `PAGA`.

---

## 🛠️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.
**Importante:** Não use aspas na `DATABASE_URL`.

```env
PORT=3003
DATABASE_URL=mysql://USUARIO:SENHA@SERVIDOR:3306/NOME_DO_BANCO

```

---

## 📍 Endpoints Principais

A documentação interativa com todos os DTOs e testes de upload de arquivos está disponível via Swagger em: `http://localhost:3003/api`

### Imóveis

| Método | Endpoint | Protegido | Descrição |
| --- | --- | --- | --- |
| GET | `/imoveis` | Sim | Lista catálogo de imóveis |
| POST | `/imoveis` | Sim | Cadastra um novo imóvel |
| GET | `/imoveis/cep/:cep` | Sim | Consulta automática de endereço via integração com ViaCEP |

### Contratos

| Método | Endpoint | Protegido | Descrição |
| --- | --- | --- | --- |
| GET | `/contratos` | Sim | Lista contratos |
| POST | `/contratos` | Sim | Gera um novo contrato de locação |
| PATCH | `/contratos/:id` | Sim | Atualiza status (ex: ATIVO para ENCERRADO) |

### Despesas (Financeiro)

| Método | Endpoint | Protegido | Descrição |
| --- | --- | --- | --- |
| GET | `/despesas` | Sim | Lista faturas (aceita filtro `?idContrato=x`) |
| POST | `/despesas` | Sim | Lança nova fatura/despesa manual |
| PATCH | `/despesas/:id/pagamento` | Sim | Liquida fatura (Exige `multipart/form-data` com arquivo) |
| GET | `/despesas/:id/comprovante` | Sim | Download do comprovante em anexo |
| DELETE | `/despesas/:id` | Sim | Exclui fatura (Bloqueado se estiver PAGA) |

---

## 💻 Execução e Deploy

### Rodar Localmente

1. Instale as dependências: `npm install`
2. Gere o Prisma Client: `npx prisma generate`
3. Inicie a API: `npm run start:dev`
A API estará rodando em: `http://localhost:3003`

### Build e Docker (Produção)

O projeto utiliza um *Multi-stage build* para garantir uma imagem leve, segura e otimizada para o API Gateway.

1. Criar a imagem Docker:

```bash
docker build -t api-imoveis .

```

2. Rodar o container:

```bash
docker run -d --name api-imoveis -p 3003:3003 --env-file .env api-imoveis

```

---

## ⚠️ Possíveis Problemas e Troubleshooting

**1. Erro de Conexão no Upload de PDF (max_allowed_packet)**

* **Erro:** `Cannot execute new commands: connection closed` ao fazer upload.
* **Causa:** O arquivo binário ultrapassa o limite de tráfego do MySQL.
* **Solução:** O servidor do banco de dados precisa ter a variável `max_allowed_packet` configurada para `64M` ou mais no arquivo `my.ini`.

**2. Porta 3003 já está em uso**

* **Erro:** `EADDRINUSE: address already in use :::3003`
* **Solução:** Verifique se há um container rodando (`docker ps`) e pare-o (`docker stop api-imoveis`), ou feche outros terminais locais.

**3. Erro de Tipagem do Prisma**

* **Erro:** O TypeScript acusa que uma propriedade ou status do Enum não existe.
* **Solução:** Rode `npx prisma generate` para traduzir o banco de dados e sincronizar os tipos com o seu código.

```