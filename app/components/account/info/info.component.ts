import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ParticipantExtendedDto } from '../../../shared/dto/participant/participant-extended.dto';
import { ParticipantEditModel } from '../../../shared/models/participant/participant-edit.model';

import { FormUtils } from '../../../forms/form.utils';
import { FormManager } from '../../../forms/form-manager';
import { ParticipantService } from '../../../shared/services/participant.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  private _participantExtended: ParticipantExtendedDto;

  accountInfoForm: FormGroup;
  isBusy = false;
  isChangePasswordCollapsed = true;

  readonly accountInfoFormKey = 'ACCOUNT_INFO_FORM';

  @Output()
  participantChanged = new EventEmitter<ParticipantExtendedDto>();

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

    FormUtils.validateForm(this.accountInfoForm);
    if (this.accountInfoForm.invalid) return;

    this.isBusy = true;

    // submit form
    const model = new ParticipantEditModel();
    model.participantId = this.participantExtended.participantId;
    model.email = this.email.value;
    model.firstName = this.firstName.value;
    model.lastName = this.lastName.value;
    model.phone = this.phone.value;
    model.address = this.address.value;
    model.district = this.district.value;

    this.fm.handleRequest(this.participantService.save(model), this.accountInfoFormKey)
      .pipe(
        finalize(() => this.isBusy = false)
      ).subscribe(p => this.onUpdateSuccess(p));
  }

  toggleChangePassword() {
    this.isChangePasswordCollapsed = !this.isChangePasswordCollapsed;
  }

  private prepareForm() {
    this.fm.reset(this.accountInfoFormKey);

    if (!this.participantExtended) {
      this.accountInfoForm = null;
      return;
    }

    this.accountInfoForm = this.fb.group({
      email: [this.participantExtended.email, [Validators.required, Validators.email]],
      firstName: [this.participantExtended.firstName, [Validators.required]],
      lastName: [this.participantExtended.lastName, [Validators.required]],
      phone: [this.participantExtended.phone, [Validators.required]],
      address: [this.participantExtended.address],
      district: [this.participantExtended.district]
    });
  }

  private onUpdateSuccess(participantExtended: ParticipantExtendedDto) {
    this.participantChanged.emit(participantExtended);
    this.messageService.success("Update success.");
  }

  get participantExtended() {
    return this._participantExtended;
  }

  get email() {
    return this.accountInfoForm.get('email');
  }

  get firstName() {
    return this.accountInfoForm.get('firstName');
  }

  get lastName() {
    return this.accountInfoForm.get('lastName');
  }

  get phone() {
    return this.accountInfoForm.get('phone');
  }

  get address() {
    return this.accountInfoForm.get('address');
  }

  get district() {
    return this.accountInfoForm.get('district');
  }
}
