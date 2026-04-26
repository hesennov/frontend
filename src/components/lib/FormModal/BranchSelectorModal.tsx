import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Search, ChevronRight, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBranch } from '@/store/slices/branchSlice';
import type { RootState } from '@/store';
import { api } from '@/services/api';

interface Branch {
  id: number;
  name: string;
  address: string;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export const BranchSelectorModal = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();
  const selectedBranchId = useSelector((state: RootState) => state.branch.selectedBranchId);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get('/branches');
        setBranches(res.data.data.filter((b: Branch) => b.is_active));
      } catch (error) {
        console.error('Şubeler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchBranches();
  }, [open]);

  const handleSelect = (id: number) => {
    dispatch(selectBranch(id));
    onClose();
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-4 border-b border-gray-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Şube Seçin</h2>
                  <p className="text-gray-500 font-medium">Size en yakın lezzet noktasını belirleyin.</p>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Şube veya bölge ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-[450px] overflow-y-auto p-8 pt-4 space-y-4 no-scrollbar">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : filteredBranches.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest">Şube bulunamadı.</div>
              ) : (
                filteredBranches.map((branch) => (
                  <motion.div
                    key={branch.id}
                    onClick={() => handleSelect(branch.id)}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${
                      selectedBranchId === branch.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-50 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedBranchId === branch.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <MapPin className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-none mb-2">{branch.name}</h3>
                        <p className="text-sm font-medium text-gray-400 line-clamp-1">{branch.address}</p>
                      </div>
                    </div>
                    {selectedBranchId === branch.id ? (
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6" />
                      </div>
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-gray-900 transition-colors" />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-8 bg-gray-50 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Toplam {filteredBranches.length} Şube Aktif</p>
              <button onClick={onClose} className="text-gray-900 font-black text-sm hover:underline">Vazgeç</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
