import {Component, Input, OnInit} from '@angular/core';
import {Restaurant} from '../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  @Input()restaurant: Restaurant;
  @Input()slug: string;
  url: string;

  constructor() { }

  ngOnInit(): void {
    this.url = 'http://localhost:4200';
    console.log(this.url, 'url');
  }

}
