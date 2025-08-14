# Exam Complaint System

A modern web-based application for managing student exam complaints with role-based access control, real-time notifications, and automated database table creation using PostgreSQL/Supabase.

## 🎯 Project Overview

This system provides an efficient platform for students to submit exam complaints and for administrators to manage and respond to these complaints based on their institutional roles and responsibilities. The system features automatic database initialization and a robust PostgreSQL backend with UUID-based primary keys.

## 🚀 Key Features

### Student Features
- **Account Registration & Login**: Secure user authentication system with UUID-based user management
- **Complaint Submission**: Submit detailed exam complaints with form validation and automatic reference number generation
- **Complaint Tracking**: Track complaint status and view administrator responses in real-time
- **Dashboard**: Personal dashboard to view all submitted complaints with advanced filtering
- **Notifications**: Real-time notification system for complaint updates

### Admin Features
- **Role-Based Access Control**: Different access levels based on institutional position
  - **Lecturers**: View complaints within their department
  - **HODs**: View complaints within their department  
  - **Deans**: View complaints within their faculty
  - **System Administrators**: View all complaints system-wide
- **Complaint Management**: Review, respond to, and update complaint statuses with full audit trail
- **Analytics Dashboard**: View complaint statistics, trends, and performance metrics
- **Email Notifications**: Automated email notifications for responses and status changes
- **Admin Profile Management**: Update profile information and system settings

### System Features
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Dark Mode Support**: Complete dark/light theme toggle with system preference detection
- **Real-time Notifications**: Toast notifications and notification dropdown for user actions
- **Security**: Session-based authentication with bcrypt password encryption
- **Auto Database Setup**: Automatic table creation and initialization on first run
- **SSL Support**: Configured for Supabase with certificate validation bypass
- **UUID-Based Schema**: Modern UUID primary keys with proper foreign key relationships

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router and latest features
- **React 18** - Modern user interface library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible and customizable UI components
- **Shadcn/UI** - Beautiful and consistent component library

### Backend
- **Next.js API Routes** - Server-side API endpoints with TypeScript support
- **PostgreSQL** - Modern relational database with JSONB support
- **Supabase** - Cloud PostgreSQL hosting with real-time capabilities
- **node-postgres (pg)** - PostgreSQL client for Node.js with connection pooling
- **bcryptjs** - Secure password hashing and verification
- **Nodemailer** - Email service integration
- **UUID Extension** - PostgreSQL UUID generation support

### Database Features
- **Automatic Table Creation**: Tables are created automatically on first run
- **UUID Primary Keys**: Modern UUID-based primary keys for all tables
- **Foreign Key Relationships**: Proper referential integrity with CASCADE options
- **Triggers**: Automatic updated_at timestamp triggers
- **Indexes**: Optimized database indexes for performance
- **Connection Pooling**: Efficient connection management with retry logic

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Supabase)
- Email service (SMTP)

### Installation Steps
```bash
# Clone repository
git clone https://github.com/Derojuu/exam-complaint-system.git
cd exam-complaint-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server (tables will be created automatically)
npm run dev
```

### Environment Configuration
```env
# Database (Supabase or local PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Alternative individual parameters
DB_HOST="your-postgres-host"
DB_USER="your-username"
DB_PASSWORD="your-password"
DB_NAME="exam_complaints"
DB_PORT="5432"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_APP_PASSWORD="your-app-password"

# Application Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET="your-session-secret"
NODE_ENV="development"
```

## 🗄️ Database Schema

### Automatic Table Creation
The system automatically creates all necessary tables on first run, including:

### Core Tables
- **users**: User accounts with UUID primary keys, role and position information
- **complaints**: Complaint records with department/faculty tracking and reference numbers
- **complaint_responses**: Administrator responses to complaints with attachment support
- **responses**: Legacy response table for backward compatibility
- **complaint_status_history**: Complete audit trail of status changes
- **password_reset_tokens**: Secure password reset token management
- **notifications**: Real-time notification system
- **audit_logs**: System-wide audit logging with JSONB details

### Advanced Features
- **UUID Primary Keys**: All tables use UUID primary keys for better scalability
- **Foreign Key Constraints**: Proper referential integrity with CASCADE delete options
- **Automatic Timestamps**: Created_at and updated_at fields with triggers
- **Database Indexes**: Optimized indexes for email, status, and foreign key lookups
- **JSONB Support**: Flexible data storage for audit logs and metadata

