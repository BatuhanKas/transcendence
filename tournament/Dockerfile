FROM node:22.16-bullseye

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY src ./src/
RUN npm run build

CMD ["npm", "run", "start"]