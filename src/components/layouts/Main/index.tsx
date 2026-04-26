import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { CartDrawer } from '@/components/lib/CartDrawer';
import { BottomNav } from '../BottomNav';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </main>
      <CartDrawer />
      <BottomNav />
    </div>
  );
};
