FROM node:17.8.0-alpine3.15

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install express cors dotenv request@2.81.0 nodemon

COPY . .

EXPOSE 8000

CMD [ "node", "lead.js" ]