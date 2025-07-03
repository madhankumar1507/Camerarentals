import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CameraService } from '../../services/camera.service';
import { NotificationService } from '../../services/notification.service';
import { Camera, CameraCategory, CameraFilter } from '../../types';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminPanelComponent implements OnInit {
  cameras: Camera[] = [];
  isLoading = true;
  error = '';
  successMessage = '';

  featureInput: string = '';
  imageInput: string = '';

  currentPage = 0;
  pageSize = 10;
  sortBy = 'name';
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  availableOnly = false;
  totalResults = 0;
  totalPages = 0;

  cameraToDelete: Camera | null = null;

  newCamera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    brand: '',
    model: '',
    category: 'DSLR' as CameraCategory,
    description: '',
    features: [],
    rentPerDay: 0,
    images: [],
    availability: true,
    stockQuantity: 1
  };

  constructor(private cameraService: CameraService,
    private notificationService: NotificationService
  ) {
    
  }

  ngOnInit(): void {
    this.loadAllCameras();
  }

  private loadAllCameras(): void {
    this.isLoading = true;
  
    const filter: CameraFilter = {
      search: this.searchTerm || undefined,
      category: this.selectedCategory as CameraCategory || undefined,
      brand: this.selectedBrand || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
      availability: this.availableOnly || undefined
    };
  
    this.cameraService.getCameras(filter, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('Camera API response:', response);
          this.cameras = this.sortCameras(response.content); // <- fixed here
          this.totalResults = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cameras:', error);
          this.isLoading = false;
          this.notificationService.error('Error', 'Failed to load cameras');
        }
      });
  }

  private sortCameras(cameras: Camera[]): Camera[] {
    switch (this.sortBy) {
      case 'price-low':
        return cameras.sort((a, b) => a.rentPerDay - b.rentPerDay);
      case 'price-high':
        return cameras.sort((a, b) => b.rentPerDay - a.rentPerDay);
      case 'newest':
        return cameras.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
      default:
        return cameras.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  prepareCameraData(): void {
    this.newCamera.features = this.featureInput
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    this.newCamera.images = this.imageInput
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
  }

  createNewCamera(): void {
    this.prepareCameraData();

    this.cameraService.createCamera(this.newCamera).subscribe((res) => {
      if (res.success) {
        //this.successMessage = res.message;
       // this.loadAllCameras();
        this.resetForm();
        this.featureInput = '';
        this.imageInput = '';
      } else {
        this.error = res.error || 'Failed to create camera.';
      }
    });
  }

  deleteConfirmed(): void {
    if (!this.cameraToDelete) return;
  
    this.cameraService.deleteCamera(this.cameraToDelete.id).subscribe({
      next: () => {
        this.successMessage = 'Camera deleted successfully';
        this.cameraToDelete = null;
        this.loadAllCameras(); // reload camera list
      },
      error: (err) => {
        this.error = 'Failed to delete camera';
        this.cameraToDelete = null;
        console.error(err);
      }
    });
  }
  
  confirmDelete(camera: Camera): void {
    this.cameraToDelete = camera;
  }
  
  cancelDelete(): void {
    this.cameraToDelete = null;
  }

  resetForm(): void {
    this.newCamera = {
      name: '',
      brand: '',
      model: '',
      category: 'DSLR' as CameraCategory,
      description: '',
      features: [],
      rentPerDay: 0,
      images: [],
      availability: true,
      stockQuantity: 1
    };
  }

  // Camera edit

  editCameraData: Camera | null = null;
editFeatureInput = '';
editImageInput = '';

openEditModal(camera: Camera): void {
  // Create a copy of the camera data to edit
  this.editCameraData = { ...camera };
  this.editFeatureInput = camera.features.join(', ');
  this.editImageInput = camera.images.join(', ');
}

cancelEdit(): void {
  this.editCameraData = null;
}

saveEditedCamera(): void {
  if (!this.editCameraData) return;

  this.editCameraData.features = this.editFeatureInput
    .split(',')
    .map(f => f.trim())
    .filter(Boolean);

  this.editCameraData.images = this.editImageInput
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

  this.cameraService.updateCamera(this.editCameraData.id, this.editCameraData).subscribe({
    next: () => {
      this.successMessage = 'Camera updated successfully';
      this.editCameraData = null;
      this.loadAllCameras(); // reload updated list
    },
    error: (err) => {
      this.error = 'Failed to update camera';
      console.error(err);
    }
  });
}

showDetailsModal = false;
selectedCamera: Camera | null = null;
currentImageIndex = 0;

openDetailsModal(camera: Camera): void {
  this.selectedCamera = camera;
  this.currentImageIndex = 0;
  this.showDetailsModal = true;
}

closeDetailModal(): void {
  this.showDetailsModal = false;
  this.selectedCamera = null;
}

nextImage(): void {
  if (this.selectedCamera && this.selectedCamera.images) {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedCamera.images.length;
  }
}

prevImage(): void {
  if (this.selectedCamera && this.selectedCamera.images) {
    this.currentImageIndex = 
      (this.currentImageIndex - 1 + this.selectedCamera.images.length) % this.selectedCamera.images.length;
  }
}

showAddCameraModal: boolean = false;

openAddCameraModal(): void {
  this.showAddCameraModal = true;
}

closeAddCameraModal(): void {
  this.showAddCameraModal = false;
}

}
