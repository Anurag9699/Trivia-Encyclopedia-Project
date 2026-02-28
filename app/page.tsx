'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Movie } from '@/lib/types';
import MovieModal from '@/components/MovieModal';
import SearchBar from '@/components/SearchBar';
import LoadingScreen from '@/components/LoadingScreen';

// Dynamic import to avoid SSR issues with Three.js
const SphereLayout = dynamic(() => import('@/components/SphereLayout'), {
  ssr: false,
});

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch('/api/movies?pages=10');
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        // Give textures a moment to start loading
        setTimeout(() => setIsLoading(false), 2500);
      }
    }

    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase();
    return movies.filter((m) => m.title.toLowerCase().includes(q));
  }, [movies, searchQuery]);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <LoadingScreen isLoading={isLoading} />

      {!isLoading && (
        <>
          <SearchBar onSearch={handleSearch} />

          {filteredMovies.length > 0 ? (
            <SphereLayout
              movies={filteredMovies}
              onSelectMovie={handleSelectMovie}
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
          <div className="fixed bottom-6 right-6 z-40 text-gray-600 text-xs tracking-wider uppercase">
            {filteredMovies.length} movies
          </div>

          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        </>
      )}
    </main>
  );
}
