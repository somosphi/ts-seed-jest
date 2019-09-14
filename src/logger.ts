import * as BLogger from '@somosphi/logger';

const { AxiosLogger, ExpressLogger, Logger, RequestLogger } = BLogger.init({
  PROJECT_NAME: 'ts-seed-backend',
  OMIT_ROUTES: ['/status', '/info'],
});

export {
  AxiosLogger,
  ExpressLogger,
  Logger,
  RequestLogger,
};
