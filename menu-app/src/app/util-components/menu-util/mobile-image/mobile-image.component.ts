import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-image',
  templateUrl: './mobile-image.component.html',
  styleUrls: ['./mobile-image.component.scss'],
})
export class MobileImageComponent implements OnInit {
  @Input() name: string;
  @Input() image: string;
  @Input() description: string;

  constructor() {}

  ngOnInit(): void {}
}
