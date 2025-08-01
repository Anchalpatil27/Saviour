# 🌟 SAVIOUR - Disaster Management Platform

<div align="center">
  <picture>
    <source srcset="/public/Saviour2.png" media="(prefers-color-scheme: dark)" />
    <source srcset="/public/Saviour.png" media="(prefers-color-scheme: light)" />
    <img src="/public/Saviour.png" alt="Saviour Logo" width="300px" />
  </picture>
  
  <h3>Empowering communities to prepare, respond, and recover from disasters</h3>
</div>

## 🚀 Overview

**SAVIOUR** is a cutting-edge disaster management platform built to save lives and strengthen community resilience during emergencies. Leveraging modern web technologies, our application delivers:

- ⚡ **Real-time emergency coordination**
- 🔔 **Instant alerts and notifications**
- 📍 **Location-based resource tracking**
- 👥 **Community support networks**
- 📊 **Resource management tools**
- 🛡️ **Comprehensive safety information**
- 📱 **Available on Web, iOS, and Android platforms**

<div align="center">
  <a href="https://saviour-ten.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Saviour_Platform-4285F4?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
</div>

## 📱 Mobile Apps

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="iOS">
      </td>
      <td align="center">
        <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android">
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <a href="https://github.com/vikrantwiz02/Saviour" target="_blank">
          <img src="https://img.shields.io/badge/View Mobile Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
        </a>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <p align="center">The mobile versions of SAVIOUR are available for both iOS and Android platforms, providing on-the-go access to critical emergency features and disaster management tools. The mobile app codebase is maintained in a separate repository.</p>
      </td>
    </tr>
  </table>
</div>

## ✨ Key Features

### 🚨 Emergency Alert System
<details>
<summary><b>Expand for details</b></summary>

- Real-time SOS alerts with location tracking
- Multi-level emergency categorization (High/Medium/Low priority)
- Support for various emergency types (Medical, Fire, Natural Disasters, etc.)
- Image upload capability for emergency documentation
- 5-second cancellation window for accidental alerts
</details>

### 🗺️ Navigation & Location Services
<details>
<summary><b>Expand for details</b></summary>

- Fast location detection with caching for immediate response
- Fallback mechanisms for geolocation services
- Integration with OpenWeatherMap for local weather alerts
- Map visualization of nearby emergencies and resources
</details>

### 📊 Resource Management
<details>
<summary><b>Expand for details</b></summary>

- Track essential supplies in your area
- Request and offer resources during emergencies
- Inventory management for disaster response teams
- Base64 storage for images and documents
</details>

### 👥 Community Support
<details>
<summary><b>Expand for details</b></summary>

- User-to-user assistance network
- Community chat for local coordination
- Help tracking for emergency responders
- SOS response coordination
</details>

### 📱 User & Admin Dashboards
<details>
<summary><b>Expand for details</b></summary>

- User-friendly dashboards with real-time updates
- Admin controls for resource allocation and emergency management
- Safety statistics and activity tracking
- Quick action buttons for common emergency tasks
</details>

### 🛡️ Safety Information
<details>
<summary><b>Expand for details</b></summary>

- Comprehensive safety guidelines for different emergencies
- Video tutorials for first aid and safety procedures
- Interactive safety guide for various disaster scenarios
- Educational resources on disaster preparedness
</details>

## 💻 Technical Stack

<div align="center">
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.1.0-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"></a>
  </p>
  <p>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"></a>
    <a href="https://github.com/vikrantwiz02/Saviour"><img src="https://img.shields.io/badge/iOS_App-Available-black?style=for-the-badge&logo=apple" alt="iOS"></a>
  </p>
  <p>
    <a href="https://github.com/vikrantwiz02/Saviour"><img src="https://img.shields.io/badge/Android_App-Available-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge" alt="License"></a>
  </p>
  
  <table>
    <tr>
      <th>Frontend</th>
      <th>Backend</th>
      <th>Communication</th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>Next.js 15.1.0</li>
          <li>TailwindCSS</li>
          <li>shadcn/ui components</li>
          <li>React Hooks, Zustand</li>
          <li>Leaflet, React-Globe.gl</li>
          <li>Framer Motion</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Firebase Firestore</li>
          <li>Firebase Auth</li>
          <li>Base64 encoding</li>
          <li>OpenWeatherMap API</li>
          <li>Nominatim Geocoding</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>Socket.io</li>
          <li>In-app notifications</li>
          <li>Nodemailer</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 📂 Project Structure

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

