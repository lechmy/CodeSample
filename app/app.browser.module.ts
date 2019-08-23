import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { InlineStyleComponent } from './inline-style/inline-style.component';

@NgModule({
  imports: [
    AppModule
  ],
  providers: [
    // Add browser-only providers here
  ],
  bootstrap: [AppComponent, InlineStyleComponent],
})
export class AppBrowserModule {}
