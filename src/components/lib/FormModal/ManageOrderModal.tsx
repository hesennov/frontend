import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChefHat, Bike, PackageCheck, MapPin, Phone, CreditCard, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import type { OrderData } from '@/store/slices/orderSlice';

interface Props {
  open: boolean;
  onClose: () => void;
  order: OrderData | null;
}

const STATUS_FLOW = [
  { status: 'PENDING', label: 'Bekliyor', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { status: 'ACCEPTED', label: 'Onayla', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { status: 'PREPARING', label: 'Hazırlanıyor', icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50' },
  { status: 'ON_THE_WAY', label: 'Yola Çıkar', icon: Bike, color: 'text-purple-600', bg: 'bg-purple-50' },
  { status: 'DELIVERED', label: 'Teslim Et', icon: PackageCheck, color: 'text-green-600', bg: 'bg-green-50' },
];

export const ManageOrderModal = ({ open, onClose, order }: Props) => {
  if (!order) return null;

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: newStatus });
      toast.success(`Sipariş durumu "${newStatus}" olarak güncellendi.`);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Durum güncellenirken bir hata oluştu.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentIdx = STATUS_FLOW.findIndex(f => f.status === order.status);
  const nextStatus = STATUS_FLOW[currentIdx + 1];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sipariş Detayı</h2>
                <p className="text-sm font-bold text-orange-600 mt-0.5">Sipariş NO: #{order.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors group cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Customer Info Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-[1.5rem] space-y-1 border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Telefon</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{String(order.phone || '-')}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-[1.5rem] space-y-1 border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ödeme</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {order.payment_type === 'CASH' ? 'Kapıda Nakit' : 'Kapıda Kart'}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-orange-50/50 p-6 rounded-[1.5rem] border border-orange-100/50">
                <div className="flex items-center gap-2 text-orange-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Teslimat Adresi</span>
                </div>
                <p className="text-gray-900 font-bold leading-relaxed">
                  {String(order.address || 'Adres bilgisi yok')}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-1">Sipariş İçeriği</h3>
                <div className="space-y-2">
                  {(order.items as any[])?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black text-sm">
                          {item.quantity}x
                        </div>
                        <span className="font-bold text-gray-900">{item.product?.name || 'Ürün'}</span>
                      </div>
                      <span className="font-black text-gray-900">₺{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-gray-500 font-bold">Toplam</span>
                  <span className="text-2xl font-black text-orange-600">₺{String(order.total_price)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-4">
              {nextStatus ? (
                <div className="space-y-3">
                  <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sıradaki İşlem</p>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(nextStatus.status)}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-200 active:scale-[0.98] cursor-pointer"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <nextStatus.icon className="w-6 h-6" />
                    )}
                    <span>{isUpdating ? 'Güncelleniyor...' : nextStatus.label}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-100">
                  <span className="text-green-600 font-bold">Bu sipariş başarıyla tamamlandı.</span>
                </div>
              )}
              
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('CANCELLED')}
                className="w-full bg-white hover:bg-red-50 disabled:opacity-50 text-red-500 font-bold py-4 px-8 rounded-2xl transition-all border border-gray-200 hover:border-red-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                Siparişi İptal Et
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
