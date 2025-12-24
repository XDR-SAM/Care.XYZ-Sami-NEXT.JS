# Care.xyz - Trusted Care Services Platform

A modern, full-stack web application for booking professional care services including babysitting, elderly care, and specialized medical support. Built with Next.js, TypeScript, Firebase, and MongoDB.

![Care.xyz Logo](./public/logo.jpg)

## 🌟 Features

### For Users
- **User Authentication**: Secure registration and login with Firebase Authentication
  - Email/Password authentication
  - Google OAuth integration
  - Profile completion with verification
- **Service Browsing**: Browse available care services with detailed information
- **Booking System**: Easy booking process with location and duration selection
- **Dashboard**: Personal dashboard to view and manage bookings
  - Booking status tracking (Pending, Confirmed, Completed, Cancelled)
  - Booking statistics and overview
  - Detailed booking information
- **Email Notifications**: Automated invoice emails sent after booking confirmation

### For Administrators
- **Admin Dashboard**: Comprehensive admin panel for managing the platform
- **Service Management**: Create, update, and delete care services
- **Booking Management**: View all bookings and update booking statuses
- **User Management**: Monitor user activity and bookings

### Design & UX
- **Modern Purple Theme**: Beautiful purple and white color scheme
- **Responsive Design**: Fully responsive layout for all devices
- **Dark Mode Support**: Automatic theme detection (system preference)
- **Professional UI**: Clean, modern interface with smooth animations
- **Accessibility**: Proper semantic HTML and ARIA labels

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **React Hook Form** - Form management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Firebase Authentication** - User authentication
- **Firebase Admin SDK** - Server-side authentication
- **MongoDB** - NoSQL database
- **Nodemailer** - Email service
- **NextAuth.js** - Tocken Provider

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Date-fns** - Date formatting utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** database (local or cloud instance like MongoDB Atlas)
- **Firebase** project with Authentication enabled
- **Gmail account** with App Password enabled (for email functionality)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/XDR-SAM/Care.XYZ-Sami-NEXT.JS.git
cd carexyz
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Service Account)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email@your_project.iam.gserviceaccount.com

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/carexyz
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=carexyz

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# Admin Initialization (Optional)
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=your_secure_password
```

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Create a Service Account:
   - Go to Project Settings → Service Accounts
   - Generate a new private key
   - Copy the credentials to your `.env.local` file

### 5. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGODB_URI` in `.env.local`

#### Option B: MongoDB Atlas (Cloud)
1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 6. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password for "Mail"
4. Use this password in `EMAIL_APP_PASSWORD`

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Initialize Admin User (Optional)

After starting the server, you can initialize an admin user by making a POST request to `/api/admin/init` or using the admin panel button (if available).

## 📁 Project Structure

```
carexyz/
├── public/                 # Static assets
│   └── logo.jpg           # Site logo/favicon
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   │   ├── admin/     # Admin API endpoints
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   ├── bookings/  # Booking endpoints
│   │   │   └── services/  # Service endpoints
│   │   ├── admin/         # Admin dashboard page
│   │   ├── booking/       # Booking pages
│   │   ├── dashboard/     # User dashboard page
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── ...
│   ├── components/        # React components
│   │   ├── BookingForm.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/               # Utility libraries
│   │   ├── firebase.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── mongodb.ts
│   │   └── nodemailer.ts
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── .env.local             # Environment variables (not in git)
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## 🎯 Key Features Explained

### Authentication Flow
1. User registers with email/password or Google OAuth
2. Profile completion required (name, contact, NID)
3. User can browse and book services
4. Role-based access (user/admin)

### Booking Flow
1. Browse available services
2. Select service and view details
3. Fill booking form (duration, location)
4. Submit booking (creates booking record)
5. Receive email invoice automatically
6. Track booking status in dashboard

### Admin Features
- View all bookings across all users
- Update booking statuses
- Create/edit/delete services
- Monitor platform activity

## 🔐 Security Features

- **Firebase Authentication**: Secure user authentication
- **Server-side Validation**: All API routes validate user tokens
- **Role-based Access Control**: Admin routes protected
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Form validation on client and server

## 📧 Email Invoice

The platform automatically sends beautifully designed invoice emails after booking confirmation. The invoice includes:
- Invoice number
- Service details
- Location information
- Pricing breakdown
- Booking status
- Professional formatting

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform's environment variable settings.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **TypeScript**: Full type safety throughout the application
- **Component-based**: Reusable React components
- **API Routes**: RESTful API endpoints
- **Server Components**: Next.js 13+ App Router features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Support

For support, email support@carexyz.com or create an issue in the repository.

## 🎨 Design

- **Color Scheme**: Purple (#7c3aed) and white theme
- **Typography**: System fonts for optimal performance
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design approach

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Built with ❤️ using Next.js and modern web technologies by Sami**
