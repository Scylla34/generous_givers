# General Givers Family - Foundation Management System

A comprehensive foundation management system for tracking projects, donations, visits, and generating reports.

## Project Structure

```
generous_givers/
├── backend/          # Java Spring Boot monolith
├── frontend/         # Next.js React application
└── docs/            # Documentation
```

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.x
- PostgreSQL (port 5433)
- Flyway (database migrations)
- JWT authentication
- Maven

### Frontend
- Next.js 14+
- React
- Tailwind CSS
- React Query
- TypeScript

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- Node.js 18+
- PostgreSQL running on port 5433
- Git

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE general_givers;
CREATE USER peter WITH PASSWORD 'manu';
GRANT ALL PRIVILEGES ON DATABASE general_givers TO peter;
```

2. Connection string: `jdbc:postgresql://localhost:5433/general_givers`

## Quick Start

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on http://localhost:8080

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env or application-local.yml)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/general_givers
SPRING_DATASOURCE_USERNAME=peter
SPRING_DATASOURCE_PASSWORD=manu
JWT_SECRET=your_secure_random_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## User Roles

- **SUPER_USER**: Full system administration
- **CHAIRMAN**: View reports, approve activities, oversee projects
- **SECRETARY**: Manage communications, events, project updates
- **TREASURER**: Manage funds and financial records
- **MEMBER**: Regular member access

## API Documentation

Once the backend is running, access Swagger UI at:
http://localhost:8080/swagger-ui.html

## Features

### Public Features
- Landing pages (Home, About, Projects)
- Project browsing
- Donation system
- Contact form

### Member Features
- User registration and authentication
- Profile management
- Donation history
- Project participation tracking

### Admin Features
- User management with role assignment
- Project CRUD operations
- Visit recording for children homes
- Donation tracking and management
- Comprehensive reporting system

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
# Hot reload enabled with spring-boot-devtools
```

### Frontend Development
```bash
cd frontend
npm run dev
# Hot reload enabled by default
```

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Migration Management

Database migrations are managed with Flyway and run automatically on startup.
Migration files are located in `backend/src/main/resources/db/migration/`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Proprietary - General Givers Family Foundation

## Support

For issues and questions, contact the development team.