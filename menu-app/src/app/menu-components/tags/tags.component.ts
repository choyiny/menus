import { Component, Input, OnInit } from '@angular/core';
import { TagInterface } from '../../interfaces/tag-interface';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  @Input() tag: TagInterface;

  constructor() {}

  ngOnInit(): void {}
}
