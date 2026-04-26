import { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { clearAlarm } from '@/store/slices/uiSlice';
import { BellRing, X, VolumeX, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Generates a more audible beep sound
function createAlarmBeep(ctx: AudioContext) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'triangle'; 
  
  const now = ctx.currentTime;
  
  oscillator.frequency.setValueAtTime(880, now); 
  oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.1); 
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.2); 
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.8, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  
  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

export const AlarmModal = () => {
  const dispatch = useDispatch();
  const { pendingAlarms } = useSelector((state: RootState) => state.ui);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);

  const isAlarmActive = pendingAlarms.length > 0;
  const currentAlarm = pendingAlarms[0];

  const initAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().then(() => {
        setIsAudioBlocked(false);
      }).catch(() => {
        setIsAudioBlocked(true);
      });
    }
  }, []);

  const playBeep = useCallback(() => {
    try {
      initAudioContext();
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        createAlarmBeep(audioCtxRef.current);
        setIsAudioBlocked(false);
      } else {
        setIsAudioBlocked(true);
      }
    } catch (e) {
      console.error('Audio error:', e);
      setIsAudioBlocked(true);
    }
  }, [initAudioContext]);

  useEffect(() => {
    const handleGesture = () => {
      if (isAlarmActive) {
        initAudioContext();
      }
    };
    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [isAlarmActive, initAudioContext]);

  useEffect(() => {
    if (isAlarmActive) {
      const timer = setTimeout(() => {
        playBeep();
        intervalRef.current = setInterval(playBeep, 2000); // 2 second interval
      }, 100);
      return () => clearTimeout(timer);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAlarmActive, playBeep]);

  return (
    <AnimatePresence>
      {isAlarmActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_rgba(239,68,68,0.3)] p-8 md:p-12 max-w-lg w-full border-8 border-red-500 overflow-hidden relative"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
               {[...Array(20)].map((_, i) => (
                 <BellRing key={i} className="absolute w-20 h-20" style={{ 
                   top: `${Math.random() * 100}%`, 
                   left: `${Math.random() * 100}%`,
                   transform: `rotate(${Math.random() * 360}deg)`
                 }} />
               ))}
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="bg-red-500 p-8 rounded-[2.5rem] mb-8 relative shadow-2xl shadow-red-500/40">
                <BellRing className="w-20 h-20 text-white animate-bounce" />
                <div className="absolute inset-0 bg-red-500 rounded-[2.5rem] animate-ping opacity-20" />
                
                {/* Counter Badge */}
                {pendingAlarms.length > 1 && (
                  <div className="absolute -top-4 -right-4 bg-white text-red-600 w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-xl border-4 border-red-500">
                    {pendingAlarms.length}
                  </div>
                )}
              </div>
              
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">YENİ SİPARİŞ!</h2>
              
              <div className="bg-gray-50 rounded-3xl p-6 mb-8 w-full border border-gray-100">
                <p className="text-2xl text-gray-800 font-black leading-tight">
                  {currentAlarm?.message}
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-red-500 font-bold uppercase tracking-widest text-xs">
                   <ClipboardCheck className="w-4 h-4" />
                   Onay Bekliyor
                </div>
              </div>

              {isAudioBlocked && (
                <div className="mb-8 flex items-center gap-3 text-amber-600 bg-amber-50 px-6 py-4 rounded-2xl border-2 border-amber-200 animate-pulse w-full justify-center">
                  <VolumeX className="w-6 h-6" />
                  <span className="text-sm font-black uppercase tracking-widest">Sesi Açmak İçin Ekrana Dokun!</span>
                </div>
              )}

              <div className="w-full space-y-4">
                <button
                  onClick={() => {
                    initAudioContext();
                    if (currentAlarm) {
                      dispatch(clearAlarm(currentAlarm.id));
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-6 px-10 rounded-[2rem] transition-all flex items-center justify-center gap-4 text-2xl shadow-2xl shadow-red-500/30 cursor-pointer"
                >
                  <X className="w-8 h-8" />
                  ALARM SUSTUR ({pendingAlarms.length})
                </button>
                
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
                  Tüm siparişler susturulana kadar alarm devam eder
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
