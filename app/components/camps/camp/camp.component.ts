import {Component, Input, OnInit} from '@angular/core';
import {EventsGroupByTermDto} from "../../../shared/dto/camps/events-group-by-term.dto";

@Component({
  selector: 'app-camp',
  templateUrl: './camp.component.html',
  styleUrls: ['./camp.component.scss']
})
export class CampComponent implements OnInit {
  @Input() term: EventsGroupByTermDto;
  @Input() currencySign: string;
  isDescriptionCollapsed: boolean;

  constructor() {
    this.isDescriptionCollapsed = false;
  }

  ngOnInit() {
  }

  collapseDescription() {
    this.isDescriptionCollapsed = !this.isDescriptionCollapsed;
  }
}
