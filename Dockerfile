FROM node:20-alpine as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY ./packages/sdk ./packages/sdk
COPY ./packages/game-server ./packages/game-server

RUN npm install
RUN yarn workspace @game/game-server run build

FROM node:20-alpine

WORKDIR /app/packages/game-server

COPY --from=build /app/packages/game-server/dist dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
