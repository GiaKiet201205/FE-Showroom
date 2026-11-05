import {
  bootstrapApplication,
  enableDebugTools,
} from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    enableDebugTools(appRef.components[0]);

    console.log(
      'PROFILER READY:',
      typeof (window as any).ng?.profiler?.timeChangeDetection,
    );
  })
  .catch((err) => console.error(err));
