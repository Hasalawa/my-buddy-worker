import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      // ✅ අලුතින් හැදූ adminUser object එක session storage එකේ තියෙනවද කියලා බලනවා
      const hasAdminSession = sessionStorage.getItem('adminUser') !== null;

      // Firebase auth එකෙනුත් ලොග් වෙලා, Session එකෙත් Data තියෙනවා නම් විතරක් ඇතුලට දානවා
      if (user && hasAdminSession) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}