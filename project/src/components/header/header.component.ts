import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="container-responsive">
        <div class="flex items-center justify-between py-4">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">CameraRentals</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a routerLink="/cameras" routerLinkActive="text-primary-600" class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Cameras
            </a>
            <a routerLink="/categories" routerLinkActive="text-primary-600" class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Categories
            </a>
            <a routerLink="/about" routerLinkActive="text-primary-600" class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
            <a routerLink="/contact" routerLinkActive="text-primary-600" class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Cart -->
            <button 
              *ngIf="isAuthenticated" 
              (click)="toggleCart()"
              class="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8L5 4H2m5 9v6a2 2 0 002 2h2a2 2 0 002-2v-6m-4-5V9a2 2 0 114 0v1"></path>
              </svg>
              <span 
                *ngIf="cartItemCount > 0" 
                class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartItemCount }}
              </span>
            </button>

            <!-- User Menu -->
            <div *ngIf="isAuthenticated; else loginButton" class="relative">
              <button 
                (click)="toggleUserMenu()"
                class="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-medium text-sm">
                    {{ currentUser?.firstName?.charAt(0) }}{{ currentUser?.lastName?.charAt(0) }}
                  </span>
                </div>
                <span class="hidden md:block font-medium">{{ currentUser?.firstName }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- User Dropdown -->
              <div 
                *ngIf="showUserMenu" 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <a routerLink="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Dashboard
                </a>
                <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                <a routerLink="/bookings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Bookings
                </a>
                <div *ngIf="isAdmin" class="border-t border-gray-200 mt-2 pt-2">
                  <a routerLink="/adminPanel" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Admin Panel
                  </a>
                </div>
                <div class="border-t border-gray-200 mt-2 pt-2">
                  <button 
                    (click)="logout()"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <!-- Login Button -->
            <ng-template #loginButton>
              <div class="flex items-center space-x-2">
                <a routerLink="/login" class="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                  Login
                </a>
                <a routerLink="/register" class="btn-primary">
                  Sign Up
                </a>
              </div>
            </ng-template>

            <!-- Mobile Menu Toggle -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg *ngIf="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg *ngIf="showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div 
          *ngIf="showMobileMenu" 
          class="md:hidden border-t border-gray-200 py-4 space-y-2"
        >
          <a routerLink="/cameras" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
            Cameras
          </a>
          <a routerLink="/categories" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
            Categories
          </a>
          <a routerLink="/about" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
            About
          </a>
          <a routerLink="/contact" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
            Contact
          </a>
          
          <div *ngIf="isAuthenticated" class="border-t border-gray-200 pt-4 mt-4">
            <a routerLink="/dashboard" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
              Dashboard
            </a>
            <a routerLink="/profile" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
              Profile
            </a>
            <a routerLink="/bookings" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
              My Bookings
            </a>
            <div>
              <div *ngIf="isAdmin">
              routerLink="adminPanel" class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg">
              nel
              
              </div>
            </div>
            <button 
              (click)="logout()"
              class="w-full text-left px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
            >
              Logout
            </button>
          </div>
          
          <div *ngIf="!isAuthenticated" class="border-t border-gray-200 pt-4 mt-4 flex space-x-2">
            <a routerLink="/login" class="btn-secondary flex-1 text-center">
              Login
            </a>
            <a routerLink="/register" class="btn-primary flex-1 text-center">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      <!-- Cart Sidebar -->
      <div 
        *ngIf="showCart" 
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        (click)="toggleCart()"
      >
        <div 
          class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold">Shopping Cart</h2>
            <button 
              (click)="toggleCart()"
              class="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4">
            <div *ngIf="cartItems.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m.6 8L5 4H2m5 9v6a2 2 0 002 2h2a2 2 0 002-2v-6m-4-5V9a2 2 0 114 0v1"></path>
              </svg>
              <p class="text-gray-500 mb-4">Your cart is empty</p>
              <a routerLink="/cameras" (click)="toggleCart()" class="btn-primary">
                Browse Cameras
              </a>
            </div>
            
            <div *ngIf="cartItems.length > 0" class="space-y-4">
              <div *ngFor="let item of cartItems" class="cart-item">
                <img [src]="item.camera.images[0]" [alt]="item.camera.name" class="cart-item-image">
                <div class="cart-item-details">
                  <h3 class="cart-item-title">{{ item.camera.name }}</h3>
                  <p class="cart-item-price">{{ item.camera.rentPerDay }}/day</p>
                  <p class="cart-item-duration">
                    {{ item.startDate | date:'MMM d' }} - {{ item.endDate | date:'MMM d' }} 
                    ({{ item.days }} days)
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <p class="font-semibold text-gray-900">{{ item.totalCost }}</p>
                  <button 
                    (click)="removeFromCart(item.id)"
                    class="text-red-600 hover:text-red-800 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="cartItems.length > 0" class="border-t border-gray-200 p-4 space-y-4">
            <div class="cart-summary">
              <div class="flex justify-between text-sm">
                <span>Items: {{ cartItems.length }}</span>
                <span>Total Days: {{ getTotalDays() }}</span>
              </div>
              <div class="cart-total">
                <span>Total: {{ getTotalCost() }}</span>
              </div>
            </div>
            <button 
              (click)="proceedToCheckout()"
              class="w-full btn-primary"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isAuthenticated = false;
  currentUser: User | null = null;
  isAdmin = false;
  cartItemCount = 0;
  cartItems: any[] = [];
  
  showUserMenu = false;
  showMobileMenu = false;
  showCart = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isAdmin = this.authService.isAdmin();
      });

    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.cartItemCount = items.length;
      });

    // Close menus when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target || !(event.target as Element).closest('.relative')) {
        this.showUserMenu = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
    if (this.showCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.showMobileMenu = false;
    this.notificationService.showLogoutSuccess();
  }

  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);
    this.notificationService.showCameraRemovedFromCart();
  }

  getTotalCost(): number {
    return this.cartService.getTotalCost();
  }

  getTotalDays(): number {
    return this.cartService.getTotalDays();
  }

  proceedToCheckout(): void {
    this.toggleCart();
    // Navigate to checkout page
    // This would be implemented with router navigation
    this.notificationService.info('Checkout', 'Proceeding to checkout...');
  }
}