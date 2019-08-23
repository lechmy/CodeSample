import { AbstractControl, FormGroup, FormControl, FormArray } from '@angular/forms';

export class FormUtils {
  public static validateForm(control: AbstractControl) {
    if (control instanceof FormGroup) {
      for (let path in control.controls) {
        FormUtils.validateForm((<FormGroup>control).get(path))
      }
    }
    else if (control instanceof FormControl) {
      (<FormControl>control).markAsDirty({ onlySelf: true });
    }
    else if (control instanceof FormArray) {
      (<FormArray>control).markAsDirty({ onlySelf: true });
      for (let item of (<FormArray>control).controls) {
        FormUtils.validateForm(item);
      }
    }
  }
}
