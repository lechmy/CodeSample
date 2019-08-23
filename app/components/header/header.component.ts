import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { ParticipantDto } from '../../shared/dto/participant/participant.dto';
import {
  AppState, selectParticipantForInstitution, selectInstitutionNewsletterLink,
  selectInstitutionShortName, selectInstitutionPhoneMobile, selectInstitutionId
} from '../../core/reducers';
import {distinctUntilChanged} from "rxjs/internal/operators";
import {ContentService} from "../../shared/services/content.service";
import {CourseTreeDto} from "../../shared/dto/course-tree.dto";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  participant: ParticipantDto;
  courses: CourseTreeDto[];
  newsletterLink: string;
  institutionName: string;
  phoneMobile: string;
  navActive: boolean;

  constructor(
    private store: Store<AppState>,
    private contentService: ContentService,
  ) {
    this.subscriptions = [];
    this.newsletterLink = '';
    this.courses = [];
    this.institutionName = '';
    this.phoneMobile = '';
    this.navActive = false;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(
        select(selectInstitutionId),
        distinctUntilChanged()
      ).subscribe(id => this.onInstitutionChange(id)),
      this.store.pipe(select(selectParticipantForInstitution))
      .subscribe(participant => this.participant = participant),
      this.store.pipe(select(selectInstitutionNewsletterLink))
        .subscribe(link => this.newsletterLink = link),
      this.store.pipe(select(selectInstitutionShortName))
        .subscribe(name => this.institutionName = name),
      this.store.pipe(select(selectInstitutionPhoneMobile))
        .subscribe(phoneMobile => this.phoneMobile = phoneMobile),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onInstitutionChange(institutionId: string){
    this.contentService.getCourseTree(institutionId).subscribe(
      this.onGetCourseTree.bind(this)
    );
  }

  onGetCourseTree(data: CourseTreeDto[]){
    this.courses = data.slice(0);
  }

  toggleNav() {
    this.navActive = !this.navActive;
  }
  closeNav() {
    this.navActive = false;
  }
}
