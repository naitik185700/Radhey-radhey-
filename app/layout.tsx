import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/storefront/CartDrawer';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Radhey Radhey Girls Point | Luxury Ethnic Wear & Women\'s Fashion',
  description:
    'Discover handcrafted luxury Indian ethnic wear, embroidered suit sets, kurti sets, co-ords, lehengas, and festive dresses from Radhey Radhey Girls Point.',
  keywords: [
    'Radhey Radhey Girls Point',
    'Ethnic Suits',
    'Kurti Sets',
    'Indian Fashion',
    'Anarkali Suits',
    'Jaipur Ethnic Wear',
    'Co-ord Sets',
    'Lehengas',
  ],
  openGraph: {
    title: 'Radhey Radhey Girls Point | Luxury Ethnic Wear',
    description: 'Artisanal Indian ethnic suits, festive wear, and boutique fashion collections.',
    url: 'https://radheygirlspoint.com',
    siteName: 'Radhey Radhey Girls Point',
    images: [
      {
        url: '/brand/hero-banner-source.png',
        width: 1200,
        height: 630,
        alt: 'Radhey Radhey Girls Point Festive Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
