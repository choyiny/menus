// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
// import { ModalComponent } from './util-components/modal/modal.component';

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginComponent } from './auth-components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SectionComponent,
    MenuItemComponent,
    FooterComponent,
    TagsComponent,
    // ModalComponent,
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
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
