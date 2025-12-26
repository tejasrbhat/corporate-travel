import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelService } from '../travel.service';
import { AuthService } from 'auth-lib';

@Component({
    selector: 'app-travel-create',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './travel-create.component.html',
    styleUrls: ['./travel-create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelCreateComponent implements OnInit {
    private travelService = inject(TravelService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    isEditMode = false;
    tripId?: number;

    travelForm!: FormGroup;

    ngOnInit() {
        if (!this.authService.isAdmin()) {
            this.router.navigate(['/travel']);
            return;
        }

        this.travelForm = this.fb.group({
            destination: ['', Validators.required],
            description: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            imageUrl: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop']
        });

        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.tripId = +id;
            this.travelService.getTrip(this.tripId).subscribe(trip => {
                this.travelForm.patchValue(trip);
                this.cdr.markForCheck();
            });
        }
    }

    onSubmit() {
        if (this.travelForm.valid) {
            if (this.isEditMode && this.tripId) {
                this.travelService.updateTrip(this.tripId, this.travelForm.value).subscribe(() => {
                    this.router.navigate(['/travel']);
                });
            } else {
                this.travelService.createTrip(this.travelForm.value).subscribe(() => {
                    this.router.navigate(['/travel']);
                });
            }
        }
    }
}
