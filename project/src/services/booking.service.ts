import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Booking, BookingRequest, BookingStatus, ApiResponse, PaginatedResponse } from '../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private apiService: ApiService) {}

  getBookings(page: number = 0, pageSize: number = 10, status?: BookingStatus): Observable<PaginatedResponse<Booking>> {
    const params: any = {
      page,
      size: pageSize
    };

    if (status) {
      params.status = status;
    }

    return this.apiService.getPaginated<Booking>('/bookings', params);
  }

  getUserBookings(page: number = 0, pageSize: number = 10, status?: BookingStatus): Observable<PaginatedResponse<Booking>> {
    const params: any = {
      page,
      size: pageSize
    };

    if (status) {
      params.status = status;
    }

    return this.apiService.getPaginated<Booking>('/bookings/my-bookings', params);
  }

  getBookingById(id: string): Observable<ApiResponse<Booking>> {
    return this.apiService.get<Booking>(`/bookings/${id}`)
      .pipe(
        map(booking => ({
          success: true,
          data: booking
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to fetch booking'
          });
        })
      );
  }

  createBooking(bookingData: BookingRequest): Observable<ApiResponse<Booking>> {
    return this.apiService.post<Booking>('/bookings', bookingData)
      .pipe(
        map(booking => ({
          success: true,
          data: booking,
          message: 'Booking created successfully'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to create booking'
          });
        })
      );
  }

  updateBookingStatus(id: string, status: BookingStatus, adminNotes?: string): Observable<ApiResponse<Booking>> {
    const params: any = { status };
    if (adminNotes) {
      params.adminNotes = adminNotes;
    }

    return this.apiService.put<Booking>(`/bookings/${id}/status`, null)
      .pipe(
        map(booking => ({
          success: true,
          data: booking,
          message: `Booking ${status.toLowerCase()} successfully`
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to update booking status'
          });
        })
      );
  }

  cancelBooking(id: string): Observable<ApiResponse<Booking>> {
    return this.apiService.put<Booking>(`/bookings/${id}/cancel`, {})
      .pipe(
        map(booking => ({
          success: true,
          data: booking,
          message: 'Booking cancelled successfully'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to cancel booking'
          });
        })
      );
  }

  getPendingBookings(): Observable<ApiResponse<Booking[]>> {
    return this.apiService.get<Booking[]>('/bookings/pending')
      .pipe(
        map(bookings => ({
          success: true,
          data: bookings
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to fetch pending bookings'
          });
        })
      );
  }
}