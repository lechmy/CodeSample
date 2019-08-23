import { Action } from '@ngrx/store';

// actions

export const UPDATE = '[Language] UPDATE';
export class UpdateAction implements Action {
  readonly type = UPDATE;

  constructor(public payload: string) { }
}

export type Actions = UpdateAction;

// reducer

export function fromObject(obj: any = null): string {
  return obj == null ? null : obj.toString();
}

export function reducer(state = null, action: Actions): string {
  switch (action.type) {
    case UPDATE:
      return action.payload;
    default:
      return state;
  }
}
