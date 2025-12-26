import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'auth-lib';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    username = signal('');
    password = signal('');
    error = signal('');

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(event: Event) {
        event.preventDefault();
        this.authService.login(this.username(), this.password())
            .subscribe(success => {
                if (success) {
                    this.router.navigate(['/travel']);
                } else {
                    this.error.set('Invalid credentials');
                }
            });
    }
}
