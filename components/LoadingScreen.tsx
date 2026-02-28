'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    isLoading: boolean;
    movieCount?: number;
    totalExpected?: number;
}

export default function LoadingScreen({
    isLoading,
    movieCount = 0,
    totalExpected = 400,
}: LoadingScreenProps) {
    const [titles, setTitles] = useState<string[]>([]);

    // Simulate scrolling movie titles
    useEffect(() => {
        if (!isLoading) return;

        const movieTitles = [
            'The Matrix', 'Inception', 'Interstellar', 'Pulp Fiction',
            'The Dark Knight', 'Forrest Gump', 'Titanic', 'Avatar',
            'Star Wars', 'The Godfather', 'Shawshank Redemption', 'Fight Club',
            'The Lion King', 'Toy Story', 'Jurassic Park', 'Back to the Future',
        ];

        let index = 0;
        const interval = setInterval(() => {
            setTitles((prev) => {
                const next = [...prev, movieTitles[index % movieTitles.length]];
                return next.slice(-4);
            });
            index++;
        }, 600);

        return () => clearInterval(interval);
    }, [isLoading]);

    const progress = totalExpected > 0 ? Math.min((movieCount / totalExpected) * 100, 100) : 0;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050510]"
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    {/* Animated rings */}
                    <div className="relative w-40 h-40 mb-8">
                        <motion.div
                            className="absolute inset-0 rounded-full border border-purple-500/20"
                            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                            transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
                        />
                        <motion.div
                            className="absolute inset-3 rounded-full border border-blue-500/30"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-6 rounded-full border border-cyan-500/40"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-9 rounded-full border-t-2 border-r-2 border-purple-400/60"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Center pulsing orb */}
                        <motion.div
                            className="absolute inset-[30%] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-lg shadow-purple-500/40"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    <motion.h1
                        className="text-3xl font-bold text-white mb-2 tracking-[0.2em]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        TRIVIA ENCYCLOPEDIA
                    </motion.h1>

                    <motion.p
                        className="text-gray-500 text-sm tracking-widest uppercase mb-8"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Assembling movie universe
                    </motion.p>

                    {/* Movie title ticker */}
                    <motion.div
                        className="h-6 overflow-hidden w-64 text-center mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <AnimatePresence mode="popLayout">
                            {titles.map((title, i) => (
                                <motion.p
                                    key={`${title}-${i}`}
                                    className="text-xs text-purple-400/60 font-mono"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    ✦ {title}
                                </motion.p>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Progress section */}
                    <div className="w-64">
                        <div className="flex justify-between text-[10px] text-gray-600 mb-1 font-mono">
                            <span>LOADING</span>
                            <span>{movieCount} / {totalExpected} MOVIES</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Bottom ambient glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
