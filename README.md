# Learning Management System

A full-stack Learning Management System (LMS) built with React and Spring Boot, featuring course management, assessments, discussions, and grade tracking.

## Tech Stack

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Redux Toolkit & React Redux
- Axios for API calls
- JWT authentication

### Backend
- Spring Boot 2.7.0
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT (JJWT 0.11.5)
- Swagger/Springfox

## Features

- **Authentication & Authorization**: JWT-based secure login and registration
- **Course Management**: Create, view, and manage courses
- **Assessments & Quizzes**: Interactive quiz system with progress tracking
- **Enrollment System**: Student enrollment and course access control
- **Discussion Forums**: Course-specific discussion posts
- **Grade Tracking**: Assessment grading and student performance monitoring
- **User Profiles**: Student and admin profile management
- **Role-based Dashboards**: Separate dashboards for students and administrators

## Project Structure

```
├── reactapp/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login and registration
│   │   │   ├── courses/        # Course management
│   │   │   ├── dashboard/      # User dashboards
│   │   │   ├── profile/        # User profiles
│   │   │   └── quiz/           # Quiz and assessments
│   │   ├── utils/              # Utility functions
│   │   └── api.js              # API configuration
│   └── package.json
│
└── springapp/         # Spring Boot backend application
    ├── src/main/java/com/examly/springapp/
    │   ├── config/             # Security and CORS configuration
    │   ├── controller/         # REST API controllers
    │   ├── model/              # Entity models
    │   ├── repository/         # JPA repositories
    │   ├── service/            # Business logic
    │   └── util/               # JWT utilities
    └── pom.xml
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 11
- MySQL
- Maven

### Backend Setup

1. Navigate to the Spring Boot application:
```bash
cd springapp
```

2. Configure database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build and run:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the React application:
```bash
cd reactapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:8081`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/{id}` - Get course by ID
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Assessments
- `GET /api/assessments` - Get all assessments
- `POST /api/assessments` - Create assessment
- `GET /api/assessments/{id}` - Get assessment by ID

### Grades
- `GET /api/grades` - Get all grades
- `POST /api/grades` - Submit grade

### Discussions
- `GET /api/discussions` - Get discussion posts
- `POST /api/discussions` - Create discussion post

## Testing

### Frontend Tests
```bash
cd reactapp
npm test
```

### Backend Tests
```bash
cd springapp
./mvnw test
```

## License

This project is for educational purposes.
# Learning-Management-System
