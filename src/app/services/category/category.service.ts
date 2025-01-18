import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoryUrl = 'http://localhost:8080/api/public/category';
  private subCategoryUrl = 'http://localhost:8080/api/public/category/sub';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryUrl);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.categoryUrl, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.categoryUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoryUrl}/${id}`);
  }

  getSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.subCategoryUrl);
  }

  createSubCategory(subCategory: any): Observable<any> {
    return this.http.post<any>(`${this.subCategoryUrl}`, subCategory, {
      withCredentials: true,
    });
  }

  updateSubCategory(id: number, subCategory: any): Observable<any> {
    return this.http.put<any>(`${this.subCategoryUrl}/${id}`, subCategory);
  }

  deleteSubCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.subCategoryUrl}/${id}`);
  }
}
