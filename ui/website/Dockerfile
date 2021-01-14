FROM node:12-alpine


RUN mkdir -p /src/website

WORKDIR /src/website

COPY package.json ./

RUN npm install \
    npm install --only=dev --silent

COPY . ./

EXPOSE 3000

