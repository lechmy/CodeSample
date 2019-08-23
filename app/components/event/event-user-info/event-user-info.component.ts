import {Component, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {DropdownDate, fillDate, validateDate} from "../../../shared/utils/dropdown-date-picker";
import {ParticipantExtendedDto} from "../../../shared/dto/participant/participant-extended.dto";
import {ClassEnrollmentModel} from "../../../shared/models/class-enrollment.model";
import {EnrollmentService} from "../../../shared/services/enrollment.service";
import {CalculatePriceModel} from "../../../shared/models/calculate-price.model";
import {DiscountServiceResultDto} from "../../../shared/dto/class-events/discount-service-result.dto";
import {EnrollmentServiceResultDto} from "../../../shared/dto/class-events/enrollment-service-result.dto";
import {BirthdayEnrollmentModel} from "../../../shared/models/birthday-enrollment.model";
import {AppState, selectInstitutionIsStripeActive} from "../../../core/reducers";
import {select, Store} from "@ngrx/store";
import {Subscription} from "rxjs/index";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-event-user-info',
  templateUrl: './event-user-info.component.html',
  styleUrls: ['./event-user-info.component.scss']
})
export class EventUserInfoComponent implements OnInit, OnChanges {
  @Input() participant: ParticipantExtendedDto;
  @Input() event: any;
  @Input() eventDayIds: string[];
  @Input() currencySign: string;
  @Input() isBirthday: boolean;
  @Input() birthdayPackageId: string;
  @Input() birthdayExtraIds: string[];

  subscriptions: Subscription[] = [];
  enrollment: any;
  priceModel: CalculatePriceModel;
  fb: FormBuilder;
  addChildForm: FormGroup;
  validator: any;
  isAcceptedTerms: FormControl;
  gender: string[];
  birthDate: DropdownDate;
  languageSpoken: string[];
  childrenEnrolled: boolean;
  invalidDate: boolean;
  noChildSelected: boolean;
  eventPrice: DiscountServiceResultDto;
  enrollmentResult: EnrollmentServiceResultDto;
  isBusy: boolean;
  isStripeActive: boolean;

  constructor(
    private enrollmentService: EnrollmentService,
    private location: Location,
    private store: Store<AppState>
  ) {
    this.validator = {};
    this.fb = new FormBuilder();
    this.gender = ['Male', 'Female'];
    this.languageSpoken = ['English', 'German', 'Bilingual'];
    this.birthDate = fillDate();
    this.childrenEnrolled = false;
    this.invalidDate = false;
    this.noChildSelected = false;
    this.priceModel = new CalculatePriceModel();
    this.eventPrice = new DiscountServiceResultDto();
    this.enrollmentResult = new EnrollmentServiceResultDto();
    this.isBusy = false;
  }

