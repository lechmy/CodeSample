import {Component, Input, OnInit} from '@angular/core';
import {BirthdayEventDto} from "../../../shared/dto/birthday/birthday-event.dto";

@Component({
  selector: 'app-event-birthday-details',
  templateUrl: './event-birthday-details.component.html',
  styleUrls: ['./event-birthday-details.component.scss']
})
export class EventBirthdayDetailsComponent implements OnInit {
  @Input() currencySign: string;
  @Input() birthdayEvent: BirthdayEventDto;

  constructor() {}

  ngOnInit() {
  }

}
