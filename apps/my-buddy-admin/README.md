# My Buddy Admin

A modern web-based admin dashboard for managing the My Buddy Worker platform. Built with React, TypeScript, Vite, and Tailwind CSS. This application allows administrators to oversee users, jobs, analytics, complaints, finance, and more.

## 🚀 Features

- **User Management**: View and manage user accounts
- **Job Management**: Handle job postings and assignments
- **Analytics Dashboard**: Monitor platform metrics and insights
- **Complaints Handling**: Manage and resolve user complaints
- **Finance Overview**: Track financial data and transactions
- **Audit Logs**: Maintain logs of administrative actions
- **Settings**: Configure application preferences

## 🛠️ Tech Stack

- **React** 19 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Recharts** - Chart library for data visualization
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Firebase** - Backend services (authentication, database)
- **React Hot Toast** - Notification system

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hasalawa/my-buddy-worker.git
   cd my-buddy-worker/apps/my-buddy-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy the Firebase service account key to `serviceAccountKey.json`
   - Configure Firebase settings in `src/config/firebase.ts`

## 🏃‍♂️ Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## 🔨 Build

Build the application for production:

```bash
npm run build
```

## 📝 Lint

Run ESLint to check code quality:

```bash
npm run lint
```

## 🖥️ Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🚀 Deployment

This application is configured for deployment on Vercel. The `vercel.json` file contains the deployment configuration.

To deploy:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, etc.)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components
│   ├── Preloader.tsx
│   ├── ProtectedRoute.tsx
│   └── Sidebar.tsx
├── config/          # Configuration files
│   └── firebase.ts  # Firebase configuration
├── layouts/         # Layout components
│   └── AdminLayout.tsx
├── pages/           # Page components
│   ├── AddAdmin.tsx
│   ├── Admins.tsx
│   ├── Analytics.tsx
│   ├── AuditLogs.tsx
│   ├── AuthPage.tsx
│   ├── Complaints.tsx
│   ├── Dashboard.tsx
│   ├── Finance.tsx
│   ├── Flagged.tsx
│   ├── Jobs.tsx
│   ├── NotFound.tsx
│   ├── Settings.tsx
│   ├── Support.tsx
│   └── Users.tsx
├── utils/           # Utility functions
│   └── discord.ts   # Discord integration utilities
├── App.css         # Global styles
├── App.tsx         # Main app component
├── index.css       # Index styles
└── main.tsx        # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Contact

For questions or support, please contact the development team.
