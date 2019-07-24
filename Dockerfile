FROM node:11-alpine

WORKDIR /app

CMD [ "node", "main" ]

COPY . /app

RUN yarn global add typescript && yarn
RUN echo "Compiling TypeScript.." && time tsc

WORKDIR /app/dist
