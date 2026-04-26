import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, Clock, Globe, Share2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[2.5rem] shadow-2xl z-[10001] overflow-hidden"
          >
            {/* Header Image/Banner */}
            <div className="h-32 bg-gray-900 relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -ml-16 -mb-16" />
              
              <h2 className="text-3xl font-black text-white z-10 tracking-tighter">
                <span className="text-orange-500">Kebab</span> evi
              </h2>
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* About Text */}
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-2">Hakkımızda</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Anadolu'nun bereketli topraklarından gelen geleneksel tarifleri, usta ellerde hayat bularak sofralarınıza taşıyoruz. 
                  Yılların tecrübesi ve en taze malzemelerle hazırladığımız lezzetlerle hizmetinizdeyiz.
                </p>
              </div>

              <div className="border-t border-gray-100" />

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 mb-2">İletişim</h3>
                
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Merkez Şube</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Lezzet Mahallesi, Gurme Sokak No:1<br/>Kadıköy, İstanbul</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Müşteri Hizmetleri</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">+90 (555) 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Çalışma Saatleri</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Her gün: 10:00 - 02:00</p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="pt-4 flex items-center justify-center gap-4">
                <a href="#" className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all cursor-pointer">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all cursor-pointer">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all cursor-pointer">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
