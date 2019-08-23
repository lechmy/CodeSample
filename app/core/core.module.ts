import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoggerFactory } from './services/logger.service';
import { rootReducer, initialStateProvider, metaReducersProvider } from './reducers';
import { startupProvider } from './startup';
import { loaderInterceptorProvider } from './services/http/loader.interceptor';
import { mainInterceptorProvider } from './services/http/mian.interceptor';
import { MessageService } from './services/message.service';
import { AuthService } from './services/auth.service';
import { AppRouterService } from './services/app-router.service';
import { HttpErrorsService } from './services/http/http-errors.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(rootReducer)
  ],
  providers: [
    LoggerFactory,
    MessageService,
    HttpErrorsService,
    AuthService,
    AppRouterService,
    initialStateProvider,
    metaReducersProvider,
    startupProvider,
    loaderInterceptorProvider,
    mainInterceptorProvider
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
