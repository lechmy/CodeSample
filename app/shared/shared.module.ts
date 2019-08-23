import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsService } from './services/settings.service';
import { ParticipantService } from './services/participant.service';

import { LanguageAndInstitutionPipe } from './pipes/language-and-institution.pipe';

import { LanguageAndInstitutionGuard } from './guards/language-and-institution.guard';
import { AuthGuard } from './guards/auth.guard';

import { ErrorResolver } from './resolvers/error.resolver';
import { RawHtmlPipe } from "./pipes/raw-html.pipe";
import { ContentService } from "./services/content.service";
import { EnrollmentService } from "./services/enrollment.service";
import { ChildParticipantService } from './services/child-participant.service';

@NgModule({
  declarations: [
    LanguageAndInstitutionPipe,
    RawHtmlPipe
  ],
  imports: [
    CommonModule
  ],
  providers: [
    LanguageAndInstitutionGuard,
    AuthGuard,
    ErrorResolver,
    SettingsService,
    ParticipantService,
    ContentService,
    EnrollmentService,
    ChildParticipantService
  ],
  exports: [
    LanguageAndInstitutionPipe,
    RawHtmlPipe
  ]
})
export class SharedModule { }
