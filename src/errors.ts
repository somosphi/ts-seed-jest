import joi from 'joi';
import { ICodedError } from './types';

export abstract class CodedError extends Error {
  code: string;

  constructor (code: string, message: string) {
    super(message);
    this.code = code;
  }

  toJSON(): ICodedError {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export abstract class DetailedCodedError extends CodedError {
  details: object;

  constructor (code: string, message: string, details: object) {
    super(code, message);
    this.details = details;
  }

  toJSON(): ICodedError {
    return {
      ...super.toJSON(),
      details: this.details,
    };
  }
}

export class NotFoundError extends CodedError {
  constructor () {
    super('NOT_FOUND', 'Page not found');
  }
}

export class ResourceNotFoundError extends CodedError {
  constructor () {
    super('RESOURCE_NOT_FOUND', 'Resource not found');
  }
}

export class ValidationError extends DetailedCodedError {
  constructor (details: joi.ValidationErrorItem[]) {
    super('VALIDATION_FAILED', 'Invalid request data', details);
  }
}
