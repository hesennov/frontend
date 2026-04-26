import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchBranches, selectBranch } from '@/store/slices/branchSlice';

export const BranchSelectionModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches, selectedBranchId, isLoading } = useSelector((state: RootState) => state.branch);

  useEffect(() => {
    if (branches.length === 0) {
      dispatch(fetchBranches());
    }
  }, [dispatch, branches.length]);

  const handleSelect = (id: number) => {
    dispatch(selectBranch(id));
  };

  // Only show if no branch is selected
  if (selectedBranchId !== null) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
              Hoş Geldiniz! 👋
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Sipariş vermek için lütfen size en uygun şubemizi seçin.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches.filter(b => b.is_active).map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch.id)}
                  className="text-left bg-gray-50 hover:bg-orange-50 border-2 border-transparent hover:border-orange-500 rounded-[2rem] p-6 transition-all duration-300 group shadow-sm hover:shadow-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                      {branch.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-4 line-clamp-2">
                    {branch.address}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-white w-fit px-3 py-1.5 rounded-xl">
                    <Clock className="w-4 h-4" />
                    {branch.working_hours}
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
