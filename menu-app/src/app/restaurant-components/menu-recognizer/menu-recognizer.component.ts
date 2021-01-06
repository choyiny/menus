import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faPlus,
  faTrash,
  faUpload,
  faAngleLeft,
  faAngleRight,
  faReply,
  faPencil,
} from '@fortawesome/pro-solid-svg-icons';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';
import { RestaurantService } from '../../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import { Menu } from '../../interfaces/restaurant-interfaces';
import { OcrService } from '../../services/ocr.service';
import { Results } from '../../interfaces/result-interface';
import copy from 'copy-to-clipboard';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-menu-recognizer',
  templateUrl: './menu-recognizer.component.html',
  styleUrls: ['./menu-recognizer.component.scss'],
})
export class MenuRecognizerComponent implements AfterViewInit, OnInit {
  // Icons
  plusIcon = faPlus;
  deleteIcon = faTrash;
  uploadIcon = faUpload;
  leftIcon = faAngleLeft;
  rightIcon = faAngleRight;
  transferIcon = faReply;
  editIcon = faPencil;

  slug: string;
  files: File[] = [];
  data: Results[] = [];

  menu: Menu;

  templates = ['grid', 'row'];
  template = 'grid';

  constructor(
    private rPS: RestaurantPermissionService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private ocrService: OcrService,
    private authService: AuthService
  ) {}

  @ViewChild('canvas', { static: true })
  canvasElement: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;
  private fileReader = new FileReader();
  private image = new Image();
  private zoom = 1.0;
  private offsetX = 0.0;
  private offsetY = 0.0;

  isMouseDown = false;

  boxes = [
    /* x, y, w, h, isMouseOver */
  ];

  currentImage = 0;

  nextImage(): void {
    this.currentImage++;
    this.loadImageIfExists();
  }

  loadImageIfExists(): void {
    if (this.data[this.currentImage]) {
      this.fileReader.readAsDataURL(this.files[this.currentImage]);
      this.fileReader.onload = () => this.loadImage(this.fileReader.result as string);
    }
  }

