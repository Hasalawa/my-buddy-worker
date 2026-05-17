# My Buddy Admin

A modern admin dashboard for the My Buddy Worker platform. Built with React, TypeScript, Vite, and Tailwind CSS, this app helps administrators manage users, jobs, analytics, complaints, finance, audit logs, and more.

## 🚀 Features

- **User Management**: View and manage user accounts
- **Job Management**: Handle job postings and assignments
- **Analytics Dashboard**: Monitor platform performance and insights
- **Complaints Handling**: Manage and resolve user complaints
- **Finance Overview**: Track financial data and transactions
- **Audit Logs**: Review administrative activity
- **Settings**: Configure application preferences

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Framer Motion
- Lucide React
- Firebase
- React Hot Toast

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

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

3. Set up Firebase configuration:
   - Copy your Firebase credential file to `serviceAccountKey.json`
   - Update `src/config/firebase.ts` with your Firebase project settings

> `serviceAccountKey.json` contains sensitive keys and should not be committed to source control.

## 🏃‍♂️ Development

Run the local development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🔨 Build

Create a production build:

```bash
npm run build
```

## 🧪 Preview

Preview the production build locally:

```bash
npm run preview
```

## 📝 Linting

Check the code with ESLint:

```bash
npm run lint
```

## 🚀 Deployment

This project is configured for Vercel deployment via `vercel.json`.

To deploy:

```bash
npm install -g vercel
vercel
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, icons, etc.)
├── components/       # Reusable UI components
│   ├── ui/           # Base UI components
│   ├── Preloader.tsx
│   ├── ProtectedRoute.tsx
│   └── Sidebar.tsx
├── config/           # App configuration
│   └── firebase.ts   # Firebase setup
├── layouts/          # Layout components
│   └── AdminLayout.tsx
├── pages/            # Page views
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
├── utils/            # Utility functions
│   └── discord.ts    # Discord integration utilities
├── App.css           # Global styles
├── App.tsx           # Main application component
├── index.css         # Base styles
└── main.tsx          # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push your branch (`git push origin feature/your-feature`)
5. Open a pull request

## 📄 License

This project is private and proprietary.

## 📞 Contact

For questions or support, contact the development team.
