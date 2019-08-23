import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {ContentService} from "../../shared/services/content.service";
import {AppState, selectInstitutionId} from "../../core/reducers";
import {select, Store} from "@ngrx/store";
import {distinctUntilChanged} from "rxjs/internal/operators";
import {ActivatedRoute} from "@angular/router";
import {StaticPageModel} from "../../shared/models/static-page.model";
import {StaticPageDto} from "../../shared/dto/static-page.dto";

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss']
})
export class StaticPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  staticPageContent: StaticPageDto;
  staticPageModel: StaticPageModel;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private contentService: ContentService
  ) {
    this.subscriptions = [];
    this.staticPageContent = new StaticPageDto();
    this.staticPageModel = new StaticPageModel();
  }

  ngOnInit() {
    this.staticPageModel.slug = this.route.snapshot.paramMap.get('slug');
    this.subscriptions.push(this.store.pipe(
      select(selectInstitutionId),
      distinctUntilChanged()
    ).subscribe(id => this.onInstitutionChange(id)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onInstitutionChange(institutionId: string){
    this.staticPageModel.institutionId = institutionId;
    this.contentService.getStaticPageContent(this.staticPageModel).subscribe(data => {
      this.staticPageContent = Object.assign({}, data);
    });
  }
}
