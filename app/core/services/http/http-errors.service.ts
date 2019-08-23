import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsService {

  unauthorized = new EventEmitter<any>();
  forbidden = new EventEmitter<any>();
  error = new EventEmitter<any>();
  badRequest = new EventEmitter<any>();

  constructor() { }
}
