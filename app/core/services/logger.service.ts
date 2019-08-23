import { Injectable } from '@angular/core';
import * as logdown from 'logdown';

import { environment } from '../../../environments/environment';

export interface ILogger {
  debug(...params: any[]) : void;
  info(...params: any[]) : void;
  warn(...params: any[]) : void;
  error(...params: any[]) : void;
}

class Logger implements ILogger {
  private readonly provider: logdown.Logger;

  constructor(prefix: string, options: logdown.LogdownOptions) {
    this.provider = logdown(prefix, options)
  }

  debug(...params: any[]) {
    this.provider.log(...params);
  }

  info(...params: any[]) {
    this.provider.info(...params);
  }

  warn(...params: any[]) {
    this.provider.warn(...params);
  }

  error(...params: any[]) {
    this.provider.error(...params);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggerFactory {
  private get options(): logdown.LogdownOptions {
    return {}
  }

  private readonly loggers: {[prefix: string] : ILogger} = {};

  constructor() {
    if (window.localStorage && !environment.production) {
      window.localStorage['debug'] = environment.loggerDebug
      if ((logdown as any)._setPrefixRegExps) {
        (logdown as any)._setPrefixRegExps();
      }
    }
  }

  getLogger(prefix: string): ILogger {
    var logger = this.loggers[prefix];
    if (!logger) {
      logger = new Logger(prefix, this.options);
      this.loggers[prefix] = logger;
    }
    return logger;
  }
}
