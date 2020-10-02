import { APP_INITIALIZER, Component } from '@angular/core';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.loadConfigurations().toPromise(),
      deps: [ConfigService],
      multi: true,
    },
  ],
})
export class AppComponent {
  title = 'menu-app';
}
