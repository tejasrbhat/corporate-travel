import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-notification-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent {
    notificationService = inject(NotificationService);

    onDelete(id: number) {
        this.notificationService.deleteNotification(id);
    }

    onApprove(notif: any) {
        if (notif.requestId) {
            this.notificationService.approveRequest(notif.requestId).subscribe(() => {
                alert('Request Approved!');
                // Auto delete notification after approval
                this.notificationService.deleteNotification(notif.id);
            });
        }
    }
}
