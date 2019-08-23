import {Component, OnInit} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionCurrencySign, selectInstitutionId} from "../../core/reducers";
import {distinctUntilChanged, map} from "rxjs/internal/operators";
import {Subscription} from "rxjs/index";
import {ContentService} from "../../shared/services/content.service";
import {CampEventsModel} from "../../shared/models/camps-events.model";
import {ActivatedRoute} from "@angular/router";
import {CampEventsDto} from "../../shared/dto/camps/camp-event.dto";

@Component({
  selector: 'app-camps',
  templateUrl: './camps.component.html',
  styleUrls: ['./camps.component.scss']
})

// export class selectedDays {
//   eventTime: string;
//   eventDayId: string;
// }

export class CampsComponent implements OnInit {
  private subscriptions: Subscription[];
  campEventsModel: CampEventsModel;
  campEventsDto: CampEventsDto;
  selectedIds: any[];
  loading: boolean;
  currencySign: string;



  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private contentService: ContentService
  ) {
    this.subscriptions = [];
    this.campEventsModel = new CampEventsModel();
    this.campEventsDto = new CampEventsDto();
    this.selectedIds = [];
    this.loading = true;
    this.currencySign = '';
  }

  ngOnInit() {
    this.subscriptions.push(this.store.pipe(
      select(selectInstitutionId),
      distinctUntilChanged()
    ).subscribe(id => this.campEventsModel.institutionId = id));

    this.subscriptions.push(
      this.route.queryParamMap.pipe(map(params => params)).subscribe(
        this.onQueryParamsChange.bind(this)
    ));
    this.subscriptions.push(
      this.store.pipe(select(selectInstitutionCurrencySign)).subscribe(
        sign => this.currencySign = sign
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onQueryParamsChange(params: any){
    this.campEventsModel.locationId = params.get('location');
    this.contentService.getCampsEvents(this.campEventsModel).subscribe(data => {
      this.campEventsDto = Object.assign({}, data);
    }, null, () => { this.loading = false; });
  }
}
