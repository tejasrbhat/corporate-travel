import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['roles'] as string[];

    if (authService.isAuthenticated()) {
        const userRole = authService.currentUser()?.role;
        if (expectedRoles && expectedRoles.includes(userRole || '')) {
            return true;
        }
    }

    return router.createUrlTree(['/']);
};
