import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItemInterface } from '../../interfaces/menu-item-interface';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  editMode: boolean;
  slug: string;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params.slug;
    const user = this.auth.currentUserValue;
    if (user) {
      this.editMode = user.is_admin || this.slug in user.menus;
    } else {
      this.editMode = false;
    }
  }

  onChange(event): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    this.menuService.uploadPhoto(this.slug, this.item.name, formData).subscribe((url) => {
      this.item.image = url;
    });
  }

  showImage(content): void {
    this.modalService.open(content);
  }
}
