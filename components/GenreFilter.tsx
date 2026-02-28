'use client';

import { motion } from 'framer-motion';
import { GENRE_FILTERS } from '@/lib/types';

interface GenreFilterProps {
    selectedGenre: number;
    onSelectGenre: (genreId: number) => void;
}

export default function GenreFilter({ selectedGenre, onSelectGenre }: GenreFilterProps) {
    return (
        <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex flex-wrap justify-center gap-2 px-4 max-w-3xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
        >
            {GENRE_FILTERS.map((genre, i) => (
                <motion.button
                    key={genre.id}
                    onClick={() => onSelectGenre(genre.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${selectedGenre === genre.id
                            ? 'bg-purple-500/30 border-purple-400/60 text-purple-200 shadow-lg shadow-purple-500/20'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300 hover:border-white/20'
                        }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.04, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {genre.name}
                </motion.button>
            ))}
        </motion.div>
    );
}
