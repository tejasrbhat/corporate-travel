import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'auth-lib';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-profile-overlay',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile-overlay.component.html',
    styleUrl: './profile-overlay.component.scss'
})
export class ProfileOverlayComponent {
    authService = inject(AuthService);
    notificationService = inject(NotificationService);
    fb = inject(FormBuilder);

    user = computed(() => this.authService.currentUser());
    isEditing = signal(false);

    editForm = this.fb.group({
        name: ['', Validators.required]
    });

    getInitials() {
        return this.user()?.name?.charAt(0).toUpperCase() || 'U';
    }

    enableEdit() {
        this.editForm.patchValue({ name: this.user()?.name || '' });
        this.isEditing.set(true);
    }

    cancelEdit() {
        this.isEditing.set(false);
    }

    onSubmit() {
        if (this.editForm.valid) {
            const updates = this.editForm.value;
            this.notificationService.requestProfileUpdate(updates).subscribe(() => {
                alert('Profile update requested. Pending manager approval.');
                this.isEditing.set(false);
                // Ideally, close the overlay too
            });
        }
    }

    logout() {
        this.authService.logout();
        location.reload(); // Simple reload to clear state and go to login
    }
}
