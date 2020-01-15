import { Router } from 'express';

import { IController } from '../../types';

export abstract class Controller implements IController {
  abstract register(router: Router): void;
}
