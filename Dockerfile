FROM node:10-alpine

# Install python to compile packages
RUN apk add --no-cache python make g++

RUN mkdir -p /opt/app/
WORKDIR /opt/app/

COPY . .

RUN npm install --only=production
RUN npm run build

EXPOSE ${SERVICEPORT}

CMD npm run migrate:up && npm start
