'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie, TriviaResponse, GENRE_MAP } from '@/lib/types';

interface MovieModalProps {
    movie: Movie | null;
    onClose: () => void;
}

// Animated number counter
function AnimatedRating({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let frame: number;
        let start: number | null = null;
        const duration = 1000;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Number((value * eased).toFixed(1)));
            if (progress < 1) frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [value]);

    return <span>{display}</span>;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    const [trivia, setTrivia] = useState<string[]>([]);
    const [isLoadingTrivia, setIsLoadingTrivia] = useState(false);
    const [revealedFacts, setRevealedFacts] = useState(0);

    const fetchTrivia = useCallback(async (title: string) => {
        setIsLoadingTrivia(true);
        setRevealedFacts(0);
        try {
            const res = await fetch('/api/trivia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            const data: TriviaResponse = await res.json();
            setTrivia(data.facts || []);

            // Staggered reveal of facts
            const facts = data.facts || [];
            facts.forEach((_, i) => {
                setTimeout(() => setRevealedFacts(i + 1), 300 + i * 400);
            });
        } catch (error) {
            console.error('Failed to fetch trivia:', error);
            setTrivia(['Unable to load trivia at this time.']);
            setRevealedFacts(1);
        } finally {
            setIsLoadingTrivia(false);
        }
    }, []);

    useEffect(() => {
        if (movie) {
            fetchTrivia(movie.title);
        } else {
            setTrivia([]);
            setRevealedFacts(0);
        }
    }, [movie, fetchTrivia]);

    // ESC key listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const releaseYear = movie?.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : 'N/A';

    const genres = movie?.genreIds
        ?.map((id) => GENRE_MAP[id])
        .filter(Boolean) || [];

    return (
        <AnimatePresence>
            {movie && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Blurred poster backdrop */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(https://image.tmdb.org/t/p/w780${movie.posterPath})`,
                                filter: 'blur(40px) brightness(0.15)',
                                transform: 'scale(1.2)',
                            }}
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </motion.div>

                    {/* Click outside to close */}
                    <div className="absolute inset-0 z-[1]" onClick={onClose} />

                    {/* Modal Content */}
                    <motion.div
                        className="relative z-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900/90 to-black/90 shadow-2xl backdrop-blur-sm"
                        initial={{ scale: 0.85, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                            {/* Poster */}
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                                <motion.img
                                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                    alt={movie.title}
                                    className="w-56 md:w-64 rounded-xl shadow-2xl shadow-purple-500/20 ring-1 ring-white/10"
                                    initial={{ opacity: 0, x: -20, rotateY: -15 }}
                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <motion.h2
                                    className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    {movie.title}
                                </motion.h2>

                                <motion.div
                                    className="flex items-center gap-4 mb-3 text-sm text-gray-400"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="text-lg">{releaseYear}</span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-yellow-500 font-semibold">
                                            <AnimatedRating value={movie.voteAverage} />
                                        </span>
                                    </span>
                                </motion.div>

                                {/* Genre Tags */}
                                {genres.length > 0 && (
                                    <motion.div
                                        className="flex flex-wrap gap-2 mb-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        {genres.map((genre) => (
                                            <span
                                                key={genre}
                                                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </motion.div>
                                )}

                                <motion.p
                                    className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {movie.overview || 'No overview available.'}
                                </motion.p>

                                {/* Trivia Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                        <span className="text-xl">🎬</span>
                                        Trivia Facts
                                        <span className="text-xs text-gray-500 font-normal ml-1">
                                            AI-generated
                                        </span>
                                    </h3>

                                    {isLoadingTrivia ? (
                                        <div className="space-y-3">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="h-5 bg-white/5 rounded-lg"
                                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.1,
                                                    }}
                                                    style={{ width: `${70 + Math.random() * 30}%` }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className="space-y-2.5">
                                            {trivia.map((fact, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="flex items-start gap-3 text-sm text-gray-300"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{
                                                        opacity: i < revealedFacts ? 1 : 0,
                                                        x: i < revealedFacts ? 0 : -20,
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 200 }}
                                                >
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white mt-0.5 shadow-lg shadow-purple-500/30">
                                                        {i + 1}
                                                    </span>
                                                    <span className="leading-relaxed">{fact}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
