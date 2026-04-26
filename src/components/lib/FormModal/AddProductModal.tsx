import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '@/store/slices/productSlice';
import type { AppDispatch } from '@/store';
import type { Product } from '@/store/slices/productSlice';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

interface Category {
  id: number;
  name: string;
}

export const AddProductModal = ({ open, onClose, product }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    base_price: '',
    category_id: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { api } = await import('@/services/api');
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
        if (!product && res.data.data.length > 0) {
          setForm(prev => ({ ...prev, category_id: String(res.data.data[0].id) }));
        }
      } catch (error) {
        console.error('Failed to fetch categories');
      }
    };
    if (open) fetchCategories();
  }, [open, product]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'saving'>('idle');

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        base_price: String(product.base_price),
        category_id: String(product.category_id),
      });
      setImagePreview(product.image);
    } else {
      setForm({ name: '', description: '', base_price: '', category_id: '1' });
      setImagePreview(null);
    }
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resim boyutu 5MB\'dan büyük olamaz.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !imageFile) {
      toast.error('Lütfen bir ürün resmi seçin.');
      return;
    }
    setIsSubmitting(true);

    try {
      const { api } = await import('@/services/api');
      let imageUrl = product?.image || '';

      // Step 1: Upload image if a new one is selected
      if (imageFile) {
        setUploadProgress('uploading');
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.url || uploadRes.data.data?.url;
      }

      // Step 2: Create or Update product
      setUploadProgress('saving');
      const payload = {
        name: form.name,
        description: form.description,
        base_price: parseFloat(form.base_price),
        category_id: parseInt(form.category_id),
        image: imageUrl,
      };

      if (isEditing && product) {
        await api.put(`/products/${product.id}`, payload);
        toast.success('Ürün güncellendi!');
      } else {
        await api.post('/products', payload);
        toast.success('Ürün başarıyla eklendi!');
      }

      dispatch(fetchProducts());
      handleClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'İşlem sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('idle');
    }
  };

  const handleClose = () => {
    if (!isEditing) {
      setForm({ name: '', description: '', base_price: '', category_id: '1' });
      setImageFile(null);
      setImagePreview(null);
    }
    onClose();
  };

  const progressText = {
    uploading: 'Resim yükleniyor...',
    saving: isEditing ? 'Güncelleniyor...' : 'Ürün kaydediliyor...',
    idle: isEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle',
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Image Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center overflow-hidden group ${
                  imagePreview ? 'border-transparent' : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                      <span className="ml-2 text-white font-bold">Değiştir</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-500">Resim seçmek için tıklayın</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — Maks 5MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Ürün Adı</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  placeholder="Örn: Margherita Pizza"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Açıklama</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all resize-none"
                  placeholder="Ürün hakkında kısa bir açıklama..."
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Fiyat (₺)</label>
                  <input
                    type="number" required min="0" step="0.01"
                    value={form.base_price}
                    onChange={e => setForm({ ...form, base_price: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Kategori</label>
                  <select
                    required
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-gray-900/20 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {progressText[uploadProgress]}
                  </>
                ) : (
                  progressText.idle
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
