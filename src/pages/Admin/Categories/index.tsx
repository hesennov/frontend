import { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, GripVertical, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  order: number;
}

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Kategoriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/categories', { name: newName, order: categories.length });
      toast.success('Kategori eklendi.');
      setNewName('');
      setIsAdding(false);
      fetchCategories();
    } catch {
      toast.error('Kategori eklenirken hata oluştu.');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await api.patch(`/categories/${id}`, { name: editName });
      toast.success('Kategori güncellendi.');
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error('Güncelleme başarısız oldu.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori silindi.');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Silme işlemi başarısız oldu.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Kategori Yönetimi</h1>
          <p className="text-gray-500 font-medium">Menü gruplarını oluşturun ve sıralayın.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gray-900 hover:bg-black text-white font-black px-8 py-4 rounded-[2rem] transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-gray-900/20 cursor-pointer text-sm uppercase tracking-widest"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Yeni Kategori
          </button>
        )}
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-50 overflow-hidden">
        <div className="p-8 space-y-4">
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 bg-orange-50/50 p-6 rounded-[2rem] border-2 border-dashed border-orange-200"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                <Tag className="w-6 h-6" />
              </div>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Kategori adı girin..."
                className="flex-1 bg-white border-none rounded-xl px-4 py-3 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button onClick={handleCreate} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors cursor-pointer">Ekle</button>
              <button onClick={() => setIsAdding(false)} className="p-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </motion.div>
          )}

          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-900/5 rounded-[2rem] border border-transparent hover:border-gray-100 transition-all"
              >
                <div className="flex items-center gap-6 flex-1">
                  <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing" />
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 bg-white border-2 border-orange-200 rounded-xl px-4 py-2 font-bold text-gray-900 outline-none"
                      />
                      <button onClick={() => handleUpdate(cat.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"><Save className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-gray-500 rounded-lg hover:bg-gray-300 cursor-pointer"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-orange-500 shadow-sm border border-gray-100 transition-colors">
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="font-black text-gray-900 text-lg">{cat.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditName(cat.name);
                    }}
                    className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all cursor-pointer"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
