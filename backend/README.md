# Foundation Management System - Backend API

Spring Boot monolithic backend for the General Givers Family Foundation Management System.

## Tech Stack

- Java 17
- Spring Boot 3.2.0
- PostgreSQL (Database)
- Flyway (Migrations)
- JWT (Authentication)
- Spring Security
- Spring Data JPA
- Swagger/OpenAPI (API Documentation)

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- PostgreSQL 12+

## Database Setup

1. Install PostgreSQL and start the service
2. Create database and user:

```sql
CREATE DATABASE general_givers;
CREATE USER peter WITH PASSWORD 'manu';
GRANT ALL PRIVILEGES ON DATABASE general_givers TO peter;
```

3. Update connection details in `src/main/resources/application.yml` or use environment variables

## Environment Configuration

Create a `.env` file or set environment variables:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/general_givers
SPRING_DATASOURCE_USERNAME=peter
SPRING_DATASOURCE_PASSWORD=manu
JWT_SECRET=your_secure_random_secret_key_minimum_256_bits
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development Mode

```bash
mvn spring-boot:run
```

Or with a specific profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Build and Run

```bash
mvn clean package
java -jar target/foundation-system-1.0.0-SNAPSHOT.jar
```

The API will be available at: `http://localhost:8080/api/v1`

## API Documentation

Once the application is running, access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Default Admin User

On first run, a default super user is created:

- **Email**: admin@generalgivers.org
- **Password**: Admin@123

**Important**: Change this password after first login!

## Project Structure

```
backend/
├── src/main/java/com/generalgivers/foundation/
│   ├── config/              # Configuration classes
│   ├── controller/          # REST controllers
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # JPA entities
│   ├── exception/           # Custom exceptions
│   ├── repository/          # Spring Data repositories
│   ├── security/            # Security & JWT utilities
│   ├── service/             # Business logic
│   └── FoundationApplication.java
├── src/main/resources/
│   ├── application.yml      # Main configuration
│   ├── application-local.yml # Local profile config
│   └── db/migration/        # Flyway migration scripts
└── pom.xml
```

## Available Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### Users
- `GET /users` - List all users (Admin)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `PATCH /users/{id}/role` - Change user role (Super User)
- `DELETE /users/{id}` - Deactivate user (Super User)

### Projects
- `GET /projects` - List all projects (Public)
- `GET /projects/active` - List active projects
- `GET /projects/{id}` - Get project details
- `POST /projects` - Create project (Admin)
- `PUT /projects/{id}` - Update project (Admin)
- `DELETE /projects/{id}` - Delete project (Admin)

### Donations
- `POST /donations` - Create donation (Public/Guest)
- `GET /donations` - List all donations (Admin)
- `GET /donations/user/{userId}` - Get user donations
- `GET /donations/project/{projectId}` - Get project donations
- `GET /donations/total` - Get total donations (Admin)

### Visits
- `GET /visits` - List all visits (Admin)
- `POST /visits` - Record visit (Secretary/Chairman)
- `GET /visits/date-range` - Get visits by date range
- `PUT /visits/{id}` - Update visit

### Children Homes
- `GET /children-homes` - List all children homes
- `POST /children-homes` - Create children home (Admin)
- `PUT /children-homes/{id}` - Update children home
- `DELETE /children-homes/{id}` - Delete children home

### Reports
- `GET /reports/funds-by-month?year=2025` - Monthly funds report
- `GET /reports/projects-progress` - Project progress report
- `GET /reports/users-roles` - User role statistics

## Security

### Authentication
- JWT-based authentication
- Tokens expire after 15 minutes (configurable)
- Include token in requests: `Authorization: Bearer <token>`

### User Roles
- **SUPER_USER**: Full system access
- **CHAIRMAN**: View reports, approve activities
- **SECRETARY**: Manage communications, record visits
- **TREASURER**: Manage funds, financial reports
- **MEMBER**: Basic member access

## Database Migrations

Flyway automatically runs migrations on startup. Migration files are in:
`src/main/resources/db/migration/`

To manually run migrations:
```bash
mvn flyway:migrate
```

## Testing

Run tests:
```bash
mvn test
```

## Logging

Logs are configured in `application.yml`. Default log level is INFO.

For debug logging:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check port 5433 is accessible
- Verify credentials in environment variables

### Migration Failures
- Check migration scripts in `db/migration/`
- Verify database user has proper permissions
- Check Flyway schema history: `SELECT * FROM flyway_schema_history;`

### JWT Errors
- Ensure JWT_SECRET is set and is at least 256 bits
- Check token expiration time
- Verify token format: `Bearer <token>`

## Development Notes

- Hot reload is enabled with spring-boot-devtools
- Database validation is set to `validate` (Flyway manages schema)
- CORS is configured for frontend URL (default: http://localhost:3000)
