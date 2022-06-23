FROM node:18

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV SERVER_PORT 5000
ENV SOCKET_IO_PORT 3000
ENV DB_URI = mongodb://mongo:27017/mevn_full_stack

ENV PORT = 5000

EXPOSE 3000 5000

CMD [ "npm", "start" ]