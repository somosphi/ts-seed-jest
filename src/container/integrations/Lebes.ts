import { HttpIntegration } from './http';

export default class Lebes extends HttpIntegration {
  constructor () {
    super({
      baseURL: 'lebes',
    });
  }
}
