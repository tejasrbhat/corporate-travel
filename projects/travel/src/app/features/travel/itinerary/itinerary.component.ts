import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravelService, Booking } from '../travel.service';
import { AuthService } from 'auth-lib';

@Component({
    selector: 'app-itinerary',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './itinerary.component.html',
    styleUrl: './itinerary.component.scss'
})
export class ItineraryComponent {
    private travelService = inject(TravelService);
    bookings = signal<Booking[]>([]);

    constructor() {
        this.travelService.getBookings().subscribe(data => {
            this.bookings.set(data);
        });
        // Ensure trips are loaded
        if (this.travelService.trips().length === 0) {
            this.travelService.loadTrips();
        }
    }

    getDestination(tripId: number): string {
        const trip = this.travelService.trips().find(t => t.id === tripId);
        return trip ? trip.destination : 'Unknown Destination';
    }
}
