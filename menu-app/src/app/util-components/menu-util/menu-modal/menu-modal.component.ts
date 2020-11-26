import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Menu } from '../../../interfaces/restaurant-interfaces';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {
  @ViewChild('menuModal') menuModal;
  @Input() menus: Menu[];
  @Input() currentMenu;
  @Output() indexEmitter = new EventEmitter<number>();
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open(): void {
    this.modalService.open(this.menuModal);
  }

  convertTime(time: number): string {
    // convert elapsed seconds to human readable time
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    return `${h % 12}:${m} ${h < 12 ? 'Am' : 'Pm'}`;
  }

  changeMenu(index: number, modal): void {
    modal.close();
    this.indexEmitter.emit(index);
  }
}
