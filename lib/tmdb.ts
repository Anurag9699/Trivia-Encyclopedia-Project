import { Movie, TMDBResponse } from './types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function getPosterUrl(posterPath: string | null): string {
    if (!posterPath) return '/placeholder-poster.png';
    return `${TMDB_IMAGE_BASE}${posterPath}`;
}

async function fetchMoviesFromEndpoint(
    endpoint: string,
    page: number
): Promise<Movie[]> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        throw new Error('TMDB_API_KEY is not set in environment variables');
    }

    const response = await fetch(
        `${TMDB_BASE_URL}${endpoint}?api_key=${apiKey}&language=en-US&page=${page}`,
        { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBResponse = await response.json();

    return data.results
        .filter((movie) => movie.poster_path)
        .map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average,
            overview: movie.overview,
            genreIds: movie.genre_ids || [],
        }));
}

export async function fetchPopularMovies(page: number = 1): Promise<Movie[]> {
    return fetchMoviesFromEndpoint('/movie/popular', page);
}

export async function fetchTopRatedMovies(page: number = 1): Promise<Movie[]> {
    return fetchMoviesFromEndpoint('/movie/top_rated', page);
}

export async function fetchNowPlayingMovies(page: number = 1): Promise<Movie[]> {
    return fetchMoviesFromEndpoint('/movie/now_playing', page);
}

export async function searchMovies(query: string): Promise<Movie[]> {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        throw new Error('TMDB_API_KEY is not set in environment variables');
    }

    const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`,
        { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
    }

    const data: TMDBResponse = await response.json();

    return data.results
        .filter((movie) => movie.poster_path)
        .map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average,
            overview: movie.overview,
            genreIds: movie.genre_ids || [],
        }));
}
