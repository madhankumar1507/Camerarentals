import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationMessage } from '../types';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private autoHideTimeouts: Map<string, any> = new Map();

  constructor() {}

  show(
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    autoHide: boolean = true,
    duration: number = 5000
  ): string {
    const notification: NotificationMessage = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    if (autoHide) {
      const timeout = setTimeout(() => {
        this.remove(notification.id);
      }, duration);
      this.autoHideTimeouts.set(notification.id, timeout);
    }

    return notification.id;
  }

  success(title: string, message: string, autoHide: boolean = true): string {
    return this.show('success', title, message, autoHide);
  }

  error(title: string, message: string, autoHide: boolean = false): string {
    return this.show('error', title, message, autoHide);
  }

  warning(title: string, message: string, autoHide: boolean = true): string {
    return this.show('warning', title, message, autoHide);
  }

  info(title: string, message: string, autoHide: boolean = true): string {
    return this.show('info', title, message, autoHide);
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);

    // Clear auto-hide timeout if exists
    if (this.autoHideTimeouts.has(id)) {
      clearTimeout(this.autoHideTimeouts.get(id));
      this.autoHideTimeouts.delete(id);
    }
  }

  clear(): void {
    this.notificationsSubject.next([]);
    
    // Clear all auto-hide timeouts
    this.autoHideTimeouts.forEach(timeout => clearTimeout(timeout));
    this.autoHideTimeouts.clear();
  }

  markAsRead(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });
    this.notificationsSubject.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notificationsSubject.next(updatedNotifications);
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  getNotifications(): NotificationMessage[] {
    return this.notificationsSubject.value;
  }

  private generateId(): string {
    return 'notification-' + Math.random().toString(36).substr(2, 9);
  }

  // Bulk operations
  removeAll(): void {
    this.clear();
  }

  removeByType(type: 'success' | 'error' | 'warning' | 'info'): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.type !== type);
    this.notificationsSubject.next(updatedNotifications);
  }

  removeOldNotifications(olderThanMinutes: number = 60): void {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - olderThanMinutes);

    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.timestamp > cutoffTime);
    this.notificationsSubject.next(updatedNotifications);
  }

  // Toast-like notifications with predefined messages
  showLoginSuccess(): void {
    this.success('Welcome!', 'You have successfully logged in.');
  }

  showLoginError(): void {
    this.error('Login Failed', 'Invalid email or password. Please try again.');
  }

  showLogoutSuccess(): void {
    this.success('Goodbye!', 'You have been logged out successfully.');
  }

  showRegistrationSuccess(): void {
    this.success('Account Created!', 'Your account has been created successfully.');
  }

  showRegistrationError(): void {
    this.error('Registration Failed', 'There was an error creating your account. Please try again.');
  }

  showBookingSuccess(): void {
    this.success('Booking Confirmed!', 'Your booking has been submitted successfully.');
  }

  showBookingError(): void {
    this.error('Booking Failed', 'There was an error processing your booking. Please try again.');
  }

  showCameraAddedToCart(): void {
    this.success('Added to Cart!', 'The camera has been added to your cart.');
  }

  showCameraRemovedFromCart(): void {
    this.info('Removed from Cart', 'The camera has been removed from your cart.');
  }

  showProfileUpdated(): void {
    this.success('Profile Updated!', 'Your profile has been updated successfully.');
  }

  showPasswordChanged(): void {
    this.success('Password Changed!', 'Your password has been changed successfully.');
  }

  showEmailSent(): void {
    this.success('Email Sent!', 'A confirmation email has been sent to your inbox.');
  }

  showConnectionError(): void {
    this.error('Connection Error', 'Unable to connect to the server. Please check your internet connection.');
  }

  showMaintenanceMode(): void {
    this.warning('Maintenance Mode', 'The system is currently under maintenance. Some features may be unavailable.');
  }

  showSessionExpired(): void {
    this.warning('Session Expired', 'Your session has expired. Please log in again.');
  }

  showFeatureNotAvailable(): void {
    this.info('Feature Not Available', 'This feature is not available in your current plan.');
  }

  showMaxItemsReached(): void {
    this.warning('Limit Reached', 'You have reached the maximum number of items allowed.');
  }

  showDataSaved(): void {
    this.success('Data Saved!', 'Your changes have been saved successfully.');
  }

  showDataRestored(): void {
    this.success('Data Restored!', 'Your data has been restored successfully.');
  }

  showBackupCreated(): void {
    this.success('Backup Created!', 'A backup of your data has been created.');
  }

  showImportSuccess(): void {
    this.success('Import Successful!', 'Your data has been imported successfully.');
  }

  showExportSuccess(): void {
    this.success('Export Successful!', 'Your data has been exported successfully.');
  }

  showPermissionDenied(): void {
    this.error('Permission Denied', 'You do not have permission to perform this action.');
  }

  showInvalidData(): void {
    this.error('Invalid Data', 'The data you provided is invalid. Please check and try again.');
  }

  showNetworkError(): void {
    this.error('Network Error', 'A network error occurred. Please try again later.');
  }

  showUnexpectedError(): void {
    this.error('Unexpected Error', 'An unexpected error occurred. Please try again or contact support.');
  }

  // Persistent notifications (don't auto-hide)
  showPersistentInfo(title: string, message: string): string {
    return this.show('info', title, message, false);
  }

  showPersistentWarning(title: string, message: string): string {
    return this.show('warning', title, message, false);
  }

  showPersistentError(title: string, message: string): string {
    return this.show('error', title, message, false);
  }

  // Confirmation notifications
  showConfirmation(title: string, message: string, duration: number = 3000): string {
    return this.show('success', title, message, true, duration);
  }

  // Progress notifications
  showProgress(title: string, message: string): string {
    return this.show('info', title, message, false);
  }

  updateProgress(id: string, message: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, message };
      }
      return notification;
    });
    this.notificationsSubject.next(updatedNotifications);
  }

  // Batch notifications
  showBatch(notifications: Array<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    autoHide?: boolean;
    duration?: number;
  }>): string[] {
    const ids: string[] = [];
    
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        const id = this.show(
          notification.type,
          notification.title,
          notification.message,
          notification.autoHide,
          notification.duration
        );
        ids.push(id);
      }, index * 100); // Stagger by 100ms
    });

    return ids;
  }

  // Queue management
  private maxNotifications = 5;

  setMaxNotifications(max: number): void {
    this.maxNotifications = max;
    this.enforceMaxNotifications();
  }

  private enforceMaxNotifications(): void {
    const currentNotifications = this.notificationsSubject.value;
    if (currentNotifications.length > this.maxNotifications) {
      const trimmedNotifications = currentNotifications.slice(-this.maxNotifications);
      this.notificationsSubject.next(trimmedNotifications);
    }
  }

  // Statistics
  getStatistics(): {
    total: number;
    unread: number;
    byType: Record<string, number>;
    recent: number;
  } {
    const notifications = this.notificationsSubject.value;
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const byType = notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = notifications.filter(n => n.timestamp > oneHourAgo).length;

    return {
      total: notifications.length,
      unread: this.getUnreadCount(),
      byType,
      recent
    };
  }
}