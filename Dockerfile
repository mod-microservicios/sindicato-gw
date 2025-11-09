# Dockerfile para sindicato-gw
FROM node:22.18.0-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias y configuración de TypeScript
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa de producción
FROM node:22.18.0-alpine AS production

WORKDIR /app

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el código compilado desde builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto del API Gateway
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]

