import { Injectable, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import {AppState, selectLanguage, selectInstitutionShortName, selectSettings} from '../reducers';
import { prefixRoute, getInstitutionByShortName, getInstitutionById } from '../../shared/utils/language-and-institution';
import {SettingsDto} from "../../shared/dto/settings/settings.dto";
import {InstitutionDto} from "../../shared/dto/institution/institution.dto";

export interface AppNavigateExtras extends NavigationExtras {
  language?: string;
  shortName?: string;
  institutionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppRouterService implements OnDestroy {
  private language: string;
  private shortName: string;
  private settings: SettingsDto;

  private subscriptions: Subscription[] = [];

  constructor(
    private router : Router,
    store: Store<AppState>
  ) {
    this.subscriptions.push(store.pipe(select(selectLanguage))
      .subscribe(lng => this.language = lng));
    this.subscriptions.push(store.pipe(select(selectInstitutionShortName))
      .subscribe(shn => this.shortName = shn));
    this.subscriptions.push(store.pipe(select(selectSettings))
      .subscribe(settings => this.settings = settings));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  navigate(commands: any[], extras: AppNavigateExtras = { skipLocationChange: false }): Promise<boolean> {
    // language
    let language = this.language;
    if (extras && extras.language) {
      language = extras.language;
    }
    if (!language) {
      language = this.settings.defaultLanguage;
    }

    // shortName
    let shortName = this.shortName;
    if (extras && extras.shortName) {
      shortName = extras.shortName;
    }
    if (extras && extras.institutionId) {
      const institution = this.getInstitutionById(extras.institutionId);
      if (institution) {
        shortName = institution.shortName;
      }
    }
    if (!shortName) {
     const institution = this.getInstitutionByShortName(this.settings.defaultInstitution);
     if (!institution) {
       shortName = institution.shortName;
     }
    }

    // navigate
    return this.router.navigate(
      prefixRoute(commands, language, shortName),
      extras
    );
  }

  navigateHome(extras: AppNavigateExtras = { skipLocationChange: false }): Promise<boolean> {
    return this.navigate(['/'], extras);
  }

  private getInstitutionByShortName(shortName: string): InstitutionDto {
    return getInstitutionByShortName(shortName, this.settings.institutions);
  }

  private getInstitutionById(institutionId: string): InstitutionDto {
    return getInstitutionById(institutionId, this.settings.institutions);
  }
}
