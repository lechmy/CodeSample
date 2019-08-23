import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {ClassEnrollmentModel} from "../models/class-enrollment.model";
import {CalculatePriceModel} from "../models/calculate-price.model";
import {DiscountServiceResultDto} from "../dto/class-events/discount-service-result.dto";
import {EnrollmentDto} from "../dto/class-events/enrollment.dto";
import {EnrollmentServiceResultDto} from "../dto/class-events/enrollment-service-result.dto";
import {BirthdayEnrollmentModel} from "../models/birthday-enrollment.model";
import {StripeModel} from "../models/stripe.model";

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(
    private http: HttpClient
  ) { }

  enrolParticipant(model: ClassEnrollmentModel): Observable<EnrollmentServiceResultDto> {
    return this.http.post<EnrollmentServiceResultDto>(`${environment.apiUrl}/enrollment/create-class-enrollment`, model);
  }

  enrolBirthdayParticipant(model: BirthdayEnrollmentModel): Observable<EnrollmentServiceResultDto> {
    return this.http.post<EnrollmentServiceResultDto>(`${environment.apiUrl}/enrollment/create-birthday-enrollment`, model);
  }

  validateCoupon(code: string, institutionId: string, eventId: string): Observable<boolean>{
    const params = new HttpParams()
      .set('code', code)
      .set('institutionId', institutionId)
      .set('eventId', eventId);
    return this.http.get<boolean>(`${environment.apiUrl}/enrollment/is-coupon-valid`, {params});
  }

  calculatePrice(model: CalculatePriceModel): Observable<DiscountServiceResultDto> {
    return this.http.post<DiscountServiceResultDto>(`${environment.apiUrl}/enrollment/calculate-price`, model);
  }

  getMyEnrollments(participantId: string): Observable<EnrollmentDto[]> {
    return this.http.get<EnrollmentDto[]>(`${environment.apiUrl}/enrollment/get-my-enrollments/${encodeURIComponent(participantId)}`);
  }

  cancelEnrollment(enrollmentId: string): Observable<EnrollmentDto> {
    return this.http.get<EnrollmentDto>(`${environment.apiUrl}/enrollment/cancel-enrollment/${encodeURIComponent(enrollmentId)}`);
  }

  sendEnrollmentPaymentData(model: StripeModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/stripe/stripe-charge`, model);
  }
}
