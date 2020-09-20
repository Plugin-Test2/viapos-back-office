import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Event } from '../data-objects/event';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
};

@Injectable()
export class EventsService {
  eventsUrl = environment.backendEndpoint + '/v1/events';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('EventsService');
  }

  /** GET heroes from the server */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getEvents', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchEvents(term: string): Observable<Event[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Event[]>(this.eventsUrl, options)
      .pipe(
        catchError(this.handleError<Event[]>('searchEvents', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addEvents(events: Event[]): Observable<Event[]> {
    return this.http.post<Event[]>(this.eventsUrl, events, httpOptions)
      .pipe(
        catchError(this.handleError('addEvents', events))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteEvent(id: number): Observable<{}> {
    const url = `${this.eventsUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteEvent'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateEvents(events: Event[]): Observable<Event[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Event[]>(this.eventsUrl, events, httpOptions)
      .pipe(
        catchError(this.handleError('updateEvents', events))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
