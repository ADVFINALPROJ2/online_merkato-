import { I18nProvider } from '@/services/i18n-context';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata = {
  title: 'Digital Merkato',
  description: 'Ethiopia online marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <I18nProvider>{children}</I18nProvider>
        </Providers>
      </body>
    </html>
  )
}