FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3001

CMD ["pnpm", "start:dev"]

