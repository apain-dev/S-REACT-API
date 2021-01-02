FROM node:lts-slim

WORKDIR /usr/src/api

COPY . ./
RUN npm i -g @nestjs/cli
RUN npm install --only=prod
RUN npm run build

CMD ["node", ".enoviah/service/@enoviah/s-js-api/main.js"]
