import {Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ContentService} from "../../shared/services/content.service";
import {ActivatedRoute, Params} from "@angular/router";
import {ParticipantExtendedDto} from "../../shared/dto/participant/participant-extended.dto";
import {
  AppState, selectInstitutionCurrencySign, selectInstitutionIsStripeActive,
  selectParticipantForInstitution
} from "../../core/reducers";
import {select, Store} from "@ngrx/store";
import {distinctUntilChanged} from "rxjs/internal/operators";
import {ParticipantDto} from "../../shared/dto/participant/participant.dto";
import {Subscription} from "rxjs/index";
import {ParticipantService} from "../../shared/services/participant.service";
import {ClassEventModel} from "../../shared/models/class-event.model";
import {EnrollmentServiceResultDto} from "../../shared/dto/class-events/enrollment-service-result.dto";
import {BirthdayEventModel} from "../../shared/models/birthday-event.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {
  @ViewChild('controls') controlsEl: ElementRef;

  private subscriptions: Subscription[];
  event: any;
  eventDayIds: string[];
  participant: ParticipantExtendedDto;
  enrollmentResult: EnrollmentServiceResultDto;
  eventModel: ClassEventModel;
  birthdayEventModel: BirthdayEventModel;

  selectedArea: string;
  userLoggedIn: boolean;
  currencySign: string;
  userRegistered: boolean;
  isBirthday: boolean;
  loading: boolean;
  isStripeActive: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private contentService: ContentService,
    private store: Store<AppState>,
    private participantService: ParticipantService,
    private location: Location
  ) {
    this.subscriptions = [];
    this.event = {};
    this.eventDayIds = [];
    this.eventModel = new ClassEventModel();
    this.birthdayEventModel = new BirthdayEventModel();
    this.participant = new ParticipantExtendedDto();
    this.enrollmentResult = new EnrollmentServiceResultDto();
    this.selectedArea = '';
    this.userLoggedIn = false;
    this.userRegistered = false;
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe(this.onParamsChange.bind(this)),
      this.store.pipe(
        select(selectParticipantForInstitution),
        distinctUntilChanged((x, y) => {
          const xId = !x ? null : x.participantId;
          const yId = !y ? null : y.participantId;
          return xId === yId;
        })).subscribe(this.participantLoggedIn.bind(this)
      ),
      this.store.pipe(select(selectInstitutionCurrencySign)).subscribe(
        sign => this.currencySign = sign
      ),
      this.store.pipe(select(selectInstitutionIsStripeActive))
        .subscribe(isStripeActive => this.isStripeActive = isStripeActive)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onParamsChange(params: Params) {
    this.isBirthday = params['id'] == 'birthday' ? true : false;
    if(this.isBirthday) {
      this.subscriptions.push(
        this.activatedRoute.queryParamMap.subscribe(this.onBirthdayQueryParamsChange.bind(this))
      );
    } else {
      this.eventModel.eventId = params['id'];
      this.subscriptions.push(
        this.activatedRoute.queryParamMap.subscribe(this.onQueryParamsChange.bind(this))
      );
    }
  }

  onQueryParamsChange(params: Params) {
    this.eventModel.eventDayIds = this.eventDayIds = params.getAll('eventDayIds');
    this.contentService.getClassEvent(this.eventModel).subscribe(data => {
      this.event = Object.assign({}, data);
    }, null, () => { this.loading = false });
  }

  onBirthdayQueryParamsChange(params: Params) {
    this.birthdayEventModel.birthdayActivityId = params.get('birthdayActivity');
    this.birthdayEventModel.birthdayPackageId = params.get('birthdayPackage');
    this.birthdayEventModel.birthdayExtraIds = params.getAll('birthdayExtras');
    this.birthdayEventModel.eventDayId = params.get('eventDayId');
    this.eventDayIds.push(params.get('eventDayId'));
    this.birthdayEventModel.additionalNumberOfChildren = params.get('additionalChildren');
    if(params.get('parentsWelcome') === 'true'){
      this.birthdayEventModel.areParentsWelcome = true;
    } else if(params.get('parentsWelcome') === 'false'){
      this.birthdayEventModel.areParentsWelcome = false;
    }
    this.birthdayEventModel.averageAge = params.get('averageAge');
    this.birthdayEventModel.language = params.get('language');
    this.contentService.getBirthdayEvent(this.birthdayEventModel).subscribe(data => {
      this.event = Object.assign({}, data);
    }, null, () => { this.loading = false });
  }

  selectArea(value: string) {
    this.selectedArea = value;
    setTimeout(() => {
      this.controlsEl.nativeElement.scrollIntoView();
    }, 100);

  }

  participantLoggedIn(participant: ParticipantDto) {
    if(participant){
      this.participantService.getParticipantExtended(participant.participantId).subscribe(data => {
        this.participant = Object.assign({}, data);
        this.userLoggedIn = true;
      });
    } else {
      this.participant = new ParticipantExtendedDto();
      this.userLoggedIn = false;
    }
  }

  onUserRegister(data: EnrollmentServiceResultDto) {
    this.enrollmentResult = data;
    this.userRegistered = true;
  }

  goBack() {
    this.location.back();
  }
}
