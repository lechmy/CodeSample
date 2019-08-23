import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule as AppFormsModule } from '../forms/forms.module';

import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HomeComponent } from "./home/home.component";
import { ErrorPageComponent } from './error-page/error-page.component';
import { ProgramsComponent } from './programs/programs.component';
import { CampsComponent } from './camps/camps.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { CampComponent } from './camps/camp/camp.component';
import { ProgramComponent } from './programs/program/program.component';
import { RootComponent } from './root/root.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { InstitutionComponent } from './institution/institution.component';
import { EventComponent } from './event/event.component';
import { EventLoginComponent } from './event/event-login/event-login.component';
import { EventRegisterComponent } from './event/event-register/event-register.component';
import { EventUserInfoComponent } from './event/event-user-info/event-user-info.component';
import { EventCouponComponent } from './event/event-coupon/event-coupon.component';
import { AccountComponent } from './account/account.component';
import { PasswordResetComponent } from './account/password-reset/password-reset.component';
import { InfoComponent } from './account/info/info.component';
import { ChildrenComponent } from './account/children/children.component';
import { EventsComponent } from './account/events/events.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { StaticPageComponent } from './static-page/static-page.component';
import { ProgramsCalendarComponent } from './programs/programs-calendar/programs-calendar.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import { BirthdaysComponent } from './birthdays/birthdays.component';
import { CampEventDayGroupComponent } from './camps/camp-event-day-group/camp-event-day-group.component';
import { EventDetailsComponent } from './event/event-details/event-details.component';
import { EventBirthdayDetailsComponent } from './event/event-birthday-details/event-birthday-details.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ErrorPageComponent,
    ProgramsComponent,
    CampsComponent,
    WorkshopsComponent,
    CampComponent,
    ProgramComponent,
    RootComponent,
    LoginComponent,
    LogoutComponent,
    InstitutionComponent,
    EventComponent,
    EventLoginComponent,
    EventRegisterComponent,
    EventUserInfoComponent,
    EventCouponComponent,
    AccountComponent,
    PasswordResetComponent,
    InfoComponent,
    ChildrenComponent,
    EventsComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    StaticPageComponent,
    ProgramsCalendarComponent,
    BirthdaysComponent,
    CampEventDayGroupComponent,
    EventDetailsComponent,
    EventBirthdayDetailsComponent,
    PaymentComponent,
  ],
  imports: [
    NgbModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  exports: [
    LayoutComponent
  ]
})
export class ComponentsModule { }
