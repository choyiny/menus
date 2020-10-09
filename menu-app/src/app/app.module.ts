// Angular
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule } from '@angular/forms';
import { ImgViewModalComponent } from './util-components/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from './util-components/img-form-modal/img-form-modal.component';

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
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
