FROM keymetrics/pm2:latest-alpine

ENV NODE_ENV=production

RUN mkdir -p /opt/app/
WORKDIR /opt/app/
COPY . .

RUN npm install

EXPOSE 3000

CMD npm run migrate-local && npm start
