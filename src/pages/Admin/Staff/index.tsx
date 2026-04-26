import { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface User {
  id: number;
  phone: string;
  role: string;
  permissions: string[];
  created_at: string;
}

export const Staff = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number, phone: string) => {
    if (!window.confirm(`${phone} numaralı personeli silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Personel silindi.');
      fetchUsers();
    } catch {
      toast.error('Silme işlemi başarısız oldu.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Personel Yönetimi</h1>
          <p className="text-gray-500 font-medium">Ekibinizi yönetin ve yetkilendirmeleri düzenleyin.</p>
        </div>
        <button className="bg-gray-900 hover:bg-black text-white font-black px-8 py-4 rounded-[2rem] transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-gray-900/20 cursor-pointer text-sm uppercase tracking-widest">
          <UserPlus className="w-5 h-5 stroke-[3]" />
          Yeni Personel Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:border-orange-200 transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 text-orange-600 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-900">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-black tracking-tight">{user.phone}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {user.permissions.length === 0 ? (
                  <span className="text-xs text-gray-400 italic">Varsayılan Yetkiler</span>
                ) : (
                  user.permissions.map((p, pIdx) => (
                    <span key={pIdx} className="bg-gray-50 text-gray-500 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter border border-gray-100">
                      {p}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Katılma: {new Date(user.created_at).toLocaleDateString('tr-TR')}
              </span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all cursor-pointer">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(user.id, user.phone)}
                  className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
