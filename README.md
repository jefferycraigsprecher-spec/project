# Midwest Shipment Company - Integrated System

## 🚀 Quick Start

Your frontend (Next.js) and backend (Express) have been configured and are ready to work together with MySQL database.

### Prerequisites
- **Node.js** v16+ installed
- **npm** installed
- **MySQL Server** installed and running on `localhost:3306`
- Port 3000 and 5000 available

### 1️⃣ Start MySQL Server

**Windows (Command Prompt as Administrator):**
```batch
net start MySQL80
```

If you need to find your MySQL service name:
```batch
sc query | find "MySQL"
```

### 2️⃣ Initialize Database

**Option A - Using batch script:**
```batch
cd c:\Users\WIZZY\midwest-shipment
INIT_DATABASE.bat
```

**Option B - Manual command:**
```bash
mysql -u root -h localhost < backend\config\schema.sql
```

**Option C - Using MySQL Client GUI:**
1. Open MySQL Workbench or MySQL Command Line Client
2. Create database and run: `source backend/config/schema.sql`

### 3️⃣ Install Dependencies

```bash
npm run setup
```

Or manually:
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 4️⃣ Start Development Environment

**Option A - All together (recommended):**
```bash
npm run dev
```

**Option B - Separately:**
```bash
# Terminal 1
npm run backend
# Backend runs on http://localhost:5000

# Terminal 2
npm run frontend
# Frontend runs on http://localhost:3000
```

### 5️⃣ Verify Setup

```bash
npm run verify
```

This will check:
- Backend configuration
- Frontend configuration
- Backend API health
- Frontend availability

---

## 📍 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/health

---

## 🔑 Default Admin Credentials

After database initialization:
- **Email**: `admin@midwestshipment.com`
- **Password**: `Admin@123456`

**⚠️ Change these credentials immediately in production!**

---

## 📁 Project Structure

```
midwest-shipment/
├── frontend/                 # Next.js React App
│   ├── src/
│   │   ├── app/             # Page routes
│   │   ├── components/      # React components
│   │   ├── lib/             # API client & utilities
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── next.config.js
├── backend/                  # Express.js API Server
│   ├── config/              # Database config & schema
│   ├── controllers/         # Route handlers
│   ├── routes/              # API endpoints
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── server.js           # App entry point
│   ├── package.json
│   └── .env                # Environment variables
├── package.json            # Root scripts (concurrently)
├── SETUP_GUIDE.md         # Detailed setup instructions
├── START_ALL.bat          # Batch startup script
├── INIT_DATABASE.bat      # Database initialization script
└── verify.js              # System verification script
```

---

## 🗄️ Database Schema

The system includes these core tables:

### Users & Auth
- **admins**: System administrators
- **customers**: Registered customers
- **customer_email_verifications**: Email verification tokens
- **customer_password_resets**: Password reset tokens

### Shipments & Tracking
- **shipments**: Main shipment records
- **tracking_events**: Tracking history
- **shipment_activity_logs**: Admin action logs
- **shipment_media**: Photos/videos of shipments

### Customer Features
- **customer_notifications**: In-app notifications
- **customer_support_tickets**: Support tickets
- **customer_delivery_documents**: Delivery documents

### Contact
- **contact_messages**: Website contact form submissions

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Shipments
- `GET /api/shipments` - List shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id` - Update shipment

### Backend examples
- `backend/examples/create_shipment.php` - PHP sample for creating a shipment via the API

### Customers
- `GET /api/customers/profile` - Get customer profile
- `PUT /api/customers/profile` - Update profile

### Contact
- `POST /api/contact` - Submit contact form

### Health
- `GET /api/health` - Health check

---

## ⚙️ Environment Configuration

### Backend (.env)
Located at `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=midwest_shipment

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads
```

### Frontend (.env.local)
The frontend automatically uses:
- API URL: `http://localhost:5000/api`
- Configurable via `NEXT_PUBLIC_API_URL` env variable

---

## 🔧 Troubleshooting

### MySQL Connection Failed
```
❌ "Error: connect ECONNREFUSED 127.0.0.1:3306"
```
**Solution:**
- Ensure MySQL Server is running
- Check MySQL is listening on port 3306
- Verify credentials in `backend/.env`

### Port Already in Use
```
❌ "EADDRINUSE: address already in use :::5000"
```
**Solution - Windows:**
```batch
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Not Installing
```
❌ "npm ERR! code ERESOLVE"
```
**Solution:**
```bash
npm cache clean --force
rm -r backend/node_modules frontend/node_modules node_modules
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Database Schema Error
```
❌ "Unknown database 'midwest_shipment'"
```
**Solution:**
```bash
# Run database initialization
INIT_DATABASE.bat
# Or manually:
mysql -u root -h localhost < backend\config\schema.sql
```

---

## 📚 API Client Usage (Frontend)

The frontend has a pre-configured API client:

```typescript
import api from '@/lib/api'

// GET request
const response = await api.get('/shipments')

// POST request
const response = await api.post('/shipments', {
  sender_name: 'John Doe',
  recipient_name: 'Jane Doe'
})

// Authentication is automatically handled via cookies
// JWT token is sent in Authorization header
```

---

## 🎯 Next Steps

1. ✅ Start MySQL Server
2. ✅ Initialize Database
3. ✅ Install Dependencies
4. ✅ Start Development Environment
5. ✅ Open http://localhost:3000 in browser
6. ✅ Login with admin@midwestshipment.com / Admin@123456

---

## 📝 Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start both frontend and backend |
| `npm run backend` | Start only backend API |
| `npm run frontend` | Start only frontend |
| `npm run setup` | Install all dependencies |
| `npm run verify` | Verify system status |

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the SETUP_GUIDE.md for detailed instructions
3. Check backend logs in terminal for errors
4. Verify MySQL is running and accessible

---

## 📄 License

Midwest Shipment Company - All Rights Reserved

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Ready for Development
