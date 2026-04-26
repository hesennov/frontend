import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, MapPin, Settings, LogOut, Users, Tag, BarChart3, Ticket, Activity } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import type { RootState } from '@/store';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SideBar = ({ isOpen, onClose }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: 'Siparişler', path: '/admin/orders', icon: ShoppingCart, roles: ['STAFF', 'ADMIN', 'SUPER_ADMIN'] },
    { name: 'Kategoriler', path: '/admin/categories', icon: Tag, roles: ['STAFF', 'ADMIN', 'SUPER_ADMIN'] },
    { name: 'Ürünler', path: '/admin/products', icon: Package, roles: ['STAFF', 'ADMIN', 'SUPER_ADMIN'] },
    { name: 'Şubeler', path: '/admin/branches', icon: MapPin, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: 'Personel', path: '/admin/staff', icon: Users, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: 'Raporlar', path: '/admin/reports', icon: BarChart3, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: 'Kuponlar', path: '/admin/promos', icon: Ticket, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: 'Denetim Kayıtları', path: '/admin/logs', icon: Activity, roles: ['ADMIN', 'SUPER_ADMIN'] },
    { name: 'Ayarlar', path: '/admin/settings', icon: Settings, roles: ['STAFF', 'ADMIN', 'SUPER_ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    !item.roles || (role && item.roles.includes(role))
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-orange-100 text-gray-700 flex flex-col shadow-xl md:shadow-sm z-[70] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-orange-600 tracking-tight">Admin</h2>
            {user && (
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                {role} Modu
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => { if(window.innerWidth < 768) onClose?.(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-[1.02]'
                  : 'hover:bg-orange-50 hover:text-orange-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-orange-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-2xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-all font-bold text-sm cursor-pointer group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
};
