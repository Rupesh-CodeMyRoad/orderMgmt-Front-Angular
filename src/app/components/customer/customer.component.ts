import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  private baseUrl = 'http://localhost:8080/api/public'; // Base URL for API
  customers: any[] = [];
  customer = { id: null, name: '', mobile: '', email: '' };
  isEdit = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Fetch all customers
  loadCustomers() {
    this.isLoading = true;
    this.http
      .get<any[]>(`${this.baseUrl}/getAllList`, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.customers = data;
          this.isLoading = false;
          this.cdr.detectChanges(); // Ensure view is updated
        },
        error: (err) => {
          console.error('Failed to load customers:', err);
          this.errorMessage = 'Error fetching customer data.';
          this.isLoading = false;
        },
      });
  }

  // Save customer (Add or Update)
  saveCustomer() {
    if (this.isEdit) {
      // Update existing customer
      this.http
        .put<any>(`${this.baseUrl}/update/${this.customer.id}`, this.customer, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            this.loadCustomers(); // Reload customers
            this.resetForm();
            alert('Customer updated successfully.');
          },
          error: (err) => {
            console.error('Failed to update customer:', err);
            alert('Error updating customer.');
          },
        });
    } else {
      // Add new customer
      this.http
        .post<any>(`${this.baseUrl}/create`, this.customer, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            this.loadCustomers(); // Reload customers
            this.resetForm();
            alert('Customer added successfully.');
          },
          error: (err) => {
            console.error('Failed to add customer:', err);
            alert('Error adding customer.');
          },
        });
    }
  }

  // Edit customer
  editCustomer(customer: any) {
    this.isEdit = true;
    this.customer = { ...customer }; // Copy customer data into form
  }

  // Delete customer
  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.http
        .delete<void>(`${this.baseUrl}/delete/${id}`, { withCredentials: true })
        .subscribe({
          next: () => {
            this.loadCustomers(); // Reload customers
            alert('Customer deleted successfully.');
          },
          error: (err) => {
            console.error('Failed to delete customer:', err);
            alert('Error deleting customer.');
          },
        });
    }
  }

  // Reset the form
  resetForm() {
    this.customer = { id: null, name: '', mobile: '', email: '' };
    this.isEdit = false;
  }
}
