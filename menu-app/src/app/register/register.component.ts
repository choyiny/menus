import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FirstMenuComponent} from '../util-components/modals/first-menu/first-menu.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit , AfterViewInit{

  @ViewChild(FirstMenuComponent) registerMenu: FirstMenuComponent;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.registerMenu.open();
  }

}
