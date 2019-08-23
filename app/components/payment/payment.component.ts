import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {EnrollmentService} from "../../shared/services/enrollment.service";
import {StripeModel} from "../../shared/models/stripe.model";
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionStripePublishableKey} from "../../core/reducers";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('paymentForm')
  paymentForm: ElementRef;

  @Input()
  enrollmentId: string;

  @Output()
  paymentFinished: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];
  stripeModel: StripeModel;
  stripe: any;
  stripePublishableKey: string;
  elements: any;
  card: any;
  cardError: string;
  isBusy = false;

  constructor(
    private enrollmentService: EnrollmentService,
    private store: Store<AppState>
  ) {
    this.stripeModel = new StripeModel();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionStripePublishableKey))
        .subscribe(stripePublishableKey => this.stripePublishableKey = stripePublishableKey)
    );
    this.stripe = Stripe(this.stripePublishableKey);
    this.elements = this.stripe.elements();
  }

  ngAfterViewInit() {
    this.card = this.elements.create('card', {
      hidePostalCode: true
    });
    this.card.mount(this.paymentForm.nativeElement.querySelector('.js-card-element'));
    this.card.addEventListener('change', (e) => this.onCardChange(e));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onPaymentSubmit() {
    this.isBusy = true;
    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        this.cardError = result.error.message;
        this.isBusy = false;
      } else {
        this.stripeTokenHandler(result.token);
      }
    });
  }

  private onCardChange(event) {
    if (event.error) {
      this.cardError = event.error.message;
    } else {
      this.cardError = null;
    }
  }

  private stripeTokenHandler(token: any) {
    this.stripeModel.enrollmentId = this.enrollmentId;
    this.stripeModel.token = token.id;
    this.enrollmentService.sendEnrollmentPaymentData(this.stripeModel).subscribe(res => {
      if(res.status === 'succeeded'){
        this.paymentFinished.emit(null);
        this.isBusy = false;
      }
    });
  }

}
