import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagInterface } from '../../interfaces/tag-interface';
import { TagService } from '../../services/tag.service';
import { TagDisplay } from '../../interfaces/tag-display';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { faSave } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-tagv2',
  templateUrl: './tagv2.component.html',
  styleUrls: ['./tagv2.component.scss']
})
export class Tagv2Component implements OnInit {
  @Input() tag: TagInterface;
  @Input() hasPermission: boolean;
  editIcon = faPen;
  saveIcon = faSave;
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