import { Component, OnInit } from '@angular/core';
import {EmployeesService} from '../services/employees.service';
import {EmployeeType} from '../data-objects/employeeType';
import {ShiftsService} from '../services/shifts.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  providers: [
    EmployeesService,
    ShiftsService
  ],
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  displayEmployeeModal;
  displayEmployeeTypeModal;
  displayShiftTypeModal;
  displayDeleteModal;
  employees;
  employeeTypes;
  shiftTypes;
  selectedEmployee;
  selectedEmployeeType;
  selectedShiftType;

  constructor(private employeesService: EmployeesService, private shiftsService: ShiftsService) { }

  ngOnInit(): void {
    this.closeModal();
    this.retrieveData();
  }

  retrieveData(): void {
    this.employeesService.getEmployees()
      .subscribe(employees => {
        this.employees = employees;
      });
    this.employeesService.getEmployeeTypes()
      .subscribe(employeeTypes => {
        this.employeeTypes = employeeTypes;
      });
    this.shiftsService.getShiftTypes()
      .subscribe(shiftTypes => {
        this.shiftTypes = shiftTypes;
      });
  }

  createEmployee(): void {
    const employees = [this.selectedEmployee];
    this.employeesService
      .addEmployee(employees)
      .subscribe(location => {
        this.retrieveData();
        this.closeModal();
      });
  }

  createType(): void {
    const types = [this.selectedEmployeeType];
    this.employeesService
      .addEmployeeType(types)
      .subscribe(location => {
        this.retrieveData();
        this.closeModal();
      });
  }

  createShiftType(): void {
    const shiftTypes = [this.selectedShiftType];
    this.shiftsService
      .addShiftTypes(shiftTypes)
      .subscribe(shiftType => {
        this.retrieveData();
        this.closeModal();
      });
  }

  deleteType(): void {
    this.employeesService.deleteEmployeeType(this.selectedEmployeeType.id)
      .subscribe(outcome => {
        this.retrieveData();
        this.closeModal();
      });
  }

  closeModal(): void {
    this.displayEmployeeModal = false;
    this.displayEmployeeTypeModal = false;
    this.displayShiftTypeModal = false;
    this.displayDeleteModal = false;
    this.selectedEmployee = undefined;
    this.selectedEmployeeType = undefined;
  }

  openDeleteModal(employeeType: EmployeeType): void {
    this.selectedEmployeeType = employeeType;
    this.displayDeleteModal = true;
  }

  openEmployeeModal(): void {
    this.displayEmployeeModal = true;
    this.selectedEmployee = {};
  }

  openEmployeeTypeModal(): void {
    this.displayEmployeeTypeModal = true;
    this.selectedEmployeeType = {};
  }

  openShiftTypeModal(): void {
    this.displayShiftTypeModal = true;
    this.selectedShiftType = {};
  }

  toggleEmployeeType(employeeTypeId: string): void {
    if (this.selectedShiftType.eligibileEmployeeTypeIds) {
      const index = this.selectedShiftType.eligibileEmployeeTypeIds.indexOf(employeeTypeId,0);
      if (index > -1) {
        this.selectedShiftType.eligibileEmployeeTypeIds.splice(index, 1);
      } else {
        this.selectedShiftType.eligibileEmployeeTypeIds.push(employeeTypeId);
      }
    } else {
      this.selectedShiftType.eligibileEmployeeTypeIds = [employeeTypeId];
    }
  }
}
