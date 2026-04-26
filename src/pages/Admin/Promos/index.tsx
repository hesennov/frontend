import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Trash2, Calendar, Banknote, Clock } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Promo {
  id: number;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  min_order: number;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  created_at: string;
}

export const Promos = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 0,
    min_order: 0,
    expires_at: '',
    usage_limit: '',
  });

  const fetchPromos = async () => {
    try {
      const res = await api.get('/promos');
      setPromos(res.data.data);
    } catch (error) {
      toast.error('Kuponlar yüklenemedi');
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/promos', {
        ...formData,
        value: Number(formData.value),
        min_order: Number(formData.min_order),
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
      });
      toast.success('Kupon başarıyla oluşturuldu');
      setIsModalOpen(false);
      setFormData({ code: '', type: 'PERCENTAGE', value: 0, min_order: 0, expires_at: '', usage_limit: '' });
      fetchPromos();
    } catch (error) {
      toast.error('Kupon oluşturulamadı');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/promos/${id}`);
      toast.success('Kupon silindi');
      fetchPromos();
    } catch (error) {
      toast.error('Kupon silinemedi');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Kupon Yönetimi</h1>
          <p className="text-gray-500 font-medium text-lg">Müşterilerinize özel indirimler ve kampanyalar oluşturun.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Yeni Kupon Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {promos.map((promo) => {
            const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date();
            const isLimitReached = promo.usage_limit && promo.used_count >= promo.usage_limit;
            const isActive = !isExpired && !isLimitReached;

            return (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[3rem] p-8 shadow-[0_15px_40px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col relative group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isActive ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'}`}>
                    <Tag className="w-7 h-7" />
                  </div>
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase">{promo.code}</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isActive ? 'Aktif' : (isExpired ? 'Süresi Doldu' : 'Limit Doldu')}
                    </span>
                    <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {promo.type === 'PERCENTAGE' ? `%${promo.value} İndirim` : `₺${promo.value} İndirim`}
                    </span>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold flex items-center gap-2"><Clock className="w-4 h-4" /> Kullanım</span>
                      <span className="text-gray-900 font-black">{promo.used_count} / {promo.usage_limit || '∞'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold flex items-center gap-2"><Calendar className="w-4 h-4" /> Bitiş</span>
                      <span className="text-gray-900 font-black">{promo.expires_at ? new Date(promo.expires_at).toLocaleDateString('tr-TR') : 'Süresiz'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-bold flex items-center gap-2"><Banknote className="w-4 h-4" /> Min. Sipariş</span>
                      <span className="text-gray-900 font-black">₺{promo.min_order}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[4rem] shadow-2xl w-full max-w-2xl overflow-hidden p-12"
            >
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-8">Yeni Kupon</h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Kupon Kodu</label>
                  <input
                    type="text" required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                    placeholder="YAZBOLU30"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">İndirim Türü</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all appearance-none"
                  >
                    <option value="PERCENTAGE">Yüzde (%)</option>
                    <option value="FIXED_AMOUNT">Sabit Tutar (₺)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">İndirim Değeri</label>
                  <input
                    type="number" required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Min. Sipariş Tutarı</label>
                  <input
                    type="number" required
                    value={formData.min_order}
                    onChange={(e) => setFormData({ ...formData, min_order: Number(e.target.value) })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Kullanım Limiti</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                    placeholder="Sınırsız için boş bırakın"
                  />
                </div>

                <div className="md:col-span-2 pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-5 bg-gray-100 text-gray-500 font-black rounded-3xl hover:bg-gray-200 transition-all"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-2 px-8 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl shadow-gray-900/20"
                  >
                    Kuponu Oluştur
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
