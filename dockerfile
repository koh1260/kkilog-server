# Stage 1 Build
FROM node:18-alpine as buildStage

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . .

RUN npm install
RUN npm run build


# Stage 2
FROM node:18-alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=buildStage /app/package.json ./
COPY --from=buildStage /app/node_modules ./node_modules
COPY --from=buildStage /app/dist ./dist

EXPOSE 8080

ENTRYPOINT [ "npx", "prisma", "migrate", "resolve", "--applied", "0_init", "--schema", "/usr/app/dist/prisma/schema.prisma"]
CMD ["node", "dist/main"]