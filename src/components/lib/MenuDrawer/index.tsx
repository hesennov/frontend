import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Info, Phone, LogOut, ChevronRight, ShieldCheck, MapPin, Package, Share2, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { useState } from 'react';
import { AboutModal } from '../FormModal/AboutModal';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBranchModal: () => void;
}

export const MenuDrawer = ({ isOpen, onClose, onOpenBranchModal }: MenuDrawerProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Başarıyla çıkış yapıldı');
    onClose();
    navigate('/');
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-[300px] bg-white z-[101] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Upper Section: Branding & Profile */}
            <div className="bg-gray-900 pt-12 pb-8 px-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
               
               <div className="flex items-center justify-between mb-8 relative z-10">
                 <span className="text-xl font-black tracking-tighter text-white">
                   <span className="text-orange-500">Kebab</span> evi
                 </span>
                 <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors cursor-pointer">
                   <X className="w-5 h-5" />
                 </button>
               </div>

               {isAuthenticated ? (
                 <div className="flex items-center gap-4 relative z-10">
                   <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 ring-4 ring-white/10">
                     <User className="w-7 h-7" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Hoş Geldiniz</p>
                     <p className="font-black text-white text-lg truncate w-40">{(user?.phone as string) || 'Kullanıcı'}</p>
                   </div>
                 </div>
               ) : (
                 <div className="relative z-10">
                   <h3 className="text-white text-lg font-black leading-tight mb-4">Lezzet dolu dünyamıza katılın!</h3>
                   <Link
                     to="/login"
                     onClick={onClose}
                     className="inline-block px-6 py-2.5 bg-orange-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-orange-500/20"
                   >
                     Giriş Yap
                   </Link>
                 </div>
               )}
            </div>

            {/* Navigation Section */}
            <div className="flex-1 py-8 px-4 overflow-y-auto space-y-1">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-4">Menü</p>
               
               <MenuLink icon={MapPin} label="Şube Değiştir" onClick={onOpenBranchModal} highlight />
               
               {isAuthenticated && (
                 <MenuLink 
                  icon={Package} 
                  label="Siparişlerim" 
                  onClick={() => { onClose(); navigate('/orders'); }} 
                 />
               )}
               
               <MenuLink icon={Info} label="Hakkımızda" onClick={() => { onClose(); setIsAboutModalOpen(true); }} />
               <MenuLink icon={Phone} label="İletişim" onClick={() => { onClose(); setIsAboutModalOpen(true); }} />
               
               {isAuthenticated && (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF') && (
                 <div className="pt-4 mt-4 border-t border-gray-50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-4">Yönetim</p>
                   <MenuLink 
                    icon={ShieldCheck} 
                    label="Yönetim Paneli" 
                    onClick={() => { onClose(); navigate('/admin'); }} 
                    highlight
                   />
                 </div>
               )}
            </div>

            {/* Bottom Section */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-6">
               {isAuthenticated && (
                 <button
                   onClick={handleLogout}
                   className="flex items-center gap-3 w-full p-4 bg-white hover:bg-red-50 text-red-500 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-sm border border-gray-100 cursor-pointer"
                 >
                   <LogOut className="w-4 h-4" />
                   Çıkış Yap
                 </button>
               )}
               
               <div className="flex items-center justify-between px-2">
                 <div className="flex gap-4">
                   <Share2 className="w-5 h-5 text-gray-300 hover:text-orange-500 transition-colors cursor-pointer" />
                   <Globe className="w-5 h-5 text-gray-300 hover:text-orange-500 transition-colors cursor-pointer" />
                 </div>
                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">v1.2.4</span>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    
    <AboutModal 
      isOpen={isAboutModalOpen} 
      onClose={() => setIsAboutModalOpen(false)} 
    />
    </>
  );
};

const MenuLink = ({ icon: Icon, label, onClick, highlight = false }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all group cursor-pointer border border-transparent ${
      highlight ? 'bg-orange-50 text-orange-600 border-orange-100/50' : 'hover:bg-gray-50 text-gray-600 hover:border-gray-100'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl transition-colors ${highlight ? 'bg-orange-100' : 'bg-gray-100 group-hover:bg-white'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-black uppercase tracking-tight">{label}</span>
    </div>
    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${highlight ? 'text-orange-300' : 'text-gray-200'}`} />
  </button>
);
