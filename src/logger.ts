import { init } from '@somosphi/logger';

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
} = init({
  PROJECT_NAME: 'infobip-middleware',
  OMIT_ROUTES: ['/status', '/info'],
});
