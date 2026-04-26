import { useState } from 'react';
import { User, Lock, Bell, Moon, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { toast } from 'sonner';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'app'>('profile');
  const [loading, setLoading] = useState(false);

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Yeni şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    try {
      // Bu endpoint'i backend'e ekleyeceğiz
      await api.patch('/auth/change-password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new
      });
      toast.success('Şifreniz başarıyla güncellendi.');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Güvenlik', icon: Lock },
    { id: 'app', name: 'Uygulama Ayarları', icon: Moon },
  ];

  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Ayarlar</h1>
        <p className="text-gray-500 font-medium">Hesabınızı ve uygulama tercihlerini özelleştirin.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-50 p-10"
          >
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <User className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Hesap Bilgileri</h3>
                    <p className="text-gray-400 font-medium">Profil bilgilerinizi güncelleyin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Telefon Numarası</label>
                    <input
                      type="text"
                      disabled
                      value="0000000"
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Telefon numarası değiştirilemez</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Görünen Ad</label>
                    <input
                      type="text"
                      placeholder="Örn: Hasan"
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <button className="bg-gray-900 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-black transition-all shadow-lg shadow-gray-900/10 cursor-pointer">
                  <Save className="w-5 h-5" />
                  Değişiklikleri Kaydet
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Lock className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Güvenlik Ayarları</h3>
                    <p className="text-gray-400 font-medium">Şifrenizi düzenli olarak güncelleyin.</p>
                  </div>
                </div>

                <div className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Mevcut Şifre</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.current}
                      onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Yeni Şifre</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.new}
                      onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Yeni Şifre (Tekrar)</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-black transition-all shadow-lg shadow-gray-900/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </form>
            )}

            {activeTab === 'app' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-sm">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">Koyu Tema</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Gözlerinizi yormayın</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      const current = localStorage.getItem('theme');
                      const next = current === 'dark' ? 'light' : 'dark';
                      localStorage.setItem('theme', next);
                      if (next === 'dark') {
                        document.documentElement.classList.add('dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                      }
                      // Force re-render to update toggle UI
                      setLoading(prev => !prev);
                      setLoading(prev => !prev);
                    }}
                    className={`w-14 h-8 rounded-full relative p-1 cursor-pointer transition-colors flex ${
                      localStorage.getItem('theme') === 'dark' ? 'bg-orange-500 justify-end' : 'bg-gray-200 justify-start'
                    }`}
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-sm">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">Sipariş Bildirimleri</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Sesli ve görsel uyarılar</p>
                    </div>
                  </div>
                  <div className="w-14 h-8 bg-orange-500 rounded-full relative p-1 cursor-pointer transition-colors flex justify-end">
                    <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
