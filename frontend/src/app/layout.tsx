import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from 'sonner';
import NotificationProvider from '@/components/NotificationProvider';
import { I18nProvider } from '@/services/i18n-context';
import QueryProvider from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/landing/footer';
import './globals.css';

export const metadata = {
  title: 'Digital Merkato',
  description: 'Ethiopia online marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <I18nProvider>
              <NotificationProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
                <Toaster />
              </NotificationProvider>
            </I18nProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}