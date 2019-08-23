import {Component, OnDestroy, OnInit} from '@angular/core';
import {WorkshopEventsDto} from "../../shared/dto/workshop/workshop-events.dto";
import {ContentService} from "../../shared/services/content.service";
import {WorkshopEventsModel} from "../../shared/models/workshop-events.model";
import {Subscription} from "rxjs/index";
import {distinctUntilChanged, map} from "rxjs/internal/operators";
import {ActivatedRoute} from "@angular/router";
import {AppState, selectInstitutionCurrencySign, selectInstitutionId} from "../../core/reducers";
import {select, Store} from "@ngrx/store";

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  workshopEvents: WorkshopEventsDto;
  workshopEventsModel: WorkshopEventsModel;
  currencySign: string;
  loading: boolean;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.subscriptions = [];
    this.workshopEvents = new WorkshopEventsDto();
    this.workshopEventsModel = new WorkshopEventsModel();
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(this.store.pipe(
      select(selectInstitutionId),
      distinctUntilChanged())
        .subscribe(id => this.workshopEventsModel.institutionId = id)
    );
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionCurrencySign)).subscribe(
        sign => this.currencySign = sign
    ));
    this.subscriptions.push(
      this.route.queryParamMap.pipe(map(params => params)).subscribe(
        this.onQueryParamsChange.bind(this)
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onQueryParamsChange(params: any) {
    this.workshopEventsModel.locationId = params.get('location');
    this.contentService.getWorkshopEvents(this.workshopEventsModel).subscribe( data => {
      this.workshopEvents = Object.assign({}, data);
    }, null, () => { this.loading = false; });
  }

}
