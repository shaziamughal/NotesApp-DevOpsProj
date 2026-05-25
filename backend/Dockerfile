FROM node:18-alpine

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm install
RUN npm ci --production --silent

COPY . .

WORKDIR /app/backend

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
