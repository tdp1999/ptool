import { Route } from '@angular/router';
import { ROUTES } from '@shared/data-access';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: ROUTES.INVESTMENT_CALCULATOR,
        pathMatch: 'full',
    },
    {
        path: ROUTES.PLAYGROUND,
        loadComponent: () =>
            import('@modules/playground').then((m) => m.PlaygroundComponent),
    },
    {
        path: ROUTES.INVESTMENT_CALCULATOR,
        loadComponent: () =>
            import('@modules/investment-calculator').then(
                (m) => m.InvestmentCalculatorComponent
            ),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
