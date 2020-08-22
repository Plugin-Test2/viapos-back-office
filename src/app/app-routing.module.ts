import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SchedulingComponent} from './scheduling/scheduling.component';
import {CalendarComponent} from './calendar/calendar.component';
import {RoutesComponent} from './routes/routes.component';
import {RouteSchedulerComponent} from './route-scheduler/route-scheduler.component';
import {LocationsComponent} from './locations/locations.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'scheduling',
    component: SchedulingComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'routes',
    component: RoutesComponent
  },
  {
    path: 'scheduleRoutes',
    component: RouteSchedulerComponent
  },
  {
    path: 'locations',
    component: LocationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
