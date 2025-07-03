import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { NotificationMessage } from '../../types';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByNotificationId"
        [class]="getNotificationClasses(notification)"
        [@slideIn]
      >
        <div class="flex items-start space-x-3">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              *ngIf="notification.type === 'success'" 
              class="w-5 h-5 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            
            <svg 
              *ngIf="notification.type === 'error'" 
              class="w-5 h-5 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            
            <svg 
              *ngIf="notification.type === 'warning'" 
              class="w-5 h-5 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            
            <svg 
              *ngIf="notification.type === 'info'" 
              class="w-5 h-5 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900">{{ notification.title }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
            <p class="text-xs text-gray-500 mt-2">{{ notification.timestamp | date:'short' }}</p>
          </div>

          <!-- Close Button -->
          <button 
            (click)="removeNotification(notification.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Progress Bar (for auto-hide notifications) -->
        <div 
          *ngIf="notification.type !== 'error'"
          class="absolute bottom-0 left-0 h-1 bg-current opacity-20 animate-shrink"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .animate-shrink {
      animation: shrink 5s linear forwards;
    }

    [data-notification-type="success"] {
      @apply border-green-200 bg-green-50 text-green-800;
    }

    [data-notification-type="error"] {
      @apply border-red-200 bg-red-50 text-red-800;
    }

    [data-notification-type="warning"] {
      @apply border-yellow-200 bg-yellow-50 text-yellow-800;
    }

    [data-notification-type="info"] {
      @apply border-blue-200 bg-blue-50 text-blue-800;
    }
  `],
  animations: [
    // You can add Angular animations here if needed
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications: NotificationMessage[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  getNotificationClasses(notification: NotificationMessage): string {
    const baseClasses = 'notification-modern relative overflow-hidden';
    const typeClasses = {
      success: 'notification-success',
      error: 'notification-error',
      warning: 'notification-warning',
      info: 'notification-info'
    };

    return `${baseClasses} ${typeClasses[notification.type]}`;
  }

  trackByNotificationId(index: number, notification: NotificationMessage): string {
    return notification.id;
  }
}