import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  subCategories: any[] = [];
  category = {
    id: null as number | null,
    name: '',
    categoryImage: '',
    status: 'ACTIVE',
  };
  subCategory = {
    id: null as number | null,
    name: '',
    category: null,
    status: 'ACTIVE',
  };
  isEdit = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();
  }

  loadCategories() {
    this.categoryService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  loadSubCategories() {
    this.categoryService
      .getSubCategories()
      .subscribe((data) => (this.subCategories = data));
  }

  saveCategory() {
    if (this.isEdit && this.category.id !== null) {
      this.categoryService
        .updateCategory(this.category.id, this.category)
        .subscribe(() => {
          this.loadCategories();
          this.resetCategoryForm();
        });
    } else {
      this.categoryService.createCategory(this.category).subscribe(() => {
        this.loadCategories();
        this.resetCategoryForm();
      });
    }
  }
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  resetCategoryForm() {
    this.category = { id: null, name: '', categoryImage: '', status: 'ACTIVE' };
    this.isEdit = false;
  }

  saveSubCategory() {
    if (this.isEdit && this.subCategory.id !== null) {
      this.categoryService
        .updateSubCategory(this.subCategory.id, this.subCategory)
        .subscribe(() => {
          this.loadSubCategories();
          this.resetSubCategoryForm();
        });
    } else {
      this.categoryService.createSubCategory(this.subCategory).subscribe(() => {
        this.loadSubCategories();
        this.resetSubCategoryForm();
      });
    }
  }
  editCategory(category: any) {
    this.isEdit = true;
    this.category = { ...category };
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
        alert('Category deleted successfully.');
      });
    }
  }

  editSubCategory(subCategory: any) {
    this.isEdit = true;

    // Set the subCategory object for editing
    this.subCategory = {
      id: subCategory.id,
      name: subCategory.name,
      category:
        this.categories.find((cat) => cat.id === subCategory.category?.id) ||
        null, // Find and set the associated category object
      status: subCategory.status,
    };
  }

  deleteSubCategory(id: number) {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.categoryService.deleteSubCategory(id).subscribe(() => {
        this.loadSubCategories();
        alert('Subcategory deleted successfully.');
      });
    }
  }

  resetSubCategoryForm() {
    this.subCategory = { id: null, name: '', category: null, status: 'ACTIVE' };
    this.isEdit = false;
  }
}
