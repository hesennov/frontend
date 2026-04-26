import { Plus, Edit2, Trash2, Search, Save, X, Building2, ChevronDown, Tag, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/slices/productSlice';
import { fetchBranches, selectBranch } from '@/store/slices/branchSlice';
import type { Product } from '@/store/slices/productSlice';
import type { RootState, AppDispatch } from '@/store';
import { AddProductModal } from '@/components/lib/FormModal/AddProductModal';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'ALL'>('ALL');
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [tempStock, setTempStock] = useState<string>('');
  const [page, setPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { items: products, meta, isLoading } = useSelector((state: RootState) => state.products);
  const { branches, selectedBranchId } = useSelector((state: RootState) => state.branch);

  useEffect(() => {
    dispatch(fetchBranches());
    const fetchCats = async () => {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    };
    fetchCats();
  }, [dispatch]);

  useEffect(() => {
    if (selectedBranchId) {
      dispatch(fetchProducts({ branchId: selectedBranchId, page, limit: 10 }));
    }
  }, [dispatch, selectedBranchId, page]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success(`${name} silindi.`);
      dispatch(fetchProducts({ branchId: selectedBranchId || 1, page, limit: 10 }));
    } catch {
      toast.error('Ürün silinirken hata oluştu.');
    }
  };

  const handleUpdateStock = async (id: number) => {
    if (!selectedBranchId) {
      toast.error('Lütfen önce bir şube seçin.');
      return;
    }

    try {
      await api.patch(`/products/${id}/stock`, {
        branch_id: selectedBranchId,
        stock_count: parseInt(tempStock) || 0
      });
      toast.success('Stok güncellenlendi.');
      setEditingStockId(null);
      dispatch(fetchProducts({ branchId: selectedBranchId, page, limit: 10 }));
    } catch {
      toast.error('Stok güncellenirken hata oluştu.');
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="space-y-10 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Ürün Yönetimi</h1>
            <p className="text-gray-500 font-medium italic">Şubeye özel stok ve fiyatlandırmayı yönetin.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group min-w-[200px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Building2 className="w-4 h-4 text-orange-500" />
              </div>
              <select
                value={selectedBranchId || ''}
                onChange={(e) => {
                  dispatch(selectBranch(Number(e.target.value)));
                  setPage(1); // Reset to first page when branch changes
                }}
                className="w-full pl-11 pr-10 py-4 bg-white border-2 border-gray-100 hover:border-orange-200 rounded-[1.5rem] font-black text-xs uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer shadow-sm group-hover:shadow-md"
              >
                <option value="" disabled>Şube Seçin</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsModalOpen(true);
              }}
              className="bg-gray-900 hover:bg-black text-white font-black px-8 py-4 rounded-[1.5rem] transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-gray-900/20 cursor-pointer text-sm uppercase tracking-widest h-[56px]"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              Ürün Ekle
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col xl:flex-row items-center gap-6">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Ürün adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-orange-200 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                categoryFilter === 'ALL' 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tümü
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
                  categoryFilter === cat.id 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] overflow-hidden border border-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ürün Bilgisi</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fiyat</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stok Durumu</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Ürünler Listeleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200">
                          <Package className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xl font-black text-gray-300 uppercase tracking-tight">Eşleşen Ürün Yok</span>
                          <p className="text-gray-400 font-medium">Arama kriterlerinizi veya filtrenizi değiştirin.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product: Product) => {
                    const branchInfo = product.branchProducts?.find(bp => bp.branch_id === selectedBranchId);
                    const stockCount = branchInfo?.stock_count ?? 0;

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50/30 transition-colors group"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-white shadow-md">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xl">?</div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-gray-900 text-lg leading-none mb-1">{product.name}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ürün Kodu: #{product.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                             <Tag className="w-3 h-3 text-orange-500" />
                             <span className="font-black text-gray-600 text-[11px] uppercase tracking-wider">
                               {product.category?.name || 'Kategorisiz'}
                             </span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="font-black text-gray-900 text-xl tracking-tighter">₺{branchInfo?.price_override || product.base_price}</span>
                        </td>
                        <td className="px-10 py-6">
                          {editingStockId === product.id ? (
                            <div className="flex items-center gap-2 animate-in slide-in-from-left-2">
                              <input
                                type="number"
                                autoFocus
                                value={tempStock}
                                onChange={(e) => setTempStock(e.target.value)}
                                className="w-20 px-4 py-3 bg-white border-2 border-orange-500 rounded-xl outline-none font-black text-center shadow-lg shadow-orange-100"
                              />
                              <button
                                onClick={() => handleUpdateStock(product.id)}
                                className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors cursor-pointer shadow-lg"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingStockId(null)}
                                className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingStockId(product.id);
                                setTempStock(String(stockCount));
                              }}
                              className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl font-black text-xs cursor-pointer hover:scale-105 transition-all shadow-sm ${stockCount > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full ${stockCount > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                              {stockCount} ADET STOK
                              <Edit2 className="w-3 h-3 opacity-30" />
                            </div>
                          )}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                              }}
                              className="p-3 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all cursor-pointer"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Pagination */}
        {!isLoading && meta.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-10 py-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-sm font-bold text-gray-400">
              Toplam <span className="text-gray-900">{meta.total}</span> üründen {(page - 1) * meta.limit + 1}-{Math.min(page * meta.limit, meta.total)} arası gösteriliyor.
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all cursor-pointer ${
                      page === i + 1
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddProductModal
        open={isModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
          if (selectedBranchId) dispatch(fetchProducts({ branchId: selectedBranchId, page, limit: 10 }));
        }}
      />
    </>
  );
};
