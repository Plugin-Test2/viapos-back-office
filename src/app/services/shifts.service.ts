import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Location } from '../data-objects/location';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import {Shift} from '../data-objects/shift';
import {ShiftType} from '../data-objects/shiftType';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
};

@Injectable()
export class ShiftsService {
  shiftsUrl = environment.backendEndpoint + '/v1/shifts';  // URL to web api
  shiftTypesUrl = this.shiftsUrl + '/types'
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ShiftsService');
  }

  /** GET heroes from the server */
  getShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.shiftsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShifts', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchShifts(shiftIds: string[]): Observable<Shift[]> {
    const url = `${this.shiftsUrl}?shiftIds=${shiftIds}`
    // Add safe, URL encoded search parameter if there is a search term

    return this.http.get<Shift[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError<Shift[]>('searchShifts', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addShifts(shifts: Shift[]): Observable<Shift[]> {
    return this.http.post<Shift[]>(this.shiftsUrl, shifts, httpOptions)
      .pipe(
        catchError(this.handleError('addShifts', shifts))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteShift(id: number): Observable<{}> {
    const url = `${this.shiftsUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteShift'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateShift(shifts: Shift[]): Observable<Shift[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Shift[]>(this.shiftsUrl, shifts, httpOptions)
      .pipe(
        catchError(this.handleError('updateShifts', shifts))
      );
  }

  getUnassignedShifts(date: string, dayOfWeek: string, locationIds: string[]): Observable<Shift[]> {
    const url = `${this.shiftsUrl}/unassigned?date=${date}&dayOfWeek=${dayOfWeek}&resources=${locationIds}`
    return this.http.get<Shift[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError('getUnassignedShifts', []))
      );
  }

  getDayShifts(date: string): Observable<Shift[]> {
    const url = `${this.shiftsUrl}?date=${date}`
    return this.http.get<Shift[]>(url, httpOptions)
      .pipe(
        catchError(this.handleError('getDayShifts', []))
      );
  }

  /////////////// Shift Types /////////////////

  /** GET heroes from the server */
  getShiftTypes(): Observable<ShiftType[]> {
    return this.http.get<ShiftType[]>(this.shiftTypesUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getShiftTypes', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchShiftTypes(term: string): Observable<ShiftType[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<ShiftType[]>(this.shiftTypesUrl, options)
      .pipe(
        catchError(this.handleError<Shift[]>('searchShiftTypes', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addShiftTypes(shiftTypes: ShiftType[]): Observable<ShiftType[]> {
    return this.http.post<ShiftType[]>(this.shiftTypesUrl, shiftTypes, httpOptions)
      .pipe(
        catchError(this.handleError('addShiftTypes', shiftTypes))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteShiftType(id: number): Observable<{}> {
    const url = `${this.shiftTypesUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteShiftType'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateShiftType(shiftTypes: ShiftType[]): Observable<ShiftType[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<ShiftType[]>(this.shiftTypesUrl, shiftTypes, httpOptions)
      .pipe(
        catchError(this.handleError('updateShiftTypes', shiftTypes))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
