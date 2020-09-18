import { Component, Input, OnInit } from '@angular/core';
import { TagInterface } from '../../interfaces/tag-interface';
import { TagService } from '../../services/tag.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  @Input() tag: TagInterface;

  icon: IconDefinition;

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.icon = this.tagService.getTag(this.tag.text);
  }
}
