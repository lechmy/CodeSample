import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerValidatorDirective } from './server-validator.directive';
import { FormManager } from './form-manager';
import { EqualValidatorDirective } from './equal-validator.directive';

@NgModule({
  declarations: [ServerValidatorDirective, EqualValidatorDirective],
  exports: [ServerValidatorDirective, EqualValidatorDirective],
  imports: [
    CommonModule
  ]
})
export class FormsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormsModule,
      providers: [
        FormManager
      ]
    }
  }
}
