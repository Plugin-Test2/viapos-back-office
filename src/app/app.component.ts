import {Component, ViewEncapsulation} from '@angular/core';
import {NavbarService} from './services/navbar.service';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    NavbarService
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'via-back-office';
}
