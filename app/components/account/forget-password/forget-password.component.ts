import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs/index";
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionId} from "../../../core/reducers";
import {ParticipantService} from "../../../shared/services/participant.service";
import {ParticipantForgotPasswordModel} from "../../../shared/models/participant/participant-forgot-password.model";

@Component({
  selector: 'app-account-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  fb: FormBuilder;
  forgotPasswordForm: FormGroup;
  forgotPasswordModel: ParticipantForgotPasswordModel;
  passwordSent: boolean;

  constructor(
    private store: Store<AppState>,
    private participantServic: ParticipantService
  ) {
    this.subscriptions = [];
    this.fb = new FormBuilder();
    this.forgotPasswordModel = new ParticipantForgotPasswordModel();
    this.passwordSent = false;
  }

  ngOnInit() {
    this.createForm();
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionId))
        .subscribe(institutionId => this.forgotPasswordForm.patchValue({institutionId}))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  createForm() {
    this.forgotPasswordForm = this.fb.group({
      institutionId: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if(this.forgotPasswordForm.invalid) {
      return;
    }
    this.forgotPasswordModel = Object.assign({}, this.forgotPasswordForm.value);
    this.participantServic.forgotPassword(this.forgotPasswordModel).subscribe(data => {
      this.passwordSent = true;
    });
  }

  get email() { return this.forgotPasswordForm.get('email'); }
}
