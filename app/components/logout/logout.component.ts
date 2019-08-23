import { Component, OnInit } from '@angular/core';

import { AppRouterService } from '../../core/services/app-router.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  template: '',
  styles: []
})
export class LogoutComponent implements OnInit {

  constructor(
    private appRouter: AppRouterService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.logout();
    this.appRouter.navigateHome();
  }

}
