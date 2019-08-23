import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { FormManager } from './form-manager';

import { Validators } from './validators';

@Directive({
  selector: '[appServerValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ServerValidatorDirective,
      multi: true
    }
  ]
})
export class ServerValidatorDirective implements Validator {
  @Input('appServerValidator') errorKey: string;
  @Input() formKey: string;

  constructor(
    private formManager: FormManager
  ) { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    const formKey = !this.formKey ? FormManager.DEFAULT_FORM_KEY : this.formKey;
    return Validators.server(this.formManager, this.errorKey, formKey)(control);
  }
}
