import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, AuthRequest, AuthResponse, RegisterRequest, ApiResponse } from '../types';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private apiService: ApiService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.storageService.get<string>('auth_token');
    const user = this.storageService.get<User>('current_user');
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: AuthRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials)
      .pipe(
        tap(response => {
          this.storageService.set('auth_token', response.token);
          this.storageService.set('current_user', response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(response => ({
          success: true,
          data: response,
          message: 'Login successful'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Login failed'
          });
        })
      );
  }

  register(registrationData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<AuthResponse>('/auth/register', registrationData)
      .pipe(
        tap(response => {
          this.storageService.set('auth_token', response.token);
          this.storageService.set('current_user', response.user);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        map(response => ({
          success: true,
          data: response,
          message: 'Registration successful'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Registration failed'
          });
        })
      );
  }

  logout(): void {
    this.storageService.remove('auth_token');
    this.storageService.remove('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  getAuthToken(): string | null {
    return this.storageService.get<string>('auth_token');
  }

  // Social login placeholders
  loginWithGoogle(): Observable<ApiResponse<AuthResponse>> {
    return of({
      success: false,
      error: 'Google login not implemented in backend'
    });
  }

  loginWithFacebook(): Observable<ApiResponse<AuthResponse>> {
    return of({
      success: false,
      error: 'Facebook login not implemented in backend'
    });
  }
}