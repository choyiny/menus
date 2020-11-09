import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-next-step',
  templateUrl: './next-step.component.html',
  styleUrls: ['./next-step.component.scss']
})
export class NextStepComponent implements OnInit {

  @Input() cancel: () => void;
  @Input() next: () => void;

  constructor() { }

  ngOnInit(): void {
  }

}
