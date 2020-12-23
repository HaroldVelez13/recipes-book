FROM node:12-alpine


RUN mkdir -p /src/website

WORKDIR /src/website

RUN npm install -g @angular/cli \
    npm install -g nodemon

COPY package.json ./

RUN npm outdated \
    npm install \
    npm install --only=dev --silent

COPY . ./

EXPOSE 4200

