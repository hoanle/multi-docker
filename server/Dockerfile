FROM node:lts-alpine3.12

WORKDIR /App

COPY ./package.json ./

RUN yarn install

COPY . .

CMD ["yarn", "run", "start"]
