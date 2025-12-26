import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'auth-lib';
import { NotificationService } from '../../services/notification.service';
import { NotificationListComponent } from '../notification-list/notification-list.component';
import { ProfileOverlayComponent } from '../profile-overlay/profile-overlay.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NotificationListComponent, ProfileOverlayComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    router = inject(Router);

    showNotifications = signal(false);
    showProfile = signal(false);

    toggleNotifications() {
        this.showNotifications.update(v => !v);
        if (this.showNotifications()) this.showProfile.set(false);
    }

    toggleProfile() {
        this.showProfile.update(v => !v);
        if (this.showProfile()) this.showNotifications.set(false);
    }
}

