import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TagService } from '../../services/tag.service';
import { TagDisplay } from '../../interfaces/tag-display';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { faSave } from '@fortawesome/pro-solid-svg-icons';
import { Tag } from '../../interfaces/restaurant-interfaces';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';

@Component({
  selector: 'app-tagv2',
  templateUrl: './tagv2.component.html',
  styleUrls: ['./tagv2.component.scss'],
})
export class Tagv2Component implements OnInit {
  @Input() tag: Tag;
  @Input() editMode: boolean;
  tagDisplay: TagDisplay;
  editIcon = faPen;
  saveIcon = faSave;
  editable = false;
  @Output() outputTagText = new EventEmitter<string>();
  hasPermission: boolean;

  constructor(private tagService: TagService, public globalService: RestaurantPermissionService) {}

  ngOnInit(): void {
    this.globalService.hasPermissionObservable.subscribe(
      (hasPermission) => (this.hasPermission = hasPermission)
    );
    if (this.tag.icon) {
      this.tagDisplay = this.tagService.getTag(this.tag.icon);
    } else if (this.tag.text) {
      this.tagDisplay = this.tagService.getTag(this.tag.text);
    }
  }

  onClick(): void {
    this.outputTagText.emit(this.tag.text);
    this.editable = false;
  }

  edit(): void {
    this.editable = true;
  }
}
