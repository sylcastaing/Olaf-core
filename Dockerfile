FROM resin/raspberry-pi-alpine-node:7.10

WORKDIR /usr/src/app

COPY package.json /usr/src/app

ENV NODE_ENV production

ENV MONGODB_URI "mongodb://olaf-data/mean-docker"

RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]