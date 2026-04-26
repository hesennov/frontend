import { useState, useEffect } from 'react';
import { MapPin, Clock, Power, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Branch {
  id: number;
  name: string;
  address: string;
  working_hours: string;
  is_active: boolean;
  phone?: string;
}

export const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Şube Yönetimi</h1>
        <p className="text-gray-500 font-medium">Şubelerinizin durumunu ve çalışma saatlerini yönetin.</p>
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
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-gray-900/10 cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                  Düzenle
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
