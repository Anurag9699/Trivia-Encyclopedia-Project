import { NextResponse } from 'next/server';
import { fetchPopularMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pages = parseInt(searchParams.get('pages') || '10', 10);

        const moviePromises = [];
        for (let page = 1; page <= Math.min(pages, 10); page++) {
            moviePromises.push(fetchPopularMovies(page));
        }

        const movieArrays = await Promise.all(moviePromises);
        // Deduplicate by movie ID (TMDB can return dupes across pages)
        const seen = new Set<number>();
        const allMovies = movieArrays.flat().filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        }).slice(0, 200);

        return NextResponse.json({ movies: allMovies });
    } catch (error) {
        console.error('Movies API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch movies' },
            { status: 500 }
        );
    }
}
