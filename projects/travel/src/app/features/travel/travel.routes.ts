import { Routes } from '@angular/router';
import { TravelListComponent } from './list/travel-list.component';
import { TravelCreateComponent } from './create/travel-create.component';
import { TripBookingComponent } from './booking/trip-booking.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { EXPENSE_ROUTES } from '../expense/expense.routes';
import { ProfileComponent } from '../profile/profile.component';

export const TRAVEL_ROUTES: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: TravelListComponent },
    { path: 'create', component: TravelCreateComponent },
    { path: 'edit/:id', component: TravelCreateComponent },
    { path: 'book/:id', component: TripBookingComponent },
    { path: 'itinerary', component: ItineraryComponent },
    {
        path: 'expenses',
        children: EXPENSE_ROUTES
    },
    {
        path: 'profile',
        component: ProfileComponent
    }
];
