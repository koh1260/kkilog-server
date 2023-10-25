FROM node:18

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY . .

RUN npm install 

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]