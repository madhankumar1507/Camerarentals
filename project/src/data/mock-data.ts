import { User, Camera, Booking, CameraCategory, BookingStatus } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-admin',
    email: 'admin@camerarentals.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user-john',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'user-jane',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'USER',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'user-demo',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'USER',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock Cameras
export const mockCameras: Camera[] = [
  {
    id: 'camera-1',
    name: 'Canon EOS R5',
    brand: 'Canon',
    model: 'EOS R5',
    category: CameraCategory.MIRRORLESS,
    description: 'Professional full-frame mirrorless camera with 45MP sensor and 8K video recording capabilities.',
    features: ['45MP Full-Frame Sensor', '8K Video Recording', 'Dual Pixel CMOS AF', 'Image Stabilization', 'Weather Sealed'],
    rentPerDay: 75,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 3,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'camera-2',
    name: 'Sony A7R V',
    brand: 'Sony',
    model: 'A7R V',
    category: CameraCategory.MIRRORLESS,
    description: 'High-resolution mirrorless camera with 61MP sensor and advanced AI-powered autofocus.',
    features: ['61MP Full-Frame Sensor', '4K Video Recording', 'AI-Powered Autofocus', 'In-Body Stabilization', 'Tilting LCD Screen'],
    rentPerDay: 80,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 2,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'camera-3',
    name: 'Nikon D850',
    brand: 'Nikon',
    model: 'D850',
    category: CameraCategory.DSLR,
    description: 'Professional DSLR camera with 45.7MP sensor and exceptional dynamic range.',
    features: ['45.7MP Full-Frame Sensor', '4K UHD Video', '153-Point AF System', 'Dual Memory Card Slots', 'Weather Sealed'],
    rentPerDay: 65,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 2,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 'camera-4',
    name: 'GoPro Hero 12',
    brand: 'GoPro',
    model: 'Hero 12',
    category: CameraCategory.GOPRO,
    description: 'Ultra-compact action camera with 5.3K video recording and advanced stabilization.',
    features: ['5.3K Video Recording', 'HyperSmooth 6.0', 'Waterproof to 10m', 'Voice Control', 'Live Streaming'],
    rentPerDay: 25,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 5,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'camera-5',
    name: 'DJI Mavic 3',
    brand: 'DJI',
    model: 'Mavic 3',
    category: CameraCategory.DRONE,
    description: 'Professional drone with Hasselblad camera and 46-minute flight time.',
    features: ['Hasselblad Camera', '5.1K Video Recording', '46-Minute Flight Time', 'Omnidirectional Obstacle Sensing', 'ActiveTrack 5.0'],
    rentPerDay: 120,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 2,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'camera-6',
    name: 'Fujifilm X-T5',
    brand: 'Fujifilm',
    model: 'X-T5',
    category: CameraCategory.MIRRORLESS,
    description: 'Compact mirrorless camera with 40MP APS-C sensor and film simulation modes.',
    features: ['40MP APS-C Sensor', 'Film Simulation Modes', 'In-Body Stabilization', '6.2K Video Recording', 'Weather Resistant'],
    rentPerDay: 55,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 3,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'camera-7',
    name: 'Leica M11',
    brand: 'Leica',
    model: 'M11',
    category: CameraCategory.MIRRORLESS,
    description: 'Premium rangefinder camera with 60MP sensor and timeless design.',
    features: ['60MP Full-Frame Sensor', 'Rangefinder Design', 'ISO 64-50,000', 'Leica M-Mount', 'Premium Build Quality'],
    rentPerDay: 150,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 1,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: 'camera-8',
    name: 'Canon EOS-1D X Mark III',
    brand: 'Canon',
    model: 'EOS-1D X Mark III',
    category: CameraCategory.DSLR,
    description: 'Professional sports and wildlife DSLR with 20.1MP sensor and 20fps shooting.',
    features: ['20.1MP Full-Frame Sensor', '20fps Continuous Shooting', 'Dual CFexpress Slots', '4K Video Recording', 'Weather Sealed'],
    rentPerDay: 95,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: false,
    stockQuantity: 0,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'camera-9',
    name: 'Polaroid Now+',
    brand: 'Polaroid',
    model: 'Now+',
    category: CameraCategory.INSTANT,
    description: 'Modern instant camera with app connectivity and creative features.',
    features: ['Instant Film', 'App Connectivity', 'Double Exposure', 'Light Painting', 'Self-Timer'],
    rentPerDay: 20,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 4,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'camera-10',
    name: 'Pentax 67II',
    brand: 'Pentax',
    model: '67II',
    category: CameraCategory.FILM,
    description: 'Medium format film camera with 6x7cm frame and professional features.',
    features: ['Medium Format Film', '6x7cm Frame', 'TTL Metering', 'Interchangeable Lenses', 'Professional Build'],
    rentPerDay: 40,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 2,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: 'camera-11',
    name: 'Canon RF 70-200mm f/2.8L',
    brand: 'Canon',
    model: 'RF 70-200mm f/2.8L',
    category: CameraCategory.LENS,
    description: 'Professional telephoto zoom lens with constant f/2.8 aperture.',
    features: ['70-200mm Zoom Range', 'Constant f/2.8 Aperture', 'Image Stabilization', 'Weather Sealed', 'Nano USM Motor'],
    rentPerDay: 45,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 3,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'camera-12',
    name: 'Sony FX6',
    brand: 'Sony',
    model: 'FX6',
    category: CameraCategory.MIRRORLESS,
    description: 'Professional cinema camera with full-frame sensor and dual base ISO.',
    features: ['Full-Frame Sensor', 'Dual Base ISO', '4K 120fps Recording', 'Electronic Variable ND Filter', 'Dual CFexpress Slots'],
    rentPerDay: 200,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 1,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'camera-13',
    name: 'Profoto B10X',
    brand: 'Profoto',
    model: 'B10X',
    category: CameraCategory.ACCESSORY,
    description: 'Professional off-camera flash with TTL and high-speed sync.',
    features: ['500Ws Power', 'TTL Support', 'High-Speed Sync', 'Wireless Control', 'Modeling Light'],
    rentPerDay: 35,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 4,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'camera-14',
    name: 'Olympus OM-1',
    brand: 'Olympus',
    model: 'OM-1',
    category: CameraCategory.MIRRORLESS,
    description: 'Weather-sealed mirrorless camera with advanced computational photography.',
    features: ['20MP Micro Four Thirds Sensor', 'In-Body Stabilization', 'Computational Photography', 'Weather Sealed', 'High-Res Mode'],
    rentPerDay: 50,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 2,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08')
  },
  {
    id: 'camera-15',
    name: 'RED Komodo 6K',
    brand: 'RED',
    model: 'Komodo 6K',
    category: CameraCategory.MIRRORLESS,
    description: 'Professional cinema camera with 6K global shutter sensor.',
    features: ['6K Global Shutter Sensor', 'RED Raw Recording', 'Compact Design', 'Canon RF Mount', 'Professional Cinema Features'],
    rentPerDay: 300,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 1,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'camera-16',
    name: 'DJI Mini 4 Pro',
    brand: 'DJI',
    model: 'Mini 4 Pro',
    category: CameraCategory.DRONE,
    description: 'Compact drone with 4K camera and obstacle avoidance.',
    features: ['4K Camera', 'Obstacle Avoidance', '34-Minute Flight Time', 'ActiveTrack 360°', 'Lightweight Design'],
    rentPerDay: 60,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: true,
    stockQuantity: 3,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-john',
    cameraId: 'camera-1',
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-25'),
    totalCost: 375,
    status: BookingStatus.APPROVED,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: 'booking-2',
    userId: 'user-jane',
    cameraId: 'camera-2',
    startDate: new Date('2024-12-22'),
    endDate: new Date('2024-12-26'),
    totalCost: 320,
    status: BookingStatus.PENDING,
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18')
  },
  {
    id: 'booking-3',
    userId: 'user-demo',
    cameraId: 'camera-4',
    startDate: new Date('2024-12-10'),
    endDate: new Date('2024-12-15'),
    totalCost: 125,
    status: BookingStatus.COMPLETED,
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: 'booking-4',
    userId: 'user-john',
    cameraId: 'camera-5',
    startDate: new Date('2024-12-28'),
    endDate: new Date('2024-12-30'),
    totalCost: 240,
    status: BookingStatus.APPROVED,
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19')
  },
  {
    id: 'booking-5',
    userId: 'user-jane',
    cameraId: 'camera-6',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-18'),
    totalCost: 165,
    status: BookingStatus.ACTIVE,
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: 'booking-6',
    userId: 'user-demo',
    cameraId: 'camera-9',
    startDate: new Date('2024-12-05'),
    endDate: new Date('2024-12-08'),
    totalCost: 60,
    status: BookingStatus.COMPLETED,
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-09')
  },
  {
    id: 'booking-7',
    userId: 'user-john',
    cameraId: 'camera-3',
    startDate: new Date('2024-12-25'),
    endDate: new Date('2024-12-28'),
    totalCost: 195,
    status: BookingStatus.CANCELLED,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-21')
  },
  {
    id: 'booking-8',
    userId: 'user-jane',
    cameraId: 'camera-7',
    startDate: new Date('2024-12-30'),
    endDate: new Date('2025-01-02'),
    totalCost: 450,
    status: BookingStatus.PENDING,
    createdAt: new Date('2024-12-22'),
    updatedAt: new Date('2024-12-22')
  }
];

