import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faImage, faSave } from '@fortawesome/pro-solid-svg-icons';
import { MenuEditable } from '../../../interfaces/menus-interface';

@Component({
  selector: 'app-change-background',
  templateUrl: './change-background.component.html',
  styleUrls: ['./change-background.component.scss'],
})
export class ChangeBackgroundComponent implements OnInit {
  @Input() hasPermission: boolean;
  @Input() image: any;
  @Output() imageEmitter = new EventEmitter<MenuEditable>();
  editMode: boolean;

  // icons
  imageIcon = faImage;
  saveIcon = faSave;

  constructor() {}

  ngOnInit(): void {}

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    this.imageEmitter.emit({ image: this.image });
    this.editMode = false;
  }
}
