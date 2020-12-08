import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-loading',
  templateUrl: './menu-loading.component.html',
  styleUrls: ['./menu-loading.component.scss'],
})
export class MenuLoadingComponent implements OnInit {
  // Styles
  sectionTitle = {
    width: '125px',
    height: '25px',
    'border-radius': 0,
  };

  sectionDescription = {
    width: '250px',
    height: '15px',
    'border-radius': 0,
  };

  constructor() {}

  ngOnInit(): void {}
}
