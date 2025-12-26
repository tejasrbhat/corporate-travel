import { Routes } from '@angular/router';
import { ExpenseListComponent } from './list/expense-list.component';
import { ExpenseCreateComponent } from './create/expense-create.component';

export const EXPENSE_ROUTES: Routes = [
  { path: 'list', component: ExpenseListComponent },
  { path: 'create', component: ExpenseCreateComponent },
  { path: 'edit/:id', component: ExpenseCreateComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];