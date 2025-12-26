import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ExpenseType = 'TRAVEL' | 'FOOD' | 'STAY' | 'GENERAL';
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseType;
  date: string;
  status: ExpenseStatus;
  receiptUrl?: string; // Data URL for preview
  travelId?: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private readonly _expenses = signal<Expense[]>([]);

  expenses = this._expenses.asReadonly();

  constructor() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.http.get<Expense[]>('/api/corporate/expenses').subscribe(data => {
      this._expenses.set(data);
    });
  }

  addExpense(expense: Omit<Expense, 'id' | 'status'>) {
    // Basic validation policy: No dupe amount on same day
    const isDuplicate = this.expenses().some(e =>
      e.amount === expense.amount && e.date === expense.date
    );

    if (isDuplicate) {
      alert('Policy Warning: Duplicate expense detected (Same Amount & Date).');
      // For now we just alert, but in real app we might block or flag
    }

    this.http.post<Expense>('/api/corporate/expenses', expense).subscribe(newExpense => {
      this._expenses.update(list => [...list, newExpense]);
    });
  }

  deleteExpense(id: number) {
    this.http.delete(`/api/corporate/expenses/${id}`).subscribe(() => {
      this._expenses.update(list => list.filter(e => e.id !== id));
    });
  }

  getExpense(id: number) {
    return this.http.get<Expense>(`/api/corporate/expenses/${id}`);
  }

  updateExpense(id: number, expense: Partial<Expense>) {
    this.http.put<Expense>(`/api/corporate/expenses/${id}`, expense).subscribe(updated => {
      this._expenses.update(list => list.map(e => e.id === id ? updated : e));
    });
  }

  updateStatus(id: number, status: ExpenseStatus) {
    this.http.put<Expense>(`/api/corporate/expenses/${id}`, { status }).subscribe(updated => {
      this._expenses.update(list => list.map(e => e.id === id ? updated : e));
    });
  }
}
