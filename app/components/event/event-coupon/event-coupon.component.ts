import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EnrollmentService} from "../../../shared/services/enrollment.service";

@Component({
  selector: 'app-event-coupon',
  templateUrl: './event-coupon.component.html',
  styleUrls: ['./event-coupon.component.scss']
})
export class EventCouponComponent implements OnInit {
  @Input() institutionId: string;
  @Input() eventId: string;
  @Output() couponValidated: EventEmitter<string> = new EventEmitter();

  fb: FormBuilder;
  couponForm: FormGroup;
  validator: any;
  couponValid: any;
  isBusy: boolean;

  constructor(
    private enrollmentService: EnrollmentService
  ) {
    this.fb = new FormBuilder();
    this.validator = {};
    this.couponValid = null;
    this.isBusy = false;
  }

  ngOnInit() {
    this.createCouponForm();
  }

  createCouponForm() {
    this.couponForm = this.fb.group({
      coupon: [null, Validators.required]
    });
  }

  validateCoupon() {
    if(this.couponForm.invalid){
      this.validator = this.couponForm.controls;
      return;
    }
    this.isBusy = true;
    const coupon = this.couponForm.controls['coupon'].value;
    this.enrollmentService.validateCoupon(coupon, this.institutionId, this.eventId).subscribe(data => {
      this.couponValid = data;
      if(this.couponValid){
        this.couponValidated.emit(coupon);
      }
    }, null, () => { this.isBusy = false; });
  }
}
