import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MenuEditable } from '../../../interfaces/menus-interface';
import { faSave, faPen } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-menu-name',
  templateUrl: './menu-name.component.html',
  styleUrls: ['./menu-name.component.scss'],
})
export class MenuNameComponent implements OnInit {
  constructor() {}

  @Input() name: string;
  @Input() hasPermission: boolean;
  @Output() menuEmitter = new EventEmitter<MenuEditable>();
  editMode = false;

  // icons
  editIcon = faPen;
  saveIcon = faSave;

  ngOnInit(): void {}

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    this.menuEmitter.emit({ name: this.name });
    this.editMode = false;
  }
}
