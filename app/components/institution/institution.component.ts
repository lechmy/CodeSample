import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentService} from "../../shared/services/content.service";
import {distinctUntilChanged} from "rxjs/internal/operators";
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionId} from "../../core/reducers";
import {Subscription} from "rxjs/index";
import {ClassLocationsDto} from "../../shared/dto/class-locations.dto";
import {ActivatedRoute} from "@angular/router";
import {AppRouterService} from "../../core/services/app-router.service";

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss']
})
export class InstitutionComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  locations: ClassLocationsDto;
  loading: boolean;
  locationType: string;
  locationTypeName: string;
  institutionId: string;

  constructor(
    private contentService: ContentService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private appRouter: AppRouterService
  ) {
    this.locations = new ClassLocationsDto();
    this.loading = false;
    this.locationTypeName = '';
  }

  ngOnInit() {
    this.loading = true;
    this.subscriptions.push(this.store.pipe(
      select(selectInstitutionId),
      distinctUntilChanged()
    ).subscribe(this.onLocationSelected.bind(this)));
    this.subscriptions.push(
      this.route.paramMap.subscribe(this.onClassTypeChange.bind(this))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onLocationSelected(institutionId: string) {
    this.institutionId = institutionId;
  }

  onClassTypeChange(params){
    this.locationType = params.get('type');
    switch(this.locationType) {
      case 'class':
        this.locationTypeName = 'Program';
        this.getPrograms(this.institutionId);
        break;
      case 'camp':
        this.locationTypeName = 'Camp';
        this.getCamps(this.institutionId);
        break;
      case 'workshop':
        this.locationTypeName = 'Workshop';
        this.getWorkshops(this.institutionId);
        break;
      case 'birthday':
        this.locationTypeName = 'Birthday';
        this.getBdays(this.institutionId);
        break;
      // default:
      //   this.getPrograms(this.institutionId);
      //   break;
    }
  }

  getPrograms(institutionId: string){
    this.contentService.getClassLocations(institutionId).subscribe(
      this.onGetLocations.bind(this),
      this.onGetLocationsError.bind(this)
    );
  }

  getCamps(institutionId: string){
    this.contentService.getCampLocations(institutionId).subscribe(
      this.onGetLocations.bind(this),
      this.onGetLocationsError.bind(this)
    );
  }

  getWorkshops(institutionId: string){
    this.contentService.getWorkshopLocations(institutionId).subscribe(
      this.onGetLocations.bind(this),
      this.onGetLocationsError.bind(this)
    );
  }

  getBdays(institutionId: string){
    this.contentService.getBdayLocations(institutionId).subscribe(
      this.onGetLocations.bind(this),
      this.onGetLocationsError.bind(this)
    );
  }

  onGetLocations(data: ClassLocationsDto) {
    this.locations = Object.assign({}, data);
    const location = this.locations.locations;
    if(location.length == 1 && location[0].locations.length == 1) {
      this.appRouter.navigate([`/location-${this.locationType}`], {
        queryParams: {
          location: location[0].locations[0].locationId,
          term: location[0].locations[0].termId
        },
        replaceUrl: true
      });
    }
    this.loading = false;
  }

  onGetLocationsError() {
    this.loading = false;
  }
}
