import {Component, Input, OnInit} from '@angular/core';
import {MenuItemInterface} from '../interfaces/MenuItemInterface';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input()item: MenuItemInterface;

  constructor() {}

  ngOnInit(): void {
  }

}
