FROM node:12-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

ENV PORT 3000
ENV MII_SERVER_HOST localhost
ENV MII_SERVER_PORT 50000
ENV MII_LOGIN_NAME user
ENV MII_LOGIN_PASSWORD 1234
ENV MYSQL_HOST 127.0.0.1
ENV MYSQL_USER alisson
ENV MYSQL_PASSWORD alisson
ENV MYSQL_DATABASE pizzaria
ENV WAIT_HOSTS ${MYSQL_HOST}:3306

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm run start
