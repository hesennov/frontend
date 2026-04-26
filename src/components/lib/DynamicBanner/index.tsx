import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerData {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

const defaultBanners: BannerData[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800', isActive: true },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', isActive: true }
];

export const DynamicBanner = () => {
  const [banners] = useState<BannerData[]>(defaultBanners);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-lg group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={banners[currentIndex].imageUrl}
          alt="Banner"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
};
