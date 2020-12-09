import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-loading',
  templateUrl: './restaurant-loading.component.html',
  styleUrls: ['./restaurant-loading.component.scss'],
})
export class RestaurantLoadingComponent implements OnInit {
  descriptionTheme = {
    'border-radius': '0',
    'margin-top': '5px',
    width: '200px',
    height: '25px',
  };

  headerTheme = {
    'border-radius': '0',
    width: '300px',
    height: '40px',
  };
  constructor() {}

  ngOnInit(): void {}
}