## 🚀 Getting Started

<details>
<summary><b>Prerequisites</b></summary>

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
</details>

### 📱 Mobile App Installation

For installing the mobile version:

1. **Visit the mobile repository:**
   [https://github.com/vikrantwiz02/Saviour](https://github.com/vikrantwiz02/Saviour)

2. **Follow the installation instructions** in the mobile app repository README.

### ⚙️ Web App Installation

1. **Clone the repository:**
```bash
git clone github.com/vikrantwiz02/Saviour2.O
cd Saviour2.O
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

<details>
<summary>View required environment variables</summary>

```env
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
</details>

4. **Start the development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🚢 Deployment

<div align="center">
  
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvikrantwiz02%2FSaviour2.O)
  
</div>

For other deployment options, follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## ⚡ Performance Optimizations

<div align="center">
  <table>
    <tr>
      <td align="center"><h3>🚀</h3> Location caching</td>
      <td align="center"><h3>⚡</h3> Parallel data fetching</td>
      <td align="center"><h3>📱</h3> Progressive loading</td>
    </tr>
    <tr>
      <td>Speeds up emergency responses</td>
      <td>Faster dashboard loading</td>
      <td>Optimized UI components</td>
    </tr>
    <tr>
      <td align="center"><h3>📍</h3> Geolocation fallbacks</td>
      <td align="center"><h3>🖼️</h3> Optimized images</td>
      <td align="center"><h3>🌐</h3> API optimizations</td>
    </tr>
    <tr>
      <td>Multiple location sources</td>
      <td>Size restrictions & efficient handling</td>
      <td>Rate limiting & caching</td>
    </tr>
  </table>
</div>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

<ol>
  <li>Fork the repository</li>
  <li>Create your feature branch (<code>git checkout -b feature/amazing-feature</code>)</li>
  <li>Commit your changes (<code>git commit -m 'Add some amazing feature'</code>)</li>
  <li>Push to the branch (<code>git push origin feature/amazing-feature</code>)</li>
  <li>Open a Pull Request</li>
</ol>

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgements

<div align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://firebase.google.com/" target="_blank"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"></a>
  <a href="https://openweathermap.org/api" target="_blank"><img src="https://img.shields.io/badge/OpenWeatherMap-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white" alt="OpenWeatherMap API"></a>
  <a href="https://nominatim.org/" target="_blank"><img src="https://img.shields.io/badge/Nominatim-4A89DC?style=for-the-badge&logo=openstreetmap&logoColor=white" alt="Nominatim"></a>
</div>

## ✨ Team & Contributors

<div align="center">

### Project Leads

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/vikrantwiz02">
        <img src="https://github.com/vikrantwiz02.png" width="100px;" alt="Vikrant Kumar"/>
        <br />
        <sub><b>Vikrant Kumar</b></sub>
      </a>
      <br />
      <small>Project Lead</small>
    </td>
    <td align="center">
      <a href="https://github.com/Ravikumar-2016">
        <img src="https://github.com/Ravikumar-2016.png" width="100px;" alt="Gunti Ravi Kumar"/>
        <br />
        <sub><b>Gunti Ravi Kumar</b></sub>
      </a>
      <br />
      <a href="https://www.linkedin.com/in/ravikumar-gunti-8b360a2a8">LinkedIn</a>
    </td>
    <td align="center">
      <a href="https://github.com/harshpalas">
        <img src="https://github.com/harshpalas.png" width="100px;" alt="Harsh Kumar Palas"/>
        <br />
        <sub><b>Harsh Kumar Palas</b></sub>
      </a>
      <br />
      <a href="https://www.linkedin.com/in/harsh-kumar-palas-652831249/">LinkedIn</a>
    </td>
    <td align="center">
      <a href="https://github.com/">
        <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" width="100px;" alt="Anchal Siddharth Patil"/>
        <br />
        <sub><b>Anchal Siddharth Patil</b></sub>
      </a>
      <br />
      <a href="https://www.linkedin.com/in/anchal-patil-67b18a299/">LinkedIn</a>
    </td>
  </tr>
</table>

</div>

<div align="center">
  <br>
  <p>
    <sub>Built with ❤️ by the SAVIOUR team</sub>
  </p>
</div>