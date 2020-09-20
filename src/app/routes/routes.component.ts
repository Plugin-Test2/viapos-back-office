import { Component, OnInit } from '@angular/core';
import {mockRoutes} from '../mock-objects/mockRoutes';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from "@angular/cdk/drag-drop";
import {Route} from '../data-objects/route';
import {FormControl} from '@angular/forms';
import {mockRouteDistribution} from '../mock-objects/mockRouteDistribution';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  routes;
  currentSelected = true;
  setters;
  settersRoutes = {};
  routeDistribution;
  displayModal = false;
  startDateForm = new FormControl(new Date());
  endDateForm = new FormControl(new Date());
  constructor() { }

  ngOnInit(): void {
    this.routes = mockRoutes;
    this.routeDistribution = mockRouteDistribution;
    this.populateSettersRoutes();
    this.setters = Object.keys(this.settersRoutes);
    console.log(this.setters);
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
        if (route.setter !== event.container.id) {
          route.setter = event.container.id;
        }
        console.log(route);
      }
    }
    console.log(event.container.data);
  }

  newSchedule(): void {
    this.displayModal = true;
  }
  closeModal(): void {
    this.displayModal = false;
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
        dist.effectivePercentage = dec.toFixed(2)
      }
    }
  }
  populateSettersRoutes(): void {
    this.settersRoutes = [];
    for (const route of this.routes) {
      if (route.assignedTo in this.settersRoutes) {
        this.settersRoutes[route.assignedTo].push(route);
      } else {
        this.settersRoutes[route.assignedTo] = [route];
      }
    }
    console.log(this.settersRoutes);
  }
}
