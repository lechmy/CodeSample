import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { finalize, concatMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EnrollmentService } from '../../../shared/services/enrollment.service';

import { ParticipantExtendedDto } from '../../../shared/dto/participant/participant-extended.dto';
import { EnrollmentDto } from '../../../shared/dto/class-events/enrollment.dto';
import {select, Store} from "@ngrx/store";
import {
  AppState, selectInstitutionCurrencySign, selectInstitutionIsStripeActive,
  selectInstitutionStripePublishableKey
} from "../../../core/reducers";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-account-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  private _participantExtended: ParticipantExtendedDto;

  subscriptions: Subscription[] = [];
  selectedEnrolment: EnrollmentDto;
  isBusy: boolean = false;
  paymentId: string;
  currencySign: string;
  isStripeActive: boolean;

  @Input()
  set participantExtended(p: ParticipantExtendedDto) {
    this._participantExtended = p;
  }

  @Input()
  enrollments: EnrollmentDto[];

  @Output()
  enrollmentsChanged = new EventEmitter<EnrollmentDto[]>();

  constructor(
    private enrollmentService: EnrollmentService,
    private modalService: NgbModal,
    private store: Store<AppState>
  ) {
    this.selectedEnrolment = new EnrollmentDto();
    this.paymentId = null;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionCurrencySign))
        .subscribe(currencySign => this.currencySign = currencySign),
      this.store.pipe(select(selectInstitutionIsStripeActive))
        .subscribe(isStripeActive => this.isStripeActive = isStripeActive)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setEnrollment(content: any, enrollment: EnrollmentDto) {
    this.selectedEnrolment = enrollment;
    this.modalService.open(content).result.then((result) => {
      this.selectedEnrolment = new EnrollmentDto();
    },reason => {
      this.selectedEnrolment = new EnrollmentDto();
    });
  }

  cancelEnrollment(){
    this.enrollmentService.cancelEnrollment(this.selectedEnrolment.enrollmentId)
      .pipe(
        concatMap(() => this.enrollmentService.getMyEnrollments(this.participantExtended.participantId)),
        finalize(() => this.isBusy = false)
      ).subscribe(enrollments => this.enrollmentsChanged.emit(enrollments));
  }

  refreshList() {
    this.enrollmentService.getMyEnrollments(this.participantExtended.participantId).subscribe(enrollments => {
      this.paymentId = null;
      this.enrollmentsChanged.emit(enrollments);
    });
  }

  togglePayment(ev: any, id: string) {
    if(this.paymentId && this.paymentId === id) {
      this.paymentId = null;
    } else {
      this.paymentId = id;
    }
  }

  get participantExtended() { return this._participantExtended; }
}