### Role-Based Access Implementation
The system enforces access control based on admin positions:
- Department-level access for Lecturers and HODs
- Faculty-level access for Deans
- System-wide access for Administrators

## 📚 System Architecture

### Authentication Flow
1. User registration with email verification and UUID generation
2. Secure login with session management and password hashing
3. Role-based dashboard routing with position-specific access
4. Password reset functionality with secure token generation

### Complaint Management Flow
1. Student submits complaint with required details and automatic validation
2. System generates unique reference number and UUID-based tracking
3. Complaint routed to appropriate administrator based on department/faculty
4. Administrator reviews and responds with full audit trail
5. Student receives email notification and real-time updates
6. Status updates tracked in history with complete change log

### Database Architecture
1. **Automatic Initialization**: All tables created automatically on first run
2. **UUID-Based Keys**: Modern UUID primary keys for better scalability
3. **Connection Pooling**: Efficient PostgreSQL connection management
4. **SSL Configuration**: Proper SSL handling for Supabase deployment
5. **Retry Logic**: Robust error handling with connection retry mechanisms

## 🔒 Security Features

- **Session-Based Authentication**: Secure HTTP-only cookies with UUID session IDs
- **Password Security**: bcrypt hashing with salt rounds and validation
- **SQL Injection Protection**: Parameterized queries with prepared statements
- **Role-Based Authorization**: Position-specific access control with database-level enforcement
- **Input Validation**: TypeScript and database-level validation
- **SSL Certificate Handling**: Configured for secure Supabase connections
- **CSRF Protection**: Built-in Next.js CSRF protection
- **UUID Security**: Non-sequential UUIDs prevent enumeration attacks

## 🎯 Project Objectives

1. **Streamline Complaint Process**: Digitize the traditional paper-based complaint system
2. **Improve Transparency**: Provide real-time tracking and status updates
3. **Enhance Efficiency**: Role-based routing to appropriate administrators
4. **Maintain Security**: Secure user data and access control with modern encryption
5. **Ensure Accessibility**: Responsive design for all devices with dark mode support
6. **Automate Setup**: Zero-configuration database setup with automatic table creation
7. **Cloud Ready**: Designed for deployment on Supabase/Vercel with automatic scaling

## 📊 Key Achievements

- ✅ **Complete MySQL to PostgreSQL Migration**: Successfully migrated from MySQL to PostgreSQL
- ✅ **Automatic Database Setup**: Tables created automatically with proper relationships
- ✅ **UUID Implementation**: Modern UUID-based primary keys for all entities
- ✅ **SSL Certificate Resolution**: Proper SSL configuration for Supabase deployment
- ✅ **Connection Pooling**: Efficient database connection management
- ✅ **Modern UI**: Updated to Next.js 15 with latest React features
- ✅ **Type Safety**: Complete TypeScript implementation
- ✅ **Cloud Ready**: Optimized for Supabase and Vercel deployment

## 🚀 Future Enhancements

- 📱 **Mobile Application**: React Native mobile app development
- 🔗 **API Integration**: RESTful API for third-party integrations
- 📊 **Advanced Analytics**: AI-powered complaint analytics and insights
- 🤖 **Automated Categorization**: Machine learning-based complaint classification
- 📧 **SMS Notifications**: Multi-channel notification system
- 🌐 **Multi-language Support**: Internationalization for global deployment
- 🔄 **Real-time Updates**: WebSocket-based real-time complaint updates
- 🗂️ **Document Management**: Advanced file handling and storage

## 🚀 Deployment

### Supabase + Vercel Deployment
```bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod

# Configure environment variables in Vercel dashboard
# DATABASE_URL: Your Supabase connection string
# Other environment variables as needed
```

### Database Setup
- No manual database setup required
- Tables are created automatically on first application start
- Default admin user created: `admin@excos.edu` / `admin123`

---

**🎓 Built with Next.js 15, TypeScript, PostgreSQL, and Supabase for modern academic excellence.**

## 📝 Migration Notes

This project has been successfully migrated from MySQL to PostgreSQL with the following improvements:
- Modern UUID-based primary keys
- Automatic table creation and initialization
- Improved connection pooling and error handling
- SSL certificate handling for cloud deployment
- Enhanced security with proper foreign key constraints
- Optimized database indexes for better performance

The migration maintains full backward compatibility while providing modern database features and cloud-ready architecture.