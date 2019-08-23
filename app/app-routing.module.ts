import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageAndInstitutionGuard, LANGUAGE_AND_INSTITUTION_GUARD_SETTINGS } from './shared/guards/language-and-institution.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { ErrorResolver } from './shared/resolvers/error.resolver';

import { HomeComponent } from "./components/home/home.component";
import { ErrorPageComponent } from "./components/error-page/error-page.component";
import { ProgramsComponent } from "./components/programs/programs.component";
import { CampsComponent } from "./components/camps/camps.component";
import { WorkshopsComponent } from "./components/workshops/workshops.component";
import { RootComponent } from './components/root/root.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { InstitutionComponent } from "./components/institution/institution.component";
import { EventComponent } from "./components/event/event.component";
import { AccountComponent } from './components/account/account.component';
import { PasswordResetComponent } from './components/account/password-reset/password-reset.component';
import { ForgetPasswordComponent } from './components/account/forget-password/forget-password.component';
import {StaticPageComponent} from "./components/static-page/static-page.component";
import {BirthdaysComponent} from "./components/birthdays/birthdays.component";

const childrenRoutes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: PasswordResetComponent
  },
  {
    path: 'location/:type',
    component: InstitutionComponent
  },
  {
    path: 'location-workshop',
    component: WorkshopsComponent
  },
  {
    path: 'location-class',
    component: ProgramsComponent
  },
  {
    path: 'location-camp',
    component: CampsComponent
  },
  {
    path: 'location-birthday',
    component: BirthdaysComponent
  },
  {
    path: 'event/:id',
    component: EventComponent
  },
  {
    path: 'camps',
    component: CampsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'static-page/:slug',
    component: StaticPageComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];

const routes: Routes = [
  {
    path: '404',
    component: ErrorPageComponent,
    data: {
      statusCode: 404
    },
    resolve: {
      error: ErrorResolver
    }
  },
  {
    path: ':param1',
    component: RootComponent,
    canActivate: [LanguageAndInstitutionGuard],
    children: childrenRoutes
  },
  {
    path: ':param1/:param2',
    component: RootComponent,
    canActivate: [LanguageAndInstitutionGuard],
    children: childrenRoutes
  },
  {
    path: '',
    component: RootComponent,
    canActivate: [LanguageAndInstitutionGuard],
    children: childrenRoutes
  },
  {
    path: '**',
    component: ErrorPageComponent,
    data: {
      statusCode: 404
    },
    resolve: {
      error: ErrorResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: LANGUAGE_AND_INSTITUTION_GUARD_SETTINGS,
      useValue: {
        institutionNotRequiredPaths: [
          'reset-password'
        ]
      }
    }
  ]
})
export class AppRoutingModule { }
