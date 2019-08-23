import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressRef, NgProgress } from '@ngx-progressbar/core';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {
  private _inProgressCount = 0;
  private _progressRef: NgProgressRef;

  constructor(ngProgress: NgProgress) {
    this._progressRef = ngProgress.ref();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ignore by request headers
    if (req.headers.has('__disableLoader')) {
      return next.handle(req.clone({headers: req.headers.delete('__disableLoader')}));
    }

    // Ignore silent api requests
    //if (this.checkUrl(req)) {
    //  return next.handle(req);
    //}

    this._inProgressCount++;

    if (!this._progressRef.isStarted) {
      this._progressRef.start();
    }

    return next.handle(req).pipe(
      finalize(() => {
        this._inProgressCount--;
        if (this._inProgressCount === 0) {
          this._progressRef.complete();
        }
      })
    );
  }
}

export const loaderInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoaderInterceptor,
  multi: true
}
