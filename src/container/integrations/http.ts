import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

import { AxiosLogger } from '../../logger';

export abstract class HttpIntegration {
  protected instance: AxiosInstance;

  constructor (options: AxiosRequestConfig) {
    this.instance = axios.create(options);
    AxiosLogger.attachInterceptor.bind(AxiosLogger)(this.instance);
  }
}
