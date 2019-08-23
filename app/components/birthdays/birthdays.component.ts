import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContentService} from "../../shared/services/content.service";
import {Subscription} from "rxjs/index";
import {BirthdayEventsModel} from "../../shared/models/birthday-events.model";
import {distinctUntilChanged, map} from "rxjs/internal/operators";
import {
  AppState, selectInstitutionCurrencySign, selectInstitutionId,
} from "../../core/reducers";
import {select, Store} from "@ngrx/store";
import {ActivatedRoute, Router} from "@angular/router";
import {BirthdayEventsDto} from "../../shared/dto/birthday/birthday-events.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EventDayExtendedBirthdayDto} from "../../shared/dto/birthday/event-day-extended-birthday.dto";
import {BirthdayExtraDto} from "../../shared/dto/birthday/birthday-extra.dto";
import {AppRouterService} from "../../core/services/app-router.service";
import {CalculatePriceModel} from "../../shared/models/calculate-price.model";

@Component({
  selector: 'app-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.scss']
})
export class BirthdaysComponent implements OnInit, OnDestroy {
  @ViewChild('timetable') timetable: ElementRef;

  private subscriptions: Subscription[];
  birthdayEventsModel: BirthdayEventsModel;
  birthdayEvents: BirthdayEventsDto;
  birthdayForm: FormGroup;
  validator: any;
  averageAge: string[] = ['4-5', '6-7', '8-10', '11-12', '12-14'];
  additionalChildren: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  currencySign: string;
  selectedTimeId: string;
  selectedExtras: string[];
  queryParams: any;
  isTimeInvalid: boolean;
  loading: boolean;
  totalBirthdayPrice: number;
  selectedExtrasPrice: number;
  selectedPackagePrice: number;
  selectedTimePrice: number;

  constructor(
    private contentService: ContentService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private appRouter: AppRouterService,
    private fb: FormBuilder
  ) {
    this.subscriptions = [];
    this.validator = {};
    this.birthdayEventsModel = new BirthdayEventsModel();
    this.birthdayEvents = new BirthdayEventsDto();
    this.fb = new FormBuilder();

    this.currencySign = '';
    this.selectedTimeId = '';
    this.selectedExtras = [];
    this.queryParams = {};
    this.isTimeInvalid = false;
    this.loading = true;
    this.totalBirthdayPrice = 0;
    this.selectedExtrasPrice = 0;
    this.selectedPackagePrice = 0;
    this.selectedTimePrice = 0;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(
        select(selectInstitutionId),
        distinctUntilChanged()
      ).subscribe(id => this.birthdayEventsModel.institutionId = id)
    );
    this.subscriptions.push(
      this.route.queryParamMap.pipe(map(params => params)).subscribe(
        this.onQueryParamsChange.bind(this)
      )
    );
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionCurrencySign)).subscribe(
        sign => this.currencySign = sign
      ));
    this.createForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onQueryParamsChange(params: any) {
    this.birthdayEventsModel.locationId = params.get('location');
    this.contentService.getBirthdayEvents(this.birthdayEventsModel).subscribe(data => {
      this.birthdayEvents = Object.assign({}, data);
    }, null, () => { this.loading = false; });
  }

  createForm() {
    this.birthdayForm = this.fb.group({
      birthdayPackage: [null, Validators.required],
      birthdayActivity: [null, Validators.required],
      averageAge: [null, Validators.required],
      additionalChildren: null,
      parentsWelcome: null,
      language: null
    })
  }

  submitForm() {
    if(this.birthdayForm.invalid || !this.selectedTimeId){
      this.validator = this.birthdayForm.controls;
      this.isTimeInvalid = this.selectedTimeId ? false : true;
      return;
    }
    this.queryParams = this.birthdayForm.value;
    this.queryParams.eventDayId = this.selectedTimeId;
    this.queryParams.birthdayExtras = this.selectedExtras;
    this.appRouter.navigate(['/event', 'birthday'] , { queryParams: this.queryParams });
  }

  selectTime(event: EventDayExtendedBirthdayDto, isBookable: boolean) {
    if(event.isTerminOccupied || !isBookable){
      return;
    }
    if(this.selectedTimeId == event.eventDayId){
      this.selectedTimeId = '';
      this.selectedTimePrice = 0;
      this.isTimeInvalid = true;
    } else {
      this.selectedTimeId = event.eventDayId;
      this.selectedTimePrice = event.price;
      this.isTimeInvalid = false;
    }
    this.totalBirthdayPrice = this.selectedPackagePrice + this.selectedExtrasPrice + this.selectedTimePrice;
  }

  selectExtras(extra: BirthdayExtraDto) {
    const index = this.selectedExtras.indexOf(extra.birthdayExtrasId);
    if(index > -1){
      this.selectedExtras.splice(index, 1);
      this.selectedExtrasPrice -= extra.price;
    } else {
      this.selectedExtras.push(extra.birthdayExtrasId);
      this.selectedExtrasPrice += extra.price;
    }
    this.totalBirthdayPrice = this.selectedPackagePrice + this.selectedExtrasPrice + this.selectedTimePrice;
  }

  selectPackage(packageId: string){
    this.birthdayEvents.birthdayPackages.forEach(item => {
      item.birthdayExtrasId === packageId ? this.selectedPackagePrice = item.price : null;
    });
    this.totalBirthdayPrice = this.selectedPackagePrice + this.selectedExtrasPrice + this.selectedTimePrice;
  }

  scroll(direction: string) {
    let sign;
    const width = this.timetable.nativeElement.clientWidth;
    if(direction == 'left'){
      sign = -1;
    } else {
      sign = 1;
    }
    this.timetable.nativeElement.scrollLeft += sign * (width - 105);
  }

  get birthdayPackage() { return this.birthdayForm.get('birthdayPackage'); }
  get birthdayActivity() { return this.birthdayForm.get('birthdayActivity'); }

}
