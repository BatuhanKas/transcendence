FROM node:22.16-bullseye

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env.example .env

RUN npm ci

COPY src ./src/
RUN npm run build

RUN mkdir /app/dist/database/sqlite && chmod 777 /app/dist/database/sqlite

CMD ["npm", "run", "start"]
