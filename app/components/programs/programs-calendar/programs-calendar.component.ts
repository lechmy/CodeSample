import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {ContentService} from "../../../shared/services/content.service";
import {EventCalendarModel} from "../../../shared/models/event-calendar.model";
import {ClassEventsModel} from "../../../shared/models/class-events.model";

class CalendarOptions {
  viewDate: Date;
  events: CalendarEvent[] = [];
  dayEndHour: number;
  dayStartHour: number;
  weekStartsOn: number;
}

@Component({
  selector: 'app-programs-calendar',
  templateUrl: './programs-calendar.component.html',
  styleUrls: ['./programs-calendar.component.scss']
})
export class ProgramsCalendarComponent implements OnInit {
  @Input() eventModel: ClassEventsModel;
  @Output() scrollToElem: EventEmitter<any> = new EventEmitter();

  eventCalendarModel: EventCalendarModel;
  calendarOpt: CalendarOptions;
  showCalendar: boolean;

  constructor(
    private contentService: ContentService,
  ) {
    this.eventCalendarModel = new EventCalendarModel();

    this.calendarOpt = new CalendarOptions();
    this.calendarOpt.viewDate = new Date();
    this.calendarOpt.dayStartHour = 12;
    this.calendarOpt.dayEndHour = 20;
    this.calendarOpt.weekStartsOn = 1;
    this.calendarOpt.events = [];
    this.showCalendar = true;
  }

  ngOnInit() {
    this.getCalendarEvents();
  }

  getCalendarEvents() {
    this.eventCalendarModel = Object.assign({}, this.eventModel);
    this.contentService.getCalendarEvents(this.eventCalendarModel).subscribe(data => {
      this.calendarOpt.events = [];
      this.calendarOpt.dayStartHour = data.dayStartHour;
      this.calendarOpt.dayEndHour = data.dayEndHour;
      data.events.forEach(item => {
        const event = {
          title: item.title,
          start: new Date(item.start),
          end: new Date(item.end),
          cssClass: `calendar-event ${item.className}-event`,
          meta: {
            eventId: item.id,
            courseType: item.className
          }
        };
        this.calendarOpt.events.push(event);
      });
    });
  }

  handleEvent(eventMeta) {
    this.scrollToElem.emit(eventMeta);
  }

  collapseCalendar() {
    this.showCalendar = !this.showCalendar;
  }
}
