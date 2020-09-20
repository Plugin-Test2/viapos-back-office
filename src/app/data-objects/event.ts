export class Event {
  id?: string;
  name?: string;
  start?: string;
  end?: string;
  resourceId?: string;
  title?: string;
  reoccurence?: string;
  locationId?: string;
  allowedEmployeeTypes?: string[];
  daysOfWeek?: string[];
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  minEmployeeNbr?: string;
  minShiftsNbr?: string
  startRecur?: string;
  endRecur?: string;
  shiftType?: string;
}
