import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Package, MapPin, CheckCircle2, ChevronRight, MessageSquare, Utensils, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface OrderItem {
  id: number;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  branch: {
    name: string;
  };
}

const statusMap = {
  PENDING: { label: 'Onay Bekliyor', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  ACCEPTED: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-700', icon: Utensils },
  PREPARING: { label: 'Mutfakta', color: 'bg-purple-100 text-purple-700', icon: Utensils },
  ON_THE_WAY: { label: 'Yolda', color: 'bg-orange-100 text-orange-700', icon: MapPin },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700', icon: Package },
};

export const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.data);
    } catch (error) {
      toast.error('Siparişleriniz yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">Siparişlerim</h1>
          <p className="text-gray-500 font-medium">Tüm sipariş geçmişinizi ve durumları takip edin.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-2xl font-bold text-sm">
          <Clock className="w-4 h-4" />
          Otomatik Güncelleniyor
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-black text-xl uppercase tracking-widest">Henüz siparişiniz yok.</p>
            </motion.div>
          ) : (
            orders.map((order, idx) => {
              const status = statusMap[order.status] || statusMap.PENDING;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[3rem] shadow-[0_15px_40px_rgb(0,0,0,0.03)] border border-gray-50 overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${status.color}`}>
                          <status.icon className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-gray-900 text-xl">#{order.id}</span>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-tighter mt-1">
                            {new Date(order.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} • {order.branch.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Toplam</span>
                        <span className="text-2xl font-black text-gray-900">₺{order.total_amount}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex-shrink-0 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <img src={item.product.image} className="w-12 h-12 rounded-xl object-cover" alt={item.product.name} />
                          <div>
                            <p className="font-bold text-gray-900 text-sm leading-none mb-1">{item.product.name}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.quantity} Adet • ₺{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-6 px-8 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-gray-900 transition-colors cursor-pointer">
                        <MessageSquare className="w-4 h-4" />
                        Yardım Al
                      </button>
                      {order.status === 'DELIVERED' && (
                        <button className="flex items-center gap-2 text-orange-500 font-black text-sm hover:text-orange-600 transition-colors cursor-pointer">
                          <Star className="w-4 h-4" />
                          Değerlendir
                        </button>
                      )}
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all cursor-pointer shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
