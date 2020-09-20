import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Section } from '../data-objects/section';
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
export class SectionsService {
  sectionsUrl = environment.backendEndpoint + '/v1/sections';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LocationsService');
  }

  /** GET heroes from the server */
  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(this.sectionsUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getSections', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchSections(term: string): Observable<Section[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Section[]>(this.sectionsUrl, options)
      .pipe(
        catchError(this.handleError<Section[]>('searchSections', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addSection(sections: Section[]): Observable<Section[]> {
    return this.http.post<Section[]>(this.sectionsUrl, sections, httpOptions)
      .pipe(
        catchError(this.handleError('addSections', sections))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteSection(id: number): Observable<{}> {
    const url = `${this.sectionsUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteSection'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateSection(section: Section[]): Observable<Section[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Section[]>(this.sectionsUrl, section, httpOptions)
      .pipe(
        catchError(this.handleError('updateSection', section))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
