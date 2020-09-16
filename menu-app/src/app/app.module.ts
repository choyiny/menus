// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SectionComponent,
    MenuItemComponent,
    FooterComponent,
    TagsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
