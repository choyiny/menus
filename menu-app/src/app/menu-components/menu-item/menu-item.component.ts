import { Component, Input, OnInit } from '@angular/core';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() item: MenuItemInterface;
  image: string;
  show: boolean;
  selectedFile;

  constructor(private menuService: MenuService, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onChange(event): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    const id = this.route.snapshot.params.slug;
    this.menuService.uploadPhoto(id, this.item.name, formData).subscribe((url) => {
      this.item.image = url;
    });
  }

  showImage(): void {
    this.show = true;
    console.log(this.show);
  }
}
