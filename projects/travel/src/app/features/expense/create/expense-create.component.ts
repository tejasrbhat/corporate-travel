import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ExpenseService, ExpenseType } from '../expense.service';
import { TravelService } from '../../travel/travel.service';

@Component({
  selector: 'app-expense-create',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expense-create.component.html',
  styleUrls: ['./expense-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseCreateComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private travelService = inject(TravelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  expenseId?: number;

  travels = this.travelService.travels;
  travelId = signal<number | null>(null);

  title = signal('');
  amount = signal(0);
  category = signal<ExpenseType>('GENERAL');
  date = signal('');
  receiptUrl = signal('');

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.expenseId = +id;
      this.expenseService.getExpense(this.expenseId).subscribe(expense => {
        if (expense) {
          this.title.set(expense.title);
          this.amount.set(expense.amount);
          this.category.set(expense.category);
          this.date.set(expense.date);
          this.receiptUrl.set(expense.receiptUrl || '');
          if (expense.travelId) this.travelId.set(expense.travelId);
        }
      });
    }
  }

  policyViolation = computed(() => {
    if (this.category() === 'FOOD' && this.amount() > 2000) {
      return 'Max food allowance is ₹2000 per meal.';
    }
    return '';
  });

  onTitleChange(value: string) {
    this.title.set(value);
    this.autoCategorize(value);
  }

  autoCategorize(title: string) {
    const t = title.toLowerCase();
    if (t.includes('flight') || t.includes('ticket') || t.includes('uber') || t.includes('cab')) {
      this.category.set('TRAVEL');
    } else if (t.includes('lunch') || t.includes('dinner') || t.includes('food') || t.includes('burger')) {
      this.category.set('FOOD');
    } else if (t.includes('hotel') || t.includes('stay') || t.includes('airbnb')) {
      this.category.set('STAY');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.receiptUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.policyViolation()) return;

    const expenseData = {
      title: this.title(),
      amount: this.amount(),
      category: this.category(),
      date: this.date(),
      receiptUrl: this.receiptUrl(),
      travelId: this.travelId() ?? undefined
    };

    if (this.isEditMode && this.expenseId) {
      this.expenseService.updateExpense(this.expenseId, expenseData);
    } else {
      this.expenseService.addExpense(expenseData);
    }

    this.router.navigate(['/travel/expenses']);
  }
}
