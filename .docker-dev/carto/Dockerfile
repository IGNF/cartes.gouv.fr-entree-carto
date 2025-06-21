FROM node:23-alpine AS builder

WORKDIR /app

COPY . .

# install dependencies
RUN npm install

ENV BASE_URL="/cartes" 
ENV SOURCE_MAP=true

CMD [ "npm", "run", "dev", "--", "--mode", "docker-dev-local" ]
