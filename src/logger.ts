import { init } from '@somosphi/logger';

export const {
  AxiosLogger,
  ExpressLogger,
  Logger,
} = init({
  PROJECT_NAME: 'ts-seed-jest',
  OMIT_ROUTES: ['/status', '/info'],
});
