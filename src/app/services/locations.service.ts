import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Location } from '../data-objects/location';
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
export class LocationsService {
  locationsUrl = environment.backendEndpoint + '/v1/locations';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationsService');
  }

  /** GET heroes from the server */
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getHeroes', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchLocations(term: string): Observable<Location[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Location[]>(this.locationsUrl, options)
      .pipe(
        catchError(this.handleError<Location[]>('searchLocations', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addLocation(locations: Location[]): Observable<Location[]> {
    return this.http.post<Location[]>(this.locationsUrl, locations, httpOptions)
      .pipe(
        catchError(this.handleError('addLocations', locations))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteLocation(id: number): Observable<{}> {
    const url = `${this.locationsUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteHero'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateLocation(location: Location): Observable<Location> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Location>(this.locationsUrl, location, httpOptions)
      .pipe(
        catchError(this.handleError('updateHero', location))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
