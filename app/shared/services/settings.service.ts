import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { SettingsDto } from '../dto/settings/settings.dto';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  getSettings(): Observable<SettingsDto> {
    const headers = new HttpHeaders()
      .append('__disableToken', '');
    return this.http.get<SettingsDto>(`${environment.apiUrl}/settings`, {headers});
  }
}
