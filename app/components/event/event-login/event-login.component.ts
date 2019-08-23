import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionId} from "../../../core/reducers";
import {AuthService} from "../../../core/services/auth.service";
import {ParticipantDto} from "../../../shared/dto/participant/participant.dto";
import {Subscription} from "rxjs/index";
import {AppRouterService} from "../../../core/services/app-router.service";

@Component({
  selector: 'app-event-login',
  templateUrl: './event-login.component.html',
  styleUrls: ['./event-login.component.scss']
})
export class EventLoginComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  validator: any;
  fb: FormBuilder;
  loginForm: FormGroup;
  disableControls: boolean;
  invalidLogin: boolean;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private appRouter: AppRouterService
  ) {
    this.subscriptions = [];
    this.validator = {};
    this.fb = new FormBuilder();
    this.disableControls = false;
    this.invalidLogin = false;
  }

  ngOnInit() {
    this.createLoginForm();
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionId))
        .subscribe(institutionId => this.loginForm.patchValue({institutionId}))
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      institutionId: [null, Validators.required]
    });
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.validator = this.loginForm.controls;
      return;
    }
    this.disableControls = true;
    this.authService.login(this.loginForm.value).subscribe(
      val => this.onSuccess(val),
      error => this.onError(error)
    );
  }

  onPasswordForget() {
    this.appRouter.navigate(['/forgot-password']);
  }

  private onError(error: any) {
    this.disableControls = false;
    this.invalidLogin = true;
    console.error('error', error);
  }

  private onSuccess(participant: ParticipantDto) {
    this.invalidLogin = false;
    this.disableControls = false;
  }
}
