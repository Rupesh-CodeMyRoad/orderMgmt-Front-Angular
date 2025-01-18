import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { CustomerService } from '../../services/customer/customer.service';
import { CategoryService } from '../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  customers: any[] = [];
  categories: any[] = [];
  order = {
    id: null,
    customer: { id: null },
    services: [] as number[],
    totalBill: 0,
    message: '',
  };
  isEdit = false;
  loading = false; // Add loading state

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private categoryService: CategoryService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadCustomers();
    this.loadCategories();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  loadOrders() {
    this.orderService.getOrders().subscribe((data) => {
      this.orders = data.map((order) => ({
        ...order,
        serviceNames: this.getServiceNames(order.services), // Add a `serviceNames` property
      }));
    });
  }

  loadCustomers() {
    this.customerService
      .getCustomers()
      .subscribe((data) => (this.customers = data));
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data
        .filter((category: any) => category.status === 'ACTIVE')
        .map((category: any) => ({
          id: category.id,
          name: category.name,
        }));
    });
  }

  onCheckboxChange(event: Event, serviceId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleService(serviceId, isChecked);
  }

  toggleService(serviceId: number, isChecked: boolean) {
    if (isChecked) {
      this.order.services.push(serviceId);
    } else {
      this.order.services = this.order.services.filter(
        (id) => id !== serviceId
      );
    }
  }

  saveOrder() {
    this.loading = true; // Show loading message
    const orderPayload = {
      id: this.order.id,
      customerId: Number(this.order.customer.id),
      services: this.order.services,
      totalBill: this.order.totalBill,
      message: this.order.message,
    };

    if (this.isEdit && this.order.id !== null) {
      this.orderService.updateOrder(this.order.id, orderPayload).subscribe({
        next: () => {
          this.loadOrders();
          this.resetOrderForm(); // Clear form and selections
          this.loading = false; // Hide loading message
          alert('Order updated successfully.');
        },
        error: () => (this.loading = false), // Hide loading message on error
      });
    } else {
      this.orderService.createOrder(orderPayload).subscribe({
        next: () => {
          this.loadOrders();
          this.resetOrderForm(); // Clear form and selections
          this.loading = false; // Hide loading message
          alert('Order created successfully.');
        },
        error: () => (this.loading = false), // Hide loading message on error
      });
    }
  }

  editOrder(order: any) {
    this.isEdit = true;

    this.order = {
      id: order.id,
      customer: { id: order.customer?.id || null },
      services: [...order.services],
      totalBill: order.totalBill,
      message: order.message,
    };

    this.updateServiceCheckboxes();
  }

  getServiceNames(serviceIds: number[]): string {
    if (!this.categories || this.categories.length === 0) {
      return ''; // If categories are not loaded yet, return empty
    }

    return serviceIds
      .map((serviceId) => {
        const category = this.categories.find(
          (category) => category.id === serviceId
        );
        return category ? category.name : '';
      })
      .filter((name) => name) // Remove empty or undefined names
      .join(', ');
  }

  updateServiceCheckboxes() {
    this.categories.forEach((category) => {
      const isChecked = this.order.services.includes(category.id);
      const checkbox = document.querySelector(
        `input[type="checkbox"][value="${category.id}"]`
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = isChecked;
      }
    });
  }

  deleteOrder(id: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe(() => {
        this.loadOrders();
        alert('Order deleted successfully.');
      });
    }
  }

  navigateTopdfDownlaod() {
    this.http
      .get('http://localhost:8080/api/public/download-order-customer-pdf', {
        responseType: 'blob', // Expect a Blob (binary file)
        withCredentials: true,
      })
      .subscribe({
        next: (blob) => {
          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Order_Customer.pdf'; // Set the file name
          a.click();
          window.URL.revokeObjectURL(url); // Cleanup
        },
        error: () => {
          alert('Failed to export the user list.');
        },
      });
  }

  resetOrderForm() {
    this.order = {
      id: null,
      customer: { id: null },
      services: [],
      totalBill: 0,
      message: '',
    };
    this.isEdit = false;

    // Clear all checkboxes
    this.categories.forEach((category) => {
      const checkbox = document.querySelector(
        `input[type="checkbox"][value="${category.id}"]`
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = false;
      }
    });

    // Reset dropdown selection
    const customerDropdown = document.querySelector(
      '#customer'
    ) as HTMLSelectElement;
    if (customerDropdown) {
      customerDropdown.selectedIndex = 0;
    }
  }
}
