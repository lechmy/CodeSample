import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { ParticipantLogInModel } from '../models/participant/participant-log-in.model';
import { ParticipantRefreshTokenModel } from '../models/participant/participant-refresh-token.model';
import { ParticipantRevokeTokenModel } from '../models/participant/participant-revoke-token.model';

import { ParticipantDto } from '../dto/participant/participant.dto';
import { ParticipantTokenDto } from '../dto/participant/participant-token.dto';
import { ParticipantExtendedDto } from "../dto/participant/participant-extended.dto";
import { ParticipantEditModel } from '../models/participant/participant-edit.model';
import { ParticipantForgotPasswordModel } from "../models/participant/participant-forgot-password.model";
import {ResetPasswordModel} from "../models/participant/reset-password.model";
import { ParticipantSavePasswordModel } from '../models/participant/participant-save-password.model';


@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(
    private http: HttpClient
  ) { }

  login(model: ParticipantLogInModel): Observable<ParticipantDto> {
    const headers = new HttpHeaders()
      .append('__disableToken', '');
    return this.http.post<ParticipantDto>(`${environment.apiUrl}/participant/login`, model, {headers});
  }

  refreshToken(model: ParticipantRefreshTokenModel): Observable<ParticipantTokenDto> {
    const headers = new HttpHeaders()
      .append('__disableToken', '')
      .append('__disableLoader', '');
    return this.http.post<ParticipantTokenDto>(`${environment.apiUrl}/participant/refresh-token`, model, {headers});
  }

  revokeToken(model: ParticipantRevokeTokenModel): Observable<any> {
    const headers = new HttpHeaders()
      .append('__disableToken', '');
    return this.http.post(`${environment.apiUrl}/participant/revoke-token`, model, {headers});
  }

  validateToken(): Observable<any> {
    const headers = new HttpHeaders()
      .append('__disableLoader', '')
      .append('__disableErrorEvents', '');
    return this.http.get(`${environment.apiUrl}/participant/validate-token`, {headers})
  }

  getParticipantExtended(id: string): Observable<ParticipantExtendedDto> {
    return this.http.get<ParticipantExtendedDto>(`${environment.apiUrl}/participant/${encodeURIComponent(id)}`)
      .pipe(
        map(item => {
          for (let child of item.childParticipants) {
            if (child.birthDate) {
              child.birthDate = new Date(child.birthDate);
            }
          }
          return item;
        })
      );
  }

  save(model: ParticipantEditModel): Observable<ParticipantExtendedDto> {
    return this.http.post<ParticipantExtendedDto>(`${environment.apiUrl}/participant`, model);
  }

  forgotPassword(model: ParticipantForgotPasswordModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/reset-password`, model);
  }

  resetPassword(token: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/reset-password/${encodeURIComponent(token)}`);
  }

  saveResetPassword(model: ResetPasswordModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/reset-password/save-reset-password`, model);
  }

  changePassword(model: ParticipantSavePasswordModel): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/participant/change-password`, model);
  }
}
