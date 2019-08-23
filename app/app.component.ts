import {Component, OnInit, OnDestroy, PLATFORM_ID, Inject} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged } from 'rxjs/operators';

import { AppState, selectParticipantForInstitution } from './core/reducers';

import { MessageService } from './core/services/message.service';
import { AppRouterService } from './core/services/app-router.service';
import { HttpErrorsService } from './core/services/http/http-errors.service';
import { AuthService } from './core/services/auth.service';

import { ParticipantDto } from './shared/dto/participant/participant.dto';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private participant: ParticipantDto;
  isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId,
    private messageService: MessageService,
    private httpErrors: HttpErrorsService,
    private appRouter: AppRouterService,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if(this.isBrowser){
      this.hideLoader();
    }
    // watch http errors
    this.subscriptions.push(this.httpErrors.error.subscribe((x: any) => this.onHttpError(x)));
    this.subscriptions.push(this.httpErrors.badRequest.subscribe((x: any) => this.onBadRequest(x)));
    this.subscriptions.push(this.httpErrors.forbidden.subscribe((x: any) => this.onHttpForbidden(x)));
    this.subscriptions.push(this.httpErrors.unauthorized.subscribe((x: any) => this.onHttpUnauthorized(x)));

    // watching participant
    this.subscriptions.push(this.store.pipe(
      select(selectParticipantForInstitution),
      distinctUntilChanged((x, y) => (!x ? null : x.participantId) === (!y ? null : y.participantId))
    ).subscribe(x => this.onParticipantChanged(x)));

    // token validation
    this.subscriptions.push(this.authService.invalidToken.subscribe(() => this.onInvalidToken()));

    // testing message service
    //this.messageService.success('Message service test!');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  private onHttpError(error: any) {
    let message = "Something is wrong!";
    if (error.error) {
      const err = error.error;
      if (err.message) {
        message += `\n${err.message}`;
      }
      else if (err.Message) {
        message += `\n${err.Message}`;
      }
    }
    else if (error.message) {
      message += `\n${error.message}`;
    }
    this.messageService.error(message);
  }

  private onBadRequest(error: any) {

  }

  private onHttpForbidden(error: any) {
    this.messageService.warning('Access forbidden!');
    this.appRouter.navigateHome();
  }

  private onHttpUnauthorized(error: any) {
    this.messageService.warning('Access denied!');
    this.appRouter.navigateHome();
  }

  private onParticipantChanged(participant: ParticipantDto) {
    this.participant = participant;
    this.authService.cancelRefreshToken();
    this.authService.validate()
      .subscribe(() => this.authService.refreshToken());
  }

  private onInvalidToken() {
    // this.messageService.warning('Token invalid!');
    this.authService.logout();
    this.appRouter.navigateHome();
  }

  private hideLoader() {
    this.document.querySelector('.loader-container').classList.remove('show');
  }
}
