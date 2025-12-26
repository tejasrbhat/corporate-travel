import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelService, Trip } from '../travel.service';
import { AuthService } from 'auth-lib';

@Component({
    selector: 'app-trip-booking',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './trip-booking.component.html',
    styleUrl: './trip-booking.component.scss'
})
export class TripBookingComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private travelService = inject(TravelService);
    private authService = inject(AuthService);

    trip = signal<Trip | undefined>(undefined);

    bookingForm = this.fb.group({
        source: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
    });

    constructor() {
        // Load trip details
        this.route.params.subscribe(params => {
            const id = +params['id'];
            // Since we don't have getTrip(id) in service for Mock simplicity, we filter from list
            // Ideally we'd have a getTrip logic
            this.travelService.getTrips().subscribe(trips => {
                const found = trips.find(t => t.id === id);
                if (found) {
                    this.trip.set(found);
                    this.bookingForm.patchValue({
                        startDate: found.startDate,
                        endDate: found.endDate
                    });
                }
            });
        });
    }

    onSubmit() {
        if (this.bookingForm.invalid || !this.trip()) return;

        const bookingRequest = {
            tripId: this.trip()!.id,
            userId: (this.authService.currentUser() as any)?.username || 'unknown',
            ...this.bookingForm.value
        } as any;

        this.travelService.createBooking(bookingRequest).subscribe(res => {
            // Navigate to itinerary or show existing bookings
            alert('Booking Confirmed! Flight: ' + res.flightDetails.flightNumber);
            this.router.navigate(['/travel/itinerary']);
        });
    }
}
