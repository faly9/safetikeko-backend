FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

COPY . .

RUN npm install


RUN npm run build

EXPOSE 5000

CMD ["node", "dist/src/main.js"]