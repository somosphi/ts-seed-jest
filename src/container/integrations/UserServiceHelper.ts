import { HttpIntegration } from './http';
import { env } from '../../env';

export default class UserServiceHelper extends HttpIntegration {
  constructor () {
    super({
      baseURL: env.userServiceHelper,
    });
  }
}
