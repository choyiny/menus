import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-loading',
  templateUrl: './restaurant-loading.component.html',
  styleUrls: ['./restaurant-loading.component.scss'],
})
export class RestaurantLoadingComponent implements OnInit {
  descriptionTheme = {
    'border-radius': '0',
    width: '200px',
    height: '20px',
  };

  headerTheme = {
    'border-radius': '0',
    width: '123px',
    height: '32px',
  };
  constructor() {}

  ngOnInit(): void {}
}
