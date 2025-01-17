import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes this service available throughout the app
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/public'; // Base URL for customer-related APIs

  constructor(private http: HttpClient) {}

  /**
   * Fetch all customers
   * @returns Observable<any[]> - List of all customers
   */
  getAllCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, { withCredentials: true });
  }

  /**
   * Fetch a single customer by ID
   * @param id - Customer ID
   * @returns Observable<any> - Customer details
   */
  getCustomerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Create a new customer
   * @param customer - Customer object
   * @returns Observable<any> - Created customer details
   */
  createCustomer(customer: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, customer, {
      withCredentials: true,
    });
  }

  /**
   * Update an existing customer
   * @param id - Customer ID
   * @param customer - Updated customer object
   * @returns Observable<any> - Updated customer details
   */
  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, customer, {
      withCredentials: true,
    });
  }

  /**
   * Delete a customer
   * @param id - Customer ID
   * @returns Observable<void>
   */
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
