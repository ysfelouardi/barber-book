# 💈 BarberBook Developer Guide

A complete step-by-step guide for building a fully functional **multilingual** barber appointment booking system using **Next.js**, **Firebase**, **Tailwind CSS**, and comprehensive internationalization — with everything you need to build, test, document, and deploy the project.

> ⚠️ Build **everything inside the current folder** — do **not create a subfolder like `barberbook/`**.
> 📁 Follow the **folder and file structure exactly as written**.
> 🧠 Use this guide as the **single source of truth** — do not hallucinate or invent structure or logic.
> 🔒 Stick to all naming conventions, formatting rules, and API signatures.

---

## 📦 Tech Stack Overview

| Layer                | Technology                       |
| -------------------- | -------------------------------- |
| Framework            | Next.js (App Router, TypeScript) |
| Internationalization | Custom i18n system (4 languages) |
| Styling              | Tailwind CSS (only)              |
| Backend              | Serverless API Routes (Next.js)  |
| Database             | Firebase Firestore               |
| Auth                 | Firebase Auth (admin only)       |
| API Documentation    | Swagger UI + OpenAPI 3.0         |
| Testing              | Jest + React Testing Library     |
| Code Quality         | ESLint + Prettier                |
| Hosting              | Vercel (free tier)               |

---

## 🌍 Internationalization Features

- **4 Languages**: English (EN), Spanish (ES), Arabic (AR), French (FR)
- **RTL Support**: Full right-to-left layout for Arabic
- **URL-based routing**: `/[locale]/page` structure
- **75+ Country translations**: For phone input component
- **Custom translation system**: Lightweight, server-side optimized
- **Logo positioning**: Consistent across RTL/LTR layouts

---

## 🚀 Getting Started

### 1. Scaffold the App

```bash
npx create-next-app@latest . --app --ts
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Main app dependencies
npm install zod react-hook-form firebase

# Development dependencies
npm install -D eslint prettier jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom husky lint-staged

# API Documentation
npm install swagger-ui-react
npm install -D @types/swagger-ui-react
```

### 3. Configure Tailwind

Update `tailwind.config.js`, `postcss.config.js`, and global styles in `app/globals.css`.

---

## 🗂 Folder Structure (Do NOT nest under a new directory)

```
app/
├── layout.tsx                    # Root layout (passes children through)
├── [locale]/                     # Internationalized routes
│   ├── layout.tsx               # Locale-specific layout (handles html/body)
│   ├── page.tsx                 # Booking form
│   ├── admin/                   # Admin dashboard
│   │   └── page.tsx
│   ├── login/                   # Admin login
│   │   └── page.tsx
│   └── api-docs/                # Swagger documentation
│       └── page.tsx
├── api/                         # API routes
│   ├── appointments/            # CRUD appointments
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── book/route.ts            # POST book appointment
│   ├── slots/route.ts           # GET available slots
│   ├── update/route.ts          # PATCH booking (legacy)
│   ├── auth/                    # Authentication endpoints
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── check/route.ts
│   └── swagger/                 # Swagger API spec
│       ├── route.ts
│       └── swagger.json
components/                      # UI components
├── AppointmentDetailsPopup.tsx
├── ConfirmDialog.tsx
├── CountryPhoneInput.tsx
├── EnhancedCalendar.tsx
└── SimpleLanguageSwitcher.tsx
hooks/                          # Custom hooks
└── useTranslations.ts
lang/                           # Translation files
├── en.json                     # English translations
├── es.json                     # Spanish translations
├── ar.json                     # Arabic translations
└── fr.json                     # French translations
lib/                            # Firebase + helpers
├── firebase.ts
├── firestore.ts
├── translations.ts
├── validation.ts
└── avatarUtils.ts
middleware.ts                   # i18n middleware
i18n.ts                        # i18n configuration
__tests__/                      # Jest test files
.gitignore                      # Comprehensive gitignore
README.md                       # Detailed project documentation
DEVELOPER_GUIDE.md              # This file
```

(Everything above must be placed in the **current folder** — no extra root folder.)

---

## 🌍 Internationalization Setup

### 1. Create Translation Files

Create `lang/` directory with JSON files for each locale:

```json
// lang/en.json
{
  "app": {
    "title": "BarberBook",
    "subtitle": "Book your barber appointment with ease"
  },
  "booking": {
    "title": "Book Your Appointment",
    "form": {
      "fullName": "Full Name",
      "phoneNumber": "Phone Number"
    }
  }
}
```

### 2. Translation System (`lib/translations.ts`)

