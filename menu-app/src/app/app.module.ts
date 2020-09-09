import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SectionComponent } from './section/section.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, MenuComponent, SectionComponent, MenuItemComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
