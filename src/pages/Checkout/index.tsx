import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { CreditCard, MapPin, Phone, User, ArrowRight, Wallet, CheckCircle2, ShoppingBag, ChevronLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const Checkout = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const selectedBranchId = useSelector((state: RootState) => state.branch.selectedBranchId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'CASH', 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [couponCode, setCouponCode] = useState('');
  const [discountData, setDiscountData] = useState<{ discount: number, code: string } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const { api } = await import('@/services/api');
      const res = await api.post('/promos/validate', { code: couponCode, total });
      setDiscountData(res.data.data);
      toast.success('Kupon uygulandı!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Geçersiz kupon');
      setDiscountData(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const finalTotal = Math.max(0, total - (discountData?.discount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Sepetiniz boş!');
      return;
    }

    if (!selectedBranchId) {
      toast.error('Lütfen önce bir şube seçin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { api } = await import('@/services/api');
      
      const payload = {
        branch_id: selectedBranchId, 
        items: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        })),
        address: formData.address,
        phone: formData.phone,
        payment_type: formData.paymentMethod,
        target_lat: 41.0082, 
        target_lng: 28.9784,
        promo_code: discountData?.code || null
      };

      await api.post('/orders', payload);
      
      setIsSuccess(true);
      dispatch(clearCart());
      
      setTimeout(() => {
        navigate('/orders');
      }, 5000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } } };
      const msg = err.response?.data?.message || err.response?.data?.error || 'Sipariş oluşturulurken bir hata oluştu.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-orange-500/10 text-center max-w-lg w-full border border-orange-50"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Siparişiniz Alındı!</h1>
          <p className="text-gray-500 font-medium mb-10 text-lg leading-relaxed">
            Lezzet yolculuğu başladı! Şeflerimiz hazırlıklara koyuldu. 5 saniye içinde siparişlerinize yönlendirileceksiniz.
          </p>
          <button 
            onClick={() => navigate('/orders')}
            className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl hover:bg-black transition-all shadow-xl shadow-gray-900/20"
          >
            Siparişlerimi Gör
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8">
          <ShoppingBag className="w-16 h-16 text-gray-200" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight text-center">Sepetiniz Boş Gözüküyor</h2>
        <p className="text-gray-400 font-medium text-lg mb-10 text-center max-w-sm">
          Menümüzdeki eşsiz lezzetleri keşfederek sepetinizi doldurmaya ne dersiniz?
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-[2rem] font-black transition-all shadow-xl shadow-orange-500/30 flex items-center gap-3 active:scale-95 text-lg"
        >
          <ChevronLeft className="w-6 h-6" />
          Menüye Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate(-1)} className="p-4 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ödeme ve Teslimat</h1>
          <p className="text-gray-500 font-medium">Siparişinizi tamamlamak için bilgileri kontrol edin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Form Side */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 p-10 md:p-12"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Teslimat Adresi</h2>
            </div>
            
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Ad Soyad</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                      placeholder="Hasan Yılmaz"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Telefon</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                      type="tel" required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Açık Adres</label>
                <textarea 
                  required rows={4}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all resize-none leading-relaxed"
                  placeholder="Mahalle, sokak, bina no, daire..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-1">Sipariş Notu</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text"
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                    placeholder="Zile basmayın, yanına acı sos vs."
                  />
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 p-10 md:p-12"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Ödeme Yöntemi</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'CASH', name: 'Kapıda Nakit', icon: Wallet, color: 'orange' },
                { id: 'BANK_TRANSFER', name: 'Kapıda Kredi Kartı', icon: CreditCard, color: 'blue' }
              ].map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setFormData({...formData, paymentMethod: method.id})}
                  className={`p-8 rounded-[2rem] border-4 cursor-pointer transition-all flex items-center gap-6 group ${
                    formData.paymentMethod === method.id 
                      ? 'border-gray-900 bg-gray-50 shadow-xl' 
                      : 'border-gray-50 bg-white hover:border-gray-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    formData.paymentMethod === method.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <method.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <span className={`block font-black text-lg ${formData.paymentMethod === method.id ? 'text-gray-900' : 'text-gray-400'}`}>
                      {method.name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teslimatta Ödeme</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-4 transition-all ${
                    formData.paymentMethod === method.id ? 'border-orange-500 bg-white scale-110' : 'border-gray-100'
                  }`} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Summary Side */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-[4rem] p-10 md:p-12 sticky top-28 shadow-2xl shadow-gray-900/30 overflow-hidden"
          >
            {/* Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <h2 className="text-3xl font-black mb-10 text-white tracking-tight relative">Sipariş Özeti</h2>
            
            <div className="space-y-6 mb-12 relative max-h-[35vh] overflow-y-auto no-scrollbar pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center group">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                      <span className="text-white font-black">{item.quantity}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg leading-none">{item.name}</span>
                      <span className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter">₺{item.price} adet</span>
                    </div>
                  </div>
                  <span className="font-black text-white text-xl">₺{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pt-8 border-t border-white/10 relative">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Kupon Kodu</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="KODU GİRİN"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold text-sm focus:bg-white/10 outline-none transition-all placeholder:text-gray-600"
                />
                <button 
                  onClick={handleValidateCoupon}
                  disabled={isValidatingCoupon || !couponCode}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                >
                  {isValidatingCoupon ? '...' : 'Uygula'}
                </button>
              </div>
              {discountData && (
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 p-3 rounded-xl border border-green-400/20">
                  <CheckCircle2 className="w-4 h-4" />
                  "{discountData.code}" kuponu ile ₺{discountData.discount} indirim uygulandı!
                </div>
              )}
            </div>

            <div className="space-y-6 pt-10 border-t border-white/10 relative">
              <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                <span>Ara Toplam</span>
                <span>₺{total}</span>
              </div>
              {discountData && (
                <div className="flex justify-between text-green-400 font-bold uppercase tracking-widest text-xs">
                  <span>İndirim</span>
                  <span>-₺{discountData.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                <span>Teslimat Ücreti</span>
                <span className="text-orange-500">Ücretsiz</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Ödenecek Toplam</span>
                  <span className="text-5xl font-black text-white tracking-tighter">₺{finalTotal}</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white/50" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full mt-12 bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 text-gray-900 font-black py-6 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl text-xl uppercase tracking-widest cursor-pointer"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
              ) : (
                <>
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-7 h-7" />
                </>
              )}
            </button>
            <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-6">
              Güvenli 256-bit SSL ödeme koruması
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
