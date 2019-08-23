import { Action } from '@ngrx/store';

// actions

export interface State {
  institutionId: string;
  shortName: string;
  currencySign: string;
  newsletterLink: string;
  phoneMobile: string;
  phoneFixed: string;
  isStripeActive: boolean;
  stripePublishableKey: string;
}
export const initialState: State = {
  institutionId: null,
  shortName: null,
  currencySign: null,
  newsletterLink: null,
  phoneMobile: null,
  phoneFixed: null,
  isStripeActive: null,
  stripePublishableKey: null,
};

export const UPDATE_ID = '[Institution] UPDATE_ID';
export class UpdateIdAction implements Action {
  readonly type = UPDATE_ID;

  constructor(public payload: string) { }
}

export const UPDATE_SHORT_NAME = '[Institution] UPDATE_SHORT_NAME';
export class UpdateShortNameAction implements Action {
  readonly type = UPDATE_SHORT_NAME;

  constructor(public payload: string) { }
}

export const UPDATE_CURRENCY_SIGN = '[Institution] UPDATE_CURRENCY_SIGN';
export class UpdateCurrencySignAction implements Action {
  readonly  type = UPDATE_CURRENCY_SIGN;

  constructor(public payload: string) { }
}

export const UPDATE_NEWSLETTER_LINK = '[Institution] UPDATE_NEWSLETTER_LINK';
export class UpdateNewsletterLinkAction implements Action {
  readonly  type = UPDATE_NEWSLETTER_LINK;

  constructor(public payload: string) { }
}

export const UPDATE_PHONE_MOBILE = '[Institution] UPDATE_PHONE_MOBILE';
export class UpdatePhoneMobileAction implements Action {
  readonly  type = UPDATE_PHONE_MOBILE;

  constructor(public payload: string) { }
}

export const UPDATE_PHONE_FIXED = '[Institution] UPDATE_PHONE_FIXED';
export class UpdatePhoneFixedAction implements Action {
  readonly  type = UPDATE_PHONE_FIXED;

  constructor(public payload: string) { }
}

export const UPDATE_IS_STRIPE_ACTIVE = '[Institution] UPDATE_IS_STRIPE_ACTIVE';
export class UpdateIsStripeActiveAction implements Action {
  readonly  type = UPDATE_IS_STRIPE_ACTIVE;

  constructor(public payload: boolean) { }
}

export const UPDATE_STRIPE_PUBLISHABLE_KEY = '[Institution] UPDATE_STRIPE_PUBLISHABLE_KEY';
export class UpdateStripePublishableKeyAction implements Action {
  readonly  type = UPDATE_STRIPE_PUBLISHABLE_KEY;

  constructor(public payload: string) { }
}

export type Actions = UpdateIdAction | UpdateShortNameAction | UpdateCurrencySignAction
  | UpdateNewsletterLinkAction | UpdatePhoneMobileAction | UpdatePhoneFixedAction
  | UpdateIsStripeActiveAction | UpdateStripePublishableKeyAction;

// reducer

export function fromObject(obj: any = null): State {
  const state = Object.assign({}, initialState);
  if (state == null)
    return state;

  if (obj.hasOwnProperty('institutionId'))
    state.institutionId = obj['institutionId'];
  if (obj.hasOwnProperty('shortName'))
    state.shortName = obj['shortName'];
  if (obj.hasOwnProperty('currencySign'))
    state.currencySign = obj['currencySign'];
  if (obj.hasOwnProperty('newsletterLink'))
    state.newsletterLink = obj['newsletterLink'];
  if (obj.hasOwnProperty('phoneMobile'))
    state.phoneMobile = obj['phoneMobile'];
  if (obj.hasOwnProperty('phoneFixed'))
    state.phoneFixed = obj['phoneFixed'];
  if (obj.hasOwnProperty('isStripeActive'))
    state.isStripeActive = obj['isStripeActive'];
  if (obj.hasOwnProperty('stripePublishableKey'))
    state.stripePublishableKey = obj['stripePublishableKey'];

  return state;
}

export function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case UPDATE_ID:
      return Object.assign({}, state, {institutionId: action.payload});
    case UPDATE_SHORT_NAME:
      return Object.assign({}, state, {shortName: action.payload});
    case UPDATE_CURRENCY_SIGN:
      return Object.assign({}, state, {currencySign: action.payload});
    case UPDATE_NEWSLETTER_LINK:
      return Object.assign({}, state, {newsletterLink: action.payload});
    case UPDATE_PHONE_MOBILE:
      return Object.assign({}, state, {phoneMobile: action.payload});
    case UPDATE_PHONE_FIXED:
      return Object.assign({}, state, {phoneFixed: action.payload});
    case UPDATE_IS_STRIPE_ACTIVE:
      return Object.assign({}, state, {isStripeActive: action.payload});
    case UPDATE_STRIPE_PUBLISHABLE_KEY:
      return Object.assign({}, state, {stripePublishableKey: action.payload});
    default:
      return state;
  }
}

export const selectInstitutionId = (state: State) => state.institutionId;
export const selectShortName = (state: State) => state.shortName;
export const selectCurrencySign = (state: State) => state.currencySign;
export const selectNewsletterLink = (state: State) => state.newsletterLink;
export const selectPhoneMobile = (state: State) => state.phoneMobile;
export const selectPhoneFixed = (state: State) => state.phoneFixed;
export const selectIsStripeActive = (state: State) => state.isStripeActive;
export const selectStripePublishableKey = (state: State) => state.stripePublishableKey;
