# ==========================================
# ETAPA 1: BUILD (Compilação)
# ==========================================
FROM node:22-alpine AS builder

# Instala o OpenSSL (Necessário para o motor do Prisma rodar no Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

# Copia os arquivos de dependência primeiro (Otimiza o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copia todo o restante do código fonte
COPY . .

# Variável "dummy" (falsa) apenas para enganar e satisfazer o Prisma durante o build
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"

# Gera o Prisma Client
RUN npx prisma generate

# Compila o NestJS (Gera a pasta /dist otimizada)
RUN npm run build


# ==========================================
# ETAPA 2: PRODUÇÃO (Imagem Final Leve)
# ==========================================
FROM node:22-alpine

# O ambiente final também precisa do OpenSSL para conectar no banco real
RUN apk add --no-cache openssl

WORKDIR /app

# Copia do "builder" APENAS o que é estritamente necessário para rodar
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expõe a porta do NestJS
EXPOSE 3000

# Execução otimizada: Roda o V8 do Node.js direto no arquivo compilado, poupando RAM
CMD ["node", "dist/main"]