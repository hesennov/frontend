import { Link } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, Search, Grid, Package, MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toggleCart } from '@/store/slices/uiSlice';
import { useState, useEffect } from 'react';
import { BranchSelectorModal } from '@/components/lib/FormModal/BranchSelectorModal';
import { MenuDrawer } from '@/components/lib/MenuDrawer';
import { api } from '@/services/api';

export const Header = () => {
  const dispatch = useDispatch();
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [branchName, setBranchName] = useState<string | null>(null);

  const { total, items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const selectedBranchId = useSelector((state: RootState) => state.branch.selectedBranchId);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const fetchBranchName = async () => {
      if (!selectedBranchId) return;
      try {
        const res = await api.get('/branches');
        const branch = res.data.data.find((b: any) => b.id === selectedBranchId);
        if (branch) setBranchName(branch.name);
      } catch (error) {
        console.error('Şube ismi alınamadı');
      }
    };
    fetchBranchName();
  }, [selectedBranchId]);

  return (
    <>
      <MenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onOpenBranchModal={() => {
          setIsMenuOpen(false);
          setIsBranchModalOpen(true);
        }}
      />

      <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center">
        <header className="w-full max-w-7xl bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-white/60 px-3 sm:px-8 py-3 sm:py-4 grid grid-cols-[1fr_auto_1fr] items-center">

          {/* Left Side: Navigation (Desktop Only) */}
          <div className="hidden sm:flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl transition-all active:scale-90 cursor-pointer border border-gray-100"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl transition-all active:scale-90 cursor-pointer border border-gray-100">
              <Search className="w-5 h-5" />
            </button>
          </div>
          {/* Mobile Placeholder to keep logo centered */}
          <div className="sm:hidden" />

          {/* Center: Logo */}
          <div className="flex justify-center px-2">
            <Link to="/" className="flex items-center gap-2 shrink-0 transition-transform active:scale-95">
              <span className="text-xl sm:text-4xl font-black tracking-tighter text-gray-900 flex items-center gap-1">
                <span className="text-orange-600">Kebab</span> <span>evi</span>
              </span>
            </Link>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center justify-end gap-1 sm:gap-4">
            {/* Branch Selector (Desktop Only) */}
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="px-5 py-3 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all hidden xl:flex items-center gap-2 cursor-pointer border border-orange-100 shadow-sm"
            >
              <MapPin className="w-4 h-4" />
              <span className="max-w-[120px] truncate">{branchName || 'Şube Seç'}</span>
            </button>

            {/* Orders (Desktop Only) */}
            {isAuthenticated && (
              <Link
                to="/orders"
                className="p-2 sm:px-5 sm:py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all hidden sm:flex items-center gap-2 cursor-pointer border border-blue-100"
                title="Siparişlerim"
              >
                <Package className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Takip</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="px-2 py-2 sm:px-6 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl sm:rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-1.5 relative cursor-pointer shadow-xl shadow-orange-500/25 border border-orange-400/20"
            >
              <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">₺{total.toFixed(0)}</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-white text-orange-600 text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-orange-100">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all active:scale-90 cursor-pointer border border-gray-100"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>

          <BranchSelectorModal
            open={isBranchModalOpen}
            onClose={() => setIsBranchModalOpen(false)}
          />
        </header>
      </div>
    </>
  );
};
