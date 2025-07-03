import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CameraService } from '../../services/camera.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Camera } from '../../types';

@Component({
  selector: 'app-camera-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50" *ngIf="camera">
      <!-- Breadcrumb -->
      <div class="bg-white shadow-sm">
        <div class="container-responsive py-4">
          <div class="breadcrumb-nav">
            <a routerLink="/" class="breadcrumb-item">Home</a>
            <span class="breadcrumb-separator">/</span>
            <a routerLink="/cameras" class="breadcrumb-item">Cameras</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ camera.name }}</span>
          </div>
        </div>
      </div>

      <div class="container-responsive py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Image Gallery -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="image-gallery-main">
              <img 
                [src]="selectedImage" 
                [alt]="camera.name"
                class="w-full h-full object-cover"
              >
            </div>
            
            <!-- Thumbnails -->
            <div class="image-gallery-thumbnails">
              <button
                *ngFor="let image of camera.images; let i = index"
                (click)="selectImage(image)"
                [class]="selectedImage === image ? 'image-gallery-thumbnail active' : 'image-gallery-thumbnail'"
              >
                <img 
                  [src]="image" 
                  [alt]="camera.name + ' - Image ' + (i + 1)"
                  class="w-full h-full object-cover"
                >
              </button>
            </div>
          </div>

          <!-- Camera Details -->
          <div class="space-y-6">
            <!-- Header -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="camera-card-category">{{ camera.category }}</span>
                <span 
                  [class]="camera.availability ? 'badge-success' : 'badge-danger'"
                >
                  {{ camera.availability ? 'Available' : 'Unavailable' }}
                </span>
              </div>
              
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {{ camera.name }}
              </h1>
              
              <p class="text-xl text-gray-600 mb-4">
                {{ camera.brand }} {{ camera.model }}
              </p>
              
              <div class="text-3xl font-bold text-primary-600 mb-6">
                {{ camera.rentPerDay }}<span class="text-lg text-gray-600">/day</span>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p class="text-gray-600 leading-relaxed">{{ camera.description }}</p>
            </div>

            <!-- Features -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Features</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div 
                  *ngFor="let feature of camera.features"
                  class="flex items-center space-x-2"
                >
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Rental Form -->
            <div *ngIf="camera.availability" class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Rental Details</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input
                    type="date"
                    [(ngModel)]="startDate"
                    [min]="minDate"
                    (change)="calculateTotal()"
                    class="form-input-modern"
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">End Date</label>
                  <input
                    type="date"
                    [(ngModel)]="endDate"
                    [min]="startDate || minDate"
                    (change)="calculateTotal()"
                    class="form-input-modern"
                  >
                </div>
              </div>

              <div *ngIf="rentalDays > 0" class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Rental Period:</span>
                  <span>{{ rentalDays }} days</span>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Daily Rate:</span>
                  <span>{{ camera.rentPerDay }}</span>
                </div>
                <div class="border-t border-gray-200 pt-2">
                  <div class="flex justify-between items-center text-lg font-semibold text-gray-900">
                    <span>Total Cost:</span>
                    <span>{{ totalCost }}</span>
                  </div>
                </div>
              </div>

              <button 
                (click)="addToCart()"
                [disabled]="!canAddToCart()"
                class="w-full btn-primary text-lg py-3"
              >
                <span *ngIf="!isInCart">Add to Cart</span>
                <span *ngIf="isInCart">Update Cart</span>
              </button>
              
              <p *ngIf="!canAddToCart() && startDate && endDate" class="text-red-600 text-sm mt-2">
                Please select valid rental dates.
              </p>
            </div>

            <!-- Unavailable Message -->
            <div *ngIf="!camera.availability" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-800 font-medium">Currently Unavailable</span>
              </div>
              <p class="text-red-700 text-sm mt-1">
                This camera is currently out of stock. Please check back later or contact us for availability updates.
              </p>
            </div>

            <!-- Stock Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-blue-800 font-medium">Stock Information</span>
              </div>
              <p class="text-blue-700 text-sm mt-1">
                {{ camera.stockQuantity }} units available for rental
              </p>
            </div>
          </div>
        </div>

        <!-- Specifications -->
        <div class="mt-12">
          <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Specifications</h2>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Brand:</span>
                      <span class="text-gray-900">{{ camera.brand }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Model:</span>
                      <span class="text-gray-900">{{ camera.model }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Category:</span>
                      <span class="text-gray-900">{{ camera.category }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Daily Rate:</span>
                      <span class="text-gray-900">{{ camera.rentPerDay }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Availability</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Status:</span>
                      <span [class]="camera.availability ? 'text-green-600' : 'text-red-600'">
                        {{ camera.availability ? 'Available' : 'Unavailable' }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Stock:</span>
                      <span class="text-gray-900">{{ camera.stockQuantity }} units</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Added:</span>
                      <span class="text-gray-900">{{ camera.createdAt | date:'mediumDate' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Updated:</span>
                      <span class="text-gray-900">{{ camera.updatedAt | date:'mediumDate' }}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-900 mb-2">Key Features</h4>
                  <div class="space-y-1">
                    <div 
                      *ngFor="let feature of camera.features.slice(0, 5)"
                      class="flex items-center space-x-2 text-sm"
                    >
                      <svg class="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="text-gray-700">{{ feature }}</span>
                    </div>
                    <div *ngIf="camera.features.length > 5" class="text-sm text-gray-500 ml-5">
                      +{{ camera.features.length - 5 }} more features
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Cameras -->
        <div class="mt-12" *ngIf="relatedCameras.length > 0">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Related Cameras</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              *ngFor="let relatedCamera of relatedCameras" 
              class="camera-card"
            >
              <div class="relative overflow-hidden">
                <img 
                  [src]="relatedCamera.images[0]" 
                  [alt]="relatedCamera.name"
                  class="w-full h-48 object-cover"
                  loading="lazy"
                >
                <div class="absolute top-4 right-4">
                  <span 
                    [class]="relatedCamera.availability ? 'badge-success' : 'badge-danger'"
                  >
                    {{ relatedCamera.availability ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
              </div>
              
              <div class="camera-card-content">
                <h3 class="camera-card-title">{{ relatedCamera.name }}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ relatedCamera.description }}</p>
                
                <div class="flex justify-between items-center">
                  <div class="camera-card-price">{{ relatedCamera.rentPerDay }}/day</div>
                  <a 
                    [routerLink]="['/cameras', relatedCamera.id]"
                    class="btn-primary text-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="loader mx-auto mb-4"></div>
        <p class="text-gray-600">Loading camera details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="error-state-container">
        <div class="error-state-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="error-state-title">Camera Not Found</h3>
        <p class="error-state-description">{{ error }}</p>
        <a routerLink="/cameras" class="btn-primary mt-4">
          Browse Cameras
        </a>
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
export class CameraDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  camera: Camera | null = null;
  relatedCameras: Camera[] = [];
  selectedImage = '';
  isLoading = true;
  error = '';
  
  // Rental form
  startDate = '';
  endDate = '';
  rentalDays = 0;
  totalCost = 0;
  minDate = '';
  isInCart = false;

  constructor(
    private route: ActivatedRoute,
    private cameraService: CameraService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const cameraId = params['id'];
        if (cameraId) {
          this.loadCamera(cameraId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCamera(id: string): void {
    this.isLoading = true;
    this.error = '';
    
    this.cameraService.getCameraById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.camera = response.data;
          this.selectedImage = this.camera.images[0];
          this.checkIfInCart();
          this.loadRelatedCameras();
        } else {
          this.error = response.error || 'Camera not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading camera:', error);
        this.error = 'Failed to load camera details';
        this.isLoading = false;
      }
    });
  }

  private loadRelatedCameras(): void {
    if (!this.camera) return;
    
    this.cameraService.getCamerasByCategory(this.camera.category).subscribe({
      next: (cameras) => {
        this.relatedCameras = cameras
          .filter(c => c.id !== this.camera!.id && c.availability)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related cameras:', error);
      }
    });
  }

  private checkIfInCart(): void {
    if (this.camera) {
      this.isInCart = this.cartService.isInCart(this.camera.id);
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  calculateTotal(): void {
    if (this.startDate && this.endDate && this.camera) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      if (end > start) {
        this.rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        this.totalCost = this.rentalDays * this.camera.rentPerDay;
      } else {
        this.rentalDays = 0;
        this.totalCost = 0;
      }
    } else {
      this.rentalDays = 0;
      this.totalCost = 0;
    }
  }

  canAddToCart(): boolean {
    return !!(this.camera && this.startDate && this.endDate && 
             this.rentalDays > 0 && this.camera.availability);
  }

  addToCart(): void {
    if (!this.canAddToCart() || !this.camera) return;
    
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    
    // Check for date conflicts
    if (this.cartService.hasDateConflict(this.camera.id, startDate, endDate)) {
      this.notificationService.warning(
        'Date Conflict', 
        'You already have this camera in your cart for overlapping dates.'
      );
      return;
    }
    
    this.cartService.addToCart(this.camera, startDate, endDate);
    this.isInCart = true;
    this.notificationService.showCameraAddedToCart();
  }
}