// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { MenuRoutingModule } from './menu-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';

// Components
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { SectionComponent } from './section/section.component';
import { TagsComponent } from './tags/tags.component';
import { ScrollingComponentComponent } from '../util-components/scrolling-component/scrolling-component.component';
import { MobileImageComponent } from '../util-components/menu-util/mobile-image/mobile-image.component';
import { CovidModalComponent } from '../util-components/modals/covid-modal/covid-modal.component';
import { ChangeBackgroundComponent } from '../util-components/menu-util/change-background/change-background.component';
import { MenuNameComponent } from '../util-components/menu-util/menu-name/menu-name.component';
import { MenuDetailsComponent } from '../util-components/menu-util/menu-details/menu-details.component';
import { FooterComponent } from '../util-components/footer/footer.component';
import { ImgFormModalComponent } from '../util-components/modals/img-form-modal/img-form-modal.component';
import { ImgViewModalComponent } from '../util-components/modals/img-view-modal/img-view-modal.component';

@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent,
    SectionComponent,
    TagsComponent,
    ScrollingComponentComponent,
    MobileImageComponent,
    CovidModalComponent,
    ChangeBackgroundComponent,
    MenuNameComponent,
    MenuDetailsComponent,
    FooterComponent,
    ImgViewModalComponent,
    ImgFormModalComponent,
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['link'],
        ],
      },
    }),
  ],
})
export class MenuModule {}
