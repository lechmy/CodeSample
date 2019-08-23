import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupDataService {
  modalState: boolean;

  constructor(
  ) { }

  open() {
    this.modalState = true;
  }

  close() {
    this.modalState = false;
  }
}
