import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss'],
})
export class ImageFormComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor() {}

  ngOnInit(): void {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }
  imageLoaded(): void {
    // show cropper
    console.log('loaded');
  }
  cropperReady(): void {
    // cropper ready
    console.log('ready');
  }
  loadImageFailed(): void {
    // show message
  }
}
