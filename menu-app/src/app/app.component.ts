import { APP_INITIALIZER, Component } from '@angular/core';
import { EnvironmentLoaderService } from './services/environment-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: EnvironmentLoaderService) => () =>
        config.loadConfigurations().toPromise(),
      deps: [EnvironmentLoaderService],
      multi: true,
    },
  ],
})
export class AppComponent {
  title = 'menu-app';
}
