import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3, PieChart as PieIcon, Download } from 'lucide-react';
import { api } from '@/services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ReportData {
  topProducts: any[];
  categoryStats: any[];
  branchStats: any[];
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#facc15'];

export const Reports = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/stats/reports');
        setData(res.data.data);
      } catch (error) {
        console.error('Reports fetch error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Detaylı Raporlar</h1>
          <p className="text-gray-500 font-medium text-lg">İşletmenizin performansını derinlemesine analiz edin.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-900/20 active:scale-95 cursor-pointer">
          <Download className="w-5 h-5" />
          Excel Raporu Al
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 p-10"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">En Çok Satan 5 Ürün</h2>
          </div>
          
          <div className="space-y-6">
            {data?.topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img src={p.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt={p.name} />
                    <span className="absolute -top-2 -left-2 w-8 h-8 bg-gray-900 text-white text-xs font-black rounded-full flex items-center justify-center border-4 border-white">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-none mb-1">{p.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.total_sold} Adet Satıldı</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">₺{p.total_revenue.toLocaleString('tr-TR')}</p>
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Premium Lezzet</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Revenue */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 p-10 flex flex-col"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
              <PieIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Kategori Dağılımı</h2>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="revenue"
                >
                  {data?.categoryStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Ciro']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {data?.categoryStats.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-sm font-bold text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Branch Performance Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-[4rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50"
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-sm">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Şube Performans Analizi</h2>
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-1">Hangi şube ne kadar kazanıyor?</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-widest border border-gray-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Verimlilik Skoru
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.branchStats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                tickFormatter={(value) => `₺${value}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 20 }}
                contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '1.5rem' }}
                formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Ciro']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#f97316" 
                radius={[20, 20, 20, 20]} 
                barSize={60}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
