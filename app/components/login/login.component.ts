import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';

import { finalize } from 'rxjs/operators';

import { AppState, selectInstitutionId } from '../../core/reducers';
import { AuthService } from '../../core/services/auth.service';
import { AppRouterService } from '../../core/services/app-router.service';
import { ParticipantDto } from '../../shared/dto/participant/participant.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
    institutionId: [null, Validators.required]
  });

  private _isBusy = false;
  get isBusy() {
    return this._isBusy;
  }
  set isBusy(value: boolean) {
    this._isBusy = value;
    for(let key in this.loginForm.controls) {
      if (this._isBusy) {
        this.loginForm.controls[key].disable();
      }
      else {
        this.loginForm.controls[key].enable();
      }
    }
  }

  invalidLogin = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService,
    private appRouter: AppRouterService
  ) { }

  ngOnInit() {
    this.store.pipe(select(selectInstitutionId))
      .subscribe(institutionId => this.loginForm.patchValue({institutionId}));
    this.authService.logout();
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isBusy)
      return;

    this.isBusy = true;
    this.invalidLogin = false;

    this.authService.login(this.loginForm.value).pipe(
      finalize(() => this.onComplete())
    ).subscribe(
      val => this.onSuccess(val),
      error => this.onError(error)
    );
  }

  onPasswordForget() {
    this.appRouter.navigate(['/forgot-password']);
  }

  private onError(error: any) {
    this.invalidLogin = true;
  }

  private onSuccess(participant: ParticipantDto) {
    this.invalidLogin = false;
    this.appRouter.navigateHome();
  }

  private onComplete() {
    this.isBusy = false
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get institutionId() {
    return this.loginForm.get('institutionId');
  }
}
