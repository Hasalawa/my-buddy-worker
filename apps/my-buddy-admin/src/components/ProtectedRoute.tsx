import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 🚀 අලුත් Architecture එකට අනුව අපි Firebase අයින් කරලා තියෙන්නේ.
    // Backend එකෙන් Session එකක් හදපු නිසා (HttpOnly Cookie), 
    // දැනට අපි sessionStorage එකේ තියෙන 'is2FAVerified' එකෙන් user ලොග් වෙලාද කියලා බලනවා.
    
    const checkAuth = () => {
      const has2FA = sessionStorage.getItem('is2FAVerified') === 'true';

      if (has2FA) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    // පොඩි delay එකක් දෙනවා Loading animation එක පේන්න
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);

    return () => clearTimeout(timer);
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