  ngOnChanges() {
    this.eventPrice.calculatedPriceTotal = this.event.price;
    this.priceModel.eventId = this.event.eventId;
    this.priceModel.participantId = this.participant.participantId;
    this.priceModel.institutionId = this.participant.institutionId;
    this.priceModel.eventDayIds = this.eventDayIds;
    this.priceModel.birthdayPackageId = this.birthdayPackageId ? this.birthdayPackageId : null;
    this.priceModel.birthdayExtraIds = this.birthdayExtraIds.length ? this.birthdayExtraIds : null;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionIsStripeActive))
        .subscribe(isStripeActive => this.isStripeActive = isStripeActive)
    )
    this.createAddChildForm();
    this.isAcceptedTerms = new FormControl(null, Validators.requiredTrue);
    this.priceModel.code = '';
    if(this.isBirthday){
      this.enrollment = new BirthdayEnrollmentModel();
    } else {
      this.enrollment = new ClassEnrollmentModel();
    }
  }

  createAddChildForm() {
    this.addChildForm = this.fb.group({
      childFirstName: [null, Validators.required],
      childLastName: [null, Validators.required],
      gender: [null, Validators.required],
      birthDay: [null, Validators.required],
      birthMonth: [null, Validators.required],
      birthYear: [null, Validators.required],
      languageSpoken: [null, Validators.required],
      note: null
    });
  }

  selectChild(event) {
    if(event.target.checked) {
      this.enrollment.childParticipantIds.push(event.target.value);
    } else {
      let index = this.enrollment.childParticipantIds.indexOf(event.target.value);
      if (index > -1) {
        this.enrollment.childParticipantIds.splice(index, 1);
      }
    }
    this.noChildSelected = false;
    this.priceModel.childParticipantIds =  this.enrollment.childParticipantIds.slice(0);
    this.enrollmentService.calculatePrice(this.priceModel).subscribe(data => {
      this.eventPrice = Object.assign({}, data);
    });
  }

  enrolUser() {
    this.invalidDate = false;
    if(!this.participant.participantId) {
      return;
    }
    this.isBusy = true;
    this.enrollment.institutionId = this.participant.institutionId;
    this.enrollment.participantId = this.participant.participantId;
    this.enrollment.eventId = this.event.eventId;
    this.enrollment.eventDayIds = this.eventDayIds;
    this.enrollment.isAcceptedTerms = this.isAcceptedTerms.value;

    if(this.isBirthday) {
      this.enrollment.eventDayId = this.eventDayIds[0];
      this.enrollment.birthdayPackageId = this.event.birthdayPackage.birthdayExtrasId;
      this.enrollment.birthdayActivityId = this.event.birthdayActivity.birthdayActivityId;
      this.enrollment.birthdayExtraIds = [];
      this.event.birthdayExtras.forEach(item => {
        this.enrollment.birthdayExtraIds.push(item.birthdayExtrasId);
      });
      this.enrollment.averageAge = this.event.averageAge;
      this.enrollment.areParentsWelcome = this.event.areParentsWelcome;
      this.enrollment.additionalNumberOfChildren = this.event.additionalNumberOfChildren;
      this.enrollment.language = this.event.language;
    }

    const year = this.addChildForm.controls['birthYear'].value;
    const month = this.addChildForm.controls['birthMonth'].value;
    const day = this.addChildForm.controls['birthDay'].value;

    if(!this.enrollment.childParticipantIds.length && this.addChildForm.pristine) {
      this.noChildSelected = true;
      this.isBusy = false;
      return;
    }

    if(!this.enrollment.childParticipantIds.length && this.addChildForm.invalid) {
      this.validator = this.addChildForm.controls;
      this.noChildSelected = false;
      this.isBusy = false;
      return;
    }

    if(!this.enrollment.childParticipantIds.length && !validateDate(day, month, year)){
      this.invalidDate = true;
      this.isBusy = false;
      return;
    }

    if(!this.isAcceptedTerms.value) {
      this.isAcceptedTerms.setValue(false);
      this.isBusy = false;
      return;
    }

    if(!this.enrollment.childParticipantIds.length) {
      this.enrollment.childFirstName = this.addChildForm.controls['childFirstName'].value;
      this.enrollment.childLastName = this.addChildForm.controls['childLastName'].value;
      this.enrollment.gender = this.addChildForm.controls['gender'].value;
      this.enrollment.birthDay = day;
      this.enrollment.birthMonth = month;
      this.enrollment.birthYear = year;
      this.enrollment.languageSpoken = this.addChildForm.controls['languageSpoken'].value;
      this.enrollment.note = this.addChildForm.controls['note'].value;
    }

    if(this.isBirthday) {
      this.enrollmentService.enrolBirthdayParticipant(this.enrollment).subscribe(data => {
        this.enrollmentResult = Object.assign({}, data);
        this.childrenEnrolled = true;
      }, null, () => { this.isBusy = false; });
    } else {
      this.enrollmentService.enrolParticipant(this.enrollment).subscribe(data => {
        this.enrollmentResult = Object.assign({}, data);
        this.childrenEnrolled = true;
      }, null, () => { this.isBusy = false; });
    }
  }

  onCouponValidated(data: string) {
    this.enrollment.code = data;
    this.priceModel.code = data;
    this.enrollmentService.calculatePrice(this.priceModel).subscribe(data => {
      this.eventPrice = Object.assign({}, data);
    });
  }

  goBack() {
    this.location.back();
  }

  get termsAccepted() { return this.isAcceptedTerms; }
}
