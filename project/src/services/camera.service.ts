import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Camera, CameraFilter, ApiResponse, PaginatedSpringResponse, CameraCategory } from '../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private apiService: ApiService) {}

  getCameras(filter?: CameraFilter, page: number = 0, pageSize: number = 12): Observable<PaginatedSpringResponse<Camera>> {
    const params: any = {
      page,
      size: pageSize
    };

    if (filter) {
      if (filter.category) params.category = filter.category;
      if (filter.brand) params.brand = filter.brand;
      if (filter.minPrice !== undefined) params.minPrice = filter.minPrice;
      if (filter.maxPrice !== undefined) params.maxPrice = filter.maxPrice;
      if (filter.availability !== undefined) params.availability = filter.availability;
      if (filter.search) params.search = filter.search;
    }

    return this.apiService.getPaginated<Camera>('/cameras', params);
  }

  getCameraById(id: string): Observable<ApiResponse<Camera>> {
    return this.apiService.get<Camera>(`/cameras/${id}`)
      .pipe(
        map(camera => ({
          success: true,
          data: camera
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to fetch camera'
          });
        })
      );
  }

  createCamera(cameraData: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Camera>> {
    return this.apiService.post<Camera>('/cameras', cameraData)
      .pipe(
        map(camera => ({
          success: true,
          data: camera,
          message: 'Camera created successfully'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to create camera'
          });
        })
      );
  }

  updateCamera(id: string, cameraData: Partial<Camera>): Observable<ApiResponse<Camera>> {
    return this.apiService.put<Camera>(`/cameras/${id}`, cameraData)
      .pipe(
        map(camera => ({
          success: true,
          data: camera,
          message: 'Camera updated successfully'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to update camera'
          });
        })
      );
  }

  deleteCamera(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`/cameras/${id}`)
      .pipe(
        map(() => ({
          success: true,
          message: 'Camera deleted successfully'
        })),
        catchError(error => {
          return of({
            success: false,
            error: error.message || 'Failed to delete camera'
          });
        })
      );
  }

  getFeaturedCameras(): Observable<Camera[]> {
    return this.apiService.get<Camera[]>('/cameras/featured');
  }

  getPopularCameras(): Observable<Camera[]> {
    return this.apiService.get<Camera[]>('/cameras/popular');
  }

  getCamerasByCategory(category: CameraCategory): Observable<Camera[]> {
    return this.apiService.get<Camera[]>(`/cameras/category/${category}`);
  }

  getBrands(): Observable<string[]> {
    return this.apiService.get<string[]>('/cameras/brands');
  }

  getCategories(): Observable<CameraCategory[]> {
    return of(Object.values(CameraCategory));
  }

  searchCameras(query: string): Observable<Camera[]> {
    return this.apiService.get<Camera[]>('/cameras', { search: query });
  }
}