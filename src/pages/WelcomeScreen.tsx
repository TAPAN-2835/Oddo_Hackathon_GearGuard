import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
    onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 1000),
            setTimeout(() => setStep(2), 2500),
            setTimeout(() => setStep(3), 4000),
            setTimeout(() => setStep(4), 5500),
            setTimeout(() => onComplete(), 7000),
        ];

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-primary via-accent to-primary">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0">
                <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="white" opacity="0.5" />
                        </pattern>
                        <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(320, 75%, 60%)" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="hsl(270, 70%, 55%)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="hsl(210, 85%, 55%)" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#meshGradient)" />
                </svg>
            </div>

            {/* Floating Orbs */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/20 backdrop-blur-sm"
                    style={{
                        width: 100 + i * 50,
                        height: 100 + i * 50,
                        left: `${10 + i * 12}%`,
                        top: `${5 + i * 10}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="logo"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.8, type: 'spring' }}
                            className="relative"
                        >
                            {/* Hexagon Logo Container */}
                            <div className="relative w-48 h-48">
                                {/* Rotating Hexagon Border */}
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <polygon
                                            points="50 1 95 25 95 75 50 99 5 75 5 25"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeDasharray="10 5"
                                            opacity="0.6"
                                        />
                                    </svg>
                                </motion.div>

                                {/* Inner Glow */}
                                <motion.div
                                    className="absolute inset-4 bg-white/30 rounded-full blur-2xl"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />

                                {/* Logo */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                                        <img src="/logo.png" alt="GearGuard" className="w-24 h-24 object-contain" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="brand"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="text-center"
                        >
                            <motion.h1
                                className="text-7xl font-black text-white mb-4"
                                animate={{
                                    backgroundImage: [
                                        'linear-gradient(45deg, #fff, #f0f0f0)',
                                        'linear-gradient(45deg, #f0f0f0, #fff)',
                                    ],
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                GearGuard
                            </motion.h1>
                            <motion.p
                                className="text-2xl text-white/90 font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                The Ultimate Maintenance Tracker
                            </motion.p>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="features"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="grid grid-cols-2 gap-6"
                        >
                            {[
                                { icon: Shield, text: 'Secure & Reliable', color: 'from-blue-400 to-cyan-400' },
                                { icon: Zap, text: 'Lightning Fast', color: 'from-yellow-400 to-orange-400' },
                                { icon: TrendingUp, text: 'Boost Efficiency', color: 'from-green-400 to-emerald-400' },
                                { icon: Sparkles, text: 'Smart Automation', color: 'from-purple-400 to-pink-400' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-white font-semibold text-lg">{feature.text}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="tagline"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="text-center max-w-2xl"
                        >
                            <motion.h2
                                className="text-5xl font-bold text-white mb-6"
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Revolutionize Your Maintenance
                            </motion.h2>
                            <p className="text-xl text-white/90 mb-8">
                                Track equipment, manage requests, and optimize workflows with cutting-edge technology
                            </p>
                            <motion.div
                                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-2xl"
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Get Started <ArrowRight className="w-5 h-5" />
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="flex gap-3 mb-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-4 h-4 bg-white rounded-full"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-white text-lg font-medium">Loading your dashboard...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
    );
}
