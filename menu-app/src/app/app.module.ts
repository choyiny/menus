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

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginComponent } from './auth-components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentLoaderService } from './services/environment-loader.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SectionComponent,
    MenuItemComponent,
    FooterComponent,
    TagsComponent,
    LoginComponent,
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
