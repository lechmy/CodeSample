import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Subscription, EMPTY, interval, Observer, Observable, from } from 'rxjs';
import { map, distinctUntilChanged, takeUntil, finalize } from 'rxjs/operators';

import { parse, isBefore, differenceInSeconds } from 'date-fns';
import * as jwtDecode from 'jwt-decode';

import { AppState, selectParticipantForInstitution, selectSettings } from '../reducers';
import { UpdateAction, RemoveAction, UpdateTokenAction } from '../reducers/participant';
import { ParticipantService } from '../../shared/services/participant.service';
import { ParticipantLogInModel } from '../../shared/models/participant/participant-log-in.model';

import { ParticipantDto } from '../../shared/dto/participant/participant.dto';
import { SettingsDto } from '../../shared/dto/settings/settings.dto';
import { ParticipantTokenDto } from '../../shared/dto/participant/participant-token.dto';

import { ParticipantRefreshTokenModel } from '../../shared/models/participant/participant-refresh-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private participant: ParticipantDto;
  private participantChanged: Subscription;

  private settings: SettingsDto;
  private settingsChanged: Subscription;

  private _cancelTokenRefresh: Observer<any>;

  private _tokenRefreshInProgress = false;

  invalidToken = new EventEmitter<any>();

  constructor(
    private participantService: ParticipantService,
    private store: Store<AppState>
  ) {
    this.participantChanged = this.store.pipe(
      select(selectParticipantForInstitution),
      distinctUntilChanged((x, y) => (!x ? null : x.participantId) === (!y ? null : y.participantId))
    ).subscribe(x => this.participant = x);

    this.settingsChanged = this.store.pipe(
      select(selectSettings)
    ).subscribe(x => this.settings = x);
  }

  ngOnDestroy() {
    if (this.participantChanged)
      this.participantChanged.unsubscribe();
    if (this.settingsChanged)
      this.settingsChanged.unsubscribe();
  }

  login(model: ParticipantLogInModel) {
    return this.participantService.login(model).pipe(
      map(val => {
        this.store.dispatch(new UpdateAction(val));
        return val
      })
    );
  }

  logout() {
    if (!this.participant)
      return;
    this.store.dispatch(new RemoveAction(this.participant.institutionId));
  }

  validate() {
    if (!this.participant)
      return EMPTY;
    return this.participantService.validateToken();
  }

  refreshToken() {
    // stop token refreshing
    this.cancelRefreshToken();

    // validate current token
    if (!this.validateToken()) {
      this.invalidToken.emit();
      return;
    }

    // start background refreshing
    interval(6000).pipe(
      takeUntil(Observable.create((x: any) => this._cancelTokenRefresh = x))
    ).subscribe(() => this.onTokenRefresh());
  }

  public cancelRefreshToken() {
    if (!this._cancelTokenRefresh) {
      return;
    }
    this._cancelTokenRefresh.next('');
    this._cancelTokenRefresh = null;
  }

  private validateToken() {
    if (!this.participant || !this.participant.token) {
      return null;
    }

    const offset = !this.settings ? 0 : this.settings.serverTimeOffset;

    let token = null;
    try {
      const source = jwtDecode<{nbf: number; exp: number; iat: number}>(this.participant.token);
      token = {
        now: new Date(),
        nbf: parse((source.nbf + offset) * 1000),
        exp: parse((source.exp + offset) * 1000),
        iat: parse((source.iat + offset) * 1000)
      };

      if (!(isBefore(token.nbf, token.now))) {
        // invalid token
        return null;
      }

      if (!(isBefore(token.now, token.exp))) {
        // invalid token
        return null;
      }
    }
    catch(err) { }

    return token
  }

  private onTokenRefresh() {
    const token = this.validateToken();
    if (!token) {
      this.invalidToken.emit();
      return;
    }

    const frame = differenceInSeconds(token.exp, token.iat);
    const left = differenceInSeconds(token.exp, token.now);
    if (left > frame / 2) {
      // skip refresh
      return;
    }

    if (this._tokenRefreshInProgress) {
      // refresh in progress
      return;
    }

    if (!this.participant.refreshToken) {
      // refresh token missing
      return;
    }

    if (!this.participant.institutionId) {
      // institution missing
      return;
    }

    this._tokenRefreshInProgress = true;

    const model = new ParticipantRefreshTokenModel();
    model.refreshToken = this.participant.refreshToken;
    this.participantService.refreshToken(model)
      .pipe(finalize(() => this._tokenRefreshInProgress = false))
      .subscribe(
        x => this.onNewToken(x),
        x => this.onNewTokenError(x)
      );
  }

  private onNewToken(token: ParticipantTokenDto) {
    this.store.dispatch(new UpdateTokenAction({
      institutionId: this.participant.institutionId,
      toke: token
    }));
  }

  private onNewTokenError(error: any) {
    if (error.status === 400) {
      if (!this.participant) {
        // missing participant
        return;
      }

      const token = new ParticipantTokenDto();
      token.token = this.participant.token;
      this.store.dispatch(new UpdateTokenAction({
        institutionId: this.participant.institutionId,
        toke: token
      }));
    }
  }
}
