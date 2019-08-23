import { Injectable, OnDestroy, InjectionToken, Optional, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';

import {
  AppState, selectSettings, selectLanguage, selectInstitutionId, selectInstitutionShortName,
  selectInstitutionCurrencySign, selectInstitutionNewsletterLink, selectInstitutionPhoneMobile,
  selectInstitutionPhoneFixed, selectInstitutionIsStripeActive, selectInstitutionStripePublishableKey
} from '../../core/reducers';
import { SettingsDto } from '../dto/settings/settings.dto';
import { InstitutionDto } from '../dto/institution/institution.dto';

import { UpdateAction as UpdateLanguageAction } from '../../core/reducers/language';
import {
  UpdateIdAction as UpdateInstitutionIdAction,
  UpdateShortNameAction as UpdateInstitutionShortNameAction,
  UpdateCurrencySignAction as UpdateInstitutionCurrencySignAction,
  UpdateNewsletterLinkAction as UpdateInstitutionNewsletterLinkAction,
  UpdatePhoneMobileAction as UpdateInstitutionPhoneMobileAction,
  UpdatePhoneFixedAction as UpdateInstitutionPhoneFixedAction,
  UpdateIsStripeActiveAction as UpdateInstitutionIsStripeActiveAction,
  UpdateStripePublishableKeyAction as UpdateInstitutionStripePublishableKeyAction
} from '../../core/reducers/institution';

import { getInstitutionByShortName } from '../utils/language-and-institution';

const languageRegex = /^\w{2,3}(-\w{2,4})?(-\w{2})?$/;

export interface LanguageAndInstitutionGuardSettings {
  institutionNotRequiredPaths: string[];
}

export const LANGUAGE_AND_INSTITUTION_GUARD_SETTINGS
  = new InjectionToken<LanguageAndInstitutionGuardSettings>('LanguageAndInstitutionGuardSettings');

@Injectable({
  providedIn: 'root',
})
export class LanguageAndInstitutionGuard implements CanActivate, OnDestroy {
  private subscriptions: Subscription[];
  private settings: SettingsDto;
  private language: string;
  private institutionId: string;
  private shortName: string;
  private currencySign: string;
  private newsletterLink: string;
  private phoneMobile: string;
  private phoneFixed: string;
  private isStripeActive: boolean;
  private stripePublishableKey: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Optional() @Inject(LANGUAGE_AND_INSTITUTION_GUARD_SETTINGS)
    private languageAndInstitutionGuardSettings: LanguageAndInstitutionGuardSettings
  ) {
    this.subscriptions = [];

    this.subscriptions.push(store.pipe(select(selectSettings))
      .subscribe(settings => this.settings = settings));
    this.subscriptions.push(store.pipe(select(selectLanguage))
      .subscribe(language => this.language = language));
    this.subscriptions.push(store.pipe(select(selectInstitutionId))
      .subscribe(institutionId => this.institutionId = institutionId));
    this.subscriptions.push(store.pipe(select(selectInstitutionShortName))
      .subscribe(shortName => this.shortName = shortName));
    this.subscriptions.push(store.pipe(select(selectInstitutionCurrencySign))
      .subscribe(currencySign => this.currencySign = currencySign));
    this.subscriptions.push(store.pipe(select(selectInstitutionNewsletterLink))
      .subscribe(newsletterLink => this.newsletterLink = newsletterLink));
    this.subscriptions.push(store.pipe(select(selectInstitutionPhoneMobile))
      .subscribe(phoneMobile => this.phoneMobile = phoneMobile));
    this.subscriptions.push(store.pipe(select(selectInstitutionPhoneFixed))
      .subscribe(phoneFixed => this.phoneFixed = phoneFixed));
    this.subscriptions.push(store.pipe(select(selectInstitutionIsStripeActive))
      .subscribe(isStripeActive => this.isStripeActive = isStripeActive));
    this.subscriptions.push(store.pipe(select(selectInstitutionStripePublishableKey))
      .subscribe(stripePublishableKey => this.stripePublishableKey = stripePublishableKey));
  }

  ngOnDestroy() {
    for(let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let institution: InstitutionDto = null;
    let currentUrl = state.url;
    let language: string = null;
    let shortName: string = null;

    if (currentUrl.indexOf('/') === 0) {
      currentUrl = currentUrl.slice(1);
    }
    let cleanUrl = currentUrl.split('?')[0]
      .split('#')[0]
      .split(';')[0];

    const urlParts = cleanUrl.split('/');

    // root
    if (urlParts.length === 1 && urlParts[0] === '') {
      language = this.updateLanguage();
      shortName = this.updateInstitution();
      this.router.navigateByUrl(this.isInstitutionRequired(currentUrl)
        ? `/${language}/${shortName}${currentUrl}`
        : `/${language}${currentUrl}`);
      return false;
    }

    // one segment
    if (urlParts.length === 1) {
      if (languageRegex.test(urlParts[0])) {
        language = this.updateLanguage(urlParts[0]);
        shortName = this.updateInstitution();
        currentUrl = currentUrl.substring(language.length);
        if (this.isInstitutionRequired(currentUrl)) {
          this.router.navigateByUrl(`/${language}/${shortName}${currentUrl}`);
          return false;
        }
        else {
          return true;
        }
      }

      institution = this.getInstitution(urlParts[0]);
      if (institution) {
        language = this.updateLanguage();
        shortName = this.updateInstitution(institution);
        this.router.navigateByUrl(`/${language}/${currentUrl}`);
        return false;
      }

      language = this.updateLanguage();
      shortName = this.updateInstitution();
      this.router.navigateByUrl(this.isInstitutionRequired(currentUrl)
        ? `/${language}/${shortName}/${currentUrl}`
        : `/${language}/${currentUrl}`);
      return false;
    }

    // two or more segments
    if (urlParts.length >= 2) {
      // first segment is institution
      institution = this.getInstitution(urlParts[0])
      if (institution) {
        language = this.updateLanguage();
        shortName = this.updateInstitution(institution);
        this.router.navigateByUrl(`/${language}/${currentUrl}`);
        return false;
      }

      // first segment language, second not institution
      institution = this.getInstitution(urlParts[1])
      if (languageRegex.test(urlParts[0]) && !institution) {
        language = this.updateLanguage(urlParts[0]);
        shortName = this.updateInstitution();
        currentUrl = currentUrl.substring(language.length);
        if (this.isInstitutionRequired(currentUrl)) {
          this.router.navigateByUrl(`${language}/${shortName}${currentUrl}`)
          return false;
        }
        else {
          return true;
        }
      }
      // first segment not language, second not institution
      if (!languageRegex.test(urlParts[0]) && !institution) {
        language = this.updateLanguage();
        shortName = this.updateInstitution();
        this.router.navigateByUrl(this.isInstitutionRequired(currentUrl)
          ? `/${language}/${shortName}/${currentUrl}`
          : `/${language}/${currentUrl}`);
        return false;
      }

      this.updateLanguage(urlParts[0]);
      this.updateInstitution(institution);
    }

    // other cases
    return true;
  }

  private updateLanguage(language: string = null): string {
    language = !language ? this.settings.defaultLanguage : language.toLowerCase();
    if (this.language !== language)
      this.store.dispatch(new UpdateLanguageAction(language));
    return !language ? 'null' : language;
  }

  private updateInstitution(param: InstitutionDto|string = null): string {
    let institution: InstitutionDto = null;
    if (!param) {
      institution = this.getInstitution(this.settings.defaultInstitution);
    }
    else if (typeof param === 'string' || param instanceof String) {
      institution = this.getInstitution(param as string)
    }
    else {
      institution = param as InstitutionDto;
    }

    const oldId = this.institutionId;
    const newId = !institution ? null : institution.institutionId;

    const oldShortName = this.shortName;
    const newShortName = !institution ? null : institution.shortName;

    const oldCurrencySign = this.currencySign;
    const newCurrencySign = !institution ? null : institution.currencySign;

    const oldNewsletterLink = this.newsletterLink;
    const newNewsletterLink = !institution ? null : institution.newsletterLink;

    const oldPhoneMobile = this.phoneMobile;
    const newPhoneMobile = !institution ? null : institution.phoneMobile;

    const oldPhoneFixed = this.phoneFixed;
    const newPhoneFixed = !institution ? null : institution.phoneFixed;

    const oldStripeActive = this.isStripeActive;
    const newStripeActive = !institution ? null : institution.isStripeActive;

    const oldStripePublishableKey = this.stripePublishableKey;
    const newStripePublishableKey = !institution ? null : institution.stripePublishableKey;

    if (oldId !== newId)
      this.store.dispatch(new UpdateInstitutionIdAction(newId));

    if (oldShortName !== newShortName)
      this.store.dispatch(new UpdateInstitutionShortNameAction(newShortName));

    if(oldCurrencySign !== newCurrencySign)
      this.store.dispatch(new UpdateInstitutionCurrencySignAction(newCurrencySign));

    if(oldNewsletterLink !== newNewsletterLink)
      this.store.dispatch(new UpdateInstitutionNewsletterLinkAction(newNewsletterLink));

    if(oldPhoneMobile !== newPhoneMobile)
      this.store.dispatch(new UpdateInstitutionPhoneMobileAction(newPhoneMobile));

    if(oldPhoneFixed !== newPhoneFixed)
      this.store.dispatch(new UpdateInstitutionPhoneFixedAction(newPhoneFixed));

    if(oldStripeActive !== newStripeActive)
      this.store.dispatch(new UpdateInstitutionIsStripeActiveAction(newStripeActive));

    if(oldStripePublishableKey !== newStripePublishableKey)
      this.store.dispatch(new UpdateInstitutionStripePublishableKeyAction(newStripePublishableKey));

    return !newShortName ? 'null' : newShortName;
  }

  private getInstitution(shortName: string): InstitutionDto {
    return getInstitutionByShortName(shortName, this.settings.institutions);
  }

  private isInstitutionRequired(url: string): boolean {
    const settings = this.languageAndInstitutionGuardSettings;
    if (settings === null)
      return true;

    if (url.indexOf('/') === 0) {
      url = url.slice(1);
    }

    let isRequired = true;
    for (let path of settings.institutionNotRequiredPaths) {
      isRequired = !url.toLowerCase().startsWith(path.toLowerCase());
      if (!isRequired) break;
    }

    return isRequired;
  }
}
