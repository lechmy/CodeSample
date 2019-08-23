import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { SaveChildParticipantModel } from '../models/save-child-participant.model';
import { ChildParticipantsDto } from '../dto/participant/child-participants.dto';

@Injectable({
  providedIn: 'root'
})
export class ChildParticipantService {

  constructor(
    private http: HttpClient
  ) { }

  save(model: SaveChildParticipantModel): Observable<ChildParticipantsDto> {
    return this.http.post<ChildParticipantsDto>(`${environment.apiUrl}/childparticipant`, model);
  }
}
