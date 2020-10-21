import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagInterface } from '../../interfaces/tag-interface';
import { TagService } from '../../services/tag.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { TagDisplay } from '../../interfaces/tag-display';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  @Input() tag: TagInterface;
  @Input() hasPermission: boolean;
  tagDisplay: TagDisplay;
  editable = false;
  @Output() outputTagText = new EventEmitter<string>();

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    this.tagDisplay = this.tagService.getTag(this.tag.text);
  }

  onClick(): void {
    this.outputTagText.emit(this.tag.text);
    this.editable = false;
  }

  edit(): void {
    this.editable = true;
  }
}
