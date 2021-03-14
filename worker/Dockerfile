FROM node:lts-alpine3.12

WORKDIR /app

COPY ./package.json ./

RUN yarn install

COPY . .

CMD ["yarn", "run", "dev"]
