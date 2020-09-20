import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {mockRoutes} from '../mock-objects/mockRoutes';
import {mockRouteDistribution} from '../mock-objects/mockRouteDistribution';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Route} from '../data-objects/route';
import {LocationsService} from '../services/locations.service';
import {EmployeesService} from '../services/employees.service';
import {SectionsService} from '../services/sections.service';
import {ShiftsService} from '../services/shifts.service';
import {RoutePlan} from '../data-objects/routePlan';
import {RoutePlansService} from '../services/routePlans.service';

@Component({
  selector: 'app-route-scheduler',
  templateUrl: './route-scheduler.component.html',
  providers: [
    LocationsService,
    EmployeesService,
    SectionsService,
    ShiftsService,
    RoutePlansService
  ],
  styleUrls: ['./route-scheduler.component.css']
})
export class RouteSchedulerComponent implements OnInit {

  routes;
  currentSelected = false;
  setters;
  setterNames;
  shiftNames;
  settersRoutes;
  routeDistribution;
  displayModal = false;
  startDateForm;
  endDateForm;
  locations;
  routePlanShifts;
  employeeTypes;
  selectedRoutePlan: RoutePlan;
  newRoutePlan: RoutePlan;
  routePlans;
  shiftTypes;
  events;
  sections;
  sectionsByLocation;
  sectionsNames;
  scheduledLocations;
  constructor(private employeesService: EmployeesService, private locationsService: LocationsService,
              private sectionsService: SectionsService, private shiftsService: ShiftsService,
              private routePlansService: RoutePlansService) { }

  ngOnInit(): void {
    this.selectedRoutePlan = {};
    this.selectedRoutePlan.sections = [];
    this.refreshData();
    // this.routes = mockRoutes;
    // this.routeDistribution = mockRouteDistribution;
    // this.populateSettersRoutes();
    // this.setters = Object.keys(this.settersRoutes);
  }

  refreshData(): void {
    this.sectionsService.getSections()
      .subscribe(sections => {
        this.sections = sections;
        this.sectionsByLocation = {};
        this.sectionsNames = {};
        for (const section of sections) {
          if (this.sectionsByLocation[section.locationId]) {
            this.sectionsByLocation[section.locationId].push(section);
          } else {
            this.sectionsByLocation[section.locationId] = [section];
          }
          this.sectionsNames[section.id] = section.name;
        }
      });
    this.locationsService.getLocations()
      .subscribe(locations => {
        this.locations = locations;
      });
    this.shiftsService.getShiftTypes()
      .subscribe(shiftTypes => {
        this.shiftTypes = shiftTypes;
      });
    this.employeesService.getEmployees()
      .subscribe(employees => {
        this.setters = employees;
        this.generateSetterNames();
      });
    this.routePlansService.getRoutePlans()
      .subscribe(routePlans => {
        this.routePlans = routePlans;
        if (routePlans) {
          this.selectedRoutePlan = routePlans[0];
          this.populateSettersRoutes();
        }
      });
  }

  onDrop(event: CdkDragDrop<Route[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      for (const route of event.container.data) {
        if (route.shiftId !== event.container.id) {
          route.shiftId = event.container.id;
          route.shiftAssignee = this.setterNames[this.shiftNames[route.shiftId].assignedTo];
          route.shiftDisplayDate = this.convertFullDateToDisplay(this.shiftNames[route.shiftId].start);
        }
      }
    }
  }

  newSchedule(): void {
    this.scheduledLocations = [];
    this.newRoutePlan = {};
    this.newRoutePlan.sections = [];
    this.newRoutePlan.shiftTypes = [];
    this.startDateForm = new Date();
    this.endDateForm = new Date();
    this.displayModal = true;
  }
  closeModal(): void {
    this.displayModal = false;
  }

  toggleScheduledShiftTypes(shiftTypeId: string): void {
    if (this.newRoutePlan.shiftTypes) {
      const index = this.newRoutePlan.shiftTypes.indexOf(shiftTypeId, 0);
      if (index > -1) {
        this.newRoutePlan.shiftTypes.splice(index, 1);
      } else {
        this.newRoutePlan.shiftTypes.push(shiftTypeId);
      }
    } else {
      this.newRoutePlan.shiftTypes = [shiftTypeId];
    }
    console.log(this.newRoutePlan.shiftTypes);
  }

