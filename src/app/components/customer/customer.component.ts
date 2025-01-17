import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customers: any[] = []; // Array to hold customer data
  customer = { id: null, name: '', mobile: '', email: '' }; // Object for form binding
  isEdit = false; // Flag to track whether in edit mode

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Fetch all customers
  loadCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Failed to load customers:', err);
        alert('Error fetching customer data.');
      },
    });
  }

  // Save customer (Add or Update)
  saveCustomer() {
    if (this.isEdit) {
      // Update existing customer
      this.customerService
        .updateCustomer(this.customer.id!, this.customer)
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
      this.customerService.createCustomer(this.customer).subscribe({
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
      this.customerService.deleteCustomer(id).subscribe({
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
