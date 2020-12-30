import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faQrcode, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import * as confetti from 'canvas-confetti';
import copy from 'copy-to-clipboard';
import { RestaurantPermissionService } from '../../../services/restaurantPermission.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-publish-modal',
  templateUrl: './publish-modal.component.html',
  styleUrls: ['./publish-modal.component.scss'],
})
export class PublishModalComponent implements OnInit {
  @ViewChild('publish') publishModal;
  downloading = false;

  slug: string;
  url: string;

  // Icons
  qrIcon = faQrcode;
  loadingIcon = faSpinner;

  constructor(
    private modalService: NgbModal,
    private restaurantPermissionService: RestaurantPermissionService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.restaurantPermissionService.getSlug().subscribe((slug) => {
      this.slug = slug;
      this.url = `${window.location.origin}/restaurants/${slug}`;
    });
  }

  open(): void {
    this.modalService.open(this.publishModal);
    this.launchFireworks();
  }

  copyMessage(): void {
    copy(this.url);
  }

  downloadQr(): void {
    this.downloading = true;
    this.adminService.generateQR(this.slug).subscribe(() => {
      this.downloading = false;
    });
  }

  launchFireworks(): void {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10001 };

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti.create(undefined, { resize: true, useWorker: true })(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti.create(undefined, { resize: true, useWorker: true })(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }
}
