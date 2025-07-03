import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CameraService } from '../../services/camera.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Camera, CameraFilter, CameraCategory } from '../../types';

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="container-responsive py-8">
          <div class="breadcrumb-nav">
            <a routerLink="/" class="breadcrumb-item">Home</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Cameras</span>
          </div>
          
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">
            Camera Rentals
          </h1>
          <p class="text-lg text-gray-600">
            Professional cameras and equipment for every project
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="container-responsive py-6">
        <div class="filter-bar">
          <!-- Search -->
          <div class="search-bar">
            <div class="search-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search cameras..."
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
              class="search-input"
            >
          </div>

          <!-- Category Filter -->
          <select 
            [(ngModel)]="selectedCategory" 
            (change)="onFilterChange()"
            class="form-select-modern"
          >
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </option>
          </select>

          <!-- Brand Filter -->
          <select 
            [(ngModel)]="selectedBrand" 
            (change)="onFilterChange()"
            class="form-select-modern"
          >
            <option value="">All Brands</option>
            <option *ngFor="let brand of brands" [value]="brand">
              {{ brand }}
            </option>
          </select>

          <!-- Price Range -->
          <div class="price-range">
            <input
              type="number"
              placeholder="Min Price"
              [(ngModel)]="minPrice"
              (input)="onFilterChange()"
              class="form-input-modern w-24"
            >
            <span class="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max Price"
              [(ngModel)]="maxPrice"
              (input)="onFilterChange()"
              class="form-input-modern w-24"
            >
          </div>

          <!-- Availability Filter -->
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              [(ngModel)]="availableOnly"
              (change)="onFilterChange()"
              class="form-checkbox-modern"
            >
            <span class="text-sm text-gray-700">Available only</span>
          </label>

          <!-- Sort -->
          <select 
            [(ngModel)]="sortBy" 
            (change)="onFilterChange()"
            class="form-select-modern"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        <!-- Active Filters -->
        <div *ngIf="hasActiveFilters()" class="flex flex-wrap gap-2 mt-4">
          <span class="text-sm text-gray-600">Active filters:</span>
          
          <span *ngIf="searchTerm" class="filter-chip active">
            Search: "{{ searchTerm }}"
            <button (click)="clearSearch()" class="ml-2 text-primary-600 hover:text-primary-800">×</button>
          </span>
          
          <span *ngIf="selectedCategory" class="filter-chip active">
            Category: {{ selectedCategory }}
            <button (click)="clearCategory()" class="ml-2 text-primary-600 hover:text-primary-800">×</button>
          </span>
          
          <span *ngIf="selectedBrand" class="filter-chip active">
            Brand: {{ selectedBrand }}
            <button (click)="clearBrand()" class="ml-2 text-primary-600 hover:text-primary-800">×</button>
          </span>
          
          <span *ngIf="minPrice || maxPrice" class="filter-chip active">
            Price: {{ minPrice || 0 }} - {{ maxPrice || '∞' }}
            <button (click)="clearPriceRange()" class="ml-2 text-primary-600 hover:text-primary-800">×</button>
          </span>
          
          <span *ngIf="availableOnly" class="filter-chip active">
            Available only
            <button (click)="clearAvailability()" class="ml-2 text-primary-600 hover:text-primary-800">×</button>
          </span>
          
          <button (click)="clearAllFilters()" class="text-sm text-red-600 hover:text-red-800 underline">
            Clear all
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="container-responsive pb-12">
        <!-- Results Header -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            <span *ngIf="!isLoading">{{ totalResults }} cameras found</span>
            <span *ngIf="isLoading">Loading...</span>
          </p>
          
          <div class="flex items-center space-x-4">
            <!-- View Toggle -->
            <div class="flex border border-gray-300 rounded-lg overflow-hidden">
              <button 
                (click)="viewMode = 'grid'"
                [class]="viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'"
                class="p-2 hover:bg-primary-50 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                (click)="viewMode = 'list'"
                [class]="viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'"
                class="p-2 hover:bg-primary-50 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" [class]="viewMode === 'grid' ? 'grid-responsive' : 'space-y-4'">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="card animate-pulse">
            <div class="skeleton h-48 mb-4"></div>
            <div class="p-4 space-y-3">
              <div class="skeleton-text h-4 w-3/4"></div>
              <div class="skeleton-text h-3 w-1/2"></div>
              <div class="skeleton-text h-3 w-full"></div>
              <div class="flex justify-between items-center">
                <div class="skeleton-text h-4 w-20"></div>
                <div class="skeleton h-8 w-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div 
          *ngIf="!isLoading && viewMode === 'grid'" 
          class="grid-responsive"
        >
          <div 
            *ngFor="let camera of cameras; trackBy: trackByCamera" 
            class="camera-card"
          >
            <div class="relative overflow-hidden">
              <img 
                [src]="camera.images[0]" 
                [alt]="camera.name"
                class="w-full h-48 object-cover"
                loading="lazy"
              >
              <div class="absolute top-4 right-4">
                <span 
                  [class]="camera.availability ? 'badge-success' : 'badge-danger'"
                >
                  {{ camera.availability ? 'Available' : 'Unavailable' }}
                </span>
              </div>
              <div class="absolute top-4 left-4">
                <span class="camera-card-category">{{ camera.category }}</span>
              </div>
            </div>
            
            <div class="camera-card-content">
              <div class="flex justify-between items-start mb-2">
                <h3 class="camera-card-title">{{ camera.name }}</h3>
              </div>
              
              <p class="text-gray-600 text-sm mb-2">{{ camera.brand }} {{ camera.model }}</p>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ camera.description }}</p>
              
              <!-- Features -->
              <div class="flex flex-wrap gap-1 mb-4">
                <span 
                  *ngFor="let feature of camera.features.slice(0, 3)" 
                  class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {{ feature }}
                </span>
                <span 
                  *ngIf="camera.features.length > 3" 
                  class="text-xs text-gray-500"
                >
                  +{{ camera.features.length - 3 }} more
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <div class="camera-card-price">{{ camera.rentPerDay }}/day</div>
                <div class="flex space-x-2">
                  <a 
                    [routerLink]="['/cameras', camera.id]"
                    class="btn-secondary text-sm"
                  >
                    Details
                  </a>
                  <button 
                    *ngIf="camera.availability"
                    (click)="addToCart(camera)"
                    class="btn-primary text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div 
          *ngIf="!isLoading && viewMode === 'list'" 
          class="space-y-4"
        >
          <div 
            *ngFor="let camera of cameras; trackBy: trackByCamera" 
            class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="flex">
              <div class="w-48 h-32 flex-shrink-0">
                <img 
                  [src]="camera.images[0]" 
                  [alt]="camera.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                >
              </div>
              
              <div class="flex-1 p-6">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                      {{ camera.name }}
                    </h3>
                    <p class="text-gray-600">{{ camera.brand }} {{ camera.model }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="camera-card-category">{{ camera.category }}</span>
                    <span 
                      [class]="camera.availability ? 'badge-success' : 'badge-danger'"
                    >
                      {{ camera.availability ? 'Available' : 'Unavailable' }}
                    </span>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ camera.description }}</p>
                
                <!-- Features -->
                <div class="flex flex-wrap gap-1 mb-4">
                  <span 
                    *ngFor="let feature of camera.features.slice(0, 5)" 
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {{ feature }}
                  </span>
                  <span 
                    *ngIf="camera.features.length > 5" 
                    class="text-xs text-gray-500"
                  >
                    +{{ camera.features.length - 5 }} more
                  </span>
                </div>
                
                <div class="flex justify-between items-center">
                  <div class="text-2xl font-bold text-primary-600">{{ camera.rentPerDay }}/day</div>
                  <div class="flex space-x-3">
                    <a 
                      [routerLink]="['/cameras', camera.id]"
                      class="btn-secondary"
                    >
                      View Details
                    </a>
                    <button 
                      *ngIf="camera.availability"
                      (click)="addToCart(camera)"
                      class="btn-primary"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && cameras.length === 0" class="empty-state-container">
          <div class="empty-state-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="empty-state-title">No cameras found</h3>
          <p class="empty-state-description">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <button (click)="clearAllFilters()" class="btn-primary mt-4">
            Clear Filters
          </button>
        </div>

        <!-- Pagination -->
        <div *ngIf="!isLoading && cameras.length > 0 && totalPages > 1" class="pagination mt-12">
          <button 
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="pagination-button"
          >
            Previous
          </button>
          
          <button 
            *ngFor="let page of getPageNumbers()" 
            (click)="goToPage(page)"
            [class]="page === currentPage ? 'pagination-button active' : 'pagination-button'"
          >
            {{ page }}
          </button>
          
          <button 
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CamerasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  cameras: Camera[] = [];
  categories: string[] = [];
  brands: string[] = [];
  
  isLoading = true;
  viewMode: 'grid' | 'list' = 'grid';
  
  // Filters
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  availableOnly = false;
  sortBy = 'name';
  
  // Pagination
  currentPage = 0;
  pageSize = 12;
  totalResults = 0;
  totalPages = 0;

  constructor(
    private cameraService: CameraService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadInitialData();
    this.handleQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadCameras();
      });
  }

  private loadInitialData(): void {
    // Load categories
    this.cameraService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    // Load brands
    this.cameraService.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['brand']) {
        this.selectedBrand = params['brand'];
      }
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      this.loadCameras();
    });
  }

  private loadCameras(): void {
    this.isLoading = true;
  
    const filter: CameraFilter = {
      search: this.searchTerm || undefined,
      category: this.selectedCategory as CameraCategory || undefined,
      brand: this.selectedBrand || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      availability: this.availableOnly || undefined
    };
  
    this.cameraService.getCameras(filter, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('Camera API response:', response);
          this.cameras = this.sortCameras(response.content); // <- fixed here
          this.totalResults = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cameras:', error);
          this.isLoading = false;
          this.notificationService.error('Error', 'Failed to load cameras');
        }
      });
  }
  
  private sortCameras(cameras: Camera[]): Camera[] {
    switch (this.sortBy) {
      case 'price-low':
        return cameras.sort((a, b) => a.rentPerDay - b.rentPerDay);
      case 'price-high':
        return cameras.sort((a, b) => b.rentPerDay - a.rentPerDay);
      case 'newest':
        return cameras.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
      default:
        return cameras.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.updateQueryParams();
    this.loadCameras();
  }

  private updateQueryParams(): void {
    const queryParams: any = {};
    
    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.selectedCategory) queryParams.category = this.selectedCategory;
    if (this.selectedBrand) queryParams.brand = this.selectedBrand;
    if (this.minPrice) queryParams.minPrice = this.minPrice;
    if (this.maxPrice) queryParams.maxPrice = this.maxPrice;
    if (this.availableOnly) queryParams.available = this.availableOnly;
    if (this.sortBy !== 'name') queryParams.sort = this.sortBy;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedCategory || this.selectedBrand || 
             this.minPrice || this.maxPrice || this.availableOnly);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onFilterChange();
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.onFilterChange();
  }

  clearBrand(): void {
    this.selectedBrand = '';
    this.onFilterChange();
  }

  clearPriceRange(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.onFilterChange();
  }

  clearAvailability(): void {
    this.availableOnly = false;
    this.onFilterChange();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.availableOnly = false;
    this.sortBy = 'name';
    this.currentPage = 0;
    this.updateQueryParams();
    this.loadCameras();
  }

  addToCart(camera: Camera): void {
    // For demo purposes, add with default dates (tomorrow for 3 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);

    this.cartService.addToCart(camera, startDate, endDate);
    this.notificationService.showCameraAddedToCart();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCameras();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  trackByCamera(index: number, camera: Camera): string {
    return camera.id;
  }
}