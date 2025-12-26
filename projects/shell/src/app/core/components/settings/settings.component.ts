import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from 'auth-lib';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  userService = inject(UserService);
  private fb = inject(FormBuilder);

  showForm = signal(false);

  userForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['USER', Validators.required]
  });

  constructor() {
    this.userService.loadUsers();
  }

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.userForm.reset({ role: 'USER' });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      this.userService.createUser(formValue as any).subscribe({
        next: (newUser) => {
          // Reload users to refresh list
          this.userService.loadUsers();
          this.toggleForm();
          alert('User created successfully');
        },
        error: (err) => {
          alert('Error creating user: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.userService.loadUsers();
      });
    }
  }
}
