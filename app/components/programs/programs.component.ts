import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ContentService} from "../../shared/services/content.service";
import {ClassEventsModel} from "../../shared/models/class-events.model";
import {distinctUntilChanged, map} from "rxjs/internal/operators";
import {AppState, selectInstitutionCurrencySign, selectInstitutionId} from "../../core/reducers";
import {select, Store} from "@ngrx/store";
import {Subscription} from "rxjs/index";
import {ClassEventsDto} from "../../shared/dto/class-events/class-events.dto";

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  classEventsModel: ClassEventsModel;
  classEventsDto: ClassEventsDto;
  selectedTabId: string;
  currencySign: string;
  accordion: any;
  accordionSection: any;
  loading: boolean;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private contentService: ContentService,
    private renderer: Renderer2
  ) {
    this.selectedTabId = '';
    this.classEventsModel = new ClassEventsModel();
    this.classEventsDto = new ClassEventsDto();
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(this.store.pipe(
        select(selectInstitutionId),
        distinctUntilChanged()
      ).subscribe(id => this.classEventsModel.institutionId = id),
      this.store.pipe(select(selectInstitutionCurrencySign)).subscribe(
        sign => this.currencySign = sign
      ),
      this.route.queryParamMap.pipe(map(params => params)).subscribe(
        this.onQueryParamsChange.bind(this)
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onQueryParamsChange(params: any) {
    this.classEventsModel.locationId = params.get('location');
    this.classEventsModel.termId = params.get('term');
    this.contentService.getClassEvents(this.classEventsModel).subscribe(data => {
      this.classEventsDto = Object.assign({}, data);
      this.selectedTabId = params.get('term');
      this.loading = false;
    }, null, () => { this.loading = false; });
  }

  scrollToElement(data: any) {
    if(this.accordion) {
      this.accordion.collapseAll();
      this.accordion.expand(data.courseType);

      setTimeout(() => {
        if(this.accordionSection) {
          this.renderer.removeClass(this.accordionSection, 'select');
        }
        this.accordionSection = document.getElementById(data.eventId);
        if(this.accordionSection) {
          this.accordionSection.scrollIntoView({
            behavior: "smooth",
            block: "end"
          });
          this.renderer.addClass(this.accordionSection, 'select');
        }
      },50);
    }
  }

  setElement(elem: ElementRef) {
    this.accordion = elem
  }
}
