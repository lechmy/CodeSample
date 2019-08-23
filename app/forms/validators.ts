import { ValidatorFn, AbstractControl } from '@angular/forms';

import { FormManager } from './form-manager';

export class Validators {
  static server(formManger: FormManager, errorKey: string, formKey: string = FormManager.DEFAULT_FORM_KEY): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      formManger.addControl(control, errorKey, formKey);
      return null;
    }
  }

  static equal(path: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const control2 = control.root.get(path);

      if (control2 && control.value !== control2.value) {
        return { equal: true }
      }

      return null;
    }
  }
}
