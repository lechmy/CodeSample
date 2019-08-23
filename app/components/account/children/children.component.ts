import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getMonth, getYear, getDate } from 'date-fns';
import { finalize, concatMap } from 'rxjs/operators';

import { FormManager } from '../../../forms/form-manager';
import { MessageService } from '../../../core/services/message.service';
import { FormUtils } from '../../../forms/form.utils';
import { DropdownDate, fillDate, validateDate } from '../../../shared/utils/dropdown-date-picker';
import { ChildParticipantService } from '../../../shared/services/child-participant.service';
import { ParticipantService } from '../../../shared/services/participant.service';

import { ParticipantExtendedDto } from '../../../shared/dto/participant/participant-extended.dto';
import { ChildParticipantsDto } from '../../../shared/dto/participant/child-participants.dto';
import { Constants } from '../../../shared/utils/constants';
import { SaveChildParticipantModel } from '../../../shared/models/save-child-participant.model';

@Component({
  selector: 'app-account-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss']
})
export class ChildrenComponent implements OnInit {
  private _participantExtended: ParticipantExtendedDto;

  childParticipant: ChildParticipantsDto;

  @Input()
  set participantExtended(p: ParticipantExtendedDto) {
    this._participantExtended = p;
  }

  @Output()
  participantChanged = new EventEmitter<ParticipantExtendedDto>();

  readonly childParticipantsFormKey = 'CHILD_PARTICIPANTS_FORM';
  childParticipantsForm: FormGroup;

  genderValues: string[];
  languageSpokenValues: string[];

  readonly dropdownDate: DropdownDate;

  isBusy = false;

  constructor(
    private fb: FormBuilder,
    private fm: FormManager,
    private messageService: MessageService,
    private childParticipantService: ChildParticipantService,
    private participantService: ParticipantService
  ) {
    this.genderValues = Constants.gender;
    this.languageSpokenValues = Constants.languageSpoken;
    this.dropdownDate = fillDate();
  }

  ngOnInit() {
    this.prepareChildParticipantsForm();
  }

  editChild(childParticipant: ChildParticipantsDto) {
    this.childParticipant = childParticipant;
    this.prepareChildParticipantsForm();
  }

  cancelEditChild() {
    this.childParticipant = null;
    this.prepareChildParticipantsForm();
  }

  onSubmit() {
    if (this.isBusy) return;

    FormUtils.validateForm(this.childParticipantsForm);
    if (this.childParticipantsForm.invalid
      || this.isBirthDayInvalid) return;

    this.isBusy = true;

    // submit form
    const model = new SaveChildParticipantModel();
    model.childParticipantId = !this.childParticipant ? null : this.childParticipant.childParticipantId;
    model.participantId = this.participantExtended.participantId;
    model.firstName = this.firstName.value;
    model.lastName = this.lastName.value;
    model.gender = this.gender.value;
    model.birthDay = this.birthDay.value;
    model.birthMonth = this.birthMonth.value;
    model.birthYear = this.birthYear.value;
    model.languageSpoken = this.languageSpoken.value;
    model.note = this.note.value;

    this.fm.handleRequest(this.childParticipantService.save(model), this.childParticipantsFormKey)
      .pipe(
        concatMap(c => this.participantService.getParticipantExtended(c.participantId)),
        finalize(() => this.isBusy = false)
      ).subscribe(p => this.onSaveSuccess(p));
  }

  onSaveSuccess(participantExtended: ParticipantExtendedDto) {
    if (this.childParticipant) {
      this.messageService.success("Update success.");
    } else {
      this.messageService.success("Child created.");
    }

    this.childParticipant = null;
    this.prepareChildParticipantsForm();

    this.participantChanged.emit(participantExtended);
  }

  private prepareChildParticipantsForm() {
    this.fm.reset(this.childParticipantsFormKey);

    if (this.childParticipant) {
      const birthDay = !this.childParticipant.birthDate ? null : getDate(this.childParticipant.birthDate);
      const birthMonth = !this.childParticipant.birthDate ? null : getMonth(this.childParticipant.birthDate) + 1;
      const birthYear = !this.childParticipant.birthDate ? null : getYear(this.childParticipant.birthDate);

      this.childParticipantsForm = this.fb.group({
        firstName: [this.childParticipant.firstName, [Validators.required]],
        lastName: [this.childParticipant.lastName, [Validators.required]],
        gender: [this.childParticipant.gender, [Validators.required]],
        birthDay: [birthDay, [Validators.required]],
        birthMonth: [birthMonth, [Validators.required]],
        birthYear: [birthYear, [Validators.required]],
        languageSpoken: [this.childParticipant.languageSpoken, [Validators.required]],
        note: [this.childParticipant.note]
      });
    } else {
      this.childParticipantsForm = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        birthDay: [null, [Validators.required]],
        birthMonth: [null, [Validators.required]],
        birthYear: [null, [Validators.required]],
        languageSpoken: ['', [Validators.required]],
        note: ['']
      });
    }
  }

  get participantExtended() {
    return this._participantExtended;
  }

  get isBirthDayInvalid() {
    return (this.birthDay.dirty || this.birthDay.touched
      || this.birthMonth.dirty || this.birthMonth.touched
      || this.birthYear.dirty || this.birthYear.touched)
      && !validateDate(this.birthDay.value, this.birthMonth.value, this.birthYear.value);
  }

  get firstName() { return this.childParticipantsForm.get('firstName'); }

  get lastName() { return this.childParticipantsForm.get('lastName'); }

  get gender() { return this.childParticipantsForm.get('gender'); }

  get birthDay() { return this.childParticipantsForm.get('birthDay'); }

  get birthMonth() { return this.childParticipantsForm.get('birthMonth'); }

  get birthYear() { return this.childParticipantsForm.get('birthYear'); }

  get languageSpoken() { return this.childParticipantsForm.get('languageSpoken'); }

  get note() { return this.childParticipantsForm.get('note'); }
}
