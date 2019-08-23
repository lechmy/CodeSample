import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, Optional } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState, selectLanguage, selectInstitutionShortName } from '../../core/reducers';

import { prefixRoute } from '../utils/language-and-institution';

@Pipe({
  name: 'languageAndInstitution',
  pure: false
})
export class LanguageAndInstitutionPipe implements PipeTransform, OnDestroy {
  private language: string;
  private shortName: string;

  private languageChanged: Subscription;
  private shortNameChanged: Subscription;

  constructor(
    private store: Store<AppState>,
    @Optional() private _ref: ChangeDetectorRef
  ) { }

  ngOnDestroy() {
    this._dispose();
  }

  private onLanguageChanged(language: string) {
    if (this.language === language)
      return;
    this.language = language;
    if (this._ref)
      this._ref.markForCheck();
  }

  private onShortNameChanged(shortName: string) {
    if(this.shortName === shortName)
      return;
    this.shortName = shortName;
    if (this._ref)
      this._ref.markForCheck();
  }

  private _dispose() {
    if (this.languageChanged) {
      this.languageChanged.unsubscribe();
      this.languageChanged = null;
    }
    if (this.shortNameChanged) {
      this.shortNameChanged.unsubscribe();
      this.shortNameChanged = null;
    }
  }

  transform(value: any, args?: any): any {
    this._dispose();

    if (!this.languageChanged) {
      this.languageChanged = this.store.pipe(select(selectLanguage))
        .subscribe(language => this.onLanguageChanged(language))
    }
    if (!this.shortNameChanged) {
      this.shortNameChanged = this.store.pipe(select(selectInstitutionShortName))
        .subscribe(shortName => this.onShortNameChanged(shortName))
    }

    return prefixRoute(value, this.language, this.shortName);
  }

}
