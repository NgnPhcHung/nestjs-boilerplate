FROM node:23-alpine

RUN corepack enable

WORKDIR /app

# COPY ./package.json ./pnpm-lock.yaml ./


COPY . .

RUN pnpm install

EXPOSE 3001

CMD ["pnpm", "start"]

