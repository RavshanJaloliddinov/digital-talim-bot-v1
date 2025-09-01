FROM node:18-alpine

WORKDIR /app

# faqat backend package.json’ni olish
COPY backend/package*.json ./

RUN npm install --production

# endi butun backendni ko‘chiramiz
COPY backend ./

# NestJS build qilish
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
