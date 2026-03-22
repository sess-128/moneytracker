# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Копируем только файлы зависимостей для кеширования слоя npm ci
COPY package.json package-lock.json* ./

# Устанавливаем зависимости (слой кешируется при неизменном package.json)
RUN npm ci --only=production || npm install --only=production

# Копируем конфиги и исходный код
COPY tsconfig.json ./
COPY public ./public
COPY src ./src

# Собираем приложение
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]