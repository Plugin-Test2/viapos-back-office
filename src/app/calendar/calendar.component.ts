import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/angular';
import {Draggable} from '@fullcalendar/interaction';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

import {Shift} from '../data-objects/shift';
import {Event} from '../data-objects/event';
import {Location} from '../data-objects/location';
import {mockShifts} from '../mock-objects/mockShifts';
import {FormControl} from '@angular/forms';
import {EventsService} from '../services/events.service';
import {LocationsService} from '../services/locations.service';
import {ShiftsService} from '../services/shifts.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  providers: [
    EventsService,
    LocationsService,
    ShiftsService
  ],
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit, OnInit {

  @ViewChild('external') external: ElementRef;

  startTime: NgbTimeStruct = {hour: 12, minute: 30, second: 10};
  endTime: NgbTimeStruct = {hour: 13, minute: 30, second: 10};
  meridian = true;
  selectedEvent;
  selectedEventName;
  startDateForm;
  endDateForm;

  calendarOptions: CalendarOptions = {
    initialView: 'resourceTimeGridFourDay',
    editable: true,
    eventStartEditable: true,
    eventResourceEditable: true,
    droppable: true,
    eventReceive: this.eventAdded.bind(this),
    eventClick: this.editEvent.bind(this),
    views: {
      resourceTimeGridFourDay: {
        type: 'resourceTimeGrid',
        duration: { days: 3 },
        buttonText: '3 days'
      },
      resourceTimeGridWeek: {
        type: 'resourceTimeGrid',
        duration: { days: 7 },
        buttonText: 'Week'
      },
      resourceTimeGridDay: {
        type: 'resourceTimeGrid',
        duration: { days: 1 },
        buttonText: '1 day'
      }
    },
    customButtons: {
      settings: {
        icon: 'cog',
        text: 'Settings',
        click: this.openSettings.bind(this)
      },
      new: {
        text: 'New',
        click: this.newEvent.bind(this)
      }
    },
    headerToolbar: {
      start: 'settings new', // will normally be on the left. if RTL, will be on the right
      center: 'title',
      end: 'today resourceTimeGridDay,resourceTimeGridFourDay,resourceTimeGridWeek prev,next' // will normally be on the right. if RTL, will be on the left
    }
  };
  potentialResources;
  locations = ['All', 'Atlanta', 'Kennesaw', 'Midtown'];
  allEvents;

  shifts = [
    {name: 'Boulder', startTime: '8:00', endTime: '16:00'},
    {name: 'Lift Shift', startTime: '6:00', endTime: '11:00'},
    {name: 'Rope Shift', startTime: '12:00', endTime: '15:00'},
    {name: 'Forerun', startTime: '13:00', endTime: '16:00'},
  ];
  selectedShift;
  shiftTypes;

  displayModal = false;

  constructor(private eventsService: EventsService, private locationsService: LocationsService, private shiftsService: ShiftsService) {}

  ngOnInit() {
    this.getLocations();
    this.getShiftTypes();
    this.refreshData();
  }

  ngAfterViewInit() {
    this.potentialResources = this.calendarOptions.resources;

    // new Draggable(this.external.nativeElement, {
    //   itemSelector: '.fc-event',
    //   eventData(eventEl) {
    //     return {
    //       title: eventEl.innerText
    //     };
    //   }
    // });
  }

  getLocations(): void {
    this.locationsService.getLocations()
      .subscribe(locations => {
        this.calendarOptions.resources = this.mapLocationToResource(locations);
      });
  }

  getShiftTypes(): void {
    this.shiftsService.getShiftTypes()
      .subscribe(shiftTypes => {
        this.shiftTypes = shiftTypes;
      });
  }

  refreshData(): void {
    this.eventsService.getEvents()
      .subscribe(events => {
        const calendarEvents = this.mapToCalendar(events);
        this.calendarOptions.events = calendarEvents;
        this.allEvents = calendarEvents;
      });
  }

  eventDragStop(model) {
    console.log(model);
  }

  selectGym(gym: string): any {
    const localCalendar = this.calendarOptions;
    if (gym === 'All') {
      this.calendarOptions.resources = this.potentialResources;
    } else {
      const newResource = [];
      for (const resource of this.potentialResources) {
        if (resource.title === gym) {
          newResource.push(resource);
        }
      }
      this.calendarOptions.resources = newResource;
    }
  }

  selectShiftTab(shift: string): any {
    if (this.selectedShift === shift) {
      this.selectedShift = '';
    } else {
      this.selectedShift = shift;
    }
    return false;
  }

  editEvent(info: any): any {
    this.setTimes(info.event);
    this.displayModal = true;
    this.selectedEvent = info.event;
    this.selectedEventName = this.selectedEvent.title;
    for (const event of this.allEvents) {
      if (event.id === info.event.id) {
        this.selectedEvent.reoccurence = event.reoccurence;
        this.selectedEvent.minEmployeeNbr = event.minEmployeeNbr;
        this.selectedEvent.minShiftsNbr = event.minShiftsNbr;
        if (event.reoccurence === 'weekly') {
          this.selectedEvent.daysOfWeek = event.daysOfWeek;
        }
        this.selectedEvent.shiftType = event.shiftType;
      }
    }
    if (this.selectedEvent.daysOfWeek === undefined) {
      this.selectedEvent.daysOfWeek = [];
    }
    if (this.selectedEvent._def && this.selectedEvent._def.resourceIds) {
      this.selectedEvent.locationId = this.selectedEvent._def.resourceIds[0];
    }
    console.log(this.selectedEvent);
    console.log(this.shiftTypes);
    return false;
  }

  eventAdded(info: any): any {
    // this.shifts.forEach(shift => {
    //   if (shift.name === info.event.title) {
    //     info.event.startTime = shift.startTime;
    //     info.event.endTime = shift.endTime;
    //     console.log(info);
    //   }
    // });
  }

  closeModal(): void {
    this.displayModal = false;
    this.selectedEvent = undefined;
  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  saveEvent(): void {
    // this.selectedEvent.setStart('2020-07-11T07:00:00.000');
   // this.selectedEvent.moveStart(this.getTimeDifference(this.selectedEvent.startStr));
    // this.selectedEvent.moveStart('-1:00');
    // this.selectedEvent.setEnd(end);
    // this.selectedEvent.setDates(start, end);
    const events = [];
    events.push(this.mapToEvent());
    if (this.selectedEvent.id) {
      this.eventsService
        .updateEvents(events)
        .subscribe(addedEvents => {
          this.refreshData();
          this.closeModal();
        });
    } else {
      this.eventsService
        .addEvents(events)
        .subscribe(addedEvents => {
          this.closeModal();
        });
    }
  }

  deleteEvent(): void {
    this.eventsService
      .deleteEvent(this.selectedEvent.id)
      .subscribe(update => {
        this.refreshData();
        this.closeModal();
      });
  }

  mapToEvent(): Event {
    const newEvent = new Event();
    const startArray = this.startDateForm.toISOString().split('T');
    const endArray = this.endDateForm.toISOString().split('T');
    let end = '';
    let start = '';
    if (startArray) {
      start = startArray[0] + 'T' + this.getTime(this.startTime);
      if (endArray) {
        end = endArray[0] + 'T' + this.getTime(this.endTime);
      } else {
        end = startArray[0] + 'T' + this.getTime(this.endTime);
      }
      newEvent.start = start;
      newEvent.end = end;
    }
    if (this.selectedEventName) {
      newEvent.name = this.selectedEventName;
    }
    if (this.selectedEvent.id) {
      newEvent.id = this.selectedEvent.id;
    }
    // if (this.selectedEvent._def.resourceIds) {
    //   newEvent.locationId = this.selectedEvent._def.resourceIds[0];
    // }
    newEvent.locationId = this.selectedEvent.locationId;
    if (this.selectedEvent.reoccurence) {
      newEvent.reoccurence = this.selectedEvent.reoccurence;
      newEvent.daysOfWeek = this.selectedEvent.daysOfWeek;

      newEvent.startTime = this.getTime(this.startTime);
      newEvent.endTime = this.getTime(this.endTime);
    }
    if (this.selectedEvent.minEmployeeNbr) {
      newEvent.minEmployeeNbr = this.selectedEvent.minEmployeeNbr;
    }
    if (this.selectedEvent.minShiftsNbr) {
      newEvent.minShiftsNbr = this.selectedEvent.minShiftsNbr;
    }
    if (this.selectedEvent.shiftType) {
      newEvent.shiftType = this.selectedEvent.shiftType;
    }
    return newEvent;
  }

  mapToCalendar(events: Event[]): Event[] {
    for (const event of events) {
      if (event.name) {
        event.title = event.name;
      }
      if (event.reoccurence) {
        event.allDay = false;
        event.startRecur = event.start;
        event.endRecur = event.end;
      }
      event.resourceId = event.locationId;
    }
    return events;
  }

  mapLocationToResource(locations: Location[]): Location[] {
    for (const location of locations) {
      if (location.name) {
        location.title = location.name;
      }
    }
    return locations;
  }

  toggleDay(day: string): void {
    if (this.selectedEvent.daysOfWeek) {
      const index = this.selectedEvent.daysOfWeek.indexOf(day, 0);
      if (index > -1) {
        this.selectedEvent.daysOfWeek.splice(index, 1);
      } else {
        this.selectedEvent.daysOfWeek.push(day);
      }
    } else {
      this.selectedEvent.daysOfWeek = [day];
    }
  }

  getTime(time: NgbTimeStruct): string {
    const timeString = this.minTwoDigits(time.hour) + ':' + this.minTwoDigits(time.minute) + ':' + this.minTwoDigits(time.second);
    return timeString;
  }

  setTimes(event: any): void {
    const startArray = event.startStr.split('T');
    const startTimes = startArray[1].split(':');
    // this.startDateForm = new FormControl(event.startStr);
    this.startDateForm = new Date(event.startStr);
    let endTimes;
    if (event.endStr) {
      const endArray = event.endStr.split('T');
      endTimes = endArray[1].split(':');
      this.endTime = { hour: Number(endTimes[0]), minute: Number(endTimes[1]), second: 0o0};
    } else {
      this.endTime = { hour: (Number(startTimes[0]) + 1), minute: Number(startTimes[1]), second: 0o0};
    }
    for (const totalEvent of this.allEvents) {
      if (totalEvent.id === event.id) {
        this.endDateForm = new Date(totalEvent.end);
      }
    }
    this.startTime = { hour: Number(startTimes[0]), minute: Number(startTimes[1]), second: 0o0};
  }

  openSettings(): any {

  }

  newEvent(): any {
    this.displayModal = true;
    this.selectedEvent = {};
    this.selectedEvent.daysOfWeek = [];
    return false;
  }

  getTimeDifference(originalDate: string): any {
    const dateArray = originalDate.split('T');
    const times = dateArray[1].split(':');
    let hourDiff = (this.startTime.hour - Number(times[0]));
    let minuteDiff = (this.startTime.minute - Number(times[1]));
    let diff = '';
    if (minuteDiff < 0 && hourDiff === 0) {
      minuteDiff = minuteDiff * -1;
      diff = '-' + hourDiff + ':' + this.minTwoDigits(minuteDiff);
    } else if (minuteDiff < 0 && hourDiff < 0) {
      minuteDiff = minuteDiff * -1;
      diff = '-' + hourDiff + ':' + this.minTwoDigits(minuteDiff);
    } else if (minuteDiff > 0 && hourDiff < 0) {
      minuteDiff = 60 - minuteDiff;
      hourDiff = hourDiff + 1;
      if (hourDiff === 0) {
        diff = '-' + hourDiff + ':' + this.minTwoDigits(minuteDiff);
      } else {
        diff = hourDiff + ':' + this.minTwoDigits(minuteDiff);
      }
    } else {
      diff = hourDiff + ':' + this.minTwoDigits(minuteDiff);
    }
    return diff;
  }

  minTwoDigits(n: any): any {
    return (n < 10 ? '0' : '') + n;
  }

  validateTimes(): any {
    return true;
  }


}
