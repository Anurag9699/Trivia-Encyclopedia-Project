'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {/* Animated rings */}
                    <div className="relative w-32 h-32 mb-8">
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-2 rounded-full border-2 border-blue-500/40"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-4 rounded-full border-2 border-cyan-500/50"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-6 rounded-full border-t-2 border-r-2 border-purple-400"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Center dot */}
                        <motion.div
                            className="absolute inset-[38%] rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    <motion.h1
                        className="text-2xl font-bold text-white mb-2 tracking-wider"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        TRIVIA ENCYCLOPEDIA
                    </motion.h1>

                    <motion.p
                        className="text-gray-500 text-sm tracking-widest uppercase"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading movie universe
                    </motion.p>

                    {/* Bottom progress bar */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: 'easeInOut' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
