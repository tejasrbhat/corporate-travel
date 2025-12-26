import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ExpenseService, ExpenseStatus, Expense } from '../expense.service';
import { AuthService } from 'auth-lib';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseListComponent {
  public expenseService = inject(ExpenseService);
  public authService = inject(AuthService);
  private router = inject(Router);

  filter = signal<'ALL' | ExpenseStatus>('ALL');

  filteredExpenses = computed(() => {
    const list = this.expenseService.expenses();
    const currentFilter = this.filter();
    if (currentFilter === 'ALL') return list;
    return list.filter((e: Expense) => e.status === currentFilter);
  });

  onApprove(id: number) {
    if (confirm('Approve this expense?')) {
      this.expenseService.updateStatus(id, 'APPROVED');
    }
  }

  onReject(id: number) {
    if (confirm('Reject this expense?')) {
      this.expenseService.updateStatus(id, 'REJECTED');
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id);
    }
  }

  onEdit(expense: any) {
    this.router.navigate(['/travel/expenses/edit', expense.id]);
  }
}