  toggleScheduledSection(sectionId: string) {
    if (this.newRoutePlan.sections) {
      const index = this.newRoutePlan.sections.indexOf(sectionId, 0);
      if (index > -1) {
        this.newRoutePlan.sections.splice(index, 1);
      } else {
        this.newRoutePlan.sections.push(sectionId);
      }
    } else {
      this.newRoutePlan.sections = [sectionId];
    }
  }

  toggleScheduledLocation(location: Location) {
    if (this.scheduledLocations) {
      const index = this.scheduledLocations.indexOf(location, 0);
      if (index > -1) {
        this.scheduledLocations.splice(index, 1);
      } else {
        this.scheduledLocations.push(location);
      }
    } else {
      this.scheduledLocations = [location];
    }
  }

  isLocationScheduled(location: Location): boolean {
    const index = this.scheduledLocations.indexOf(location, 0);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  saveRoutePlan(): void {
    this.newRoutePlan.startDate = this.startDateForm.toISOString();
    this.newRoutePlan.endDate = this.endDateForm.toISOString();
    const routePlans = [this.newRoutePlan];
    this.routePlansService
      .addRoutePlans(routePlans)
      .subscribe(update => {
        this.refreshData();
        this.closeModal();
      });
  }

  createRouteSchedule(): void {
    const numSetters = this.setters.length;
    const routes = Math.floor(this.routes.length / numSetters);
    const extraRoutes = this.routes.length % routes;
    const routeCont = [];
    for (const dist of this.routeDistribution) {
      if (routeCont.length === 0) {
        routeCont.push(+dist.percentage);
      } else {
        routeCont.push(+dist.percentage + routeCont[routeCont.length - 1]);
      }
    }
    console.log(extraRoutes);
    this.routes.forEach((route, i) => {
      if (i < (extraRoutes * (routes + 1))) {
        route.assignedTo = this.setters[Math.floor(i / (routes + 1))];
      } else {
        route.assignedTo = this.setters[Math.floor((i - extraRoutes) / (routes))];
      }
      const num = Math.floor(Math.random() * 100) + 1;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < routeCont.length; j++) {
        if (num <= routeCont[j]) {
          route.assignedGrade = this.routeDistribution[j].grade;
          break;
        }
      }
    });
    this.calculateRouteDistribution();
    this.populateSettersRoutes();
    this.displayModal = false;
  }

  calculateRouteDistribution(): void {
    const routeDistCount = {};
    let sum = 0;
    this.routes.forEach((route) => {
      if (route.assignedGrade in routeDistCount) {
        routeDistCount[route.assignedGrade] = routeDistCount[route.assignedGrade] + 1;
      } else {
        routeDistCount[route.assignedGrade] = 1;
      }
      sum = sum + 1;
    });
    for (const dist of this.routeDistribution) {
      if (dist.grade in routeDistCount) {
        const dec = routeDistCount[dist.grade] / sum * 100;
        dist.effectivePercentage = dec.toFixed(2);
      }
    }
  }
  populateSettersRoutes(): void {
    this.settersRoutes = [];
    this.routePlanShifts = [];
    for (const route of this.selectedRoutePlan.routes) {
      if (route.shiftId in this.settersRoutes) {
        this.settersRoutes[route.shiftId].push(route);
      } else {
        this.settersRoutes[route.shiftId] = [route];
        this.routePlanShifts.push(route.shiftId);
      }
    }
    this.generateShiftNames();
  }

  generateShiftNames(): void {
    this.shiftNames = [];
    this.shiftsService.searchShifts(Object.keys(this.settersRoutes))
      .subscribe(shifts => {
        for (const shift of shifts) {
          this.shiftNames[shift.id] = shift;
        }
        for (const route of this.selectedRoutePlan.routes) {
          if (route.shiftId in this.shiftNames) {
            route.shiftAssignee = this.setterNames[this.shiftNames[route.shiftId].assignedTo];
            route.sectionName = this.sections;
          }
          if (this.shiftNames[route.shiftId].start) {
            route.shiftDisplayDate = this.convertFullDateToDisplay(this.shiftNames[route.shiftId].start);
          }
        }
      });
  }


  generateSetterNames(): void {
    this.setterNames = [];
    for (const employee of this.setters) {
      this.setterNames[employee.id] = employee.name;
    }
  }

  convertFullDateToDisplay(fullDate: string): string {
    if (fullDate.indexOf('T') > -1) {
      fullDate = fullDate.split('T')[0];
    }
    const splitIndex = fullDate.indexOf('-') + 1;
    let dateStr = fullDate.slice(splitIndex);
    dateStr = dateStr.replace('-', '/')
    return dateStr;
  }

}