// Helper functions for generating mock data
export function mockUser(): User {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma', 'Ryan', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    firstName,
    lastName,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function mockCamera(): Camera {
  const brands = ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Olympus', 'Panasonic', 'Leica'];
  const categories = Object.values(CameraCategory);
  const features = [
    'Full-Frame Sensor',
    'In-Body Stabilization',
    '4K Video Recording',
    'Weather Sealed',
    'Dual Memory Cards',
    'High-Speed Shooting',
    'Advanced Autofocus',
    'Touchscreen LCD',
    'Electronic Viewfinder',
    'Wireless Connectivity'
  ];
  
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const selectedFeatures = features.sort(() => 0.5 - Math.random()).slice(0, 5);
  
  return {
    id: `camera-${Math.random().toString(36).substr(2, 9)}`,
    name: `${brand} Test Camera`,
    brand,
    model: `Model ${Math.floor(Math.random() * 1000)}`,
    category,
    description: `Professional ${category.toLowerCase()} camera with advanced features and excellent image quality.`,
    features: selectedFeatures,
    rentPerDay: Math.floor(Math.random() * 200) + 20,
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/194511/pexels-photo-194511.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    availability: Math.random() > 0.2,
    stockQuantity: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function mockBooking(): Booking {
  const statuses = Object.values(BookingStatus);
  const userIds = mockUsers.map(user => user.id);
  const cameraIds = mockCameras.map(camera => camera.id);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1);
  
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyRate = Math.floor(Math.random() * 200) + 20;
  
  return {
    id: `booking-${Math.random().toString(36).substr(2, 9)}`,
    userId: userIds[Math.floor(Math.random() * userIds.length)],
    cameraId: cameraIds[Math.floor(Math.random() * cameraIds.length)],
    startDate,
    endDate,
    totalCost: days * dailyRate,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Get mock data with relationships
export function getMockBookingsWithRelations(): (Booking & { user?: User; camera?: Camera })[] {
  return mockBookings.map(booking => ({
    ...booking,
    user: mockUsers.find(user => user.id === booking.userId),
    camera: mockCameras.find(camera => camera.id === booking.cameraId)
  }));
}

export function getMockUserBookings(userId: string): Booking[] {
  return mockBookings.filter(booking => booking.userId === userId);
}

export function getMockCameraBookings(cameraId: string): Booking[] {
  return mockBookings.filter(booking => booking.cameraId === cameraId);
}

// Statistics helpers
export function getMockStatistics() {
  return {
    totalUsers: mockUsers.length,
    totalCameras: mockCameras.length,
    totalBookings: mockBookings.length,
    availableCameras: mockCameras.filter(camera => camera.availability).length,
    activeBookings: mockBookings.filter(booking => booking.status === BookingStatus.ACTIVE).length,
    pendingBookings: mockBookings.filter(booking => booking.status === BookingStatus.PENDING).length,
    completedBookings: mockBookings.filter(booking => booking.status === BookingStatus.COMPLETED).length,
    totalRevenue: mockBookings
      .filter(booking => booking.status === BookingStatus.COMPLETED)
      .reduce((sum, booking) => sum + booking.totalCost, 0)
  };
}

// Search helpers
export function searchMockCameras(query: string): Camera[] {
  const searchTerm = query.toLowerCase();
  return mockCameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm) ||
    camera.brand.toLowerCase().includes(searchTerm) ||
    camera.model.toLowerCase().includes(searchTerm) ||
    camera.description.toLowerCase().includes(searchTerm) ||
    camera.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );
}

export function filterMockCameras(filters: {
  category?: CameraCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: boolean;
}): Camera[] {
  return mockCameras.filter(camera => {
    if (filters.category && camera.category !== filters.category) return false;
    if (filters.brand && !camera.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.minPrice !== undefined && camera.rentPerDay < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && camera.rentPerDay > filters.maxPrice) return false;
    if (filters.availability !== undefined && camera.availability !== filters.availability) return false;
    return true;
  });
}

// Date helpers
export function getDateRange(days: number): { start: Date; end: Date } {
  const start = new Date();
  start.setDate(start.getDate() + 1); // Start from tomorrow
  
  const end = new Date(start);
  end.setDate(end.getDate() + days);
  
  return { start, end };
}

export function isDateAvailable(cameraId: string, date: Date): boolean {
  const bookings = getMockCameraBookings(cameraId);
  
  return !bookings.some(booking => {
    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      return false;
    }
    
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    return date >= bookingStart && date <= bookingEnd;
  });
}

export function getAvailableDateRange(cameraId: string, duration: number): { start: Date; end: Date } | null {
  const today = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const start = new Date(today);
    start.setDate(start.getDate() + i);
    
    const end = new Date(start);
    end.setDate(end.getDate() + duration);
    
    let available = true;
    for (let j = 0; j < duration; j++) {
      const checkDate = new Date(start);
      checkDate.setDate(checkDate.getDate() + j);
      
      if (!isDateAvailable(cameraId, checkDate)) {
        available = false;
        break;
      }
    }
    
    if (available) {
      return { start, end };
    }
  }
  
  return null;
}

