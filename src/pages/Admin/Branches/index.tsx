import { useState, useEffect } from 'react';
import { MapPin, Clock, Power, Edit3, Plus, X, Truck, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Branch {
  id: number;
  name: string;
  address: string;
  working_hours: string;
  is_active: boolean;
  lat?: number | null;
  lng?: number | null;
  delivery_radius_km?: number;
  commission_rate?: number;
}

const emptyForm = {
  name: '',
  address: '',
  working_hours: '09:00-23:00',
  lat: '',
  lng: '',
  delivery_radius_km: '5',
  commission_rate: '5',
};

export const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    try {
      const response = await api.get('/branches/all-admin');
      setBranches(response.data.data);
    } catch (error) {
      toast.error('Şubeler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const openCreateModal = () => {
    setEditingBranch(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setForm({
      name: branch.name,
      address: branch.address,
      working_hours: branch.working_hours,
      lat: branch.lat?.toString() || '',
      lng: branch.lng?.toString() || '',
      delivery_radius_km: branch.delivery_radius_km?.toString() || '5',
      commission_rate: branch.commission_rate?.toString() || '5',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.working_hours) {
      toast.error('Şube adı, adres ve çalışma saatleri zorunludur.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        working_hours: form.working_hours,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
        delivery_radius_km: parseFloat(form.delivery_radius_km) || 5,
        commission_rate: parseFloat(form.commission_rate) || 5,
      };

      if (editingBranch) {
        await api.patch(`/branches/${editingBranch.id}`, payload);
        toast.success('Şube başarıyla güncellendi!');
      } else {
        await api.post('/branches', payload);
        toast.success('Yeni şube başarıyla eklendi!');
      }

      setShowModal(false);
      setEditingBranch(null);
      setForm(emptyForm);
      fetchBranches();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (branch: Branch) => {
    try {
      const newStatus = !branch.is_active;
      await api.patch(`/branches/${branch.id}`, { is_active: newStatus });
      toast.success(`Şube ${newStatus ? 'aktif' : 'pasif'} duruma getirildi.`);
      fetchBranches();
    } catch (error) {
      toast.error('Durum güncellenirken bir hata oluştu.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Şube Yönetimi</h1>
          <p className="text-gray-500 font-medium">Şubelerinizin durumunu ve çalışma saatlerini yönetin.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer text-sm uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Yeni Şube Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {branches.map((branch, idx) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${
              branch.is_active ? 'border-gray-50' : 'border-red-100 bg-red-50/20'
            } group transition-all relative overflow-hidden`}
          >
            {/* Status Indicator Bar */}
            <div className={`absolute top-0 left-0 w-full h-2 ${branch.is_active ? 'bg-green-500' : 'bg-red-500'}`} />

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    branch.is_active ? 'bg-orange-50 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{branch.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: #{branch.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Çalışma Saatleri</span>
                      <span className="text-sm font-bold text-gray-700">{branch.working_hours}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Adres</span>
                      <span className="text-sm font-bold text-gray-700 leading-tight">{branch.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teslimat Yarıçapı</span>
                      <span className="text-sm font-bold text-gray-700">{branch.delivery_radius_km || 5} km</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Percent className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Komisyon</span>
                      <span className="text-sm font-bold text-gray-700">%{branch.commission_rate || 5}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[140px]">
                <button
                  onClick={() => toggleStatus(branch)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${
                    branch.is_active 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {branch.is_active ? 'Şubeyi Kapat' : 'Şubeyi Aç'}
                </button>
                <button
                  onClick={() => openEditModal(branch)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-gray-900/10 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Düzenle
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {editingBranch ? 'Şubeyi Düzenle' : 'Yeni Şube Ekle'}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">
                    {editingBranch ? `#${editingBranch.id} — ${editingBranch.name}` : 'Yeni bir şube oluşturun.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Şube Adı */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Şube Adı *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Örn: Merkez Şube"
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    required
                  />
                </div>

                {/* Adres */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Adres *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Örn: Atatürk Cad. No:15, Kadıköy"
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    required
                  />
                </div>

                {/* Çalışma Saatleri */}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Çalışma Saatleri *</label>
                  <input
                    type="text"
                    value={form.working_hours}
                    onChange={(e) => setForm({ ...form, working_hours: e.target.value })}
                    placeholder="09:00-23:00"
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    required
                  />
                </div>

                {/* Lat / Lng */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Enlem (Lat)</label>
                    <input
                      type="text"
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                      placeholder="41.0082"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Boylam (Lng)</label>
                    <input
                      type="text"
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                      placeholder="28.9784"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                {/* Delivery Radius / Commission */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Teslimat (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.delivery_radius_km}
                      onChange={(e) => setForm({ ...form, delivery_radius_km: e.target.value })}
                      placeholder="5"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Komisyon (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.commission_rate}
                      onChange={(e) => setForm({ ...form, commission_rate: e.target.value })}
                      placeholder="5"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-orange-500/30 text-sm uppercase tracking-widest cursor-pointer mt-4"
                >
                  {submitting ? 'Kaydediliyor...' : editingBranch ? 'Güncelle' : 'Şubeyi Oluştur'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
