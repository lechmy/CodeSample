import {Component, Input, OnInit} from '@angular/core';
import {EventExtendedCampDto} from "../../../shared/dto/camps/event-extended-camp.dto";
import {Router} from "@angular/router";
import {AppRouterService} from "../../../core/services/app-router.service";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-camp-event-day-group',
  templateUrl: './camp-event-day-group.component.html',
  styleUrls: ['./camp-event-day-group.component.scss']
})
export class CampEventDayGroupComponent implements OnInit {
  @Input() event: EventExtendedCampDto;
  @Input() currencySign: string;
  selectedIds: any;
  eventDayIds: string[];
  isEventInvalid: boolean;
  selectedTime: string;
  weekSummedPrice: number[];

  constructor(
    private appRouter: AppRouterService,
  ) {
    this.selectedIds = {};
    this.isEventInvalid = false;
    this.eventDayIds = [];
    this.selectedTime = '';
    this.weekSummedPrice = [];
  }

  ngOnInit() {
    let index = 0;
    for(let i = 0; i < this.event.eventDaysExtendedCampGroupByDate[0].eventDays.length; i++){
      let priceSum = 0;
      this.event.eventDaysExtendedCampGroupByDate.forEach( event => {
          priceSum += event.eventDays[index].price;
      });
      this.weekSummedPrice.push(priceSum);
      index++;
    }
  }

  selectEventTime(eventDay: string, eventTimeId: string){

    if(!this.selectedIds.hasOwnProperty(eventDay)){
      this.selectedIds[eventDay] = '';
    }
    if(this.selectedIds[eventDay] == eventTimeId) {
      delete this.selectedIds[eventDay];
    } else {
      this.selectedIds[eventDay] = eventTimeId;
    }
    this.eventDayIds = Object.values(this.selectedIds);
    this.isEventInvalid = !Object.keys(this.selectedIds).length ? true : false;
  }

  selectWeekTime(eventDay: any, eventTimeId: string, eventName: string) {
    this.eventDayIds = [];
    if(this.selectedTime == eventTimeId) {
      this.selectedTime = '';
      this.isEventInvalid = true;
      return;
    }
    this.selectedTime = eventTimeId;
    this.isEventInvalid = false;
    for(let date of eventDay) {
      for(let id of date['eventDays']){
        if(id['name'] == eventName){
          this.eventDayIds.push(id['eventDayId']);
        }
      }
    }
  }

  bookEvent() {
    if(!this.eventDayIds.length){
      this.isEventInvalid = true;
      return;
    }
    this.appRouter.navigate(['/event', this.event.eventId] , { queryParams: {eventDayIds: this.eventDayIds} });
  }
}
