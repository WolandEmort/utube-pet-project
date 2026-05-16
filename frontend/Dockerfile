FROM node:20-alpine

WORKDIR /app

# Копіюємо package.json та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо решту коду
COPY . .

# Запускаємо Vite з доступом по мережі
CMD ["npm", "run", "dev", "--", "--host"]