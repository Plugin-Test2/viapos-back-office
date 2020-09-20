import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CalendarOptions, FullCalendarComponent} from '@fullcalendar/angular';
import {Draggable} from '@fullcalendar/interaction'; // useful for typechecking
import {mockShifts} from '../mock-objects/mockShifts';
import {EventsService} from '../services/events.service';
import {Event} from '../data-objects/event';
import {LocationsService} from '../services/locations.service';
import {Location} from '../data-objects/location';
import {Employee} from '../data-objects/employee';
import {ShiftsService} from '../services/shifts.service';
import {FormControl} from '@angular/forms';
import {EmployeesService} from '../services/employees.service';
import {Shift} from '../data-objects/shift';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css'],
  providers: [
    EventsService,
    LocationsService,
    ShiftsService,
    EmployeesService
  ],
  encapsulation: ViewEncapsulation.None
})
export class SchedulingComponent implements OnInit, AfterViewInit {
  @ViewChild('selectedCalendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'today prev,next',
      center: 'title',
      right: 'resourceTimelineWeek,dayGridMonth'
    },
    initialView: 'dayGridMonth',
    editable: true,
    dateClick: this.handleDateClick.bind(this), // bind is important!
    displayEventEnd: true,
    // resourceAreaColumns: [
    //   {
    //     group: true,
    //     field: 'building',
    //     headerContent: 'Building'
    //   },
    //   {
    //     field: 'shift',
    //     headerContent: 'Shift'
    //   }
    // ],
    resourceGroupField: 'building',
    resources: [
      { id: 'Kennesaw-Lift Shift', building: 'Kennesaw', title: 'Lift Shift', order: 1 },
      { id: 'Kennesaw-Fore Run', building: 'Kennesaw', title: 'Fore Run', order: 2 },
      { id: 'Kennesaw-Rope Shift', building: 'Kennesaw', title: 'Lift Shift', order: 3 },
      { id: 'Kennesaw-Boulder', building: 'Kennesaw', title: 'Bouldering', order: 4 },
      { id: 'Atlanta-Lift Shift', building: 'Atlanta', title: 'Lift Shift', order: 1 },
      { id: 'Atlanta-Fore Run', building: 'Atlanta', title: 'For Run', order: 2 },
      { id: 'Atlanta-Rope Shift', building: 'Atlanta', title: 'Rope Shift', order: 3 },
      { id: 'Atlanta-Boulder', building: 'Atlanta', title: 'Bouldering', order: 4 },
      { id: 'Midtown-Boulder', building: 'Midtown', title: 'Bouldering', order: 1 }
    ],
    events: [
    ],
    views: {
      resourceTimelineWeek: {
        buttonText: 'Week',
        slotDuration: '02:00'
      },
    }
  };

  selectedDayCalendar: CalendarOptions = {
    headerToolbar: {
      left: '',
      center: 'title',
      right: ''
    },
    height: '100%',
    timeZone: 'none',
    initialView: 'resourceTimeGridDay',
    eventClick: this.openShift.bind(this),
    editable: true,
    // resourceAreaColumns: [
    //   {
    //     group: true,
    //     field: 'building',
    //     headerContent: 'Building'
    //   },
    //   {
    //     field: 'shift',
    //     headerContent: 'Shift'
    //   }
    // ],
    events: [
    ],
    views: {
      resourceTimelineWeek: {
        buttonText: 'Week',
        slotDuration: '02:00'
      },
    }
  };
  selectedShift;
  selectedShifts;
  shiftEmployees;
  availableShiftEmployees;
  unavailableShiftEmployees;
  selectedShiftEvent;
  addedShifts;
  deletedShifts;
  allDayShifts;
  allEvents;
  scheduledShifts;
  locations;
  backgroundEvents;
  displayModal;
  displayEventModal;
  startDateForm = new FormControl(new Date());
  endDateForm = new FormControl(new Date());
  employees;
  employeesMap = {};
  employeeTypes;

  constructor(private eventsService: EventsService, private locationsService: LocationsService, private shiftsService: ShiftsService, private employeesService: EmployeesService) {
  }

  ngOnInit() {
    this.displayModal = false;
    this.scheduledShifts = mockShifts;
    // this.overlayScheduledShifts();
    this.getLocations();
    this.refreshData();
    this.employeesService.getEmployees()
      .subscribe(employees => {
        this.employees = employees;
        for (const employee of employees) {
          this.employeesMap[employee.id] = employee.name;
        }
      });
    this.employeesService.getEmployeeTypes()
      .subscribe(employeeTypes => {
        this.employeeTypes = employeeTypes;
      });
  }

  ngAfterViewInit() {
  }

  refreshData(): void {
    this.eventsService.getEvents()
      .subscribe(events => {
        const calendarEvents = this.mapToCalendar(events);
        this.allEvents = events;
        this.calendarOptions.events = calendarEvents;
        // this.setSelectedEvents(calendarEvents);
      });
  }

  handleDateClick(arg) {
    // this.getUnassignedShifts(arg.dateStr, arg.date.getDay(), this.locations);
    this.displayDayShifts(arg.dateStr);
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(arg.dateStr); // call a method on the Calendar object
  }

  displayDayShifts(date: string) {
    this.shiftsService.getDayShifts(date)
      .subscribe(shifts => {
        const calendarEvents = this.mapToSelectedCalendar(shifts);
        this.allDayShifts = shifts;
        this.selectedDayCalendar.events = calendarEvents;
      });
  }


  getUnassignedShifts(date: string, dayOfWeek: string, resources: string[]) {
    this.shiftsService.getUnassignedShifts(date, dayOfWeek, resources)
      .subscribe(shifts => {
        const calendarEvents = this.mapToSelectedCalendar(shifts);
        this.selectedDayCalendar.events = calendarEvents;
      });
  }

  setSelectedEvents(events: Event[]): void {
    const selectedEvents = [];
    const newEvents = [];
    // creating a shallow copy of the array, as to not affect the other calendar
    events.forEach(val => newEvents.push(Object.assign({}, val)));
    for (const event of newEvents) {
      event.display = 'background';
      selectedEvents.push(event);
    }
    this.backgroundEvents = selectedEvents;
    this.selectedDayCalendar.events = selectedEvents;
  }

  selectShiftTab(shift: string): any {
    if (this.selectedShift === shift) {
      this.selectedShift = '';
    } else {
      this.selectedShift = shift;
    }
    return false;
  }

  getLocations(): void {
    this.locationsService.getLocations()
      .subscribe(locations => {
        this.selectedDayCalendar.resources = this.mapLocationToResource(locations);
      });
  }

  mapLocationToResource(locations: Location[]): Location[] {
    this.locations = [];
    for (const location of locations) {
      if (location.name) {
        location.title = location.name;
      }
      this.locations.push(location.id);
    }
    return locations;
  }

  overlayScheduledShifts(): void {
    const events = [];
    for (const shift of this.scheduledShifts) {
      if (shift.resourceId === '1') {
        shift.resourceId = 'Atlanta-' + shift.title;
        shift.display = 'background';
        events.push(shift);
      } else if (shift.resourceId === '2') {
        shift.resourceId = 'Kennesaw-' + shift.title;
        shift.display = 'background';
        events.push(shift);
      } else if (shift.resourceId === '3') {
        shift.resourceId = 'Midtown-' + shift.title;
        shift.display = 'background';
        events.push(shift);
      }
    }
    console.log(events);
    this.calendarOptions.events = events;
    // do something
  }

  mapToCalendar(events: any[]): any[] {
    for (const event of events) {
      if (event.name) {
        event.title = event.name;
      }
      if (event.reoccurence) {
        event.allDay = false;
        event.startTime = event.start.split('T')[1];
        event.endTime = event.end.split('T')[1];
        event.startRecur = event.start;
        event.endRecur = event.end;
      }
      event.resourceId = event.locationId;
    }
    return events;
  }

  mapToSelectedCalendar(events: any[]): any[] {
    const combinedEvents = [];
    for (const event of events) {
      if (event.assignedTo) {
        event.title = this.employeesMap[event.assignedTo] + ' - ' + event.name;
      } else {
        event.title = 'Unassigned' + ' - ' + event.name;
      }
      if (event.reoccurence) {
        event.allDay = false;
        event.startTime = event.start.split('T')[1];
        event.endTime = event.end.split('T')[1];
      }
      event.resourceId = event.locationId;
      combinedEvents.push(event);
    }
    // for (const event of this.backgroundEvents) {
      // combinedEvents.push(event);
    // }
    return combinedEvents;
  }

  openShift(editInfo: any): any {
    this.shiftEmployees = [];
    this.selectedShifts = [];
    this.addedShifts = [];
    this.deletedShifts = [];
    this.selectedShift = editInfo.event;
    if (this.selectedShift.id && this.selectedShift.id !== 'null') {
      for (const shift of this.allDayShifts) {
        if (this.selectedShift.id === shift.id) {
          for (const event of this.allEvents) {
            if (event.id === shift.eventId) {
              this.selectedShiftEvent = event;
            }
          }
        }
      }
    } else {
      for (const event of this.allEvents) {
        const eventName = this.selectedShift.title.split(' - ');
        if (eventName && eventName[1] && eventName[1] === event.name) {
          this.selectedShiftEvent = event;
        }
      }
    }
    for (const shift of this.allDayShifts) {
      if (shift.eventId === this.selectedShiftEvent.id) {
        this.selectedShifts.push(shift);
        for (const employee of this.employees) {
          if (shift.assignedTo === employee.id) {
            this.shiftEmployees.push(employee);
          }
        }
      }
    }
    this.availableShiftEmployees = [];
    this.unavailableShiftEmployees = [];
    for (const employee of this.employees) {
      this.availableShiftEmployees.push(employee);
    }
    this.displayEventModal = true;
  }

  filterEmployees(input: any): void {
    const availableEmployees = [];
    const unavailableEmployees = [];
    if (input.target.value) {
      for (const employee of this.employees) {
        if (employee.name.toUpperCase().indexOf(input.target.value.toUpperCase()) > -1) {
          availableEmployees.push(employee);
        }
      }
      this.availableShiftEmployees = availableEmployees;
      for (const employee of this.unavailableShiftEmployees) {
        if (employee.name.toUpperCase().indexOf(input.target.value.toUpperCase()) > -1) {
          unavailableEmployees.push(employee);
        }
      }
      this.unavailableShiftEmployees = unavailableEmployees;
    } else {
      this.availableShiftEmployees = this.employees;
    }
  }

  assignEmployeeToShift(employee: Employee): void {
    if (this.addedShifts) {
      this.addedShifts.push(employee);
    } else {
      this.addedShifts = [employee];
    }
    this.shiftEmployees.push(employee);
  }

  removeShift(employee: Employee): void {
    if (this.shiftEmployees) {
      const index = this.shiftEmployees.indexOf(employee, 0);
      if (index > -1) {
        this.shiftEmployees.splice(index, 1);
      }
      for (const shift of this.selectedShifts) {
        if (shift.assignedTo === employee.id) {
          if (this.deletedShifts) {
            this.deletedShifts.push(shift);
          } else {
            this.deletedShifts = [shift];
          }
        }
      }
    }
  }

  saveShifts(): void {
    if (this.addedShifts) {
      const newShifts = [];
      for (const employee of this.addedShifts) {
        console.log(this.selectedShift);
        const shift: Shift = this.createShift(this.selectedShift, this.selectedShiftEvent.id, this.selectedShiftEvent.title, employee.id);
        newShifts.push(shift);
      }
      this.shiftsService.addShifts(newShifts)
        .subscribe(shifts => {
        });
    }
    if (this.deletedShifts) {
      for (const shift of this.deletedShifts) {
        this.shiftsService.deleteShift(shift.id)
          .subscribe();
      }
    }
    this.closeModal();
  }

  createShift(shift: any, eventId: string, eventName: string, employeeId: string): Shift {
    const newShift: Shift = {name: eventName};
    newShift.eventId = eventId;
    newShift.assignedTo = employeeId;
    newShift.start = shift.start;
    newShift.end = shift.end;
    newShift.locationId = shift._def.resourceIds[0];
    return newShift;
  }

  openModal(): void {
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
    this.displayEventModal = false;
  }

}