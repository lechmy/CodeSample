import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { InlineStyleModule } from './inline-style/inline-style.module';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from './app.component';
import { FormsModule } from './forms/forms.module';

import { WindowRef } from './core/services/window.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'efkbackoffice-portal'}),
    NgProgressModule.withConfig({spinner: false, color: '#b6121c'}),
    FormsModule.forRoot(),
    HttpClientModule,
    CoreModule,
    SharedModule,
    InlineStyleModule,
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [WindowRef]
})
export class AppModule { }
