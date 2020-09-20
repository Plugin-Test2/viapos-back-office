import {Route} from './route';

export class RoutePlan {
  id?: string;
  startDate?: string;
  endDate?: string;
  sections?: string[];
  shiftTypes?: string[];
  name?: string;
  routes?: Route[];
}
