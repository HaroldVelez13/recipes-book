FROM node:12


RUN mkdir -p /src/domain

WORKDIR /src/domain

RUN npm install  @nestjs/cli -g --silent

COPY package.json ./

RUN npm rebuild bcrypt --build-from-source

COPY . ./

EXPOSE 3000