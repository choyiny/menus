import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FirstMenuComponent } from '../util-components/register/first-menu/first-menu.component';
import { SignupComponent } from '../util-components/register/signup/signup.component';
import { Restaurant } from '../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild(FirstMenuComponent) registerMenu: FirstMenuComponent;
  constructor() {}

  restaurant: Restaurant;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.registerMenu.open();
  }
}
