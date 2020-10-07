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
import { ImgViewModalComponent } from './util-components/img-view-modal/img-view-modal.component';
import { ImgFormModalComponent } from './util-components/img-form-modal/img-form-modal.component';

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentLoaderService } from './services/environment-loader.service';
import { environment } from '../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { QuillModule } from 'ngx-quill';

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
    DragDropModule,
    QuillModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: EnvironmentLoaderService) => () => {
        configService
          .loadConfigurations()
          .toPromise()
          .then((env) => {
            environment.settings = env.settings;
          });
      },
      deps: [EnvironmentLoaderService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
