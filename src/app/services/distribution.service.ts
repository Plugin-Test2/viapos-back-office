import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Distribution } from '../data-objects/distribution';
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
export class DistributionService {
  distributionsUrl = environment.backendEndpoint + '/v1/distributions';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationsService');
  }

  /** GET heroes from the server */
  getDistributions(): Observable<Distribution[]> {
    return this.http.get<Distribution[]>(this.distributionsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getDistributions', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchDistributions(term: string): Observable<Distribution[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Distribution[]>(this.distributionsUrl, options)
      .pipe(
        catchError(this.handleError<Distribution[]>('searchDistributions', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addDistributions(distributions: Distribution[]): Observable<Distribution[]> {
    return this.http.post<Distribution[]>(this.distributionsUrl, distributions, httpOptions)
      .pipe(
        catchError(this.handleError('addDistributions', distributions))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteDistribution(id: string): Observable<{}> {
    const url = `${this.distributionsUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteDistribution'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateDistributions(distribution: Distribution[]): Observable<Distribution[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Distribution[]>(this.distributionsUrl, distribution, httpOptions)
      .pipe(
        catchError(this.handleError('updateDistributions', distribution))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
