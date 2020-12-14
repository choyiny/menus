import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  faPlus,
  faTrash,
  faUpload,
  faAngleLeft,
  faAngleRight,
  faReply,
  faPencil,
  faCheck
} from '@fortawesome/pro-solid-svg-icons';
import { RestaurantPermissionService } from '../../services/restaurantPermission.service';
import { RestaurantService } from '../../services/restaurant.service';
import { ActivatedRoute } from '@angular/router';
import {Item} from '../../interfaces/restaurant-interfaces';

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

  constructor(
    private rPS: RestaurantPermissionService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
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
    [0, 0, 20, 20, 0],
    [120, 130, 20, 200, 0],
    [60, 80, 50, 320, 0],
    [600, 380, 150, 30, 0],
  ];

  ngAfterViewInit(): void {
    this.context = this.canvasElement.nativeElement.getContext('2d');
    this.fileReader.onload = () => this.loadImage(this.fileReader.result as string);
    setInterval(() => this.canvasRender(), 1000 / 30);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.slug = params.slug);
  }

  loadImage(file: string): void {
    this.image.src = file;

    this.image.onload = () => {
      this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
    };
  }

  uploadImage(event: any): void {
    this.fileReader.readAsDataURL(event.target.files[0]);
  }

  canvasRender(): void {
    // Draw background
    this.context.fillStyle = 'rgba(250, 250, 250)';
    this.context.fillRect(
      -this.offsetX,
      -this.offsetY,
      this.canvasElement.nativeElement.width / this.zoom,
      this.canvasElement.nativeElement.height / this.zoom
    );

    // Draw image
    this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);

    // Draw boxes
    this.boxes.forEach(([x, y, w, h, c]) => {
      this.context.fillStyle = `rgba(${200 * c}, ${50 * c}, 256, 0.3)`;
      this.context.fillRect(x, y, w, h);
    });
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
}
