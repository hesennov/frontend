import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTracker = ({ orderId }: { orderId: number }) => {
  const { activeOrders } = useSelector((state: RootState) => state.order);
  const order = activeOrders.find(o => o.id === orderId);

  if (!order) return <div className="p-4 text-center text-gray-500">Sipariş bulunamadı veya tamamlandı.</div>;

  const steps = [
    { status: 'PENDING', label: 'Bekliyor', icon: Clock },
    { status: 'ACCEPTED', label: 'Onaylandı', icon: CheckCircle2 },
    { status: 'PREPARING', label: 'Hazırlanıyor', icon: ChefHat },
    { status: 'ON_THE_WAY', label: 'Yolda', icon: Bike },
    { status: 'DELIVERED', label: 'Teslim Edildi', icon: PackageCheck },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Sipariş Takibi #{order.id}</h3>
      <div className="flex justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
        {/* Active Progress Bar */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
        
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? '#f97316' : '#E5E7EB',
                  color: isActive ? '#FFFFFF' : '#9CA3AF'
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'text-orange-700' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
