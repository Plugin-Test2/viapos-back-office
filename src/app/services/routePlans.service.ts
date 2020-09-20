import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Section } from '../data-objects/section';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import {environment} from '../../environments/environment';
import {RoutePlan} from '../data-objects/routePlan';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
};

@Injectable()
export class RoutePlansService {
  sectionsUrl = environment.backendEndpoint + '/v1/routePlans';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationsService');
  }

  /** GET heroes from the server */
  getRoutePlans(): Observable<RoutePlan[]> {
    return this.http.get<RoutePlan[]>(this.sectionsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getRoutePlans', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchRoutePlans(term: string): Observable<RoutePlan[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<RoutePlan[]>(this.sectionsUrl, options)
      .pipe(
        catchError(this.handleError<RoutePlan[]>('searchRoutePlans', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addRoutePlans(routePlans: RoutePlan[]): Observable<RoutePlan[]> {
    return this.http.post<RoutePlan[]>(this.sectionsUrl, routePlans, httpOptions)
      .pipe(
        catchError(this.handleError('addRoutePlans', routePlans))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteRoutePlan(id: number): Observable<{}> {
    const url = `${this.sectionsUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteRoutePlan'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateRoutePlan(routePlan: RoutePlan[]): Observable<RoutePlan[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<RoutePlan[]>(this.sectionsUrl, routePlan, httpOptions)
      .pipe(
        catchError(this.handleError('updateRoutePlan', routePlan))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
