# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Открываем порт 3000
EXPOSE 3000

# Устанавливаем переменную окружения для порта
ENV PORT=3000

# Запускаем приложение
CMD ["npm", "start"]

