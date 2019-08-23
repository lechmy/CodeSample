import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {FooterLinkDto} from "../../shared/dto/footer-link.dto";
import {AppState, selectInstitutionId} from "../../core/reducers";
import {select, Store} from "@ngrx/store";
import {distinctUntilChanged} from "rxjs/internal/operators";
import {ContentService} from "../../shared/services/content.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  footerLinks: FooterLinkDto[];

  constructor(
    private store: Store<AppState>,
    private contentService: ContentService
  ) {
    this.subscriptions = [];
    this.footerLinks = [];
  }

  ngOnInit() {
    this.subscriptions.push(this.store.pipe(
      select(selectInstitutionId),
      distinctUntilChanged()
    ).subscribe(id => this.onInstitutionChange(id)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onInstitutionChange(institutionId: string) {
    this.footerLinks = [];
    if (!institutionId) return;

    this.contentService.getFooterLinks(institutionId).subscribe( data => {
      this.footerLinks = data.slice(0);
    });
  }

}
