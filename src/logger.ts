import winston from 'winston';
import moment from 'moment-timezone';

const {
  combine, splat, colorize, printf,
} = winston.format;

export const customFormat = printf((info) => {
  const message = info instanceof Error ? info.stack : info.message;
  return `[${moment(info.timestamp)
    .utc()
    .format('YYYY-MM-DD HH:mm:ss')}] ${info.level}: ${message}`;
});

export const logger = winston.createLogger({
  format: combine(splat(), colorize(), customFormat),
  transports: [new winston.transports.Console({})],
});