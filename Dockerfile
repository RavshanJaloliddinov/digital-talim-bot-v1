FROM node:18-alpine
WORKDIR /app

# backend fayllarini ko‘chirish
COPY backend/package*.json ./
RUN npm install --production
COPY backend ./

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
