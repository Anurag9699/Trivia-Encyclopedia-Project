import { NextResponse } from 'next/server';
import { fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pages = parseInt(searchParams.get('pages') || '20', 10);

        // Fetch from multiple sources for variety
        const popularPromises = [];
        const topRatedPromises = [];
        const nowPlayingPromises = [];

        for (let page = 1; page <= Math.min(pages, 10); page++) {
            popularPromises.push(fetchPopularMovies(page));
        }
        for (let page = 1; page <= Math.min(Math.floor(pages / 2), 5); page++) {
            topRatedPromises.push(fetchTopRatedMovies(page));
        }
        for (let page = 1; page <= Math.min(Math.floor(pages / 4), 3); page++) {
            nowPlayingPromises.push(fetchNowPlayingMovies(page));
        }

        const [popularArrays, topRatedArrays, nowPlayingArrays] = await Promise.all([
            Promise.all(popularPromises),
            Promise.all(topRatedPromises),
            Promise.all(nowPlayingPromises),
        ]);

        // Combine all sources
        const combined = [
            ...popularArrays.flat(),
            ...topRatedArrays.flat(),
            ...nowPlayingArrays.flat(),
        ];

        // Deduplicate by movie ID
        const seen = new Set<number>();
        const allMovies = combined
            .filter((m) => {
                if (seen.has(m.id)) return false;
                seen.add(m.id);
                return true;
            })
            .slice(0, 400);

        return NextResponse.json({ movies: allMovies });
    } catch (error) {
        console.error('Movies API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch movies' },
            { status: 500 }
        );
    }
}
