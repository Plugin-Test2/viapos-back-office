import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSchedulerComponent } from './route-scheduler.component';

describe('RouteSchedulerComponent', () => {
  let component: RouteSchedulerComponent;
  let fixture: ComponentFixture<RouteSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
