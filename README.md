# 💈 BarberBook

A modern, multilingual barber appointment booking system built with Next.js, TypeScript, and Firebase. Features a responsive design with RTL support and a comprehensive admin dashboard.

## 🌟 Features

### 🎯 Core Functionality

- **Online Booking System**: Customers can book appointments with date/time selection
- **Real-time Availability**: Dynamic time slot management based on existing bookings
- **Admin Dashboard**: Comprehensive appointment management with calendar and table views
- **Status Management**: Pending, confirmed, and cancelled appointment states
- **Customer Management**: Phone number validation with international country codes

### 🌍 Internationalization (i18n)

- **4 Languages Supported**: English, Spanish, Arabic, French
- **RTL Support**: Proper right-to-left layout for Arabic
- **Localized Content**: All UI elements, forms, and messages translated
- **Country Names**: 75+ countries with localized names
- **Date/Time Formatting**: Locale-aware formatting

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional design with smooth transitions
- **Accessibility**: Proper form validation and error handling
- **Language Switcher**: Easy language switching with flag indicators

### 🔧 Admin Features

- **Enhanced Dashboard**: Filter by status, date, view modes (table/calendar)
- **Appointment Management**: Confirm, cancel, delete appointments
- **Real-time Updates**: Refresh functionality with loading states
- **Appointment Details**: Popup with full customer information
- **Delete Confirmation**: Safety dialogs for destructive actions

### 📚 API Documentation

- **Interactive Swagger UI**: Complete API documentation with live testing
- **Comprehensive Endpoints**: All booking, management, and authentication APIs
- **Request/Response Schemas**: Detailed models with validation rules and examples
- **Authentication Support**: Documented admin endpoints with security requirements
- **Easy Access**: Direct link from admin dashboard

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **Package Manager**: npm (included with Node.js)
- **Firebase Account**: For database and authentication
- **Git**: For version control

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd barber-citas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Firebase configuration (see Firebase Setup below).

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `barberbook-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Add authorized domains if deploying to production

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location close to your users
4. Click "Done"

### 4. Set up Firestore Collections

Create these collections in Firestore:

#### `appointments` Collection

```javascript
// Example document structure
{
  id: "auto-generated-id",
  name: "John Doe",
  phone: "+34123456789",
  service: "haircut", // "haircut" | "beard" | "both"
  date: "2024-06-15",
  time: "10:00",
  status: "pending", // "pending" | "confirmed" | "cancelled"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `settings` Collection (Optional)

```javascript
// Document ID: "business"
{
  name: "Your Barber Shop",
  workingHours: {
    start: "09:00",
    end: "18:00"
  },
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  slotDuration: 30, // minutes
  breakTime: 15 // minutes between appointments
}
```

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Web app** icon (`</>`)
4. Register app with nickname: `barberbook-web`
5. Copy the Firebase configuration object

### 6. Configure Environment Variables

Create `.env.local` file in project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Credentials (for login)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 7. Set Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for appointments
    match /appointments/{document} {
      allow read, write: if true; // Adjust based on your security needs
    }

    // Allow read for settings
    match /settings/{document} {
      allow read: if true;
      allow write: if false; // Only allow through Firebase Console
    }
  }
}
```

## 📚 API Documentation

BarberBook includes comprehensive API documentation powered by Swagger UI, providing interactive documentation for all endpoints.

### 🌐 Accessing API Documentation

1. **From Admin Dashboard**: Click the "API Docs" button in the admin header
2. **Direct URL**: Navigate to `/[locale]/api-docs` (e.g., `/en/api-docs`)
3. **Swagger JSON**: Raw specification available at `/api/swagger`

### 📋 Available Endpoints

#### Public Endpoints

| Method   | Endpoint      | Description                         |
| -------- | ------------- | ----------------------------------- |
| `POST`   | `/api/book`   | Create a new appointment            |
| `GET`    | `/api/slots`  | Get available time slots for a date |
| `PATCH`  | `/api/update` | Update an appointment (legacy)      |
| `DELETE` | `/api/update` | Delete an appointment (legacy)      |

#### Admin Endpoints (Authentication Required)

| Method   | Endpoint                 | Description                 |
| -------- | ------------------------ | --------------------------- |
| `GET`    | `/api/appointments`      | Get all appointments        |
| `PATCH`  | `/api/appointments/{id}` | Update appointment status   |
| `DELETE` | `/api/appointments/{id}` | Delete specific appointment |
| `POST`   | `/api/auth/login`        | Admin login                 |
| `POST`   | `/api/auth/logout`       | Admin logout                |
| `GET`    | `/api/auth/check`        | Check authentication status |

### 🔧 Features

- **Interactive Testing**: Test APIs directly from the documentation
- **Request/Response Examples**: Complete examples with validation rules
- **Schema Documentation**: Detailed data models and requirements
- **Authentication Support**: Bearer token authentication for admin endpoints
- **Multi-language Support**: Documentation available in all supported locales

### 📝 Example Usage

#### Book an Appointment

```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+34123456789",
    "service": "haircut",
    "date": "2024-06-15",
    "time": "10:00"
  }'
```

#### Get Available Slots

```bash
curl "http://localhost:3000/api/slots?date=2024-06-15"
```

#### Admin: Get All Appointments

```bash
curl -X GET http://localhost:3000/api/appointments \
  -H "Cookie: auth-token=authenticated"
