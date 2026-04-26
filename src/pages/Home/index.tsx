import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';
import { fetchProducts, type Product } from '@/store/slices/productSlice';
import type { RootState, AppDispatch } from '@/store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Star, Flame, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/services/api';

interface Category {
  id: number;
  name: string;
}

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, meta, isLoading } = useSelector((state: RootState) => state.products);
  const selectedBranchId = useSelector((state: RootState) => state.branch.selectedBranchId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ branchId: selectedBranchId || 1, page, limit: 12 }));
  }, [dispatch, selectedBranchId, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (error) {
        console.error('Kategoriler yüklenemedi');
      }
    };
    fetchCategories();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.base_price,
      quantity: 1,
    }));
    toast.success(`${product.name} sepete eklendi!`, {
      icon: <ShoppingCart className="w-4 h-4 text-orange-500" />,
      className: 'rounded-2xl font-bold border-none shadow-2xl'
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category_id === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bestsellers = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-32 pt-10">

      {/* Premium Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden shadow-2xl group">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        >
          <source src="/header-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4 bg-orange-500 w-fit px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/30">
              <Flame className="w-4 h-4 text-white animate-pulse" />
              <span className="text-white text-xs font-black uppercase tracking-widest">Şehrin En İyi Kebabı</span>
            </div>
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.9]">
              Gerçek Ateş,<br />Efsane <span className="text-orange-500">Lezzet.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
              Anadolu'nun bereketli topraklarından gelen geleneksel tarifler, usta ellerde hayat buluyor.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-5 rounded-[2rem] transition-all active:scale-95 shadow-xl shadow-orange-500/40 text-lg cursor-pointer">
                Hemen Sipariş Ver
              </button>
              <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-black px-10 py-5 rounded-[2rem] transition-all border border-white/20 text-lg cursor-pointer">
                Menüyü Keşfet
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Popüler Lezzetler</h2>
            <p className="text-gray-500 font-medium mt-1">En çok tercih edilen, damak çatlatan seçenekler.</p>
          </div>
          <button className="text-orange-500 font-black flex items-center gap-2 group cursor-pointer">
            Tümünü Gör <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-50 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 relative">
                <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black text-gray-900">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">{product.name}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">#{product.category?.name || 'Kebab'}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-gray-900">₺{product.base_price}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  className="w-12 h-12 bg-gray-900 group-hover:bg-orange-500 text-white rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sticky Category & Search Bar */}
      <div className="sticky top-28 z-40 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-xl shadow-black/5 border border-white flex flex-col md:flex-row items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full md:flex-1 no-scrollbar p-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${activeCategory === 'all'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
          >
            Tüm Menü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Lezzet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
          />
        </div>
      </div>

      {/* Main Menu Grid */}
      <section className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 h-[450px] rounded-[3rem] animate-pulse" />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Aradığınız lezzet bulunamadı.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[3rem] overflow-hidden shadow-[0_15px_40px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image || ''}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest shadow-sm">
                        {product.category?.name || 'Ana Menü'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-black text-gray-900 leading-none">{product.name}</h3>
                      <div className="flex items-center gap-1 text-orange-500">
                        <Star className="w-4 h-4 fill-orange-500" />
                        <span className="text-sm font-black">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-400 font-medium line-clamp-2 leading-relaxed h-12">
                      {product.description || 'Geleneksel yöntemlerle hazırlanan, damağınızda unutulmaz bir tat bırakacak enfes seçenek.'}
                    </p>
                    <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fiyat</span>
                        <span className="text-3xl font-black text-gray-900">₺{product.base_price}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {!isLoading && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(meta.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm transition-all cursor-pointer ${page === i + 1
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                      : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer group"
            >
              <ChevronRight className="w-6 h-6 text-gray-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
  </svg>
);
