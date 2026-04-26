import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from '@/components/layouts/SideBar';
import { socketManager } from '@/sockets/socketManager';
import { Menu, Bell } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { triggerAlarm } from '@/store/slices/uiSlice';

export const AdminLayout = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeOrders } = useSelector((state: RootState) => state.order);
  const { pendingAlarms } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Ensure socket is connected (handles page refresh case)
    socketManager.connect();
  }, []);

  // Order Reminder Logic: Every 20 seconds, check for pending orders that aren't already alarming
  useEffect(() => {
    const interval = setInterval(() => {
      const pendingNotAlarming = activeOrders.filter(order => 
        order.status === 'PENDING' && 
        !pendingAlarms.some(alarm => alarm.id === order.id)
      );

      pendingNotAlarming.forEach(order => {
        dispatch(triggerAlarm({
          id: order.id,
          message: `DİKKAT: #${order.id} nolu sipariş hala onay bekliyor!`
        }));
      });
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [activeOrders, pendingAlarms, dispatch]);

  return (
    <div className="min-h-screen bg-orange-50/20 flex flex-col md:flex-row">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-orange-100 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-orange-50 text-orange-600 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-black tracking-tighter text-gray-900">
            <span className="text-orange-600">Kebab</span>evi.
          </span>
          <button className="p-2 hover:bg-orange-50 text-orange-600 rounded-xl transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-10 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
