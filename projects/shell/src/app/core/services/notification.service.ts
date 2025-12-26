import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'auth-lib';
import { Observable, timer, switchMap, of, tap } from 'rxjs';

export interface Notification {
    id: number;
    userId: string;
    message: string;
    read: boolean;
    date: string;
    requestId?: number;
    type?: 'APPROVAL_REQUEST' | 'INFO';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/corporate';

    private _notifications = signal<Notification[]>([]);
    notifications = this._notifications.asReadonly();

    unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

    constructor() {
        this.loadNotifications();
    }

    loadNotifications() {
        if (!this.authService.isAuthenticated()) return;

        const user = this.authService.currentUser() as any;
        if (user) {
            this.http.get<Notification[]>(`${this.apiUrl}/notifications?userId=${user.username}`)
                .subscribe(data => this._notifications.set(data));
        }
    }

    deleteNotification(id: number) {
        this.http.delete(`${this.apiUrl}/notifications/${id}`).subscribe(() => {
            this._notifications.update(list => list.filter(n => n.id !== id));
        });
    }

    requestProfileUpdate(updates: any): Observable<any> {
        const user = this.authService.currentUser() as any;
        if (!user) return of(null);

        return this.http.post(`${this.apiUrl}/profile/update-request`, {
            userId: user.username,
            updates
        });
    }

    approveRequest(requestId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/manager/approve-request/${requestId}`, {}).pipe(
            tap(() => this.loadNotifications())
        );
    }
}
