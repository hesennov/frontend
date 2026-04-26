import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleCart } from '@/store/slices/uiSlice';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const getProfilePath = () => {
    if (!isAuthenticated) return '/login';
    if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF') return '/admin';
    return '/profile';
  };

  const navItems = [
    { name: 'Ana Sayfa', path: '/', icon: Home },
    { name: 'Siparişlerim', path: '/orders', icon: ClipboardList },
    { name: 'Sepetim', isAction: true, icon: ShoppingBag, badge: cartCount },
    { name: 'Profil', path: getProfilePath(), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-around py-4 px-2 shadow-2xl shadow-black/20">
        {navItems.map((item) => {
          if (item.isAction && item.name === 'Sepetim') {
            return (
              <button
                key={item.name}
                onClick={() => dispatch(toggleCart())}
                className="relative flex flex-col items-center gap-1 p-2 transition-all text-gray-400 hover:text-orange-500 cursor-pointer"
              >
                <div className="relative">
                  <item.icon className="w-6 h-6 stroke-[2.5]" />
                  {(item.badge ?? 0) > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-900"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path!}
              className={({ isActive }) => `
                relative flex flex-col items-center gap-1 p-2 transition-all
                ${isActive ? 'text-orange-500' : 'text-gray-400'}
              `}
            >
              <div className="relative">
                <item.icon className="w-6 h-6 stroke-[2.5]" />
                {(item.badge ?? 0) > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-gray-900"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
