import { ActionReducer, ActionReducerMap, MetaReducer, INITIAL_STATE, META_REDUCERS, createSelector } from '@ngrx/store';
import { Injector } from '@angular/core';

import { SettingsDto } from '../../shared/dto/settings/settings.dto';
import { ParticipantTokenDto } from '../../shared/dto/participant/participant-token.dto';
import { LoggerFactory } from '../services/logger.service';

import * as fromSettings from './settings';
import * as fromLanguage from './language';
import * as fromInstitution from './institution';
import * as fromParticipant from './participant';

export type InstitutionState = fromInstitution.State;
export type ParticipantState = fromParticipant.State;

const storageKey = 'appState';
const logPrefix = 'app:store';

export interface AppState {
  settings: SettingsDto,
  language: string,
  institution: InstitutionState,
  participant: ParticipantState
}

const initialState: AppState = {
  settings: null,
  language: null,
  institution: fromInstitution.initialState,
  participant: fromParticipant.initialState
};

export const rootReducer: ActionReducerMap<AppState> = {
  settings: fromSettings.reducer,
  language: fromLanguage.reducer,
  institution: fromInstitution.reducer,
  participant: fromParticipant.reducer
};

export function fromObject(obj: any = null): AppState {
  const state = Object.assign({}, initialState);
  if (obj == null)
    return state;

  if (obj.hasOwnProperty('settings'))
    state.settings = fromSettings.fromObject(obj['settings']);
  if (obj.hasOwnProperty('language'))
    state.language = fromLanguage.fromObject(obj['language']);
  if (obj.hasOwnProperty('institution'))
    state.institution = fromInstitution.fromObject(obj['institution']);
  if (obj.hasOwnProperty('participant'))
    state.participant = fromParticipant.fromObject(obj['participant']);

  return state;
}

export function localStorage(reducer: ActionReducer<any>, loggerFactory: LoggerFactory): ActionReducer<any> {
  return (state, action) => {
    const logger = loggerFactory.getLogger(logPrefix);
    const newState = reducer(state, action);
    logger.debug('New state:', action.type, newState);
    if (!window.localStorage) {
      logger.warn('No localStorage API.');
    } else {
      window.localStorage.setItem(storageKey, JSON.stringify(newState));
    }
    return newState;
  };
}

export function fromLocaleStorage(loggerFactory: LoggerFactory): AppState {
  const logger = loggerFactory.getLogger(logPrefix);
  let state = null;
  try {
    if (window.localStorage) {
      const json = JSON.parse(window.localStorage.getItem(storageKey));
      state = fromObject(json);
    } else {
      logger.warn('No localStorage API.');
    }
  } catch (e) {
    logger.error(e);
  }

  if (!state) {
    state = fromObject();
  }

  logger.debug('State from store:', state);

  return state;
}

export function initialStateFactory(injector: Injector): AppState {
  return fromLocaleStorage(injector.get(LoggerFactory));
}

export function metaReducersFactory(injector: Injector): MetaReducer<any>[] {
  const loggerFactory = injector.get(LoggerFactory);
  return [
    reducer => localStorage(reducer, loggerFactory)
  ];
}

export const initialStateProvider = {
  provide: INITIAL_STATE,
  useFactory: initialStateFactory,
  deps: [Injector]
};

export const metaReducersProvider = {
  provide: META_REDUCERS,
  useFactory: metaReducersFactory,
  deps: [Injector]
};

export const selectSettings = (state: AppState) => state.settings;
export const selectLanguage = (state: AppState) => state.language;

export const selectInstitution = (state: AppState) => state.institution;
export const selectInstitutionId = createSelector(selectInstitution, fromInstitution.selectInstitutionId);
export const selectInstitutionShortName = createSelector(selectInstitution, fromInstitution.selectShortName);
export const selectInstitutionCurrencySign = createSelector(selectInstitution, fromInstitution.selectCurrencySign);
export const selectInstitutionNewsletterLink = createSelector(selectInstitution, fromInstitution.selectNewsletterLink);
export const selectInstitutionPhoneMobile = createSelector(selectInstitution, fromInstitution.selectPhoneMobile);
export const selectInstitutionPhoneFixed = createSelector(selectInstitution, fromInstitution.selectPhoneFixed);
export const selectInstitutionIsStripeActive = createSelector(selectInstitution, fromInstitution.selectIsStripeActive);
export const selectInstitutionStripePublishableKey = createSelector(selectInstitution, fromInstitution.selectStripePublishableKey);

export const selectParticipant = (state: AppState) => state.participant;
export const selectParticipantForInstitution = createSelector(
  selectInstitutionId,
  selectParticipant,
  (institutionId, participant) => participant[institutionId]);
export const selectParticipantToken = createSelector(selectParticipantForInstitution, participant =>
  !participant ? null : ({token: participant.token, refreshToken: participant.refreshToken} as ParticipantTokenDto));
