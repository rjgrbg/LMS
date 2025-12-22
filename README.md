# SCOSCI1 Learning Management System - Node.js

A modern Learning Management System built with Node.js, Express, and MySQL.

## Features

- User authentication (login/signup)
- Role-based access (Admin/Student)
- Material upload and management
- File downloads
- Profile management with picture upload
- Dashboard statistics
- Search functionality

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure database:
   - Create a MySQL database named `scosci1_lms`
   - Import the schema: `mysql -u root -p scosci1_lms < scosci1_lms.sql`

3. Configure environment:
   - Edit `.env` file with your database credentials
   - Change `SESSION_SECRET` to a secure random string

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Access the application:
   - Open browser to `http://localhost:3000`
   - Default admin credentials: username `admin`, password `admin123`

## Project Structure

```
├── server.js              # Main application entry
├── config/
│   └── db.js             # Database connection
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── materials.js      # Material management
│   └── users.js          # User management
├── middleware/
│   └── auth.js           # Auth middleware
├── public/               # Static files (HTML, CSS, JS)
├── uploads/              # Uploaded materials
└── profile-pictures/     # User profile pictures
```

## API Endpoints

All endpoints maintain PHP-style naming for compatibility:

### Authentication
- POST `/api/login.php` - User login
- POST `/api/signup.php` - User registration
- GET `/api/check-auth.php` - Check authentication status
- POST `/api/logout.php` - User logout

### Materials
- GET `/api/get-materials.php` - Get all materials
- POST `/api/upload-material.php` - Upload material (admin)
- GET `/api/download-material.php?id=X` - Download material
- DELETE `/api/delete-material.php` - Delete material (admin)
- PUT `/api/update-material.php` - Update material (admin)

### Users
- GET `/api/get-users.php` - Get all users (admin)
- POST `/api/update-profile.php` - Update user profile
- POST `/api/upload-profile-picture.php` - Upload profile picture
- GET `/api/get-dashboard-stats.php` - Get dashboard statistics (admin)
- GET `/api/get-statistics.php` - Get detailed statistics (admin)

## Environment Variables

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=scosci1_lms
DB_PORT=3306
SESSION_SECRET=your-secret-key-change-this-in-production
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name scosci1-lms
   ```
3. Configure reverse proxy (nginx/Apache)
4. Enable HTTPS and set `cookie.secure = true` in session config
5. Use environment-specific database credentials

## Security Notes

- Change default admin password immediately
- Use strong SESSION_SECRET in production
- Enable HTTPS in production
- Keep dependencies updated
- Implement rate limiting for production

## License

ISC