  previousImage(): void {
    this.currentImage--;
    this.loadImageIfExists();
  }

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    this.fileReader.onload = () => this.loadImage(this.fileReader.result as string);
    setInterval(() => this.canvasRender(), 1000 / 30);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params.slug;
      this.rPS.setSlug(this.slug);
      this.restaurantService.getRestaurant(this.slug).subscribe((restaurant) => {
        this.rPS.setRestaurantPermissions(restaurant);
      });
      const user = this.authService.currentUserValue;
      this.rPS.setPermission(user.is_admin || user.restaurants.includes(this.slug));
    });
    this.restaurantService.addMenu(this.slug, { name: 'Menu', sections: [] }).subscribe((menu) => {
      this.menu = menu;
      this.rPS.setMenuName(menu.name);
    });
  }

  addSection(): void {
    this.restaurantService.newSection().subscribe((section) => {
      this.menu.sections.push(section);
      this.restaurantService
        .editMenu(this.slug, this.menu.name, this.menu)
        .subscribe((menu) => (this.menu = menu));
    });
  }

  loadImage(file: string): void {
    this.image.src = file;
    this.image.onload = () => {
      this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    };
  }

  annotateImage(): void {
    this.files.forEach((file, i) => {
      const formData = new FormData();
      formData.append('file', this.files[i]);
      formData.append('template', this.template);
      this.ocrService.recognizeImage(formData).subscribe((data) => {
        data.results = data.results.map((result) => {
          result.bounds = [
            result.bounds[0],
            [result.bounds[1][0] - result.bounds[0][0], result.bounds[1][1] - result.bounds[0][1]],
          ];
          return result;
        });
        this.data[i] = data;
        if (i === this.currentImage) {
          this.fileReader.readAsDataURL(file);
          this.fileReader.onload = () => this.loadImage(this.fileReader.result as string);
        }
      });
    });
  }

  changeTemplate(): void {
    this.data = [];
    this.image.src = '';
    this.annotateImage();
  }

  uploadImage(event: any): void {
    this.files = [...this.files, ...event.target.files];
    this.annotateImage();
  }

  clickUpload(): void {
    document.getElementById('upload-file').click();
  }

  deleteCurrentFile(): void {
    if (this.files) {
      this.files.splice(this.currentImage, 1);
      this.currentImage =
        this.currentImage === this.files.length && this.currentImage !== 0
          ? this.currentImage - 1
          : this.currentImage;
      this.loadImageIfExists();
    }
  }

  transfer(): void {
    this.restaurantService.addMenu(this.slug, this.menu).subscribe((menu) => (this.menu = menu));
  }

  canvasRender(): void {
    // Draw background
    this.context.fillStyle = 'rgba(250, 250, 250)';
    this.context.imageSmoothingEnabled = false;
    this.context.fillRect(
      -this.offsetX,
      -this.offsetY,
      this.canvasElement.nativeElement.width / this.zoom,
      this.canvasElement.nativeElement.height / this.zoom
    );

    // Draw image
    if (this.image.src) {
      this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    }

    // Draw boxes
    if (this.data[this.currentImage]) {
      this.data[this.currentImage].results.forEach((result) => {
        const [x, y, w, h] = [...result.bounds[0], ...result.bounds[1]];
        this.context.strokeStyle = `rgba(${200}, ${50}, 256, 0.3)`;
        this.context.strokeRect(x, y, w, h);
      });
    }
  }

  onWheel(event: any): void {
    // Adapted from https://stackoverflow.com/a/3151987
    event.preventDefault();
    const mouseX = event.clientX - this.canvasElement.nativeElement.offsetLeft;
    const mouseY = event.clientY - this.canvasElement.nativeElement.offsetTop;
    const wheel = Math.sign(-event.deltaY);
    const zoomFactor = Math.exp(wheel * 0.1);
    this.context.translate(-this.offsetX, -this.offsetY);
    this.context.scale(zoomFactor, zoomFactor);
    this.offsetX += mouseX / (this.zoom * zoomFactor) - mouseX / this.zoom;
    this.offsetY += mouseY / (this.zoom * zoomFactor) - mouseY / this.zoom;
    this.context.translate(this.offsetX, this.offsetY);
    this.zoom *= zoomFactor;
  }

  onMove(event: any): void {
    if (!this.isMouseDown) {
      this.onMouseOver(event);
      return;
    }
    const x = event.movementX / this.zoom;
    const y = event.movementY / this.zoom;
    this.context.translate(x, y);
    this.offsetX += x;
    this.offsetY += y;
  }

  onMouseOver(event: any): void {
    const mouseX = event.clientX - this.canvasElement.nativeElement.offsetLeft;
    const mouseY = event.clientY - this.canvasElement.nativeElement.offsetTop;

    const coordinatesRelativeToScreen = this.boxes.map(([x, y, w, h, ...rest]) => [
      (x + this.offsetX) * this.zoom,
      (y + this.offsetY) * this.zoom,
      w * this.zoom,
      h * this.zoom,
      ...rest,
    ]);

    coordinatesRelativeToScreen.forEach(([x, y, w, h], index) => {
      const withinX = x < mouseX && mouseX < x + w;
      const withinY = y < mouseY && mouseY < y + h;

      this.boxes[index][4] = withinX && withinY ? 1 : 0;
    });
  }

  canvasOnClick(event): void {
    const isIntersect = (position: number[], bound: number[][]) => {
      const [x, y] = position;
      const [[x1, y1], [w, h]] = [bound[0], bound[1]];
      return x > x1 && x < x1 + w && y > y1 && y < y1 + h;
    };

    const rect = this.context.canvas.getBoundingClientRect();

    const posX = event.clientX - rect.left - this.offsetX;
    const posY = event.clientY - rect.top - this.offsetY;

    // Sort results based on area, so inner bounding-box is clicked first
    this.data[this.currentImage].results.sort((result1, result2) => {
      const [, [w1, h1]] = result1.bounds;
      const [, [w2, h2]] = result1.bounds;
      return w1 * h1 - w2 * h2;
    });

    if (this.data[this.currentImage]) {
      for (const result of this.data[this.currentImage].results) {
        if (isIntersect([posX, posY], result.bounds)) {
          copy(result.text.join(' '));
          break;
        }
      }
    }
  }

  // Currently unused, show bounding box text on click with zoom enabled
  // testOnClick(event): void {
  //   const isIntersect = (position: number[], bound: number[]) => {
  //     const [x, y] = position;
  //     const [x1, y1, x2, y2] = bound;
  //     return x > x1 && x < x2 && y > y1 && y < y2;
  //   };
  //
  //   const normalizeBounds = (bounds: number[][]) => {
  //     let [[x1, y1], [w, h]] = [bounds[0], bounds[1]];
  //     x1 = (x1 + this.offsetX) * this.zoom;
  //     y1 = (y1 + this.offsetY) * this.zoom;
  //     w = w * this.zoom;
  //     h = h * this.zoom;
  //     return [x1, y1, x1 + w, y1 + h];
  //   };
  //
  //   const rect = this.context.canvas.getBoundingClientRect();
  //
  //   const posX = event.clientX;
  //   const posY = event.clientY;
  //
  //   this.context.fillRect(posX, posY, 10, 10);
  //
  //   if (this.data[this.currentImage]) {
  //     for (const result of this.data[this.currentImage].results) {
  //       if (isIntersect([posX, posY], normalizeBounds(result.bounds))) {
  //         break;
  //       }
  //     }
  //   }
  // }
}
