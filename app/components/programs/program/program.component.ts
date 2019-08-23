import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {WindowRef} from "../../../core/services/window.service";

import {EventsGroupByCourseTypeDto} from "../../../shared/dto/class-events/events-group-by-course-type.dto";

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {
  @ViewChild('accordion') accordion: ElementRef;
  @Input() events: EventsGroupByCourseTypeDto[];
  @Input() currencySign: string;
  @Output() setElement: EventEmitter<ElementRef> = new EventEmitter();

  accordionSection: any;

  constructor(
    private winRef: WindowRef
  ) { }

  ngOnInit() {
    this.setElement.emit(this.accordion);
  }

  panelChanged($event: NgbPanelChangeEvent) {
    if(!$event.nextState) {
      return false;
    }
    setTimeout(() => {
      this.accordionSection = document.getElementById($event.panelId);
      this.accordionSection.scrollIntoView();
      this.winRef.nativeWindow.scrollBy(0, -122);
    },50);
  }
}
