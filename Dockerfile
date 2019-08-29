FROM keymetrics/pm2:latest-alpine

RUN mkdir -p /opt/app/
WORKDIR /opt/app/

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm start
