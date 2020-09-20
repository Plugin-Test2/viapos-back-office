import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Employee } from '../data-objects/employee';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import {EmployeeType} from '../data-objects/employeeType';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
};

@Injectable()
export class EmployeesService {
  employeeUrl = environment.backendEndpoint + '/v1/employees';
  employeeTypeUrl = this.employeeUrl + '/types';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  /** GET heroes from the server */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getEmployees', []))
      );
  }

  /* GET heroes whose name contains search term */
  searchEmployees(term: string): Observable<Employee[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Employee[]>(this.employeeUrl, options)
      .pipe(
        catchError(this.handleError<Employee[]>('searchEmployees', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addEmployee(employees: Employee[]): Observable<Employee[]> {
    return this.http.post<Employee[]>(this.employeeUrl, employees, httpOptions)
      .pipe(
        catchError(this.handleError('addEmployee', employees))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteEmployee(id: number): Observable<{}> {
    const url = `${this.employeeUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteEmployee'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateEmployee(employees: Employee[]): Observable<Employee[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Employee[]>(this.employeeUrl, employees, httpOptions)
      .pipe(
        catchError(this.handleError('updateEmployee', employees))
      );
  }

  /** GET heroes from the server */
  getEmployeeTypes(): Observable<EmployeeType[]> {
    return this.http.get<EmployeeType[]>(this.employeeTypeUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getEmployeeTypes', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the database */
  addEmployeeType(employeeTypes: EmployeeType[]): Observable<EmployeeType[]> {
    return this.http.post<EmployeeType[]>(this.employeeTypeUrl, employeeTypes, httpOptions)
      .pipe(
        catchError(this.handleError('addEmployeeType', employeeTypes))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteEmployeeType(id: number): Observable<{}> {
    const url = `${this.employeeTypeUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteEmployeeType'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateEmployeeType(employeeTypes: EmployeeType[]): Observable<EmployeeType[]> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<EmployeeType[]>(this.employeeTypeUrl, employeeTypes, httpOptions)
      .pipe(
        catchError(this.handleError('updateEmployeeType', employeeTypes))
      );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
