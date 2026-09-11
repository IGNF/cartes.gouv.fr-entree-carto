FROM node:24-slim AS builder

WORKDIR /app

# Upgrade system packages to fix vulnerabilities
RUN apt-get update && apt-get upgrade -y

COPY . .
RUN rm -rf node_modules

# install dependencies
RUN npm install

ENV BASE_URL="/explorer-les-cartes" 
ENV SOURCE_MAP=true

CMD [ "npm", "run", "dev-local"]
