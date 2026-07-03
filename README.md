# 🏢 Microsserviço de Catálogo e Gestão de Imóveis

Este é o microsserviço central responsável pela gestão do ecossistema imobiliário. Ele fornece uma API RESTful robusta para o cadastro de imóveis, acompanhamento do ciclo de vida de contratos de locação e gestão financeira (lançamento, liquidação e arquivamento de comprovantes de despesas).

Construído com foco em escalabilidade, tipagem estrita e arquitetura modular, este serviço está pronto para ser integrado a front-ends (Web/Mobile) e orquestrado via API Gateway.

## 🚀 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)**: Framework Node.js progressivo para construção de aplicações eficientes e escaláveis.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática rigorosa para maior segurança de código.
- **[Prisma ORM](https://www.prisma.io/)**: Mapeamento objeto-relacional (ORM) de última geração para interação com o banco de dados.
- **[MySQL / MariaDB]**: Banco de dados relacional para armazenamento transacional seguro.
- **[Multer]**: Gerenciamento e upload de arquivos binários (PDFs, Imagens) em rotas `multipart/form-data`.
- **[Swagger / OpenAPI]**: Documentação interativa e automatizada dos endpoints.
- **[Docker]**: Containerização da aplicação (Multi-stage build) para deploys isolados e leves.

---

## 📦 Módulos Principais (Domínios)

1. **Imóveis:** Cadastro e gerenciamento do portfólio de propriedades.
2. **Contratos:** Gestão do ciclo de vida da locação, vinculando inquilinos aos imóveis com controle de datas e status.
3. **Despesas (Financeiro):** Motor transacional de faturas. Permite lançamentos avulsos, liquidação com envio e validação de comprovantes (upload de arquivos) e travas de segurança rigorosas contra manipulação de faturas pagas.

---

## 🛠️ Configuração do Ambiente (.env)

Antes de rodar o projeto, crie um arquivo `.env` na raiz do projeto. Você pode usar o `.env.example` como base (caso exista) ou seguir a estrutura abaixo:

```env
# Configuração do Banco de Dados Relacional
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"

# Outras variáveis de ambiente (JWT, Portas, etc)
PORT=3000