```

### 🎨 Swagger UI Customization

The Swagger UI is customized to match BarberBook's design:

- **Color Coding**: HTTP methods use consistent colors (GET=Blue, POST=Green, PATCH=Orange, DELETE=Red)
- **Hidden Topbar**: Clean interface without default Swagger branding
- **Custom Styling**: Matches the app's Tailwind CSS design system
- **Responsive Design**: Works perfectly on mobile and desktop

## 🛠️ Development

### Project Structure

```
barber-citas/
├── app/                     # Next.js 13+ App Router
│   ├── [locale]/           # Internationalized routes
│   │   ├── page.tsx        # Main booking page
│   │   ├── admin/          # Admin dashboard
│   │   ├── login/          # Admin login
│   │   └── api-docs/       # Swagger API documentation
│   ├── api/                # API routes
│   │   ├── appointments/   # CRUD operations
│   │   ├── book/          # Booking endpoint
│   │   ├── slots/         # Available time slots
│   │   ├── auth/          # Authentication
│   │   └── swagger/       # OpenAPI specification
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   ├── CountryPhoneInput.tsx      # Phone input with country selection
│   ├── SimpleLanguageSwitcher.tsx # Language switcher component
│   ├── EnhancedCalendar.tsx       # Admin calendar view
│   ├── AppointmentDetailsPopup.tsx # Admin appointment details modal
│   └── ConfirmDialog.tsx          # Delete confirmation dialog
├── lib/                   # Utilities and configurations
│   ├── firebase.ts        # Firebase configuration
│   ├── firestore.ts       # Firestore database utilities
│   ├── translations.ts    # Translation system
│   ├── validation.ts      # Form validation schemas
│   └── avatarUtils.ts     # Avatar generation utilities
├── lang/                  # Translation files
│   ├── en.json           # English translations
│   ├── es.json           # Spanish translations
│   ├── ar.json           # Arabic translations
│   └── fr.json           # French translations
├── hooks/                 # Custom React hooks
│   └── useTranslations.tsx # Translation hook
├── scripts/              # Build and utility scripts
├── i18n.ts               # Internationalization configuration
├── middleware.ts         # Next.js middleware for i18n routing
└── jest.config.ts        # Jest testing configuration
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode

# Code Formatting
npm run format       # Format code with Prettier
```

### Adding New Languages

1. **Create translation file**: `lang/[locale].json`
2. **Update i18n configuration**: Add locale to `i18n.ts`
3. **Update middleware**: Ensure routing supports new locale
4. **Add to language switcher**: Update `SimpleLanguageSwitcher.tsx`
5. **Test RTL support**: For right-to-left languages, add `dir` attribute logic

Example translation file structure:

```json
{
  "common": {
    "loading": "Loading...",
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "booking": {
    "title": "Book Appointment",
    "name": "Full Name",
    "phone": "Phone Number",
    "service": "Service",
    "date": "Date",
    "time": "Time"
  },
  "admin": {
    "title": "Admin Dashboard",
    "login": "Login",
    "logout": "Logout"
  },
  "countries": {
    "US": "United States",
    "ES": "Spain",
    "FR": "France"
  },
  "countryInput": {
    "search": "Search countries...",
    "noResults": "No countries found"
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub/GitLab**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables from `.env.local`
   - Deploy

### Other Platforms

- **Netlify**: Connect GitHub repo, add environment variables
- **Firebase Hosting**: `npm run build && firebase deploy`
- **Self-hosted**: Build and serve static files

### Environment Variables for Production

Ensure these are set in your deployment platform:

- All `NEXT_PUBLIC_FIREBASE_*` variables
- `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Any additional configuration

## 🔐 Security Considerations

### Firestore Rules

Update Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{document} {
      allow read: if true;
      allow create: if validateAppointment(resource.data);
      allow update: if isAdmin() || validateUpdate(resource.data);
      allow delete: if isAdmin();
    }
  }
}
```

### Admin Authentication

- Use strong passwords
- Consider implementing proper authentication (Firebase Auth)
- Add rate limiting for login attempts

### Data Validation

- All form inputs are validated client and server-side
- Phone numbers are validated with country codes
- Date/time validation prevents past bookings

## 🧪 Testing

### Automated Testing

The project includes Jest configuration for unit testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

Test files should be placed in `__tests__/` directories or named with `.test.ts` or `.spec.ts` extensions.

### Manual Testing Checklist

#### Booking Flow

- [ ] Select service, date, and time
- [ ] Fill customer information with phone validation
- [ ] Submit form and receive confirmation
- [ ] Test in all 4 languages
- [ ] Test responsive design on mobile

#### Admin Dashboard

- [ ] Login with admin credentials
- [ ] View appointments in table and calendar modes
- [ ] Filter by status and date
- [ ] Confirm/cancel/delete appointments
- [ ] Test appointment details popup

#### Internationalization

- [ ] Switch between all languages
- [ ] Verify RTL layout in Arabic
- [ ] Check translated country names
- [ ] Test date/time localization

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Issues**

```bash
# Check environment variables
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID

# Verify Firebase config in browser console
# Look for Firebase initialization errors
```

**Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```

**Styling Issues**

```bash
# Rebuild Tailwind CSS
npm run build
# Check for CSS conflicts in browser DevTools
```

**Translation Issues**

- Verify JSON syntax in translation files
- Check translation keys match component usage
- Ensure all languages have same key structure

### Getting Help

1. Check browser console for errors
2. Review Firebase Console for database issues
3. Verify environment variables are set correctly
4. Check network tab for API call failures

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@domain.com or create an issue in the repository.

---

**Made with ❤️ for modern barber shops**
