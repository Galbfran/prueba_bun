FROM oven/bun:1 AS base
WORKDIR /app

# Instalar dependencias
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Build de la aplicación
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Imagen final para producción
FROM base AS runner
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "run", "dist/main.js"]
