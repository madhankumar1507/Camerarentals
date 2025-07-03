import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo -->
        <div class="flex justify-center">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-900">CameraRentals</span>
          </div>
        </div>
        
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <a routerLink="/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-6">
            <!-- First Name -->
            <div class="form-group">
              <label for="firstName" class="form-label">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                required
                [(ngModel)]="formData.firstName"
                #firstName="ngModel"
                class="form-input-modern"
                [class.error]="firstName.invalid && firstName.touched"
              >
              <div *ngIf="firstName.invalid && firstName.touched" class="form-error">
                <span *ngIf="firstName.errors?.['required']">First name is required</span>
                <span *ngIf="firstName.errors?.['minlength']">First name must be at least 2 characters</span>
              </div>
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label for="lastName" class="form-label">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                required
                [(ngModel)]="formData.lastName"
                #lastName="ngModel"
                class="form-input-modern"
                [class.error]="lastName.invalid && lastName.touched"
              >
              <div *ngIf="lastName.invalid && lastName.touched" class="form-error">
                <span *ngIf="lastName.errors?.['required']">Last name is required</span>
                <span *ngIf="lastName.errors?.['minlength']">Last name must be at least 2 characters</span>
              </div>
            </div>

            <!-- Mobile Number -->
            <div class="form-group">
              <label for="phone" class="form-label">Mobile Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="[0-9]{10}"
                [(ngModel)]="formData.phone"
                #phone="ngModel"
                class="form-input-modern"
                [class.error]="phone.invalid && phone.touched"
              >
              <div *ngIf="phone.invalid && phone.touched" class="form-error">
                <span *ngIf="phone.errors?.['required']">Mobile number is required</span>
                <span *ngIf="phone.errors?.['pattern']">Enter a valid 10-digit mobile number</span>
              </div>
            </div>

            <!-- Country Dropdown -->
            <div class="form-group">
              <label for="country" class="form-label">Country</label>
              <select
                id="country"
                name="country"
                required
                [(ngModel)]="formData.country"
                #country="ngModel"
                class="form-input-modern"
                [class.error]="country.invalid && country.touched"
              >
                <option value="" disabled selected>Select a country</option>
                <option *ngFor="let c of countryList" [value]="c">{{ c }}</option>
              </select>
              <div *ngIf="country.invalid && country.touched" class="form-error">
                <span *ngIf="country.errors?.['required']">Country is required</span>
              </div>
            </div>



            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                [(ngModel)]="formData.email"
                #email="ngModel"
                class="form-input-modern"
                [class.error]="email.invalid && email.touched"
              >
              <div *ngIf="email.invalid && email.touched" class="form-error">
                <span *ngIf="email.errors?.['required']">Email is required</span>
                <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="relative">
                <input
                  id="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  minlength="6"
                  [(ngModel)]="formData.password"
                  #password="ngModel"
                  class="form-input-modern pr-10"
                  [class.error]="password.invalid && password.touched"
                >
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg 
                    *ngIf="!showPassword" 
                    class="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg 
                    *ngIf="showPassword" 
                    class="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <div *ngIf="password.invalid && password.touched" class="form-error">
                <span *ngIf="password.errors?.['required']">Password is required</span>
                <span *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</span>
              </div>
              
              <!-- Password Strength Indicator -->
              <div *ngIf="formData.password" class="mt-2">
                <div class="flex space-x-1">
                  <div 
                    *ngFor="let strength of passwordStrengthBars" 
                    [class]="strength"
                    class="h-1 flex-1 rounded"
                  ></div>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ passwordStrengthText }}</p>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm password</label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  [(ngModel)]="formData.confirmPassword"
                  #confirmPassword="ngModel"
                  class="form-input-modern pr-10"
                  [class.error]="(confirmPassword.invalid && confirmPassword.touched) || (confirmPassword.touched && !passwordsMatch())"
                >
                <button
                  type="button"
                  (click)="toggleConfirmPasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg 
                    *ngIf="!showConfirmPassword" 
                    class="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg 
                    *ngIf="showConfirmPassword" 
                    class="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <div *ngIf="(confirmPassword.invalid && confirmPassword.touched) || (confirmPassword.touched && !passwordsMatch())" class="form-error">
                <span *ngIf="confirmPassword.errors?.['required']">Please confirm your password</span>
                <span *ngIf="confirmPassword.touched && !passwordsMatch()">Passwords do not match</span>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                [(ngModel)]="formData.agreeToTerms"
                #agreeToTerms="ngModel"
                class="form-checkbox-modern mt-1"
              >
              <label for="agreeToTerms" class="ml-2 block text-sm text-gray-900">
                I agree to the
                <a routerLink="/terms" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
                and
                <a routerLink="/privacy" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
              </label>
            </div>
            <div *ngIf="agreeToTerms.invalid && agreeToTerms.touched" class="form-error">
              <span>You must agree to the terms and conditions</span>
            </div>

            <!-- Marketing Emails -->
            <div class="flex items-start">
              <input
                id="marketingEmails"
                name="marketingEmails"
                type="checkbox"
                [(ngModel)]="formData.marketingEmails"
                class="form-checkbox-modern mt-1"
              >
              <label for="marketingEmails" class="ml-2 block text-sm text-gray-900">
                I would like to receive marketing emails about new equipment and special offers
              </label>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                [disabled]="registerForm.invalid || !passwordsMatch() || isLoading"
                class="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">Create account</span>
                <span *ngIf="isLoading" class="flex items-center justify-center">
                  <div class="loading-spinner mr-2"></div>
                  Creating account...
                </span>
              </button>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="alert-error-modern">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ errorMessage }}
              </div>
            </div>
          </form>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <!-- Social Registration -->
            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                (click)="signUpWithGoogle()"
                [disabled]="isLoading"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="ml-2">Google</span>
              </button>

              <button
                type="button"
                (click)="signUpWithFacebook()"
                [disabled]="isLoading"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span class="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone : '',
    country: '',
    agreeToTerms: false,
    marketingEmails: false
  };
  
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  passwordStrengthBars: string[] = [];
  passwordStrengthText = '';
  countryList: string[] = [
    'India',
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Singapore',
    'United Arab Emirates',
    'Japan'
  ];
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.isLoading || !this.passwordsMatch()) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    const registrationData = {
      email: this.formData.email,
      password: this.formData.password,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      phone: this.formData.phone,
      country: this.formData.country
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notificationService.showRegistrationSuccess();
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.error || 'Registration failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'An unexpected error occurred. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  signUpWithGoogle(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.loginWithGoogle().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notificationService.success('Welcome!', 'Successfully signed up with Google');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.error || 'Google sign up failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Google sign up failed. Please try again.';
        console.error('Google sign up error:', error);
      }
    });
  }

  signUpWithFacebook(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.loginWithFacebook().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notificationService.success('Welcome!', 'Successfully signed up with Facebook');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.error || 'Facebook sign up failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Facebook sign up failed. Please try again.';
        console.error('Facebook sign up error:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    return this.formData.password === this.formData.confirmPassword;
  }

  // Password strength calculation
  ngDoCheck(): void {
    this.updatePasswordStrength();
  }

  private updatePasswordStrength(): void {
    const password = this.formData.password;
    if (!password) {
      this.passwordStrengthBars = [];
      this.passwordStrengthText = '';
      return;
    }

    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ];

    strength = checks.filter(check => check).length;

    // Update bars
    this.passwordStrengthBars = [];
    for (let i = 0; i < 4; i++) {
      if (i < strength - 1) {
        if (strength <= 2) {
          this.passwordStrengthBars.push('bg-red-500');
        } else if (strength <= 3) {
          this.passwordStrengthBars.push('bg-yellow-500');
        } else {
          this.passwordStrengthBars.push('bg-green-500');
        }
      } else {
        this.passwordStrengthBars.push('bg-gray-200');
      }
    }

    // Update text
    if (strength <= 2) {
      this.passwordStrengthText = 'Weak password';
    } else if (strength <= 3) {
      this.passwordStrengthText = 'Medium password';
    } else {
      this.passwordStrengthText = 'Strong password';
    }
  }
}