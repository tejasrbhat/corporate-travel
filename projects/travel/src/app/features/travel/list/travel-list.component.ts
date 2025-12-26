import { RouterLink, Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService } from '../travel.service';
import { AuthService } from 'auth-lib';

@Component({
    selector: 'app-travel-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './travel-list.component.html',
    styleUrls: ['./travel-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelListComponent {
    private router = inject(Router);
    // Wait, import Router first.

    constructor(
        public travelService: TravelService,
        public authService: AuthService
    ) { }

    onDelete(id: number) {
        if (confirm('Are you sure you want to delete this trip?')) {
            this.travelService.deleteTrip(id).subscribe(() => {
                this.travelService.loadTrips(); // Refresh list
            });
        }
    }

    onEdit(plan: any) {
        this.router.navigate(['/travel/edit', plan.id]);
        // Note: TravelService doesn't have router. Component usually has router. 
        // TravelListComponent uses routerLink, but for method navigation we need Router injected.
        // Wait, I should verify if I can just use router link in html or inject router here.
    }
}
