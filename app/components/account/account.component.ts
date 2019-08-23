import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, concatMap, map } from 'rxjs/operators';

import { ParticipantService } from '../../shared/services/participant.service';
import { EnrollmentService } from '../../shared/services/enrollment.service';

import { AppState, selectParticipantForInstitution } from '../../core/reducers';
import { UpdateAction as UpdateParticipantAction } from '../../core/reducers/participant';

import { ParticipantDto } from '../../shared/dto/participant/participant.dto';
import { ParticipantExtendedDto } from '../../shared/dto/participant/participant-extended.dto';
import { EnrollmentDto } from '../../shared/dto/class-events/enrollment.dto';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  participant: ParticipantDto;
  participantExtended: ParticipantExtendedDto;
  enrollments: EnrollmentDto[] = [];
  loading: boolean;
  selectedTab: string;

  constructor(
    private store: Store<AppState>,
    private participantService: ParticipantService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute
  ) {
    this.selectedTab = 'tab-info';
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(
        select(selectParticipantForInstitution),
        distinctUntilChanged((x, y) => (!x ? null : x.participantId) === (!y ? null : y.participantId))
      ).subscribe(x => this.onParticipantChanged(x))
    );
    this.subscriptions.push(
      this.route.fragment.subscribe(fragment => {
        if(fragment === 'events') {
          this.selectedTab = 'tab-events';
        }
      })
    );
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions)
      subscription.unsubscribe();
  }

  onParticipantExtendedChanged(participantExtended: ParticipantExtendedDto) {
    this.participantExtended = participantExtended;

    this.participant.email = participantExtended.email;
    this.participant.firstName = participantExtended.firstName;
    this.participant.lastName = participantExtended.lastName;
    this.participant.phone = participantExtended.phone;

    this.store.dispatch(new UpdateParticipantAction(this.participant));
  }

  private onParticipantChanged(participant: ParticipantDto)
  {
    this.participant = participant;
    if (!this.participant) {
      this.reset()
    }

    this.participantService.getParticipantExtended(this.participant.participantId)
      .pipe(
        concatMap(p => this.getEnrollments(p))
      ).subscribe(
        p => this.onParticipantExtendedResponse(p),
        e => this.onParticipantExtendedResponseError(e),
      () => this.onParticipantExtendedResponseComplete()
      )
  }

  onEnrollmentsChanged(enrollments: EnrollmentDto[]) {
    this.enrollments = enrollments;
  }

  private onParticipantExtendedResponse(participantExtended: ParticipantExtendedDto) {
    this.participantExtended = participantExtended;
  }

  private onParticipantExtendedResponseError(error: any) {
    this.reset();
  }

  private onParticipantExtendedResponseComplete() {
    this.loading = false;
  }

  private getEnrollments(participantExtended: ParticipantExtendedDto): Observable<ParticipantExtendedDto> {
    return this.enrollmentService.getMyEnrollments(participantExtended.participantId)
      .pipe(
        map(enrollments => {
          this.enrollments = enrollments;
          return participantExtended;
        })
      );
  }

  private reset() {
    this.participantExtended = null;
    this.enrollments = []
  }
}
