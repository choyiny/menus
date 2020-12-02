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
import { ImageFormComponent } from './util-components/image-util/image-form/image-form.component';
import { LoginComponent } from './auth-components/login/login.component';
import { DashboardComponent } from './auth-components/dashboard/dashboard.component';
import { ScrollingComponentComponent } from './util-components/menu-util/scrolling-component/scrolling-component.component';
import { MobileImageComponent } from './util-components/menu-util/mobile-image/mobile-image.component';
import { CovidModalComponent } from './util-components/covid-modal/covid-modal.component';
import { ChangeBackgroundComponent } from './util-components/menu-util/change-background/change-background.component';
import { MenuNameComponent } from './util-components/menu-util/menu-name/menu-name.component';
import { MenuDetailsComponent } from './util-components/menu-util/menu-details/menu-details.component';
import { FooterComponent } from './util-components/footer/footer.component';
import { ImgFormModalComponent } from './util-components/image-util/img-form-modal/img-form-modal.component';
import { ImgViewModalComponent } from './util-components/image-util/img-view-modal/img-view-modal.component';
import { Itemv2Component } from './restaurant-components/itemv2/itemv2.component';
import { Sectionv2Component } from './restaurant-components/sectionv2/sectionv2.component';
import { Menuv2Component } from './restaurant-components/menuv2/menuv2.component';
import { Tagv2Component } from './restaurant-components/tagv2/tagv2.component';
import { SignupComponent } from './util-components/register/signup/signup.component';
import { FirstMenuComponent } from './util-components/register/first-menu/first-menu.component';
import { RegisterComponent } from './register/register.component';
import { PreviewComponent } from './restaurant-components/preview/preview.component';
import { MenuRecognizerComponent } from './restaurant-components/menu-recognizer/menu-recognizer.component';

// NPM packages
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularFireModule } from '@angular/fire';
import { CDK_DRAG_CONFIG, DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { RestaurantComponent } from './restaurant-components/restaurant/restaurant.component';
import { VerificationComponent } from './auth-components/verification/verification.component';
import { ManageSectionsComponent } from './control-panel/manage-sections/manage-sections.component';
import { CollapsedSectionComponent } from './control-panel/collapsed-section/collapsed-section.component';
import { NavbarComponent } from './util-components/navbar/navbar.component';
import { HomeComponent } from './restaurant-components/home/home.component';
import { MenuModalComponent } from './util-components/menu-util/menu-modal/menu-modal.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuLoadingComponent } from './util-components/loading/menu-loading/menu-loading.component';
import { RestaurantLoadingComponent } from './util-components/loading/restaurant-loading/restaurant-loading.component';
import { ItemLoadingComponent } from './util-components/loading/item-loading/item-loading.component';
import { PublishModalComponent } from './util-components/register/publish-modal/publish-modal.component';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ImageFormComponent,
    DashboardComponent,
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
    Itemv2Component,
    Sectionv2Component,
    Menuv2Component,
    Tagv2Component,
    SignupComponent,
    FirstMenuComponent,
    RegisterComponent,
    VerificationComponent,
    ManageSectionsComponent,
    CollapsedSectionComponent,
    NavbarComponent,
    HomeComponent,
    PreviewComponent,
    MenuModalComponent,
    MenuLoadingComponent,
    RestaurantLoadingComponent,
    ItemLoadingComponent,
    PublishModalComponent,
    MenuRecognizerComponent,
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
    NgxSkeletonLoaderModule.forRoot(),
    MatBottomSheetModule,
    DragDropModule,
    MatTooltipModule,
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
    MatListModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: CDK_DRAG_CONFIG, useValue: DragConfig },
    {
      provide: 'externalUrlRedirectResolver',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        window.location.href = (route.data as any).externalUrl;
      },
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [MenuModalComponent],
})
export class AppModule {}
