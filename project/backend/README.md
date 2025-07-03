# Camera Rentals Backend

Spring Boot REST API for the Camera Rentals platform.

## 🚀 Quick Start

1. **Prerequisites**
   - Java 17+
   - Maven 3.6+
   - MySQL 8.0

2. **Database Setup**
   ```sql
   CREATE DATABASE camera_rentals;
   ```

3. **Run Application**
   ```bash
   ./mvnw spring-boot:run
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@camerarentals.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "user": {
      "id": 1,
      "email": "admin@camerarentals.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    }
  }
}
```

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Camera Endpoints

#### GET /api/cameras
Get cameras with optional filtering and pagination.

**Query Parameters:**
- `category` - Camera category (DSLR, MIRRORLESS, etc.)
- `brand` - Camera brand
- `minPrice` - Minimum price per day
- `maxPrice` - Maximum price per day
- `availability` - Availability status (true/false)
- `search` - Search term
- `page` - Page number (default: 0)
- `size` - Page size (default: 12)
- `sort` - Sort order (name, price-low, price-high, newest)

**Example:**
```
GET /api/cameras?category=MIRRORLESS&brand=Canon&page=0&size=10
```

#### GET /api/cameras/{id}
Get camera details by ID.

#### POST /api/cameras (Admin Only)
Create a new camera.

**Request Body:**
```json
{
  "name": "Canon EOS R5",
  "brand": "Canon",
  "model": "EOS R5",
  "category": "MIRRORLESS",
  "description": "Professional mirrorless camera",
  "features": ["45MP Sensor", "8K Video"],
  "rentPerDay": 75.00,
  "images": ["image-url-1", "image-url-2"],
  "availability": true,
  "stockQuantity": 3
}
```

### Booking Endpoints

#### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "cameraId": 1,
  "startDate": "2024-12-25",
  "endDate": "2024-12-28",
  "notes": "For wedding photography"
}
```

#### GET /api/bookings/my-bookings
Get current user's bookings.

#### PUT /api/bookings/{id}/status (Admin Only)
Update booking status.

**Query Parameters:**
- `status` - New status (PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED, CANCELLED)
- `adminNotes` - Optional admin notes

## 🔐 Security

The API uses JWT (JSON Web Tokens) for authentication:

1. Login to receive a JWT token
2. Include the token in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### Roles
- **USER**: Can view cameras, create bookings, manage own bookings
- **ADMIN**: Full access to all endpoints

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Cameras Table
```sql
CREATE TABLE cameras (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    category ENUM('DSLR', 'MIRRORLESS', 'GOPRO', 'DRONE', 'FILM', 'INSTANT', 'LENS', 'ACCESSORY') NOT NULL,
    description TEXT,
    rent_per_day DECIMAL(10,2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    camera_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
);
```

## 🧪 Testing

Run tests:
```bash
./mvnw test
```

## 📦 Build & Deploy

Build production JAR:
```bash
./mvnw clean package
```

Run production build:
```bash
java -jar target/camera-rentals-backend-1.0.0.jar
```

## ⚙️ Configuration

Key configuration properties in `application.yml`:

```yaml
app:
  jwt:
    secret: your-secret-key
    expiration: 86400000  # 24 hours
  cors:
    allowed-origins: http://localhost:4200
```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Resource not found",
  "data": null
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error