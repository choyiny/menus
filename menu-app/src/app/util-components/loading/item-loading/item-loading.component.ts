import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-loading',
  templateUrl: './item-loading.component.html',
  styleUrls: ['./item-loading.component.scss'],
})
export class ItemLoadingComponent implements OnInit {
  // Style
  imageIcon = {
    width: '60px',
    height: '60px',
  };

  itemTitle = {
    width: '100px',
    'border-radius': '0',
    height: '15px',
    'margin-bottom': '10px',
  };

  itemPrice = {
    width: '50px',
    'border-radius': '0',
    height: '15px',
    'margin-bottom': '10px',
  };

  itemDescription = {
    width: '250px',
    height: '15px',
    'border-radius': 0,
  };

  constructor() {}

  ngOnInit(): void {}
}
