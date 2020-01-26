FROM node:10.13-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn install --production --silent && yarn build

CMD ["yarn", "start"]