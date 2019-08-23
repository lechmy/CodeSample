import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { FormUtils } from '../../../forms/form.utils';
import { FormManager } from '../../../forms/form-manager';
import { ParticipantService } from '../../../shared/services/participant.service';
import { MessageService } from '../../../core/services/message.service';

import { ParticipantExtendedDto } from '../../../shared/dto/participant/participant-extended.dto';
import { ParticipantSavePasswordModel } from '../../../shared/models/participant/participant-save-password.model';

@Component({
  selector: 'app-account-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  private _participantExtended: ParticipantExtendedDto;

  readonly changePasswordFormKey = 'CHANGE_PASSWORD_FORM';

  changePasswordForm: FormGroup;
  isBusy = false;

  @Input()
  set participantExtended(p: ParticipantExtendedDto) {
    this._participantExtended = p;
    this.prepareForm();
  }

  constructor(
    private fb: FormBuilder,
    private fm: FormManager,
    private participantService: ParticipantService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.isBusy) return;

    FormUtils.validateForm(this.changePasswordForm);
    if (this.changePasswordForm.invalid) return;

    this.isBusy = true;

    // submit form
    const model = new ParticipantSavePasswordModel();
    model.participantId = this.participantExtended.participantId;
    model.oldPassword = this.oldPassword.value;
    model.newPassword = this.newPassword.value;
    model.confirmPassword = this.confirmPassword.value;

    this.fm.handleRequest(this.participantService.changePassword(model), this.changePasswordFormKey)
      .pipe(
        finalize(() => this.isBusy = false)
      ).subscribe(() => this.onChangePasswordSuccess());
  }

  private prepareForm() {
    this.fm.reset(this.changePasswordFormKey);

    if (!this.participantExtended) {
      this.changePasswordForm = null;
      return;
    }

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  private onChangePasswordSuccess() {
    this.messageService.success('Password chang success.');
    this.prepareForm();
  }

  get participantExtended() {
    return this._participantExtended;
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }
}
