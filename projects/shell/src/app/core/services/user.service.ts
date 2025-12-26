import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'auth-lib';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);

    // Expose users as a signal
    readonly users = signal<User[]>([]);

    loadUsers() {
        this.http.get<User[]>('/api/corporate/users').subscribe(data => {
            this.users.set(data);
        });
    }

    createUser(user: User & { password: string }) {
        return this.http.post<User>('/api/corporate/users', user);
    }

    deleteUser(id: number) {
        return this.http.delete(`/api/corporate/users/${id}`);
    }
}
