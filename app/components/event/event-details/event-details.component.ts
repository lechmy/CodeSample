import {Component, Input, OnInit} from '@angular/core';
import {ClassEventDto} from "../../../shared/dto/class-events/class-event.dto";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  @Input() currencySign: string;
  @Input() event: ClassEventDto;

  constructor() { }

  ngOnInit() {

  }
}
