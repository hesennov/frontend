import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar } from 'lucide-react';

interface DashboardStats {
  activeOrdersCount: number;
  todayRevenue: number;
  totalCustomers: number;
  statusBreakdown: Array<{ status: string; _count: { id: number } }>;
  recentOrders: any[];
}

interface ChartData {
  date: string;
  amount: number;
  count: number;
}

const statusMap: Record<string, string> = {
  PENDING: 'Bekliyor',
  ACCEPTED: 'Onaylandı',
  PREPARING: 'Hazırlanıyor',
  READY: 'Hazır',
  ON_THE_WAY: 'Yolda',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'İptal Edildi'
};

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Redirect STAFF away from financial dashboard
    if (user?.role === 'STAFF') {
      navigate('/admin/orders', { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/stats/revenue')
        ]);
        setStats(statsRes.data.data);
        setChartData(chartRes.data.data);
      } catch (error) {
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (loading || user?.role === 'STAFF') return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  const cards = [
    { label: 'Aktif Siparişler', value: stats?.activeOrdersCount || 0, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Günlük Ciro', value: `₺${stats?.todayRevenue.toLocaleString('tr-TR') || 0}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Toplam Müşteri', value: stats?.totalCustomers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Bekleyenler', value: stats?.statusBreakdown.find(s => s.status === 'PENDING')?._count?.id || 0, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Özeti</h1>
        <p className="text-gray-500 font-medium">Restoranınızın bugünkü performansına göz atın.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col gap-4 group hover:border-orange-200 transition-colors"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 shadow-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Haftalık Gelir Grafiği</h3>
              <p className="text-gray-400 font-medium text-xs uppercase tracking-widest">Son 7 günlük ciro değişimi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-2xl font-bold text-xs uppercase tracking-widest">
            <TrendingUp className="w-4 h-4" />
            Büyüme Analizi
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
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
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  padding: '1.5rem'
                }}
                itemStyle={{ fontWeight: 900, fontSize: '1rem', color: '#111827' }}
                labelStyle={{ fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem' }}
                formatter={(value: any) => [`₺${value.toLocaleString('tr-TR')}`, 'Ciro']}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#f97316" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Son Siparişler</h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sipariş NO</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Müşteri</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tutar</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5 font-black text-gray-900 text-sm">#{order.id}</td>
                      <td className="px-8 py-5 font-bold text-gray-600 text-sm">{order.phone}</td>
                      <td className="px-8 py-5 font-black text-orange-600">₺{order.total_price}</td>
                      <td className="px-8 py-5">
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                          {statusMap[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 tracking-tight px-2">Sipariş Dağılımı</h3>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 space-y-6">
            {stats?.statusBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-600 text-sm">{statusMap[item.status] || item.status}</span>
                  <span className="font-black text-gray-900">{item._count.id}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item._count.id / (stats?.statusBreakdown.reduce((a, b) => a + b._count.id, 0) || 1)) * 100}%` }}
                    className="bg-orange-500 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
