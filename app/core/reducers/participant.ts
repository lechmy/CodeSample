import { Action } from '@ngrx/store';

import { ParticipantDto } from '../../shared/dto/participant/participant.dto';
import { ParticipantTokenDto } from '../../shared/dto/participant/participant-token.dto';

// actions

export interface State {
  [institutionId: string]: ParticipantDto;
}

export const initialState: State = {};

export const UPDATE = '[Participant] UPDATE';
export class UpdateAction implements Action {
  type = UPDATE;

  constructor(public payload: ParticipantDto) { }
}

export const UPDATE_TOKEN = '[Participant] UPDATE_TOKEN';
export class UpdateTokenAction implements Action {
  type = UPDATE_TOKEN;

  constructor(public payload: {toke: ParticipantTokenDto, institutionId: string}) { }
}

export const REMOVE = '[Participant] REMOVE';
export class RemoveAction implements Action {
  type = REMOVE;

  constructor(public payload: string) { }
}

export const CLEAN = '[Participant] CLEAN';
export class CleanAction implements Action {
  type = CLEAN;
  payload = null;
}

export type Actions = UpdateAction | UpdateTokenAction | RemoveAction | CleanAction;

// reducer

export function fromObject(obj: any = null): State {
  return !obj ? {} : obj;
}

export function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case UPDATE:
    {
      const st = Object.assign({}, state);
      const participant = action.payload as ParticipantDto;
      if (participant)
        st[participant.institutionId] = participant;
      return st;
    }
    case UPDATE_TOKEN:
    {
      const st = Object.assign({}, state);
      const tokenUpdate = (action.payload as {toke: ParticipantTokenDto, institutionId: string});
      const token = !tokenUpdate ? null : tokenUpdate.toke;
      const institutionId = !tokenUpdate ? null : tokenUpdate.institutionId;
      if (st[institutionId]) {
        st[institutionId].token = token.token;
        st[institutionId].refreshToken = token.refreshToken;
      }
      return st;
    }
    case REMOVE:
    {
      const st = Object.assign({}, state);
      const institutionId = action.payload as string;
      if (st[institutionId])
        delete st[institutionId];
      return st;
    }
    case CLEAN:
    {
      const st = Object.assign({}, initialState);
      return st;
    }
    default:
      return state;
  }
}
