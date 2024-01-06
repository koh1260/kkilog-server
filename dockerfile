# Stage 1 Build
FROM node:18-alpine as buildStage

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


# Stage 2
FROM node:18-alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY --from=buildStage /app/package.json ./
COPY --from=buildStage /app/node_modules ./node_modules
COPY --from=buildStage /app/dist ./dist

EXPOSE 8080
  
CMD ["npm", "run", "start:prod"]