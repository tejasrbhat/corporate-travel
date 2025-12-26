import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { LoginComponent } from './core/components/login/login.component';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { authGuard, roleGuard } from 'auth-lib';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'travel',
                loadChildren: () =>
                    loadRemoteModule({
                        type: 'module',
                        remoteEntry: 'http://localhost:4201/remoteEntry.js',
                        exposedModule: './routes',
                    }).then((m) => m.TRAVEL_ROUTES),
            },
            {
                path: 'settings',
                loadComponent: () => import('./core/components/settings/settings.component').then(m => m.SettingsComponent),
                canActivate: [authGuard, roleGuard],
                data: { roles: ['ADMIN'] }
            },
            {
                path: '',
                redirectTo: 'travel',
                pathMatch: 'full'
            }
        ],
    },
];
