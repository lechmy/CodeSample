import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs/operators';

import { AppState, selectParticipantForInstitution } from '../../core/reducers';
import { ParticipantDto } from '../dto/participant/participant.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {
  private subscriptions: Subscription[] = [];
  private participant: ParticipantDto;

  constructor(
    store: Store<AppState>
  ) {
    // watching participant
    this.subscriptions.push(store.pipe(
      select(selectParticipantForInstitution),
      distinctUntilChanged((x, y) => (!x ? null : x.participantId) === (!y ? null : y.participantId))
    ).subscribe(x => this.participant = x));
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions)
      sub.unsubscribe();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return !this.participant ? false : true;
  }
}
