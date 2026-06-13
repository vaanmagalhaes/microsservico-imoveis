import 'dotenv/config'; // Aqui eu garanto o carregamento das variáveis do meu .env
import { defineConfig, env } from 'prisma/config'; // Importo os utilitários de configuração do Prisma

// Criei este arquivo para atender ao padrão do Prisma 7, 
// centralizando as configurações da CLI e removendo a inteligência de conexão do schema.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'), // Puxo a string de conexão validando sua existência através do helper 'env'
  },
});