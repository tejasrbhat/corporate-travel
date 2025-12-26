import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, of, Observable } from 'rxjs';

export type Role = 'ADMIN' | 'EMPLOYEE' | 'MANAGER' | 'USER';

export interface User {
    id: number;
    name: string;
    username: string;
    role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // Mock logged in user - initially null
    readonly currentUser = signal<User | null>(null);

    readonly isAuthenticated = signal(false);

    // Role Helpers
    readonly isAdmin = signal(false);
    readonly isManager = signal(false);
    readonly isUser = signal(false);

    private http = inject(HttpClient);

    constructor() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.setUser(JSON.parse(savedUser));
        }
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post<any>('/api/corporate/auth/login', { username, password })
            .pipe(
                tap((response: any) => {
                    if (response.user) {
                        console.log('Login Response User:', response.user);
                        this.setUser(response.user);
                    }
                }),
                map(() => true),
                catchError(() => of(false))
            );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        this.resetRoles();
    }

    private setUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.isAdmin.set(user.role === 'ADMIN');
        this.isManager.set(user.role === 'MANAGER');
        this.isUser.set(user.role === 'USER' || user.role === 'EMPLOYEE');
        console.log('Roles set - isAdmin:', this.isAdmin(), 'isManager:', this.isManager());
    }

    private resetRoles() {
        this.isAdmin.set(false);
        this.isManager.set(false);
        this.isUser.set(false);
    }

    // Helper for Templates
    hasRole(role: Role): boolean {
        return this.currentUser()?.role === role;
    }
}
