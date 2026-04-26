import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, User, Activity, ChevronDown, ChevronUp, Search, Calendar } from 'lucide-react';
import { api } from '@/services/api';

interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity: string;
  entity_id: number;
  details: any;
  created_at: string;
  user: {
    phone: string;
    role: string;
  };
}

export const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/logs');
        setLogs(res.data.data);
      } catch (error) {
        console.error('Audit logs fetch error');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.phone.includes(searchTerm) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes('DELETE')) return 'text-red-500 bg-red-50 border-red-100';
    if (action.includes('CREATE')) return 'text-green-500 bg-green-50 border-green-100';
    if (action.includes('UPDATE')) return 'text-blue-500 bg-blue-50 border-blue-100';
    return 'text-orange-500 bg-orange-50 border-orange-100';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Denetim Kayıtları</h1>
          <p className="text-gray-500 font-medium text-lg">Sistemdeki tüm idari hareketleri gerçek zamanlı izleyin.</p>
        </div>
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text"
            placeholder="İşlem, telefon veya varlık ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-900 focus:border-orange-200 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.03)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Zaman</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kullanıcı</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">İşlem</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Varlık</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <Fragment key={log.id}>
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-300" />
                        <span className="text-sm font-bold text-gray-600">
                          {new Date(log.created_at).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 leading-none mb-1">{log.user.phone}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{log.user.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-500/50" />
                        <span className="font-bold text-gray-900">{log.entity}</span>
                        <span className="text-xs font-bold text-gray-400">#{log.entity_id}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {expandedId === log.id ? <ChevronUp className="w-5 h-5 ml-auto text-orange-500" /> : <ChevronDown className="w-5 h-5 ml-auto text-gray-300" />}
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedId === log.id && (
                      <tr>
                        <td colSpan={5} className="bg-gray-50/50 px-10 py-8">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <Activity className="w-3 h-3" /> İşlem Detayları
                                </h4>
                                <pre className="text-xs font-mono bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                              <div className="space-y-4">
                                <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Kayıt Tarihi</p>
                                    <p className="font-black text-gray-900">{new Date(log.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                </div>
                                <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Varlık Türü</p>
                                    <p className="font-black text-gray-900">{log.entity} (ID: {log.entity_id})</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Activity className="w-12 h-12 text-gray-200 mb-2" />
                      <span className="text-lg font-black text-gray-300">Kayıt Bulunamadı</span>
                      <p className="text-gray-400 text-sm">Arama kriterlerinize uygun sistem kaydı yok.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Fragment = ({ children }: { children: React.ReactNode }) => <>{children}</>;
