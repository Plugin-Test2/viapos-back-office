import { Component, OnInit } from '@angular/core';
import { LocationsService } from '../services/locations.service';
import { Location } from '../data-objects/location';
import {Section} from '../data-objects/section';
import {SectionsService} from '../services/sections.service';
import {Distribution} from '../data-objects/distribution';
import {DistributionService} from '../services/distribution.service';
import {Assignment} from '../data-objects/assignment';

import Amplify, { Auth } from 'aws-amplify';
import * as AwsConfig from '../config/aws-config';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  providers: [LocationsService,
  SectionsService,
  DistributionService],
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  locations: Location[];
  sections: Section[];
  distributions: Distribution[];
  selectedSections: Section[];
  selectedSection;
  newLocation;
  newDistribution;
  displayDistributionModal;
  displayLocationModal;
  displaySectionModal;
  displayDeleteModal;
  selectedLocation: Location;
  locationString = 'location';
  sectionString = 'section';
  distributionString = 'distribution';
  allString = 'All';
  // tslint:disable-next-line:max-line-length
  constructor(private locationsService: LocationsService, private sectionService: SectionsService, private distributionService: DistributionService) { }

  ngOnInit(): void {
    this.loadData();
    this.closeModal();
    this.displayLocation( {name: this.allString, id: ''});
    Amplify.configure(AwsConfig);
  }

  displayLocation(location: Location): any {
    this.selectedLocation = location;
    this.selectedSections = [];
    if (location.name === this.allString) {
      this.selectedSections = this.sections;
    } else {
      for (const section of this.sections) {
        if (section.locationId === location.id) {
          this.selectedSections.push(section);
        }
      }
    }
  }

  displayAllLocations(): void {
    this.displayLocation( {name: this.allString, id: ''});

  }

  loadData(): void {
    this.locationsService.getLocations()
      .subscribe(locations => (this.locations = locations));
    this.sectionService.getSections()
      .subscribe(sections => {
        this.sections = sections;
        this.selectedSections = sections;
      });
    this.distributionService.getDistributions()
      .subscribe(distributions => (this.distributions = distributions));
  }

  closeModal(): void {
    this.displayLocationModal = false;
    this.displaySectionModal = false;
    this.displayDeleteModal = false;
    this.displayDistributionModal = false;
  }

  openModal(type: string) {
    this.closeModal();
    if (type === this.locationString) {
      this.displayLocationModal = true;
      this.newLocation = new Location();
    } else if (type === this.sectionString) {
      this.displaySectionModal = true;
      this.selectedSection = new Section();
      this.selectedSection.difficulty = 'None';
      // if (this.selectedLocation !== undefined) {
      //   this.selectedSection.locationName = this.selectedLocation;
      // }
    } else if (type === this.distributionString) {
      this.displayDistributionModal = true;
      this.newDistribution = new Distribution();
    }
  }

  createLocation(): void {
    const locations = [];
    locations.push(this.newLocation);
    this.locationsService
      .addLocation(locations)
      .subscribe(location => this.locations.push(this.newLocation));
    this.displayLocationModal = false;
  }

  updateSection(): void {
    const sections = [];
    sections.push(this.selectedSection);
    if (this.selectedSection.id === undefined || this.selectedSection.id.isEmpty) {
      this.sectionService
        .addSection(sections)
        .subscribe(section => {
          this.sections.push(this.selectedSection);
          this.displaySectionModal = false;
        });
    } else {
      this.sectionService
        .updateSection(sections)
        .subscribe(section => {
          this.displaySectionModal = false;
        });
    }
  }

  editSection(section: Section): void {
    this.selectedSection = section;
    this.displaySectionModal = true;
  }

  openDeleteModal(section: Section): void {
    this.selectedSection = section;
    this.displayDeleteModal = true;
  }

  deleteSection(): void {
    this.sectionService
      .deleteSection(this.selectedSection.id).subscribe(outcome => {
        this.loadData();
        this.closeModal();
    });
  }

  addAssignment(): void {
    if (this.newDistribution.assignments) {
      const newGrade = new Assignment();
      newGrade.grade = 'Set Name';
      newGrade.percentage = 'Set Percentage';
      this.newDistribution.assignments.push(newGrade);
    } else {
      const newGrade = new Assignment();
      newGrade.grade = 'Set Name';
      newGrade.percentage = 'Set Percentage';
      this.newDistribution.assignments = [];
      this.newDistribution.assignments.push(newGrade);
    }
  }

  editDistribution(distribution: Distribution): void {
    this.newDistribution = distribution;
    this.displayDistributionModal = true;
  }

  updateDistribution(): void {
    const distributions = [];
    distributions.push(this.newDistribution);
    if (this.newDistribution.id === undefined || this.newDistribution.id.isEmpty) {
      this.distributionService
        .addDistributions(distributions)
        .subscribe(distribution => {
          this.distributions.push(this.newDistribution);
          this.closeModal();
        });
    } else {
      this.distributionService
        .updateDistributions(distributions)
        .subscribe(distribution => {
          this.closeModal();
        });
    }
  }

  deleteDistribution(distribution: Distribution): void {
    this.distributionService
      .deleteDistribution(distribution.id).subscribe(outcome => {
      this.loadData();
      this.closeModal();
    });
  }

}