// Validation helpers
export function validateBookingDates(startDate: Date, endDate: Date): string[] {
  const errors: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (startDate < today) {
    errors.push('Start date cannot be in the past');
  }
  
  if (endDate <= startDate) {
    errors.push('End date must be after start date');
  }
  
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days > 30) {
    errors.push('Maximum rental period is 30 days');
  }
  
  return errors;
}

export function validateCamera(camera: Partial<Camera>): string[] {
  const errors: string[] = [];
  
  if (!camera.name || camera.name.trim().length < 2) {
    errors.push('Camera name must be at least 2 characters');
  }
  
  if (!camera.brand || camera.brand.trim().length < 2) {
    errors.push('Brand must be at least 2 characters');
  }
  
  if (!camera.model || camera.model.trim().length < 1) {
    errors.push('Model is required');
  }
  
  if (!camera.category || !Object.values(CameraCategory).includes(camera.category)) {
    errors.push('Valid category is required');
  }
  
  if (!camera.description || camera.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  
  if (!camera.rentPerDay || camera.rentPerDay <= 0) {
    errors.push('Rent per day must be greater than 0');
  }
  
  if (!camera.stockQuantity || camera.stockQuantity < 0) {
    errors.push('Stock quantity must be 0 or greater');
  }
  
  if (!camera.features || camera.features.length === 0) {
    errors.push('At least one feature is required');
  }
  
  if (!camera.images || camera.images.length === 0) {
    errors.push('At least one image is required');
  }
  
  return errors;
}

// Export organized data
export const mockData = {
  users: mockUsers,
  cameras: mockCameras,
  bookings: mockBookings,
  statistics: getMockStatistics(),
  helpers: {
    mockUser,
    mockCamera,
    mockBooking,
    getMockBookingsWithRelations,
    getMockUserBookings,
    getMockCameraBookings,
    searchMockCameras,
    filterMockCameras,
    getDateRange,
    isDateAvailable,
    getAvailableDateRange,
    validateBookingDates,
    validateCamera
  }
};