import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { localConfigProviders, thirdPartyProviders } from './app.provider';
import { appRoutes } from './app.routes';
import { maskConfigFunction } from '@shared/core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideEnvironmentNgxMask(maskConfigFunction),
        provideAnimationsAsync(),
        ...thirdPartyProviders,
        ...localConfigProviders,
    ],
};
