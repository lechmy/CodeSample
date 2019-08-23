import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { ErrorModel } from '../../shared/models/error.model';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  error: ErrorModel

  private readonly defaultError: ErrorModel;

  constructor(
    private route: ActivatedRoute
  ) {
    this.defaultError = new ErrorModel();
    this.defaultError.statusCode = 500
  }

  ngOnInit() {
    this.error = this.route.snapshot.data.error || this.defaultError;
  }

}
