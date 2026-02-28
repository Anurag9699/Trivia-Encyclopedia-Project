'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Movie } from '@/lib/types';
import MovieModal from '@/components/MovieModal';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';
import LoadingScreen from '@/components/LoadingScreen';

// Dynamic import to avoid SSR issues with Three.js
const SphereLayout = dynamic(() => import('@/components/SphereLayout'), {
  ssr: false,
});

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch('/api/movies?pages=20');
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        // Wait for textures to start loading
        setTimeout(() => setIsLoading(false), 3000);
      }
    }

    loadMovies();
  }, []);

  // Filter movies by search query
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase();
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [movies, searchQuery]);

  // Determine which movies to display (search filtered)
  // Genre filter dims rather than removes (so sphere doesn't rearrange)
  const displayMovies = searchFiltered;

  // Set of movie IDs that match the genre filter (used for dimming)
  const activeMovieIds = useMemo(() => {
    if (selectedGenre === 0) return undefined; // No filter = all active
    const matching = new Set<number>();
    displayMovies.forEach((m) => {
      if (m.genreIds.includes(selectedGenre)) {
        matching.add(m.id);
      }
    });
    return matching;
  }, [displayMovies, selectedGenre]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelectGenre = useCallback((genreId: number) => {
    setSelectedGenre(genreId);
  }, []);

  const matchCount = activeMovieIds ? activeMovieIds.size : displayMovies.length;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#050510]">
      <LoadingScreen
        isLoading={isLoading}
        movieCount={movies.length}
        totalExpected={400}
      />

      {!isLoading && (
        <>
          <SearchBar onSearch={handleSearch} />
          <GenreFilter selectedGenre={selectedGenre} onSelectGenre={handleSelectGenre} />

          {displayMovies.length > 0 ? (
            <SphereLayout
              movies={displayMovies}
              onSelectMovie={handleSelectMovie}
              dimmedIds={activeMovieIds}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                {movies.length === 0
                  ? 'Loading movies...'
                  : 'No movies match your search.'}
              </p>
            </div>
          )}

          {/* Movie count indicator */}
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-500 text-xs tracking-wider uppercase font-mono">
              {matchCount} movies
            </span>
          </div>

          {/* Logo watermark */}
          <div className="fixed bottom-6 left-6 z-40">
            <span className="text-gray-700 text-[10px] tracking-[0.3em] uppercase font-mono">
              Trivia Encyclopedia
            </span>
          </div>

          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        </>
      )}
    </main>
  );
}