```typescript
export type Locale = 'en' | 'es' | 'ar' | 'fr'

export const translations = {
  en: () => import('../lang/en.json').then((m) => m.default),
  es: () => import('../lang/es.json').then((m) => m.default),
  ar: () => import('../lang/ar.json').then((m) => m.default),
  fr: () => import('../lang/fr.json').then((m) => m.default),
}

export function getTranslation(obj: any, key: string): string {
  return key.split('.').reduce((o, k) => o?.[k], obj) || key
}
```

### 3. Custom Hook (`hooks/useTranslations.ts`)

```typescript
import { useParams } from 'next/navigation'
import { translations, getTranslation, type Locale } from '@/lib/translations'

export function useTranslations() {
  const params = useParams()
  const locale = (params?.locale as Locale) || 'en'

  const t = (key: string) => {
    const localeTranslations = translations[locale] || translations.en
    return getTranslation(localeTranslations, key)
  }

  return { t, locale }
}
```

### 4. Layout Structure for i18n

**Root Layout** (`app/layout.tsx`):

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Just pass children through - locale layout handles html/body
  return children
}
```

**Locale Layout** (`app/[locale]/layout.tsx`):

```typescript
export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

## 🔒 Firebase Setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)

2. Create a project

3. Enable **Authentication > Email/Password**

4. Enable **Firestore** with these collections:

   - `appointments`
   - `availability`

5. Add your Firebase config to `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Create `lib/firebase.ts` to initialize Firebase and `lib/firestore.ts` for database operations.

---

## 🧠 API Routes & Documentation

| Route                    | Method | Description                                    |
| ------------------------ | ------ | ---------------------------------------------- |
| `/api/book`              | POST   | Create new appointment                         |
| `/api/slots`             | GET    | Get available time slots from **today** onward |
| `/api/appointments`      | GET    | Get all appointments (admin only)              |
| `/api/appointments/[id]` | PATCH  | Update appointment status                      |
| `/api/appointments/[id]` | DELETE | Delete appointment                             |
| `/api/update`            | PATCH  | Legacy update endpoint                         |
| `/api/auth/login`        | POST   | Admin login                                    |
| `/api/auth/logout`       | POST   | Admin logout                                   |
| `/api/auth/check`        | GET    | Check authentication status                    |
| `/api/swagger`           | GET    | Serve OpenAPI specification                    |

### Swagger API Documentation

1. **OpenAPI Spec**: Create comprehensive `app/api/swagger/swagger.json`
2. **Swagger UI**: Implement at `/[locale]/api-docs` with custom styling
3. **Interactive Testing**: Full request/response examples and live testing

Access API docs at: `/en/api-docs`, `/es/api-docs`, etc.

---

## 🎨 Styling Guidelines

### Tailwind CSS Only

- **No component libraries** (shadcn/ui, Radix UI, etc.)
- **Mobile-first** responsive design
- **RTL-aware** layouts using `dir` attributes
- **Consistent spacing** and color schemes

### RTL Support Patterns

```jsx
// Logo positioning (consistent across RTL/LTR)
<h1 className="flex items-center justify-center gap-2">
  <span className="order-1">💈</span>
  <span className="order-2">{t('app.title')}</span>
</h1>

// Language switcher container
<div className="flex justify-end mb-4" dir="ltr">
  <SimpleLanguageSwitcher />
</div>
```

---

## 🔧 Component Guidelines

### Internationalized Components

```typescript
// Use translation hook in client components
const { t, locale } = useTranslations()

// Country phone input with 75+ translated countries
<CountryPhoneInput
  value={watch('phone') || ''}
  onChange={(value) => setValue('phone', value)}
  placeholder={t('booking.form.phonePlaceholder')}
/>

