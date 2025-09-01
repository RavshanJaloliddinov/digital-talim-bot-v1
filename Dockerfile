# Node.js bazasi
FROM node:18-alpine

# Ishchi katalog
WORKDIR /app

# Fayllarni nusxalash
COPY package*.json ./
RUN npm install

# Loyihani nusxalash
COPY . .

# Loyihani qurish
RUN npm run build

# Port ochish (Render process.env.PORT ni beradi)
EXPOSE 3000

# NestJSni production rejimda ishga tushirish
CMD ["npm", "run", "start:prod"]