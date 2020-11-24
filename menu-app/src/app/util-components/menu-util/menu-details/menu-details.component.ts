import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuEditable } from '../../../interfaces/menus-interface';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { faSave } from '@fortawesome/pro-solid-svg-icons';
import {GlobalService} from "../../../services/global.service";

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.scss'],
})
export class MenuDetailsComponent implements OnInit {
  editMode = false;
  @Input() description: string;
  @Output() menuEmitter = new EventEmitter<MenuEditable>();
  editIcon = faPen;
  saveIcon = faSave;

  hasPermission: boolean;

  constructor(private globalService: GlobalService) {}

  ngOnInit(): void {
    this.globalService.hasPermissionObservable.subscribe( hasPermission => this.hasPermission = hasPermission);
  }

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    this.menuEmitter.emit({ description: this.description });
    this.editMode = false;
  }
}
