import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlarmModal } from '@/components/lib/FormModal/AlarmModal';
import { MainLayout } from '@/components/layouts/Main';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/lib/ProtectedRoute';
import { ErrorBoundary } from '@/components/lib/ErrorBoundary';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Checkout } from '@/pages/Checkout';

// Admin Pages
import { Dashboard } from '@/pages/Admin/Dashboard';
import { Orders as AdminOrders } from '@/pages/Admin/Orders';
import { CustomerOrders } from '@/pages/Orders';
import { Profile } from '@/pages/Profile';
import { Products } from '@/pages/Admin/Products';
import { Branches } from '@/pages/Admin/Branches';
import { Staff } from '@/pages/Admin/Staff';
import { Categories } from '@/pages/Admin/Categories';
import { Reports } from '@/pages/Admin/Reports';
import { Promos } from '@/pages/Admin/Promos';
import { AuditLogs } from '@/pages/Admin/AuditLogs';
import { Settings } from '@/pages/Admin/Settings';

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize dark mode from localStorage
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AlarmModal />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="branches" element={<Branches />} />
            <Route path="staff" element={<Staff />} />
            <Route path="reports" element={<Reports />} />
            <Route path="promos" element={<Promos />} />
            <Route path="logs" element={<AuditLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Fallback */}
          <Route path="*" element={<div className="p-8 text-center text-red-600 text-2xl font-bold mt-20">404 - Sayfa Bulunamadı</div>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
