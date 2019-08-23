import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MessageService } from '../core/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class FormManager implements OnDestroy {
  static DEFAULT_FORM_KEY = '__default__';

  private controls: Object = {};

  constructor(
    private messageService: MessageService
  ) { }

  ngOnDestroy() {
    this.resetAll();
  }

  private static setErrors(control: AbstractControl, errorKey: string, errors: {[key: string]: string[]}) {
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const messageKey = key.replace('model.', '');
        if (errorKey.toLowerCase() === messageKey.toLowerCase()) {
          const componentErrors = control.errors || {};
          componentErrors['server'] = errors[key];
          control.setErrors(componentErrors);
          control.markAsDirty();
          control.markAsTouched();
          return;
        }
      }
    }
  }

  addControl(control: AbstractControl, errorKey: string, formKey: string = FormManager.DEFAULT_FORM_KEY) {
    if (!this.controls[formKey]) {
      this.controls[formKey] = {};
    }
    this.controls[formKey][errorKey] = control;
  }

  handleRequest<T>(request: Observable<T>, formKey: string = FormManager.DEFAULT_FORM_KEY): Observable<T> {
    return request.pipe(
      catchError(error => {
        this.parseError(error, formKey);
        return throwError(error);
      })
    )
  }

  private parseError(error: any, formKey: string) {
    if (!error || !error.error) {
      return null;
    }

    const modelErrors = !error.error['modelState'] ? error.error : error.error['modelState'];
    (modelErrors[''] || []).forEach((x: string) => this.messageService.error(x));

    const controls = this.controls[formKey];
    for (let errorKey in controls) {
      if (controls.hasOwnProperty(errorKey)) {
        FormManager.setErrors(controls[errorKey], errorKey, modelErrors);
      }
    }
  }

  reset(formKey: string = FormManager.DEFAULT_FORM_KEY) {
    if (!formKey) {
      for (const key in this.controls) {
        if (this.controls.hasOwnProperty(key)) {
          delete this.controls[key];
        }
      }
      return;
    }
    delete this.controls[formKey];
  }

  resetAll() {
    this.reset(null);
  }
}
