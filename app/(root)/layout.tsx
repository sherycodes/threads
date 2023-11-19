import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import TopBar from '@/components/shared/TopBar';
import RightSideBar from '@/components/shared/RightSideBar';
import BottomBar from '@/components/shared/BottomBar';
import LeftSideBar from '@/components/shared/LeftSideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Threads',
  description: 'Threads Clone built Using Next 14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang='en'>
        <body className={inter.className}>
          <TopBar />
          <main className='flex'>
            <LeftSideBar />
            <section className='bg-dark-1 min-h-screen flex-col flex-1 items-center pt-28 px-6 pb-10 max-md:pb-32 sm:px-10'>
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            <RightSideBar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
