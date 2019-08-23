import {Component, OnDestroy, OnInit} from '@angular/core';
import {CourseTreeDto} from "../../shared/dto/course-tree.dto";
import {select, Store} from "@ngrx/store";
import {AppState, selectInstitutionId, selectInstitutionShortName} from "../../core/reducers";
import {Subscription} from "rxjs";
import {distinctUntilChanged} from "rxjs/internal/operators";
import {ILogger, LoggerFactory} from "../../core/services/logger.service";
import {ContentService} from "../../shared/services/content.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  courses: CourseTreeDto[] = [];
  institutionName: string;
  private logger: ILogger;
  loading: boolean;

  constructor(
    private contentService: ContentService,
    private store: Store<AppState>,
    loggerFactory: LoggerFactory
  ) {
    this.subscriptions = [];
    this.logger = loggerFactory.getLogger('app:components:home');
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(this.store.pipe(
      select(selectInstitutionId),
      distinctUntilChanged()
    ).subscribe(id => this.onInstitutionChange(id)),
      this.store.pipe(select(selectInstitutionShortName))
        .subscribe(name => this.institutionName = name)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onInstitutionChange(institutionId: string){
    this.contentService.getCourseTree(institutionId).subscribe(
      this.onGetCourseTree.bind(this),
      null,
      this.onGetCourseTreeComplete.bind(this)
    );
  }

  onGetCourseTree(data: CourseTreeDto[]){
    this.courses = data.slice(0);
  }

  onGetCourseTreeComplete() {
    this.loading = false;
  }
}
