// Angular
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

// Routes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { ImageFormComponent } from './util-components/image-form/image-form.component';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { MenuComponent } from './menu-components/menu/menu.component';
import { MenuItemComponent } from './menu-components/menu-item/menu-item.component';
import { SectionComponent } from './menu-components/section/section.component';
import { TagsComponent } from './menu-components/tags/tags.component';
import { ScrollingComponentComponent } from './util-components/scrolling-component/scrolling-component.component';
import { MobileImageComponent } from './util-components/menu-util/mobile-image/mobile-image.component';
import { CovidModalComponent } from './util-components/modals/covid-modal/covid-modal.component';
import { ChangeBackgroundComponent } from './util-components/menu-util/change-background/change-background.component';
import { MenuNameComponent } from './util-components/menu-util/menu-name/menu-name.component';
import { MenuDetailsComponent } from './util-components/menu-util/menu-details/menu-details.component';
import { FooterComponent } from './util-components/footer/footer.component';
import { ImgFormModalComponent } from './util-components/modals/img-form-modal/img-form-modal.component';
import { ImgViewModalComponent } from './util-components/modals/img-view-modal/img-view-modal.component';

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularFireModule } from '@angular/fire';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { RestaurantComponent } from './restaurant-components/restaurant/restaurant.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ImageFormComponent,
    DashboardComponent,
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
    RestaurantComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    LayoutModule,
    ReactiveFormsModule,
    NgbModule,
    ImageCropperModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.settings.firebase),
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
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule { }
