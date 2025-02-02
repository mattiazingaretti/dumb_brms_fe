import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Configuration, CONFIGURATION_PARAMETERS} from "./api/configuration";
import {AuthControllerService} from "./api/api/authController.service";
import {provideHttpClient, withInterceptors} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    AuthControllerService,
    { provide: CONFIGURATION_PARAMETERS, useValue: { basePath: 'http://localhost:8080', withCredentials: true } },
    Configuration,
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([]))
  ]
};
