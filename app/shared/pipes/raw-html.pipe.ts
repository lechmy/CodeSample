import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, Optional } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, selectLanguage, selectInstitutionShortName } from '../../core/reducers';

import { prefixRoute } from '../utils/language-and-institution';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'rawHtml',
  pure: false
})
export class RawHtmlPipe implements PipeTransform {


  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(value: any, args?: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
