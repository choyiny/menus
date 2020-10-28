import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPen, faSave } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-change-background',
  templateUrl: './change-background.component.html',
  styleUrls: ['./change-background.component.scss'],
})
export class ChangeBackgroundComponent implements OnInit {
  @Input() hasPermission: boolean;
  @Input() image: any;
  @Output() imageEmitter = new EventEmitter<string>();
  editMode: boolean;

  constructor() {}

  ngOnInit(): void {}

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    this.imageEmitter.emit(this.image);
    this.editMode = false;
  }
}
