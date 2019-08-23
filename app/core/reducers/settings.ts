import { Action } from '@ngrx/store';

import { SettingsDto } from '../../shared/dto/settings/settings.dto';

// actions

export const UPDATE = '[Settings] UPDATE';
export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: SettingsDto) { }
}

export type Actions = UpdateAction;

// reducer

export function fromObject(obj: any = null): SettingsDto {
  return obj;
}

export function reducer(state = null, action: Actions): SettingsDto {
  switch (action.type) {
    case UPDATE:
      return action.payload == null ? null : Object.assign({}, action.payload);
    default:
      return state;
  }
}
