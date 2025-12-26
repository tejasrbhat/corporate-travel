import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface TravelPlan {
    id: number;
    destination: string;
    description: string;
    startDate: string;
    durationDays: number;
    imageUrl?: string;
}

export interface Trip {
    id: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
}

export interface Booking {
    id?: number;
    tripId: number;
    userId: string;
    source: string;
    startDate: string;
    endDate: string;
    status?: string; // 'BOOKED'
    bookedAt?: string;
    flightDetails?: any;
}

@Injectable({ providedIn: 'root' })
export class TravelService {
    private http = inject(HttpClient);
    private apiUrl = '/api/corporate';
    private readonly _travels = signal<Trip[]>([]);
    travels = this._travels.asReadonly();

    constructor() {
        this.loadTrips();
    }

    loadTrips() {
        this.getTrips().subscribe(data => this._travels.set(data));
    }

    getTrips(): Observable<Trip[]> {
        return this.http.get<Trip[]>(`${this.apiUrl}/trips`);
    }

    createTrip(trip: Omit<Trip, 'id'>): Observable<Trip> {
        return this.http.post<Trip>(`${this.apiUrl}/trips`, trip).pipe(
            tap(newTrip => this._travels.update(trips => [...trips, newTrip]))
        );
    }

    getTrip(id: number): Observable<Trip> {
        return this.http.get<Trip>(`${this.apiUrl}/trips/${id}`);
    }

    updateTrip(id: number, trip: Partial<Trip>): Observable<Trip> {
        return this.http.put<Trip>(`${this.apiUrl}/trips/${id}`, trip).pipe(
            tap(updatedTrip => {
                this._travels.update(trips => trips.map(t => t.id === id ? updatedTrip : t));
            })
        );
    }

    deleteTrip(id: number): Observable<void> {
        // Note: Mock server might not strictly have delete for trips yet, so we might need to update server.js too
        // or just let it fail if not implemented.
        // Actually, let's assuming I need to implement it in server.js too if I want it to work.
        // But for "Enhance Travel Feature" (User booking), Admin deleting trips wasn't explicitly requested as a "must verify" but good to have.
        // I will add the method.
        return this.http.delete<void>(`${this.apiUrl}/trips/${id}`);
    }

    getBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
    }

    createBooking(booking: Booking): Observable<Booking> {
        return this.http.post<Booking>(`${this.apiUrl}/bookings`, booking);
    }

    get trips() { return this._travels.asReadonly(); } // Expose signal as Trip[]

}
