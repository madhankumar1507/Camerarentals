# Camera Rentals Full-Stack Application

A modern full-stack web application for camera rental services built with Spring Boot backend and Angular frontend.

## 🚀 Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with MySQL
- **Maven** for dependency management
- **ModelMapper** for object mapping
- **Validation** with Bean Validation

### Frontend
- **Angular 15+** with TypeScript
- **Tailwind CSS** for styling
- **RxJS** for reactive programming
- **Angular HTTP Client** for API communication
- **JWT** token-based authentication

### Database
- **MySQL 8.0** for production
- **H2** for testing

## 🎯 Features

### User Features
- ✅ User registration & login with JWT authentication
- ✅ Browse cameras with advanced filtering (brand, category, price, availability)
- ✅ Search functionality across camera details
- ✅ Camera detail view with image gallery
- ✅ Add items to rental cart
- ✅ Set rental duration and place orders
- ✅ View rental history and current bookings
- ✅ Responsive design for all devices

### Admin Features
- ✅ Admin dashboard with role-based access
- ✅ Add/update/delete camera products
- ✅ Manage camera inventory and pricing
- ✅ View and manage all rental bookings
- ✅ Approve/reject/complete rental requests
- ✅ Dashboard analytics and statistics

## 📦 Project Structure

```
camera-rentals/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   ├── config/         # Configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── exception/     # Exception handling
│   │   ├── model/         # JPA entities
│   │   ├── repository/    # Data repositories
│   │   ├── security/      # Security configuration
│   │   └── service/       # Business logic
│   └── src/main/resources/
│       ├── application.yml # Application configuration
│       └── data.sql       # Sample data
├── src/                    # Angular frontend
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── services/         # Angular services
│   ├── types/            # TypeScript interfaces
│   └── environments/     # Environment configs
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd camera-rentals
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE camera_rentals;
   CREATE USER 'camera_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON camera_rentals.* TO 'camera_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configure Database**
   Update `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/camera_rentals
       username: camera_user
       password: password
   ```

4. **Run Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   Backend will start at `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'
   };
   ```

3. **Run Frontend**
   ```bash
   npm start
   ```
   Frontend will start at `http://localhost:4200`

## 🔐 Default Credentials

### Admin Account
- **Email:** admin@camerarentals.com
- **Password:** password123

### Demo User
- **Email:** john@example.com
- **Password:** password123

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Cameras
- `GET /api/cameras` - Get cameras with filtering
- `GET /api/cameras/{id}` - Get camera by ID
- `POST /api/cameras` - Create camera (Admin only)
- `PUT /api/cameras/{id}` - Update camera (Admin only)
- `DELETE /api/cameras/{id}` - Delete camera (Admin only)
- `GET /api/cameras/featured` - Get featured cameras
- `GET /api/cameras/brands` - Get all brands

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings` - Get all bookings (Admin only)
- `PUT /api/bookings/{id}/status` - Update booking status (Admin only)
- `PUT /api/bookings/{id}/cancel` - Cancel booking

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the application:
   ```bash
   ./mvnw clean package
   ```
2. Run the JAR file:
   ```bash
   java -jar target/camera-rentals-backend-1.0.0.jar
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to your web server

## 🔧 Environment Variables

### Backend
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRATION` - JWT expiration time (ms)

### Frontend
- `API_URL` - Backend API URL

## 📄 Sample Data

The application includes sample data with:
- 8+ camera models from various brands
- Multiple categories (DSLR, Mirrorless, Drone, etc.)
- Demo user accounts
- Sample bookings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@camerarentals.com

---

Made with ❤️ using Spring Boot + Angular