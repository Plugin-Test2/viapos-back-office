import { Component, OnInit } from '@angular/core';
import {NavbarService} from '../services/navbar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  providers: [
    NavbarService
  ],
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(public navbarService: NavbarService) { }

  ngOnInit(): void {
  }

}
