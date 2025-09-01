# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend ./

RUN npm run build


# Stage 2: production
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

# faqat dist ni olib kelamiz
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
