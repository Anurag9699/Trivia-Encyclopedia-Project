'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Movie, GENRE_MAP } from '@/lib/types';

interface SearchResultsProps {
    movies: Movie[];
    query: string;
    onSelectMovie: (movie: Movie) => void;
}

function MovieCard({ movie, index, onSelect }: { movie: Movie; index: number; onSelect: (movie: Movie) => void }) {
    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A';
    const genres = movie.genreIds?.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3) || [];
    const rating = movie.voteAverage?.toFixed(1) || '0.0';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={() => onSelect(movie)}
            className="search-card group relative cursor-pointer"
        >
            {/* Hover glow border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-purple-500/60 group-hover:via-blue-500/40 group-hover:to-cyan-500/60 transition-all duration-500 opacity-0 group-hover:opacity-100 blur-[1px]" />

            {/* Card body */}
            <div className="relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] overflow-hidden transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/[0.12] group-hover:shadow-2xl group-hover:shadow-purple-500/10 group-hover:-translate-y-1">
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.posterPath ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                    )}

                    {/* Gradient overlay on poster */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-semibold text-white">{rating}</span>
                    </div>

                    {/* Title + year overlay at bottom of poster */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1 drop-shadow-lg">
                            {movie.title}
                        </h3>
                        <span className="text-gray-300 text-xs font-medium">{year}</span>
                    </div>
                </div>

                {/* Genre pills */}
                {genres.length > 0 && (
                    <div className="px-3 py-2.5 flex flex-wrap gap-1.5">
                        {genres.map((genre) => (
                            <span
                                key={genre}
                                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 border border-purple-500/20 transition-all duration-300 group-hover:from-purple-500/30 group-hover:to-blue-500/30 group-hover:border-purple-500/30"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function SearchResults({ movies, query, onSelectMovie }: SearchResultsProps) {
    return (
        <motion.div
            className="fixed inset-0 z-30 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Dark cinematic backdrop */}
            <div className="absolute inset-0 bg-[#050510]/95 backdrop-blur-sm" />

            {/* Ambient glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative h-full overflow-y-auto search-results-scroll pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="max-w-7xl mx-auto mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-500 to-blue-500" />
                        <div>
                            <h2 className="text-white/90 text-lg font-semibold tracking-tight">
                                {movies.length > 0 ? (
                                    <>
                                        Found <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{movies.length}</span> result{movies.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                                    </>
                                ) : (
                                    <>No results for &quot;{query}&quot;</>
                                )}
                            </h2>
                            <p className="text-gray-500 text-xs mt-0.5">Click a movie to explore trivia facts</p>
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid */}
                {movies.length > 0 ? (
                    <motion.div
                        className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {movies.map((movie, index) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    index={index}
                                    onSelect={onSelectMovie}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    /* Empty state */
                    <motion.div
                        className="flex flex-col items-center justify-center min-h-[50vh]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-xl" />
                        </div>
                        <p className="text-gray-400 text-base font-medium mb-1">No movies found</p>
                        <p className="text-gray-600 text-sm">Try a different search term</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
