import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DropdownDate, fillDate, validateDate} from "../../../shared/utils/dropdown-date-picker";
import {ClassEnrollmentModel} from "../../../shared/models/class-enrollment.model";
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionId} from "../../../core/reducers";
import {Subscription} from "rxjs/index";
import {AuthService} from "../../../core/services/auth.service";
import {WindowRef} from "../../../core/services/window.service";

import {ParticipantDto} from "../../../shared/dto/participant/participant.dto";
import {EnrollmentService} from "../../../shared/services/enrollment.service";
import {ClassEventDto} from "../../../shared/dto/class-events/class-event.dto";
import {CalculatePriceModel} from "../../../shared/models/calculate-price.model";
import {DiscountServiceResultDto} from "../../../shared/dto/class-events/discount-service-result.dto";
import { Constants } from '../../../shared/utils/constants';
import {EnrollmentServiceResultDto} from "../../../shared/dto/class-events/enrollment-service-result.dto";
import {FormManager} from "../../../forms/form-manager";

@Component({
  selector: 'app-event-register',
  templateUrl: './event-register.component.html',
  styleUrls: ['./event-register.component.scss']
})
export class EventRegisterComponent implements OnInit, OnDestroy, OnChanges {
  readonly enrollmentFormKey = 'CHANGE_PASSWORD_FORM';

  @ViewChildren('inputfield') inputfields: QueryList<ElementRef>;

  @Input() event: ClassEventDto;
  @Input() eventDayIds: string[];
  @Input() currencySign: string;
  @Output() userRegistered: EventEmitter<EnrollmentServiceResultDto> = new EventEmitter();

  private subscriptions: Subscription[];
  validator: any;
  fb: FormBuilder;
  registerForm: FormGroup;
  howDidYouHearAboutUs: string[];
  gender: string[];
  birthDate: DropdownDate;
  languageSpoken: string[];
  enrollment: ClassEnrollmentModel;
  priceModel: CalculatePriceModel;
  loginData: any;
  institutionId: string;
  invalidDate: boolean;
  eventPrice: DiscountServiceResultDto;
  isBusy: boolean;

  constructor(
    private store: Store<AppState>,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private fm: FormManager,
    private winRef: WindowRef
  ) {
    this.subscriptions = [];
    this.validator = {};
    this.fb = new FormBuilder();
    this.howDidYouHearAboutUs = Constants.howDidYouHearAboutUs;
    this.gender = Constants.gender;
    this.languageSpoken = Constants.languageSpoken;
    this.birthDate = fillDate();
    this.enrollment = new ClassEnrollmentModel();
    this.institutionId = '';
    this.invalidDate = false;
    this.eventPrice = new DiscountServiceResultDto();
    this.priceModel = new CalculatePriceModel();
    this.isBusy = false;
    this.loginData = {};
  }

  ngOnInit() {
    this.createRegisterForm();
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionId))
        .subscribe(institutionId => {
          this.registerForm.patchValue({institutionId});
          this.institutionId = institutionId;
          this.priceModel.institutionId = institutionId
        })
    );
    this.registerForm.patchValue({'eventId': this.event.eventId});
    this.eventPrice.calculatedPriceTotal = this.event.price;

  }

  ngOnChanges() {
    this.priceModel.eventId = this.event.eventId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      institutionId: [null, Validators.required],
      eventId: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      address: null,
      district: null,
      howDidYouHearAboutUs: [null, Validators.required],
      isAcceptedTerms: [null, Validators.requiredTrue],
      childFirstName: [null, Validators.required],
      childLastName: [null, Validators.required],
      gender: [null, Validators.required],
      birthDay: [null, Validators.required],
      birthMonth: [null, Validators.required],
      birthYear: [null, Validators.required],
      languageSpoken: [null, Validators.required],
      note: null
    }, {validator: [this.checkPasswordValidation, this.checkDateValidation.bind(this)]});
  }

  onRegisterSubmit() {
    this.invalidDate = false;

    this.enrollment = Object.assign({}, this.enrollment, this.registerForm.value);
    this.enrollment.eventDayIds = this.eventDayIds;

    if(!validateDate(this.enrollment.birthDay, this.enrollment.birthMonth, this.enrollment.birthYear)){
      this.invalidDate = true;
    }

    if (this.registerForm.invalid) {
      this.validator = this.registerForm.controls;
      this.checkInputfields();
      return;
    }

    this.isBusy = true;
    this.loginData = {
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
      institutionId: this.registerForm.controls['institutionId'].value,
    };

    this.fm.handleRequest(this.enrollmentService.enrolParticipant(this.enrollment), this.enrollmentFormKey)
      .subscribe(
        this.onEnrollmentSuccess.bind(this),
        this.onEnrollmentError.bind(this),
        this.onEnrollmentComplete.bind(this)
      );

    // this.enrollmentService.enrolParticipant(this.enrollment).subscribe(data => {
    //   this.userRegistered.emit(data);
    //   this.authService.login(this.loginData).subscribe(
    //     val => this.onSuccess(val),
    //     error => this.onError(error),
    //     () => this.onComplete()
    //   );
    // }, this.onEnrollmentError.bind(this));
  }

  onCouponValidated(data: string) {
    this.enrollment.code = data;
    this.priceModel.code = data;
    this.enrollmentService.calculatePrice(this.priceModel).subscribe(data => {
      this.eventPrice = Object.assign({}, data);
    });
  }

  onEnrollmentSuccess(data: any) {
    this.userRegistered.emit(data);
    this.authService.login(this.loginData).subscribe(
      val => this.onSuccess(val),
      error => this.onError(error),
      () => this.onComplete()
    );
  }

  onEnrollmentError(error: any) {
    // console.error('error', error);
    this.isBusy = false;
    setTimeout(() => {
      this.checkInputfields();
    }, 0);
  }

  onEnrollmentComplete() {

  }

  checkPasswordValidation(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { 'notSame': true };
  }

  checkDateValidation(group: FormGroup) {
    const validDays = {
      1: 31,
      2: group.controls.birthYear.value % 4 == 0 ? 29 : 28,
      3: 31,
      4: 30,
      5: 31,
      6: 31,
      7: 30,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31
    };
    if(group.controls.birthDay.value <= validDays[group.controls.birthMonth.value] && group.controls.birthDay.value > 0) {
      this.invalidDate = false;
      return null;
    } else {
      return { 'invalidDate': true };
    }
  }

  checkInputfields() {
    this.inputfields.some(item => {
      // IF statement is DOM structure bound
      if(item.nativeElement.classList.contains('ng-invalid') || item.nativeElement.classList.contains('ng-custom-error')){
        item.nativeElement.scrollIntoView();
        this.winRef.nativeWindow.scrollBy(0, -112);
        return true;
      }
    });
  }

  private onSuccess(participant: ParticipantDto) {
    // console.log('participant', participant);
  }
  private onError(error: any) {
    // console.error('error', error);
  }
  private onComplete() {
    this.isBusy = false;
  }

  get password() {
    return this.registerForm.get('password');
  }

}
