import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { SchedulingComponent } from './scheduling/scheduling.component';

import {MatNativeDateModule} from '@angular/material/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {DemoMaterialModule} from './material-module';


import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { CalendarComponent } from './calendar/calendar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RoutesComponent } from './routes/routes.component';
import { RouteSchedulerComponent } from './route-scheduler/route-scheduler.component';
import { LocationsComponent } from './locations/locations.component';
import {HttpClientModule} from '@angular/common/http';
import {HttpErrorHandler} from './http-error-handler.service';
import {MessageService} from './message.service';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import {LoginService} from './services/login.service';
import {CognitoUtil} from './services/cognito.service';
import {AwsUtil} from './services/aws.service';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
  resourceTimeGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    SchedulingComponent,
    CalendarComponent,
    RoutesComponent,
    RouteSchedulerComponent,
    LocationsComponent,
    EmployeesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    NgbModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    HttpClientModule,
    AmplifyUIAngularModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    HttpErrorHandler,
    MessageService,
    AuthGuard,
    LoginService,
    CognitoUtil,
    AwsUtil
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
