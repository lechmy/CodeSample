import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { Validators } from './validators';

@Directive({
  selector: '[appEqualValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EqualValidatorDirective,
      multi: true
    }
  ]
})
export class EqualValidatorDirective implements Validator {
  @Input('appEqualValidator') path: string;

  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    return Validators.equal(this.path)(control);
  }

}
