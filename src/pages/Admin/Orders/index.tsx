import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import type { RootState, AppDispatch } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ChefHat, Bike, PackageCheck, Settings2, Loader2, Search, X as XIcon, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import type { OrderData } from '@/store/slices/orderSlice';
import { fetchActiveOrders } from '@/store/slices/orderSlice';
import { ManageOrderModal } from '@/components/lib/FormModal/ManageOrderModal';

import type { ElementType } from 'react';

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string, icon: ElementType, label: string }> = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Bekliyor' },
    ACCEPTED: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2, label: 'Onaylandı' },
    PREPARING: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: ChefHat, label: 'Hazırlanıyor' },
    ON_THE_WAY: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Bike, label: 'Yolda' },
    DELIVERED: { color: 'bg-green-100 text-green-800 border-green-200', icon: PackageCheck, label: 'Teslim Edildi' },
    CANCELLED: { color: 'bg-red-100 text-red-800 border-red-200', icon: XIcon, label: 'İptal Edildi' },
  };

  const current = config[status] || config.PENDING;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${current.color}`}>
      <Icon className="w-3 h-3" />
      {current.label}
    </span>
  );
};

export const Orders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeOrders, meta, isLoading } = useSelector((state: RootState) => state.order);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchActiveOrders({ page, limit: 15 }));
  }, [dispatch, page]);

  const handleManage = (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = activeOrders.filter(order => {
    const matchesSearch = order.phone?.includes(searchTerm) || String(order.id).includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { id: 'ALL', label: 'Tümü' },
    { id: 'PENDING', label: 'Bekleyen' },
    { id: 'ACCEPTED', label: 'Onaylı' },
    { id: 'PREPARING', label: 'Hazırlanan' },
    { id: 'ON_THE_WAY', label: 'Yolda' }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Sipariş Yönetimi</h1>
          <p className="text-gray-500 font-medium">Aktif siparişleri gerçek zamanlı izleyin ve yönetin.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
          {isLoading && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Canlı Yayın</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col xl:flex-row items-center gap-6">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Sipariş NO veya Telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-orange-200 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {statuses.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setStatusFilter(s.id);
                setPage(1); // Reset page on filter change
              }}
              className={`px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                statusFilter === s.id 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sipariş Bilgisi</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Müşteri</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tutar</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Durum</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                       <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-gray-200" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-gray-300">Sipariş Bulunamadı</p>
                          <p className="text-gray-400 font-medium text-sm">Filtrelerinizi değiştirerek tekrar deneyin.</p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredOrders.map((order: OrderData) => (
                    <motion.tr 
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group hover:bg-gray-50/50 transition-all"
                    >
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                             #{order.id}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-black text-gray-900">Sipariş Detayı</span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online Sipariş</span>
                           </div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">{String(order.phone || '-')}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Telefon</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="font-black text-orange-600 text-xl tracking-tighter">₺{String(order.total_price || '0')}</span>
                      </td>
                      <td className="px-10 py-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => handleManage(order)}
                          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-2xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-gray-900/10"
                        >
                          <Settings2 className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-widest">Yönet</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && meta.totalPages > 1 && (
           <div className="flex items-center justify-between px-10 py-6 bg-gray-50/50 border-t border-gray-100">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
               Toplam <span className="text-gray-900">{meta.total}</span> aktif sipariş
             </p>
             <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 disabled:opacity-30 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(meta.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        page === i + 1
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 disabled:opacity-30 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
             </div>
           </div>
        )}
      </div>

      <ManageOrderModal 
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(fetchActiveOrders({ page, limit: 15 }));
        }}
        order={selectedOrder}
      />
    </div>
  );
};
