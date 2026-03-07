# Используем Node.js 20
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь исходный код
COPY . .

# Открываем порт Vite
EXPOSE 5173

# Запускаем dev-сервер, разрешая доступ извне (0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]