// Language switcher
<SimpleLanguageSwitcher />
```

### Component Naming & Structure

| Type             | Pattern          | Example                 |
| ---------------- | ---------------- | ----------------------- |
| Components       | PascalCase       | `CountryPhoneInput.tsx` |
| Files/Folders    | kebab-case       | `api-docs/`             |
| Translation Keys | dot.notation     | `booking.form.fullName` |
| Hooks            | use + PascalCase | `useTranslations`       |

---

## 📅 Admin Dashboard Features

- **Enhanced Calendar**: Month/week views with appointment overlays
- **Appointment Management**: Confirm, cancel, delete with confirmation dialogs
- **Real-time Updates**: Refresh functionality with loading states
- **Filtering**: By status (pending/confirmed/cancelled) and date
- **Detailed Popups**: Full customer information display
- **API Documentation**: Direct link to Swagger UI from admin header

---

## 🧾 Customer Booking Features

### Form Fields & Validation

- **Service type**: haircut, beard, both (required)
- **Date**: from today onward only (required)
- **Time**: based on available slots (required)
- **Name**: required, min 2 characters
- **Phone**: international format with country selector (required)

### Internationalized Phone Input

- **75+ countries** with flags and prefixes
- **Searchable dropdown** with translated country names
- **E.164 format validation**
- **RTL-compatible** layout

---

## 🧪 Testing Strategy

### Jest Configuration (`jest.config.ts`)

```typescript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
```

### Testing Patterns

- **Component testing**: Use React Testing Library
- **API testing**: Mock Firebase and test route handlers
- **i18n testing**: Test translation key resolution
- **Form validation**: Test zod schemas and user interactions

---

## 🗂️ Project Management

### Comprehensive .gitignore

```bash
# Dependencies
node_modules/

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env*

# Development
.vscode/
.idea/

# OS generated files
.DS_Store
Thumbs.db
```

### Environment Variables Template (`.env.local.example`)

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

---

## 🧹 Code Quality

### ESLint Configuration

```js
module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    'prefer-const': 'error',
    'no-unused-vars': 'warn',
  },
}
```

### Prettier Configuration

```json
{
  "singleQuote": true,
  "semi": false,
  "printWidth": 100,
  "trailingComma": "es5",
  "tabWidth": 2
}
```

---

## 📦 Deployment Checklist

### Pre-deployment

- [ ] All translations complete (EN, ES, AR, FR)
- [ ] API documentation generated and accessible
- [ ] Firebase security rules configured
- [ ] Environment variables set in production
- [ ] All tests passing
- [ ] Build successful (`npm run build`)

### Production Features

- [ ] Multilingual booking form (4 languages)
- [ ] Admin dashboard with calendar view
- [ ] Comprehensive API documentation
- [ ] RTL support for Arabic
- [ ] International phone input
- [ ] Firebase integration
- [ ] Responsive design
- [ ] Error handling and loading states

---

## 🛠️ Best Practices & Enhancements

### Performance Optimization

- **Static Generation**: Use `generateStaticParams` for locale routes
- **Image Optimization**: Use Next.js `Image` component
- **Code Splitting**: Dynamic imports for heavy components
- **Cache Headers**: Cache API responses appropriately

### Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG 2.1 AA compliance
- **RTL Support**: Proper text direction for Arabic

### Error Handling

- **Global Error Boundary**: Catch and display runtime errors
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Clear messages for no data scenarios
- **Form Validation**: Real-time validation with helpful messages

---

## 📘 Documentation Standards

### API Documentation

- **OpenAPI 3.0**: Complete specification in `swagger.json`
- **Interactive UI**: Swagger UI with custom styling
- **Request Examples**: Sample payloads for all endpoints
- **Authentication**: Clear auth requirements and flows

### Code Documentation

```typescript
/**
 * Books a new appointment in the system.
 * @param appointmentData - The appointment details
 * @returns Promise resolving to the appointment ID
 * @throws {ValidationError} When data is invalid
 * @throws {ConflictError} When time slot is unavailable
 */
async function createAppointment(appointmentData: BookingData): Promise<string>
```

### README Structure

- **Quick Start**: Installation and running instructions
- **Features**: Comprehensive feature list with screenshots
- **API Documentation**: Links to Swagger UI
- **Firebase Setup**: Step-by-step configuration guide
- **Deployment**: Vercel deployment instructions
- **Contributing**: Development workflow and guidelines

---

## ✅ Final Implementation Notes

### Architecture Principles

1. **Internationalization First**: All components support multiple languages
2. **API-Driven**: Clean separation between frontend and backend
3. **Type Safety**: Full TypeScript coverage with proper interfaces
4. **Mobile Responsive**: Works seamlessly on all device sizes
5. **Accessibility**: WCAG 2.1 AA compliant
6. **Documentation**: Self-documenting code and comprehensive API docs

### Success Metrics

- ✅ **4 Languages**: English, Spanish, Arabic, French
- ✅ **RTL Support**: Proper Arabic layout and text direction
- ✅ **API Documentation**: Interactive Swagger UI
- ✅ **Clean Architecture**: No hydration warnings, optimized performance
- ✅ **Production Ready**: Comprehensive error handling and validation
- ✅ **Developer Experience**: Clear documentation and maintainable code

---

**Build everything directly in the root folder. Follow this structure exactly. Use this guide as your complete reference for the multilingual BarberBook application.**

Happy shipping! 💇‍♂️🌍
