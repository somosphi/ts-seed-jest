import { Router } from 'express';

interface IController {
  register(router: Router): void;
}
