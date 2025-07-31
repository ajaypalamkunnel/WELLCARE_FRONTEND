# 🌟 WELLCARE Frontend

<div align="center">

![WELLCARE Logo](https://img.shields.io/badge/WELLCARE-Healthcare%20Platform-03C03C?style=for-the-badge)

**A modern, responsive healthcare consultation platform built with Next.js 15, TypeScript, and cutting-edge web technologies**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-wellcare.space-blue?style=for-the-badge)](https://www.wellcare.space)
[![GitHub Repo](https://img.shields.io/badge/📦%20Backend%20Repo-WELLCARE__BACKEND-green?style=for-the-badge)](https://github.com/ajaypalamkunnel/WELLCARE_BACKEND)

</div>

---

## 📋 Project Overview

WELLCARE Frontend is a sophisticated, user-centric healthcare web application that revolutionizes the way patients connect with healthcare professionals. Built with Next.js 15 and modern React technologies, it offers seamless doctor consultations, appointment booking, real-time chat, and high-quality video calling experiences.

Our platform serves **500+ expert doctors** across **50+ specialties**, helping **10,000+ happy patients** access quality healthcare from the comfort of their homes with **24/7 support** availability.

## ✨ Key Features

### 🏠 **Homepage & Navigation**
- **Hero Section**: Compelling call-to-action with statistics (500+ Doctors, 10k+ Patients)
- **Medical Specialties**: Browse 11+ departments including Cardiology, Neurology, Pediatric
- **Doctor Discovery**: Advanced search and filtering by specialty, location, and availability
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👨‍⚕️ **Doctor Management**
- **Doctor Profiles**: Detailed profiles with specialization, experience, ratings, and availability
- **Real-time Availability**: Live status indicators for online/offline doctors
- **Advanced Filtering**: Filter by gender, department, availability, and ratings
- **Verification Badges**: Verified doctor indicators for trust and credibility

### 📅 **Appointment Booking System**
- **Interactive Calendar**: User-friendly date and time slot selection
- **Real-time Slot Management**: Live availability updates to prevent double bookings
- **Appointment History**: Complete history of past and upcoming appointments
- **Cancellation Management**: Easy appointment cancellation with refund processing
- **Appointment Details**: Comprehensive view of appointment information

### 💬 **Real-time Communication**
- **Live Chat System**: Instant messaging between patients and doctors
- **Message History**: Persistent chat history and conversation management
- **Real-time Notifications**: Instant updates for new messages and appointments
- **Typing Indicators**: Real-time typing status for better user experience

### 🎥 **Video Consultation**
- **HD Video Calls**: Crystal-clear video calling powered by Agora SDK
- **Screen Sharing**: Ability to share screens during consultations
- **Call Controls**: Mute/unmute, video on/off, and call termination controls
- **Call Timer**: Session duration tracking for billing purposes
- **Recording Options**: Session recording capabilities (with consent)

### 💳 **Payment Integration**
- **Razorpay Gateway**: Secure payment processing for appointments
- **Wallet System**: Digital wallet for easy payments and refunds
- **Transaction History**: Complete payment and transaction records
- **Multiple Payment Methods**: Support for cards, UPI, and digital wallets

### 👤 **User Management**
- **Multi-role Authentication**: Separate interfaces for Patients, Doctors, and Admins
- **Profile Management**: Comprehensive user profiles with medical history
- **Google OAuth**: Social login integration for seamless access
- **Password Management**: Secure password reset and change functionality

### 📱 **Additional Features**
- **Prescription Downloads**: Digital prescription generation and download
- **Review System**: Patient reviews and ratings for doctors
- **Medical Departments**: Organized healthcare services by specialty
- **About Page**: Comprehensive information about the platform and team
- **Responsive UI**: Mobile-first design with seamless cross-device experience

## 🛠️ Technologies Used

### **Frontend Framework**
- **Next.js 15** - Latest React framework with App Router
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development environment

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions
- **Tailwind Animate** - Additional animation utilities
- **Custom Design System** - Consistent color scheme and typography

### **Real-time Communication**
- **Socket.IO Client** - Real-time bidirectional communication
- **Agora RTC SDK** - High-quality video calling and streaming

### **State Management & Data**
- **Zustand** - Lightweight state management
- **React Hook Form** - Efficient form handling
- **Axios** - HTTP client for API communication

### **UI Components & Libraries**
- **Headless UI** - Accessible component primitives
- **Heroicons** - Beautiful SVG icons
- **Radix UI** - Low-level UI primitives
- **Ant Design** - Additional UI components
- **Lucide React** - Modern icon library

### **Utilities & Tools**
- **Day.js** - Date manipulation library
- **JWT Decode** - JSON Web Token decoding
- **React Toastify** - Toast notifications
- **React Hot Toast** - Alternative toast system
- **Class Variance Authority** - Dynamic class management
- **File Saver** - Client-side file saving

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **TypeScript** - Static type checking

## 📁 Folder Structure

```
src/
├── 📁 app/                    # Next.js App Router pages
│   ├── 📁 (auth)/            # Authentication group routes
│   ├── 📁 Home/              # Homepage components
│   ├── 📁 admin/             # Admin dashboard
│   ├── 📁 auth-success/      # OAuth success page
│   ├── 📁 doctor/            # Doctor-specific pages
│   ├── 📁 doctordashboard/   # Doctor dashboard
│   ├── 📁 selectrole/        # Role selection page
│   ├── 📁 user/              # User-specific pages
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Global styles
│   └── not-found.tsx         # 404 error page
├── 📁 components/            # Reusable React components
│   ├── 📁 admin/             # Admin-specific components
│   ├── 📁 chatComponents/    # Chat functionality components
│   ├── 📁 commonUIElements/  # Shared UI components
│   ├── 📁 doctorComponents/  # Doctor interface components
│   ├── 📁 homeComponents/    # Homepage components
│   ├── 📁 otpPage/           # OTP verification components
│   ├── 📁 providers/         # Context providers
│   ├── 📁 selectRole/        # Role selection components
│   ├── 📁 toastProvider/     # Toast notification provider
│   ├── 📁 ui/                # Base UI components
│   ├── 📁 userComponents/    # User interface components
│   ├── 📁 videoCallComponents/ # Video calling components
│   ├── LoginComponent.tsx    # Login form component
│   ├── Signup.tsx            # Registration form component
│   ├── OtpPage.tsx          # OTP verification page
│   └── Forgot-password.tsx   # Password reset component
├── 📁 config/                # Configuration files
├── 📁 constants/             # Application constants
├── 📁 hooks/                 # Custom React hooks
├── 📁 lib/                   # Utility libraries
├── 📁 services/              # API service functions
├── 📁 store/                 # State management (Zustand)
├── 📁 types/                 # TypeScript type definitions
├── 📁 utils/                 # Utility functions
└── middleware.ts             # Next.js middleware
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/ajaypalamkunnel/WELLCARE_FRONTEND.git
cd WELLCARE_FRONTEND
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Agora Configuration
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=WELLCARE
NEXT_PUBLIC_APP_DESCRIPTION="Trusted Healthcare Platform"
```

### 4. Start the Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

The application will start on `http://localhost:3000`

### 5. Build for Production
```bash
# Clean previous builds and create production build
npm run build

# Start production server
npm start
```

## 🏃‍♂️ How to Run the Project Locally

### **Complete Setup Guide**

1. **Prerequisites Check**:
   ```bash
   # Check Node.js version (should be 18+)
   node --version
   
   # Check npm version
   npm --version
   ```

2. **Project Setup**:
   ```bash
   # Clone the repository
   git clone https://github.com/ajaypalamkunnel/WELLCARE_FRONTEND.git
   cd WELLCARE_FRONTEND
   
   # Install dependencies
   npm install
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env.local` (if available)
   - Add all required environment variables
   - Ensure backend server is running on port 5000

4. **Backend Connection**:
   - Clone and setup the [WELLCARE_BACKEND](https://github.com/ajaypalamkunnel/WELLCARE_BACKEND)
   - Start the backend server first
   - Verify backend is running on `http://localhost:5000`

5. **Start Frontend**:
   ```bash
   npm run dev
   ```

6. **Verify Installation**:
   - Visit `http://localhost:3000`
   - Check console for any errors
   - Test basic navigation and features

### **Development Workflow**

1. **Code Changes**:
   - Next.js provides hot reload for instant updates
   - Changes to components reflect immediately
   - TypeScript errors show in terminal and browser

2. **Testing Features**:
   - Test authentication flow
   - Verify real-time chat functionality
   - Test video calling (requires backend and Agora configuration)
   - Check responsive design on different screen sizes

## 🌐 Deployment Information

### **Live Application**
- **Production URL**: [https://www.wellcare.space](https://www.wellcare.space)
- **Deployment Platform**: Vercel (optimized for Next.js)

### **GitHub Repositories**
- **Frontend Repository**: [WELLCARE_FRONTEND](https://github.com/ajaypalamkunnel/WELLCARE_FRONTEND)
- **Backend Repository**: [WELLCARE_BACKEND](https://github.com/ajaypalamkunnel/WELLCARE_BACKEND)

### **Deployment Platforms**

#### **Recommended Platforms for Next.js**:
- **Vercel** (Recommended) - Optimized for Next.js
- **Netlify** - Great for static sites and SSG
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Scalable hosting

#### **Vercel Deployment** (Recommended):
1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Environment Variables**:
   - Add all environment variables in Vercel dashboard
   - Update API URLs to production endpoints
   - Configure domain settings

3. **Build Settings**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

#### **Custom Domain Setup**:
- Configure custom domain in deployment platform
- Update CORS settings in backend for new domain
- Update environment variables with production URLs

### **Performance Optimizations**
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting with dynamic imports
- **SSR/SSG**: Server-side rendering for better SEO
- **CDN**: Vercel Edge Network for global content delivery

## 🤝 Contributing Guidelines

We welcome contributions to WELLCARE Frontend! Here's how you can help:

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   git fork https://github.com/ajaypalamkunnel/WELLCARE_FRONTEND.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Development Setup**
   ```bash
   npm install
   npm run dev
   ```

4. **Make Your Changes**
   - Follow the existing code structure
   - Use TypeScript for type safety
   - Follow Tailwind CSS conventions
   - Test your changes thoroughly

5. **Code Quality Checks**
   ```bash
   # Run linting
   npm run lint
   
   # Fix linting issues
   npm run lint:fix
   
   # Type check
   npx tsc --noEmit
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

7. **Push and Create PR**
   ```bash
   git push origin feature/amazing-new-feature
   ```

### **Development Guidelines**

#### **Code Style**:
- Use **TypeScript** for all new components
- Follow **React functional components** with hooks
- Use **Tailwind CSS** for styling
- Implement **responsive design** principles
- Follow **accessibility best practices**

#### **Component Structure**:
```tsx
// Example component structure
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

#### **Commit Message Format**:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### **Areas for Contribution**
- 🐛 **Bug Fixes**: Report and fix bugs
- ✨ **New Features**: Add new functionality
- 🎨 **UI/UX Improvements**: Enhance user interface
- 📱 **Mobile Responsiveness**: Improve mobile experience
- 🔧 **Performance**: Optimize loading and runtime performance
- 📚 **Documentation**: Improve documentation and examples
- 🧪 **Testing**: Add unit and integration tests

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 Transform Healthcare with WELLCARE

**Experience the future of healthcare consultations**

[![Star this repo](https://img.shields.io/github/stars/ajaypalamkunnel/WELLCARE_FRONTEND?style=social)](https://github.com/ajaypalamkunnel/WELLCARE_FRONTEND)
[![Follow on GitHub](https://img.shields.io/github/followers/ajaypalamkunnel?style=social)](https://github.com/ajaypalamkunnel)

**Built with ❤️ and ⚡ by [Ajay Palamkunnel](https://github.com/ajaypalamkunnel)**

*Connecting patients with trusted healthcare professionals worldwide* 🏥✨

</div>
