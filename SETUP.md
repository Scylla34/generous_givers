# Foundation Management System - Setup Guide

Complete setup instructions for the General Givers Family Foundation Management System.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** ([Download](https://adoptium.net/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 12+** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

## Database Setup

### 1. Install and Start PostgreSQL

Make sure PostgreSQL is running on port 5433 (or update the configuration to match your port).

### 2. Create Database and User

Open PostgreSQL command line or pgAdmin and run:

```sql
CREATE DATABASE general_givers;
CREATE USER peter WITH PASSWORD 'manu';
GRANT ALL PRIVILEGES ON DATABASE general_givers TO peter;
```

### 3. Verify Connection

Test the connection:
```bash
psql -h localhost -p 5433 -U peter -d general_givers
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Configure Environment Variables

Create a `.env` file or set environment variables:

```bash
# Windows (PowerShell)
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/general_givers"
$env:SPRING_DATASOURCE_USERNAME="peter"
$env:SPRING_DATASOURCE_PASSWORD="manu"
$env:JWT_SECRET="your_secure_random_secret_key_minimum_256_bits_for_HS256_algorithm"
$env:FRONTEND_URL="http://localhost:3000"

# macOS/Linux
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/general_givers"
export SPRING_DATASOURCE_USERNAME="peter"
export SPRING_DATASOURCE_PASSWORD="manu"
export JWT_SECRET="your_secure_random_secret_key_minimum_256_bits_for_HS256_algorithm"
export FRONTEND_URL="http://localhost:3000"
```

Or copy `.env.example` to `.env` and update values.

### 3. Build the Project

```bash
mvn clean install
```

This will:
- Download dependencies
- Compile the code
- Run tests
- Create the JAR file

### 4. Run Database Migrations

Migrations run automatically on startup, but you can run them manually:

```bash
mvn flyway:migrate
```

### 5. Start the Backend Server

```bash
mvn spring-boot:run
```

Or with local profile for debug logging:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The API will be available at: **http://localhost:8080/api/v1**

### 6. Verify Backend is Running

Open your browser and navigate to:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

### 7. Test Default Admin Login

The system creates a default super user:
- **Email**: admin@generalgivers.org
- **Password**: Admin@123

Test the login endpoint:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@generalgivers.org",
    "password": "Admin@123"
  }'
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- Tailwind CSS
- React Query
- Axios
- And other dependencies

### 3. Configure Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

### 5. Verify Frontend is Running

Open your browser and navigate to:
- **Home Page**: http://localhost:3000
- You should see the landing page with hero section

## Verification Steps

### 1. Check Backend Health

```bash
curl http://localhost:8080/api/v1/projects/active
```

Should return an empty array: `[]`

### 2. Create a Test User

```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "phone": "+1234567890"
  }'
```

Should return a user object with access token.

### 3. Test Protected Endpoint

Using the token from signup/login:

```bash
curl http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Common Issues and Solutions

### PostgreSQL Connection Error

**Error**: `Connection refused` or `Cannot connect to database`

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   sc query postgresql-x64-14

   # macOS/Linux
   ps aux | grep postgres
   ```

2. Check if the port is correct (5433 vs 5432)
3. Verify username and password
4. Check `pg_hba.conf` for connection permissions

### JWT Secret Error

**Error**: `JWT signing key must be at least 256 bits`

**Solution**: Use a longer secret key (at least 32 characters):
```bash
JWT_SECRET=this_is_a_secure_random_secret_key_with_at_least_256_bits
```

### Maven Build Failures

**Error**: `Could not resolve dependencies`

**Solutions**:
1. Clear Maven cache:
   ```bash
   mvn clean
   rm -rf ~/.m2/repository
   ```

2. Check internet connection
3. Try updating Maven: `mvn -U clean install`

### Flyway Migration Errors

**Error**: `Detected failed migration`

**Solutions**:
1. Check migration scripts in `backend/src/main/resources/db/migration/`
2. Clean Flyway history:
   ```sql
   DELETE FROM flyway_schema_history WHERE success = false;
   ```
3. Drop and recreate database (development only):
   ```sql
   DROP DATABASE general_givers;
   CREATE DATABASE general_givers;
   ```

### Node Modules Installation Issues

**Error**: `npm install` fails

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Try using Yarn instead:
   ```bash
   yarn install
   ```

### Port Already in Use

**Backend Error**: `Port 8080 is already in use`

**Solutions**:
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:8080 | xargs kill -9
   ```

2. Or change the port in `application.yml`:
   ```yaml
   server:
     port: 8081
   ```

**Frontend Error**: `Port 3000 is already in use`

**Solutions**:
1. Kill the process or use a different port:
   ```bash
   npm run dev -- -p 3001
   ```

## Development Workflow

### Running Both Backend and Frontend

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Hot Reload

- **Backend**: Automatically reloads with `spring-boot-devtools`
- **Frontend**: Automatically reloads on file changes

### Viewing Logs

**Backend**:
- Logs are printed to console
- Log level can be adjusted in `application.yml`

**Frontend**:
- Browser console for client-side logs
- Terminal for server-side logs

## Next Steps

After successful setup:

1. **Change default admin password**
   - Login with admin credentials
   - Go to profile settings
   - Update password

2. **Create additional users**
   - Use the signup endpoint or admin UI
   - Assign appropriate roles

3. **Add test data**
   - Create projects
   - Add children homes
   - Record test donations

4. **Explore API**
   - Use Swagger UI at http://localhost:8080/swagger-ui.html
   - Test different endpoints
   - Check role-based access control

5. **Continue Development**
   - Implement remaining frontend pages
   - Customize styling
   - Add additional features

## Production Deployment

For production deployment, refer to:
- Backend: `backend/README.md`
- General: `README.md`

Key production considerations:
- Use production-grade PostgreSQL instance
- Set strong JWT secret
- Enable HTTPS
- Configure CORS properly
- Set up proper logging
- Use environment-specific configurations
- Implement backup strategy

## Support

For issues or questions:
1. Check this setup guide
2. Review the FSD document in `docs/FSD.md`
3. Check backend README: `backend/README.md`
4. Review Swagger API documentation
5. Contact the development team

## Quick Reference

### URLs
- Backend API: http://localhost:8080/api/v1
- Swagger UI: http://localhost:8080/swagger-ui.html
- Frontend: http://localhost:3000

### Default Credentials
- Email: admin@generalgivers.org
- Password: Admin@123

### Key Commands

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend
cd frontend
npm install
npm run dev

# Database
psql -h localhost -p 5433 -U peter -d general_givers
```
