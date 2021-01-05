import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faImage, faSave, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-change-background',
  templateUrl: './change-background.component.html',
  styleUrls: ['./change-background.component.scss'],
})
export class ChangeBackgroundComponent implements OnInit {
  @Output() restaurantEmitter = new EventEmitter<Restaurant>();
  @Input() slug: string;
  editMode: boolean;
  file: File;

  // icons
  imageIcon = faImage;
  saveIcon = faSave;
  addIcon = faPlus;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {}

  edit(): void {
    this.editMode = true;
  }

  save(): void {
    const formData = new FormData();
    this.editMode = false;
    if (this.file) {
      formData.append('file', this.file);
      this.restaurantService.uploadHeader(this.slug, formData).subscribe((restaurant) => {
        this.restaurantEmitter.emit(restaurant);
      });
    }
  }
  onChange(event): void {
    this.file = event.target.files[0];
    document.getElementById('file-label').innerText = event.target.files[0].name;
  }
}
