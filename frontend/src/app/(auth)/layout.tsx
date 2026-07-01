import { AuthProvider } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/landing/footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}