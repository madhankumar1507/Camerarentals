import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Camera } from '../types';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cartItems = this.storageService.get<CartItem[]>('cart_items') || [];
    this.cartItemsSubject.next(cartItems);
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    this.storageService.set('cart_items', cartItems);
  }

  addToCart(camera: Camera, startDate: Date, endDate: Date): void {
    const days = this.calculateDays(startDate, endDate);
    const totalCost = days * camera.rentPerDay;
    
    const cartItem: CartItem = {
      id: this.generateId(),
      camera,
      startDate,
      endDate,
      totalCost,
      days
    };

    const currentItems = this.cartItemsSubject.value;
    
    // Check if item already exists for the same camera and dates
    const existingItemIndex = currentItems.findIndex(item => 
      item.camera.id === camera.id && 
      item.startDate.getTime() === startDate.getTime() && 
      item.endDate.getTime() === endDate.getTime()
    );

    if (existingItemIndex !== -1) {
      // Item already exists, don't add duplicate
      return;
    }

    const updatedItems = [...currentItems, cartItem];
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  removeFromCart(itemId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  updateCartItem(itemId: string, startDate: Date, endDate: Date): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;

    const item = currentItems[itemIndex];
    const days = this.calculateDays(startDate, endDate);
    const totalCost = days * item.camera.rentPerDay;

    const updatedItem: CartItem = {
      ...item,
      startDate,
      endDate,
      totalCost,
      days
    };

    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = updatedItem;
    
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.length;
  }

  getTotalCost(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.totalCost, 0);
  }

  getTotalDays(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.days, 0);
  }

  isInCart(cameraId: string): boolean {
    return this.cartItemsSubject.value.some(item => item.camera.id === cameraId);
  }

  getCartItem(cameraId: string): CartItem | undefined {
    return this.cartItemsSubject.value.find(item => item.camera.id === cameraId);
  }

  hasDateConflict(cameraId: string, startDate: Date, endDate: Date): boolean {
    return this.cartItemsSubject.value.some(item => {
      if (item.camera.id !== cameraId) return false;
      
      const itemStart = new Date(item.startDate);
      const itemEnd = new Date(item.endDate);
      
      return (startDate < itemEnd && endDate > itemStart);
    });
  }

  validateCartItem(item: CartItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if camera is still available
    if (!item.camera.availability) {
      errors.push('Camera is no longer available');
    }

    // Check if dates are valid
    if (item.startDate >= item.endDate) {
      errors.push('End date must be after start date');
    }

    // Check if start date is in the past
    if (item.startDate < new Date()) {
      errors.push('Start date cannot be in the past');
    }

    // Check minimum rental period (1 day)
    if (item.days < 1) {
      errors.push('Minimum rental period is 1 day');
    }

    // Check maximum rental period (30 days)
    if (item.days > 30) {
      errors.push('Maximum rental period is 30 days');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateCart(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const currentItems = this.cartItemsSubject.value;

    if (currentItems.length === 0) {
      errors.push('Cart is empty');
    }

    // Validate each item
    currentItems.forEach((item, index) => {
      const validation = this.validateCartItem(item);
      if (!validation.isValid) {
        errors.push(`Item ${index + 1}: ${validation.errors.join(', ')}`);
      }
    });

    // Check for conflicts between items
    for (let i = 0; i < currentItems.length; i++) {
      for (let j = i + 1; j < currentItems.length; j++) {
        const item1 = currentItems[i];
        const item2 = currentItems[j];
        
        if (item1.camera.id === item2.camera.id) {
          const start1 = new Date(item1.startDate);
          const end1 = new Date(item1.endDate);
          const start2 = new Date(item2.startDate);
          const end2 = new Date(item2.endDate);
          
          if (start1 < end2 && end1 > start2) {
            errors.push(`Date conflict for ${item1.camera.name}`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  updateCartAfterPriceChange(cameraId: string, newPrice: number): void {
    const currentItems = this.cartItemsSubject.value;
    let updated = false;

    const updatedItems = currentItems.map(item => {
      if (item.camera.id === cameraId) {
        updated = true;
        return {
          ...item,
          camera: { ...item.camera, rentPerDay: newPrice },
          totalCost: item.days * newPrice
        };
      }
      return item;
    });

    if (updated) {
      this.cartItemsSubject.next(updatedItems);
      this.saveCartToStorage(updatedItems);
    }
  }

  removeUnavailableItems(): string[] {
    const currentItems = this.cartItemsSubject.value;
    const unavailableItems: string[] = [];

    const availableItems = currentItems.filter(item => {
      if (!item.camera.availability) {
        unavailableItems.push(item.camera.name);
        return false;
      }
      return true;
    });

    if (unavailableItems.length > 0) {
      this.cartItemsSubject.next(availableItems);
      this.saveCartToStorage(availableItems);
    }

    return unavailableItems;
  }

  getCartSummary(): {
    itemCount: number;
    totalCost: number;
    totalDays: number;
    averageDailyCost: number;
  } {
    const items = this.cartItemsSubject.value;
    const totalCost = this.getTotalCost();
    const totalDays = this.getTotalDays();

    return {
      itemCount: items.length,
      totalCost,
      totalDays,
      averageDailyCost: totalDays > 0 ? totalCost / totalDays : 0
    };
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  private generateId(): string {
    return 'cart-item-' + Math.random().toString(36).substr(2, 9);
  }

  // Persistence methods
  saveCartToFile(): string {
    const cartData = {
      items: this.cartItemsSubject.value,
      savedAt: new Date().toISOString()
    };
    return JSON.stringify(cartData, null, 2);
  }

  loadCartFromFile(jsonData: string): { success: boolean; message: string } {
    try {
      const cartData = JSON.parse(jsonData);
      
      if (!cartData.items || !Array.isArray(cartData.items)) {
        return { success: false, message: 'Invalid cart data format' };
      }

      // Validate each item
      const validItems = cartData.items.filter((item: CartItem) => {
        return item.id && item.camera && item.startDate && item.endDate && item.totalCost;
      });

      if (validItems.length !== cartData.items.length) {
        return { success: false, message: 'Some cart items are invalid' };
      }

      this.cartItemsSubject.next(validItems);
      this.saveCartToStorage(validItems);

      return { success: true, message: 'Cart loaded successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to parse cart data' };
    }
  }

  // Checkout preparation
  prepareCheckout(): {
    items: CartItem[];
    summary: any;
    validation: any;
  } {
    const items = this.cartItemsSubject.value;
    const summary = this.getCartSummary();
    const validation = this.validateCart();

    return {
      items,
      summary,
      validation
    };
  }

  // After successful checkout
  onCheckoutSuccess(): void {
    this.clearCart();
  }

  // Auto-save functionality
  private autoSaveInterval: any;

  startAutoSave(intervalMs: number = 30000): void {
    this.stopAutoSave();
    this.autoSaveInterval = setInterval(() => {
      this.saveCartToStorage(this.cartItemsSubject.value);
    }, intervalMs);
  }

  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSave();
  }
}