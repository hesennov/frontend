import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import { LogOut, User, ShieldCheck, Package } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = () => {
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Başarıyla çıkış yapıldı');
    navigate('/');
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-lg mx-auto">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-orange-500/5 border border-orange-100">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 mb-6 rotate-3">
            <User className="w-12 h-12 -rotate-3" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Hesabım</h1>
          <p className="text-gray-500 font-medium">Hoş geldin, {(user?.phone as string) || 'Kullanıcı'}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-orange-500 rounded-xl shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-700">Siparişlerim</span>
            </div>
          </button>

          {(role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF') && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-orange-600 rounded-xl shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold text-orange-700">Yönetim Paneli</span>
              </div>
            </button>
          )}

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-red-500 rounded-xl shadow-sm">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-bold text-red-600">Çıkış Yap</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
