import { NextResponse } from 'next/server';
import { generateTrivia, TriviaFact } from '@/lib/openai';

// In-memory cache to avoid repeated API calls
const triviaCache = new Map<string, TriviaFact[]>();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title } = body;

        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { error: 'Movie title is required' },
                { status: 400 }
            );
        }

        // Check cache first
        const cacheKey = title.toLowerCase().trim();
        if (triviaCache.has(cacheKey)) {
            return NextResponse.json({
                facts: triviaCache.get(cacheKey),
                cached: true,
            });
        }

        // Generate trivia
        const facts = await generateTrivia(title);

        // Store in cache
        triviaCache.set(cacheKey, facts);

        return NextResponse.json({
            facts,
            cached: false,
        });
    } catch (error) {
        console.error('Trivia API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate trivia' },
            { status: 500 }
        );
    }
}
