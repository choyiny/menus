import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuEditable } from '../../../interfaces/menus-interface';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { faSave } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.scss'],
})
export class MenuDetailsComponent implements OnInit {
  editMode = false;
  @Input() description: string;
  @Input() hasPermission: boolean;
  @Output() menuEmitter = new EventEmitter<MenuEditable>();
  editIcon = faPen;
  saveIcon = faSave;

  constructor() {}

  ngOnInit(): void {}

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    this.menuEmitter.emit({ description: this.description });
    this.editMode = false;
  }
}
