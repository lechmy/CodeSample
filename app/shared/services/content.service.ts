import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CourseTreeDto} from "../dto/course-tree.dto";
import {Observable} from "rxjs/index";
import {ClassLocationsDto} from "../dto/class-locations.dto";
import {ClassEventsModel} from "../models/class-events.model";
import {ClassEventsDto} from "../dto/class-events/class-events.dto";
import {ClassEventDto} from "../dto/class-events/class-event.dto";
import {LocationDto} from "../dto/location.dto";
import {WorkshopEventsModel} from "../models/workshop-events.model";
import {WorkshopEventsDto} from "../dto/workshop/workshop-events.dto";
import {FooterLinkDto} from "../dto/footer-link.dto";
import {StaticPageDto} from "../dto/static-page.dto";
import {StaticPageModel} from "../models/static-page.model";
import {EventCalendarModel} from "../models/event-calendar.model";
import {EventsCalendarDto} from "../dto/events-calendar.dto";
import {CampEventsModel} from "../models/camps-events.model";
import {CampEventsDto} from "../dto/camps/camp-event.dto";
import {BirthdayEventsModel} from "../models/birthday-events.model";
import {BirthdayEventsDto} from "../dto/birthday/birthday-events.dto";
import {ClassEventModel} from "../models/class-event.model";
import {BirthdayEventModel} from "../models/birthday-event.model";
import {BirthdayEventDto} from "../dto/birthday/birthday-event.dto";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private http: HttpClient
  ) { }

  getCourseTree(institutionId: string): Observable<CourseTreeDto[]> {
    return this.http.get<CourseTreeDto[]>(`${environment.apiUrl}/coursetree/get-default-courses/${encodeURIComponent(institutionId)}`);
  }

  getClassLocations(institutionId: string): Observable<ClassLocationsDto[]> {
    return this.http.get<ClassLocationsDto[]>(`${environment.apiUrl}/location/get-class-locations/${encodeURIComponent(institutionId)}`);
  }

  getCampLocations(institutionId: string): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(`${environment.apiUrl}/location/get-camp-locations/${encodeURIComponent(institutionId)}`);
  }

  getWorkshopLocations(institutionId: string): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(`${environment.apiUrl}/location/get-workshop-locations/${encodeURIComponent(institutionId)}`);
  }

  getBdayLocations(institutionId: string): Observable<LocationDto[]> {
    return this.http.get<LocationDto[]>(`${environment.apiUrl}/location/get-birthday-locations/${encodeURIComponent(institutionId)}`);
  }

  getClassEvents(model: ClassEventsModel): Observable<ClassEventsDto> {
    const params = new HttpParams()
      .set('institutionId', model.institutionId)
      .set('locationId', model.locationId)
      .set('termId', model.termId);
    return this.http.get<ClassEventsDto>(`${environment.apiUrl}/event/get-class-events`, { params });
  }

  getCalendarEvents(model: EventCalendarModel): Observable<EventsCalendarDto>{
    const params = new HttpParams()
      .set('institutionId', model.institutionId)
      .set('locationId', model.locationId)
      .set('termId', model.termId);
    return this.http.get<EventsCalendarDto>(`${environment.apiUrl}/event/get-calendar-events`, { params });
  }

  getWorkshopEvents(model: WorkshopEventsModel): Observable<WorkshopEventsDto> {
    const params = new HttpParams()
      .set('InstitutionId', model.institutionId)
      .set('LocationId', model.locationId);
    return this.http.get<WorkshopEventsDto>(`${environment.apiUrl}/event/get-workshop-events`, { params });
  }

  getCampsEvents(model: CampEventsModel): Observable<CampEventsDto> {
    const params = new HttpParams()
      .set('InstitutionId', model.institutionId)
      .set('LocationId', model.locationId);
    return this.http.get<CampEventsDto>(`${environment.apiUrl}/event/get-camp-events`, { params });
  }

  getBirthdayEvents(model: BirthdayEventsModel): Observable<BirthdayEventsDto> {
    const params = new HttpParams()
      .set('InstitutionId', model.institutionId)
      .set('LocationId', model.locationId);
    return this.http.get<BirthdayEventsDto>(`${environment.apiUrl}/event/get-birthday-events`, { params });
  }

  getClassEvent(model: ClassEventModel): Observable<ClassEventDto> {
    let params = new HttpParams()
      .set('eventId', model.eventId);
    for(let eventDayId of model.eventDayIds){
      params = params.append('eventDayIds', eventDayId);
    }
    return this.http.get<ClassEventDto>(`${environment.apiUrl}/event/get-class-event`, {params});
  }

  getBirthdayEvent(model: BirthdayEventModel): Observable<BirthdayEventDto> {
    let params = new HttpParams()
      .set('EventDayId', model.eventDayId)
      .set('BirthdayPackageId', model.birthdayPackageId)
      .set('BirthdayActivityId', model.birthdayActivityId)
      .set('AverageAge', model.averageAge)
      .set('AdditionalNumberOfChildren', model.additionalNumberOfChildren ? model.additionalNumberOfChildren.toString() : '')
      .set('AreParentsWelcome', model.areParentsWelcome === true || model.areParentsWelcome === false ? model.areParentsWelcome.toString() : '')
      .set('Language', model.language ? model.language : '');
    for(let birthdayExtraId of model.birthdayExtraIds){
      params = params.append('BirthdayExtraIds', birthdayExtraId);
    }
    return this.http.get<BirthdayEventDto>(`${environment.apiUrl}/event/get-birthday-event`, {params})
  }

  getFooterLinks(institutionId: string): Observable<FooterLinkDto[]> {
    return this.http.get<FooterLinkDto[]>(`${environment.apiUrl}/staticpage/get-footer-links/${encodeURIComponent(institutionId)}`);
  }

  getStaticPageContent(model: StaticPageModel): Observable<StaticPageDto> {
    const params = new HttpParams()
      .set('institutionId', model.institutionId)
      .set('slug', model.slug);
    return this.http.get<StaticPageDto>(`${environment.apiUrl}/staticpage/get-static-page`, { params });
  }

}
