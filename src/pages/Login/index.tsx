import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice';
import { socketManager } from '@/sockets/socketManager';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Phone, Lock, UserPlus, LogIn, UtensilsCrossed, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { api } = await import('@/services/api');
      
      let response;
      if (isRegister) {
        response = await api.post('/auth/register', { phone, password });
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.', {
          className: 'rounded-2xl font-bold bg-green-500 text-white border-none'
        });
        setIsRegister(false);
        setIsLoading(false);
        return;
      } else {
        response = await api.post('/auth/login', { phone, password });
      }
      
      const token = response.data.data.accessToken;
      const user = response.data.data.user;
      
      dispatch(loginSuccess({
        token,
        user,
        role: user.role
      }));

      socketManager.connect();

      toast.success(`Hoş geldiniz!`, {
        icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
        className: 'rounded-2xl font-bold border-none shadow-2xl'
      });
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } } };
      toast.error(err.response?.data?.message || err.response?.data?.error || 'İşlem başarısız.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen -mt-20 flex items-center justify-center p-4 relative overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Left Side: Visual/Hero */}
        <div className="hidden md:flex md:w-[45%] bg-gray-900 relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000" 
              className="w-full h-full object-cover grayscale"
              alt="Kitchen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-4">
              Lezzetin En<br />Giriş Hali.
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              En özel tariflerimize ve kampanyalarımıza ulaşmak için hesabınıza giriş yapın.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <StarIcon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-bold text-white tracking-wide">
                100,000+ Mutlu Müşteri
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-10 md:p-16">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              {isRegister ? 'Aramıza Katıl' : 'Tekrar Hoş Geldin'}
            </h2>
            <p className="text-gray-400 font-medium">
              {isRegister ? 'Yeni bir lezzet yolculuğuna başla.' : 'En sevdiğin tatlar seni bekliyor.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Telefon</label>
              <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="tel" required
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Şifre</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-900 focus:bg-white focus:border-orange-200 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl shadow-gray-900/20 text-lg"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
              ) : (
                <>
                  <span>{isRegister ? 'Hesabımı Oluştur' : 'Giriş Yap'}</span>
                  {isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col items-center gap-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-gray-400 font-bold hover:text-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isRegister ? 'Zaten hesabım var' : 'Henüz hesabım yok mu?'}
              <span className="text-orange-500 underline decoration-2 underline-offset-4">
                {isRegister ? 'Giriş Yap' : 'Hemen Kayıt Ol'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
