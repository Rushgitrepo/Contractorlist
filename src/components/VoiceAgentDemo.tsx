import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Bot, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const vapi = new Vapi('8d34f2f5-d645-40b4-801a-d00f88c97f91');

const VoiceAgentDemo = () => {
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'active'>('idle');
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Sound effects
    const playSound = (type: 'calling' | 'end') => {
        const audio = new Audio(type === 'calling' ? 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3' : 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
        audio.play().catch(e => console.log('Sound error:', e));
    };

    useEffect(() => {
        vapi.on('call-start', () => {
            setCallStatus('active');
        });

        vapi.on('call-end', () => {
            setCallStatus('idle');
            playSound('end');
        });

        vapi.on('volume-level', (level) => {
            setVolume(level);
        });

        return () => {
            vapi.stop();
        };
    }, []);

    const handleToggleCall = async () => {
        if (callStatus === 'idle') {
            setCallStatus('calling');
            playSound('calling');
            try {
                await vapi.start('6528d9b9-4abc-4b37-a6ba-a29f6862417d');
            } catch (err) {
                console.error('Vapi start error:', err);
                setCallStatus('idle');
            }
        } else {
            vapi.stop();
            setCallStatus('idle');
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-white dark:bg-[#1a1c21] rounded-[3rem] p-4 shadow-2xl border-[8px] border-gray-900 dark:border-gray-800 relative overflow-hidden aspect-[9/19]">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-gray-800 rounded-b-2xl z-20" />

            {/* Screen Content */}
            <div className="h-full w-full rounded-[2.5rem] bg-gradient-to-b from-yellow-400/20 to-white dark:from-yellow-900/20 dark:to-[#0f1115] overflow-hidden flex flex-col p-6 pt-12 relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Agent</span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Morgan</h3>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 border-none animate-pulse">
                        {callStatus === 'active' ? 'Active' : callStatus === 'calling' ? 'Calling...' : 'Online'}
                    </Badge>
                </div>

                {/* Main Visualizer Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {callStatus === 'idle' ? (
                            <motion.div
                                key="idle-view"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative flex flex-col items-center"
                            >
                                <div className="w-48 h-48 rounded-full bg-yellow-400/10 flex items-center justify-center relative overflow-hidden group">
                                    <motion.img
                                        src="/yellow-helmet.png"
                                        alt="Yellow Helmet"
                                        className="w-32 h-32 object-contain relative z-10"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <div className="absolute inset-0 bg-yellow-400/20 blur-2xl group-hover:bg-yellow-400/30 transition-all" />
                                </div>
                                <p className="mt-6 text-sm font-bold text-gray-600 dark:text-gray-400 text-center px-4">
                                    Tap to speak with our AI Construction Manager
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="active-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center w-full"
                            >
                                {/* Visualizer Circles */}
                                <div className="relative w-64 h-64 flex items-center justify-center">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute border-2 border-yellow-400/30 rounded-full"
                                            animate={{
                                                scale: [1, 1.2 + volume, 1],
                                                opacity: [0.3, 0.1, 0.3],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.4,
                                                ease: "easeInOut"
                                            }}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    ))}

                                    <div className="w-32 h-32 rounded-full bg-yellow-400 shadow-xl shadow-yellow-400/50 flex items-center justify-center relative z-10">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1 + volume * 0.5, 1],
                                            }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <Bot className="w-12 h-12 text-black" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase">
                                        {callStatus === 'calling' ? 'Connecting Terminal...' : 'Morgan is Listening'}
                                    </h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">
                                        Paradise Construction AI
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="pb-10 pt-6 flex justify-around items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                        className={cn(
                            "h-14 w-14 rounded-full border border-gray-100 dark:border-white/5",
                            isMuted ? "bg-red-500/10 text-red-500" : "bg-white dark:bg-white/5 text-gray-500"
                        )}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>

                    <Button
                        onClick={handleToggleCall}
                        className={cn(
                            "h-20 w-20 rounded-full shadow-2xl transition-all duration-500 hover:scale-110",
                            callStatus === 'idle'
                                ? "bg-yellow-400 hover:bg-yellow-500 text-black shadow-yellow-500/20"
                                : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                        )}
                    >
                        {callStatus === 'idle' ? (
                            <Phone className="w-8 h-8" />
                        ) : (
                            <PhoneOff className="w-8 h-8" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-500"
                    >
                        <Volume2 className="w-6 h-6" />
                    </Button>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 dark:bg-gray-800 rounded-full" />
            </div>
        </div>
    );
};

// Simple CN utility if not imported
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default VoiceAgentDemo;
