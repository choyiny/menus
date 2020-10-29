// Angular
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

// Routes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { FooterComponent } from './util-components/footer/footer.component';
import { MenuComponent } from './menu-components/menu/menu.component';
import { SectionComponent } from './menu-components/section/section.component';
import { TagsComponent } from './menu-components/tags/tags.component';
import { MenuItemComponent } from './menu-components/menu-item/menu-item.component';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { ImageFormComponent } from './util-components/image-form/image-form.component';
import { LoginComponent } from './auth-components/login/login.component';
import { ImgViewModalComponent } from './util-components/modals/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from './util-components/modals/img-form-modal/img-form-modal.component';
import { CreateComponent } from './admin-components/create/create.component';
import { AdminDashboardComponent } from './admin-components/admin-dashboard/admin-dashboard.component';
import { MenuDashboardComponent } from './admin-components/menu-dashboard/menu-dashboard.component';

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { QuillModule } from 'ngx-quill';
import { AngularFireModule } from '@angular/fire';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { CovidModalComponent } from './util-components/modals/covid-modal/covid-modal.component';
import { ScrollingComponentComponent } from './util-components/scrolling-component/scrolling-component.component';
import { MenuDetailsComponent } from './util-components/menu-util/menu-details/menu-details.component';
import { MenuNameComponent } from './util-components/menu-util/menu-name/menu-name.component';
import { MobileImageComponent } from './util-components/menu-util/mobile-image/mobile-image.component';
import { ChangeBackgroundComponent } from './util-components/menu-util/change-background/change-background.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SectionComponent,
    MenuItemComponent,
    FooterComponent,
    TagsComponent,
    LoginComponent,
    ImageFormComponent,
    ImgViewModalComponent,
    ImgFormModalComponent,
    DashboardComponent,
    CreateComponent,
    AdminDashboardComponent,
    MenuDashboardComponent,
    CovidModalComponent,
    ScrollingComponentComponent,
    MenuDetailsComponent,
    MenuNameComponent,
    MobileImageComponent,
    ChangeBackgroundComponent,
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
    AngularFireModule.initializeApp(environment.settings.firebase),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
