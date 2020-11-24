import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from '../../interfaces/restaurant-interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  @Input() restaurant: Restaurant;
  @Input() slug: string;
  url: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.url = `${window.location.origin}/restaurants/${this.slug}`;
  }

  getUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
