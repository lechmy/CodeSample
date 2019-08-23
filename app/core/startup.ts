import { Injector, APP_INITIALIZER } from '@angular/core';
import { tap, concatMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { getTime } from 'date-fns';

import { SettingsService } from '../shared/services/settings.service';
import { LoggerFactory } from './services/logger.service';
import { AppState } from './reducers';
import { UpdateAction as UpdateSettingsAction } from './reducers/settings';
import { UpdateAction as UpdateLanguageAction } from './reducers/language';

export function startupFactory(injector: Injector) {
  return () => {
    const logger = injector.get(LoggerFactory).getLogger('app:startup');
    const settingsService = injector.get(SettingsService);
    const store = injector.get<Store<AppState>>(Store)

    // load settings from server
    const settings$ = settingsService.getSettings()
      .pipe(
        tap(
          settings => {
            if (settings) {
              settings.serverTimeOffset = Math.floor((getTime(new Date()) / 1000)) - settings.serverTime;
            }
            logger.debug('Settings:', settings);
            store.dispatch(new UpdateSettingsAction(settings));
            store.dispatch(new UpdateLanguageAction(settings.defaultLanguage));
          }
        )
      );

    // pipe everything together
    return of([])
      .pipe(
        concatMap(() => settings$)
      )
      .toPromise();
  }
}

export const startupProvider = {
  provide: APP_INITIALIZER,
  useFactory: startupFactory,
  deps: [Injector],
  multi: true
}
