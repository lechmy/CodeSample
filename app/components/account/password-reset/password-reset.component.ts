import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ParticipantService} from "../../../shared/services/participant.service";
import {ResetPasswordModel} from "../../../shared/models/participant/reset-password.model";
import {ParticipantLogInModel} from "../../../shared/models/participant/participant-log-in.model";
import {AuthService} from "../../../core/services/auth.service";
import {AppRouterService} from "../../../core/services/app-router.service";
import {FormManager} from "../../../forms/form-manager";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  readonly resetPasswordFormKey = 'RESET_PASSWORD_FORM';

  resetPasswordForm: FormGroup;
  resetPasswordModel: ResetPasswordModel;
  loginModel: ParticipantLogInModel;
  passwordMach: boolean;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private participantService: ParticipantService,
    private authService: AuthService,
    private appRouter: AppRouterService,
    private fb: FormBuilder,
    private fm: FormManager,
  ) {
    this.resetPasswordModel = new ResetPasswordModel();
    this.loginModel = new ParticipantLogInModel();
    this.passwordMach = true;
    this.token = '';
  }

  ngOnInit() {
    this.validateToken();
    this.createResetPasswordForm();
    this.fm.reset(this.resetPasswordFormKey);
  }

  validateToken(){
    this.token = this.route.snapshot.paramMap.get('token');
    this.participantService.resetPassword(this.token).subscribe(
      this.onValidateTokenSuccess.bind(this)
    )
  }

  createResetPasswordForm() {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  onSubmit() {
    if(this.password.value !== this.confirmPassword.value){
      this.passwordMach = false;
      return;
    }
    this.passwordMach = true;
    this.resetPasswordModel.password = this.password.value;
    this.resetPasswordModel.confirmPassword = this.confirmPassword.value;
    this.fm.handleRequest(this.participantService.saveResetPassword(this.resetPasswordModel), this.resetPasswordFormKey).subscribe(
      this.onSavePasswordSuccess.bind(this)
    );
  }

  onValidateTokenSuccess(data: any) {
    this.resetPasswordModel.email = data['emailSentTo'];
    this.resetPasswordModel.token = data['portalUserPasswordResetTokenId'];
    this.loginModel.institutionId = data['institutionId'];
    this.loginModel.email = data['emailSentTo'];
  }

  onSavePasswordSuccess() {
    this.loginModel.password = this.password.value;
    this.authService.login(this.loginModel).subscribe(() => {
      this.appRouter.navigateHome({
        institutionId: this.loginModel.institutionId
      });
    });
  }

  get password() { return this.resetPasswordForm.get('password'); }

  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }

}
