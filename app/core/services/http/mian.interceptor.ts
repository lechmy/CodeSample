import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorsService } from './http-errors.service';
import { AppState, selectParticipantForInstitution, selectLanguage } from '../../reducers';
import { RemoveAction as RemoveParticipantAction } from '../../reducers/participant'
import { ParticipantDto } from '../../../shared/dto/participant/participant.dto';

@Injectable({
  providedIn: 'root'
})
export class MainInterceptor implements HttpInterceptor, OnDestroy {
  private participant: ParticipantDto;
  private language: string;

  private participantChanged: Subscription;
  private languageChanged: Subscription;

  constructor(
    private store: Store<AppState>,
    private httpErrors: HttpErrorsService
  ) {
    this.participantChanged = this.store.pipe(select(selectParticipantForInstitution))
      .subscribe(participant => this.participant = participant);
    this.languageChanged = this.store.pipe(select(selectLanguage))
      .subscribe(language => this.language = language);
  }

  ngOnDestroy() {
    if (this.participantChanged)
      this.participantChanged.unsubscribe();
    if (this.languageChanged)
      this.languageChanged.unsubscribe();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let disableToken = false;
    let disableErrorEvents = false;

    // Ignore by request headers
    if (req.headers.has('__disableToken')) {
      disableToken = true;
      req = req.clone({headers: req.headers.delete('__disableToken')});
    }

    // stop http error events
    if (req.headers.has('__disableErrorEvents')) {
      disableErrorEvents = true;
      req = req.clone({headers: req.headers.delete('__disableErrorEvents')});
    }

    if (!disableToken && !req.headers.has('Authorization') && this.participant) {
      req = req.clone({setHeaders: {Authorization: `Bearer ${this.participant.token}`}});
    }

    if (this.language) {
      req = req.clone({setHeaders: {'X-Culture': this.language}});
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 400 && !disableErrorEvents) {
          this.httpErrors.badRequest.emit(error);
        }
        else if (error.status === 401) {
          if (!disableErrorEvents) {
            this.httpErrors.unauthorized.emit(error);
          }
          if (this.participant) {
            this.store.dispatch(new RemoveParticipantAction(this.participant.institutionId));
          }
        }
        else if (error.status === 403 && !disableErrorEvents) {
          this.httpErrors.forbidden.emit(error);
        }
        else if (!disableErrorEvents) {
          this.httpErrors.error.emit(error);
        }
        return throwError(error);
      })
    );
  }
}

export const mainInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: MainInterceptor,
  multi: true
}
