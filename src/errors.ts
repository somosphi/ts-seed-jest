export const {
  BadRequest,
  InternalServerError,
  NotFound,
  NotImplemented,
  Unauthorized,
  UnprocessableEntity,
  CustomError,
} = require('@4alltecnologia/http-errors');

export class Conflict extends CustomError {
  constructor (message: string, details: null | any[] = null) {
    super('CONFLICT', message, details);
  }
}
