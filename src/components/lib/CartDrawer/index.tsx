import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/store';
import { closeCart } from '@/store/slices/uiSlice';
import { removeItem, addItem, clearCart } from '@/store/slices/cartSlice';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector((state: RootState) => state.ui);
  const { items, total } = useSelector((state: RootState) => state.cart);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
                <ShoppingBag className="w-5 h-5" />
                <span>Sepetim</span>
              </div>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={() => dispatch(clearCart())}
                    title="Sepeti Temizle"
                    className="p-2 hover:bg-red-100 hover:text-red-600 text-gray-400 rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => dispatch(closeCart())}
                  className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Sepetiniz şu an boş.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-orange-600 font-bold mt-1">₺{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch(addItem({ ...item, quantity: -1 }));
                          } else {
                            dispatch(removeItem(item.productId));
                          }
                        }}
                        className="p-1 hover:bg-white hover:shadow rounded-lg transition-all text-gray-600 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(addItem({ ...item, quantity: 1 }))}
                        className="p-1 hover:bg-white hover:shadow rounded-lg transition-all text-gray-600 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 pb-28 md:pb-4 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Toplam Tutar</span>
                  <span className="text-2xl font-bold text-gray-900">₺{total}</span>
                </div>
                <button 
                  onClick={() => {
                    dispatch(closeCart());
                    navigate('/checkout');
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-orange-200"
                >
                  <span>Ödemeye Geç</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
