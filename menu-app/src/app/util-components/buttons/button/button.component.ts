import { Component, Input, OnInit } from '@angular/core';
import { faSave, faPen } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() editMode: boolean;
  @Input() hasPermission: boolean;
  @Input() editText = 'Edit';
  @Input() saveText = 'Save';
  saveIcon = faSave;
  editIcon = faPen;

  constructor() {}

  ngOnInit(): void {}
}
