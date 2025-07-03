import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CameraService } from '../../services/camera.service';
import { AuthService } from '../../services/auth.service';
import { Camera } from '../../types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section section-spacing">
      <div class="container-responsive">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-shadow animate-fade-in-up">
            Rent Professional Cameras
            <span class="block text-gradient">For Every Moment</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in-up animate-delay-200">
            Access the latest camera equipment from top brands. Perfect for photographers, videographers, and content creators.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
            <a routerLink="/cameras" class="btn-primary text-lg px-8 py-4">
              Browse Cameras
            </a>
            <a routerLink="/about" class="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-4">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section-spacing bg-white">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CameraRentals?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            We make professional photography equipment accessible to everyone with our premium rental service.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-card animate-fade-in-up">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Quality Guaranteed</h3>
            <p class="text-gray-600">
              All our equipment is professionally maintained and tested before each rental to ensure perfect performance.
            </p>
          </div>

          <div class="feature-card animate-fade-in-up animate-delay-200">
            <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Fast Delivery</h3>
            <p class="text-gray-600">
              Quick and secure delivery to your location. Same-day delivery available in select areas.
            </p>
          </div>

          <div class="feature-card animate-fade-in-up animate-delay-300">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
            <p class="text-gray-600">
              Our expert team is available around the clock to help you with any questions or technical support.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Cameras Section -->
    <section class="section-spacing bg-gray-50">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Equipment
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular cameras and equipment, trusted by professionals worldwide.
          </p>
        </div>

        <div class="grid-responsive" *ngIf="featuredCameras.length > 0">
          <div 
            *ngFor="let camera of featuredCameras" 
            class="camera-card animate-fade-in-up"
          >
            <div class="relative overflow-hidden">
              <img 
                [src]="camera.images[0]" 
                [alt]="camera.name"
                class="w-full h-48 object-cover"
                loading="lazy"
              >
              <div class="absolute top-4 right-4">
                <span class="badge-success">Available</span>
              </div>
            </div>
            
            <div class="camera-card-content">
              <div class="flex justify-between items-start mb-2">
                <h3 class="camera-card-title">{{ camera.name }}</h3>
                <span class="camera-card-category">{{ camera.category }}</span>
              </div>
              
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ camera.description }}</p>
              
              <div class="flex justify-between items-center">
                <div class="camera-card-price">{{ camera.rentPerDay }}/day</div>
                <a 
                  [routerLink]="['/cameras', camera.id]"
                  class="btn-primary text-sm"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="grid-responsive">
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

        <div class="text-center mt-12">
          <a routerLink="/cameras" class="btn-primary text-lg px-8 py-4">
            View All Cameras
          </a>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section-spacing bg-white">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect equipment for your specific needs and creative vision.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <a 
            *ngFor="let category of categories" 
            [routerLink]="['/cameras']" 
            [queryParams]="{ category: category.value }"
            class="group block"
          >
            <div class="bg-gray-100 rounded-xl p-8 text-center hover:bg-primary-50 transition-colors duration-200 group-hover:scale-105 transform">
              <div class="w-16 h-16 mx-auto mb-4 text-gray-600 group-hover:text-primary-600 transition-colors">
                <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="category.icon"></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">{{ category.count }} items</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section-spacing bg-gray-50">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied photographers and videographers who trust us with their projects.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div *ngFor="let testimonial of testimonials" class="testimonial-card animate-fade-in-up">
            <div class="flex items-center mb-4">
              <div *ngFor="let star of [1,2,3,4,5]" class="text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <blockquote class="text-gray-600 mb-4">
              "{{ testimonial.quote }}"
            </blockquote>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <div class="font-semibold text-gray-900">{{ testimonial.name }}</div>
                <div class="text-sm text-gray-600">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-spacing bg-gradient-primary text-white">
      <div class="container-responsive text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Next Project?
        </h2>
        <p class="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Browse our extensive collection of professional cameras and equipment. 
          Get started today and bring your creative vision to life.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/cameras" class="btn-secondary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
            Browse Equipment
          </a>
          <a 
            *ngIf="!isAuthenticated" 
            routerLink="/register" 
            class="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-4"
          >
            Create Account
          </a>
        </div>
      </div>
    </section>
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
export class HomeComponent implements OnInit {
  featuredCameras: Camera[] = [];
  isLoading = true;
  isAuthenticated = false;

  categories = [
    {
      name: 'DSLR Cameras',
      value: 'DSLR',
      count: 15,
      icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z'
    },
    {
      name: 'Mirrorless',
      value: 'MIRRORLESS',
      count: 12,
      icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z'
    },
    {
      name: 'Action Cameras',
      value: 'GOPRO',
      count: 8,
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    },
    {
      name: 'Drones',
      value: 'DRONE',
      count: 6,
      icon: 'M12 19l9-7-9-7-9 7 9 7z M5 12l7-7 7 7-7 7-7-7z'
    }
  ];

  testimonials = [
    {
      quote: "CameraRentals made my wedding photography business possible. The quality of equipment and service is outstanding.",
      name: "Sarah Johnson",
      role: "Wedding Photographer"
    },
    {
      quote: "As a freelance videographer, I rely on CameraRentals for the latest equipment. They never disappoint.",
      name: "Mike Chen",
      role: "Videographer"
    },
    {
      quote: "The rental process is so smooth and the equipment always arrives in perfect condition. Highly recommended!",
      name: "Emily Davis",
      role: "Content Creator"
    }
  ];

  constructor(
    private cameraService: CameraService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedCameras();
    this.checkAuthStatus();
  }

  private loadFeaturedCameras(): void {
    this.cameraService.getFeaturedCameras().subscribe({
      next: (cameras) => {
        this.featuredCameras = cameras;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured cameras:', error);
        this.isLoading = false;
      }
    });
  }

  private checkAuthStatus(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }
}