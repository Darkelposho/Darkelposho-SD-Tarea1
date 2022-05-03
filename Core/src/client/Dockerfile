FROM node:17.8.0-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install express cors body-parser dotenv axios redis request@2.81.0 nodemon

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]