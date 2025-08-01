# SAVIOUR - Disaster Management Platform

![Saviour Logo](/public/Saviour.png)

## Overview

SAVIOUR is a comprehensive disaster management platform designed to empower communities and save lives during emergencies. Built with Next.js and Firebase, this application provides real-time alerts, emergency coordination, resource management, and safety information to help users prepare for, respond to, and recover from natural disasters and other emergency situations.

## Key Features

### 🚨 Emergency Alert System
- Real-time SOS alerts with location tracking
- Multi-level emergency categorization (High/Medium/Low priority)
- Support for various emergency types (Medical, Fire, Natural Disasters, etc.)
- Image upload capability for emergency documentation
- 5-second cancellation window for accidental alerts

### 🗺️ Navigation & Location Services
- Fast location detection with caching for immediate response
- Fallback mechanisms for geolocation services
- Integration with OpenWeatherMap for local weather alerts
- Map visualization of nearby emergencies and resources

### 📊 Resource Management
- Track essential supplies in your area
- Request and offer resources during emergencies
- Inventory management for disaster response teams
- Base64 storage for images and documents

### 👥 Community Support
- User-to-user assistance network
- Community chat for local coordination
- Help tracking for emergency responders
- SOS response coordination

### 📱 User & Admin Dashboards
- User-friendly dashboards with real-time updates
- Admin controls for resource allocation and emergency management
- Safety statistics and activity tracking
- Quick action buttons for common emergency tasks

### 🛡️ Safety Information
- Comprehensive safety guidelines for different emergencies
- Video tutorials for first aid and safety procedures
- Interactive safety guide for various disaster scenarios
- Educational resources on disaster preparedness

## Technical Stack

### Frontend
- **Framework**: Next.js 15.1.0
- **UI Libraries**: TailwindCSS, shadcn/ui components
- **State Management**: React Hooks, Zustand
- **Maps & Visualization**: Leaflet, React-Leaflet, React-Globe.gl
- **Animation**: Framer Motion

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Base64 encoding in Firestore
- **APIs**: OpenWeatherMap, Nominatim Geocoding

### Communication
- **Real-time**: Socket.io
- **Notifications**: In-app notifications
- **Email**: Nodemailer

## Project Structure

```
saviour-project/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router
│   │   ├── api/        # API routes
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # User dashboard
│   │   ├── admin-dashboard/ # Admin interface
│   │   └── ...         # Other app routes
│   ├── components/     # Reusable UI components
│   │   ├── Safety/     # Safety information components
│   │   ├── ui/         # Base UI components
│   │   └── ...         # Other components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   │   ├── actions/    # Server actions
│   │   ├── stores/     # State stores
│   │   └── ...         # Other utilities
│   └── types/          # TypeScript type definitions
└── ...                 # Configuration files
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
github.com/vikrantwiz02/Saviour2.O
cd Saviour2.O
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_GEMINI_API_KEY=
JWT_SECRET=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
BASE_URL=
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

SMTP_HOST=smtp.example.com
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=Saviour_Team
CONTACT_RECIPIENT_EMAIL=
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy the application is to use Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fsaviour-project)

For other deployment options, follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Performance Optimizations

The application includes several performance optimizations:
- Location caching to speed up emergency responses
- Parallel data fetching for faster dashboard loading
- Optimized geolocation with fallback mechanisms
- Efficient handling of image uploads with size restrictions
- Progressive loading of UI components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Nominatim](https://nominatim.org/) for geocoding services
- All the contributors who have helped shape SAVIOUR
