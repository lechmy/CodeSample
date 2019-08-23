import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ErrorModel } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorResolver implements Resolve<ErrorModel> {

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ErrorModel {
    let statusCode = parseInt(route.paramMap.get('statusCode'));
    if (isNaN(statusCode)) {
      statusCode = parseInt(route.data.statusCode);
      if (isNaN(statusCode)) {
        statusCode = 500
      }
    }

    var error = new ErrorModel();
    error.statusCode = statusCode;

    return error;
  }
}
