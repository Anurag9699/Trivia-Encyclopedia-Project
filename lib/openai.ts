import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    if (!openaiClient) {
        openaiClient = new OpenAI({ apiKey });
    }
    return openaiClient;
}

export async function generateTrivia(movieTitle: string): Promise<string[]> {
    const client = getClient();
    if (!client) {
        return getFallbackTrivia(movieTitle);
    }

    try {
        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a movie trivia expert. Respond with exactly 5 trivia facts, one per line. Each fact should be short and under 20 words. Do not number the facts or add bullet points.',
                },
                {
                    role: 'user',
                    content: `Generate 5 short, interesting and surprising trivia facts about the movie "${movieTitle}". Keep each fact under 20 words.`,
                },
            ],
            temperature: 0.8,
            max_tokens: 300,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            return getFallbackTrivia(movieTitle);
        }

        const facts = content
            .split('\n')
            .map((line) => line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim())
            .filter((line) => line.length > 0)
            .slice(0, 5);

        return facts.length >= 3 ? facts : getFallbackTrivia(movieTitle);
    } catch (error) {
        console.error('OpenAI API error:', error);
        return getFallbackTrivia(movieTitle);
    }
}

function getFallbackTrivia(movieTitle: string): string[] {
    return [
        `"${movieTitle}" has been watched by millions of viewers worldwide.`,
        `The production of "${movieTitle}" involved hundreds of talented crew members.`,
        `"${movieTitle}" received significant attention from film critics upon release.`,
        `Many memorable scenes from "${movieTitle}" were improvised on set.`,
        `The soundtrack of "${movieTitle}" was carefully curated to enhance the viewing experience.`,
    ];
}
