import { Component, OnInit } from '@angular/core';
import { faMobileAlt } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  mobileIcon = faMobileAlt;

  constructor() {}

  ngOnInit(): void {}
}
