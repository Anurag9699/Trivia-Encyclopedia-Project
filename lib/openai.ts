import { GoogleGenerativeAI } from '@google/generative-ai';

export interface TriviaFact {
    title: string;
    explanation: string;
}

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!genAI) {
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

export async function generateTrivia(movieTitle: string): Promise<TriviaFact[]> {
    const client = getClient();
    if (!client) {
        return getFallbackTrivia(movieTitle);
    }

    try {
        const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a movie trivia expert and film enthusiast.

Generate 5 high-quality trivia facts about the movie: "${movieTitle}".

Requirements:
• Write in a clear, engaging, and slightly fun tone.
• Each trivia fact should be interesting, unique, and informative.
• Avoid obvious facts like basic plot summaries.
• Focus on behind-the-scenes facts, production details, casting stories, Easter eggs, filming locations, cultural impact, technology used, or awards.
• Keep each fact concise (2–3 sentences max).
• Use simple language so anyone can understand.
• Make the facts feel like something you'd read on IMDb trivia or a movie blog.
• Do not repeat information.
• If possible include surprising or little-known details.

You MUST respond in EXACTLY this format with no extra text — 5 facts separated by blank lines:

TITLE: [Short catchy fact title]
DETAIL: [2-3 sentence explanation]

TITLE: [Short catchy fact title]
DETAIL: [2-3 sentence explanation]

TITLE: [Short catchy fact title]
DETAIL: [2-3 sentence explanation]

TITLE: [Short catchy fact title]
DETAIL: [2-3 sentence explanation]

TITLE: [Short catchy fact title]
DETAIL: [2-3 sentence explanation]`;

        const result = await model.generateContent(prompt);
        const content = result.response.text();

        if (!content) {
            return getFallbackTrivia(movieTitle);
        }

        const facts = parseTriviaResponse(content);
        return facts.length >= 3 ? facts : getFallbackTrivia(movieTitle);
    } catch (error) {
        console.error('Gemini API error:', error);
        return getFallbackTrivia(movieTitle);
    }
}

function parseTriviaResponse(content: string): TriviaFact[] {
    const facts: TriviaFact[] = [];

    // Split by blank lines to get individual fact blocks
    const blocks = content.split(/\n\s*\n/).filter((b) => b.trim());

    for (const block of blocks) {
        const lines = block.trim().split('\n');
        let title = '';
        let detail = '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.match(/^TITLE:\s*/i)) {
                title = trimmed.replace(/^TITLE:\s*/i, '').trim();
            } else if (trimmed.match(/^DETAIL:\s*/i)) {
                detail = trimmed.replace(/^DETAIL:\s*/i, '').trim();
            } else if (title && !detail) {
                detail = trimmed;
            } else if (title && detail) {
                detail += ' ' + trimmed;
            }
        }

        if (title && detail) {
            facts.push({ title, explanation: detail });
        }
    }

    // Fallback: if structured parsing failed, try line-by-line
    if (facts.length < 3) {
        const lineByLine = content
            .split('\n')
            .map((l) => l.replace(/^\d+[\.\)]\s*/, '').trim())
            .filter((l) => l.length > 10);

        if (lineByLine.length >= 3) {
            return lineByLine.slice(0, 5).map((line) => ({
                title: line.split(/[.!?]/)[0]?.trim() || 'Fun Fact',
                explanation: line,
            }));
        }
    }

    return facts.slice(0, 5);
}

function getFallbackTrivia(movieTitle: string): TriviaFact[] {
    return [
        {
            title: 'Massive Global Audience',
            explanation: `"${movieTitle}" captivated audiences worldwide, earning a passionate fanbase and sparking countless online discussions and fan theories.`,
        },
        {
            title: 'Talented Cast & Crew',
            explanation: `The production of "${movieTitle}" brought together some of the most talented professionals in the industry, from award-winning actors to visionary technicians.`,
        },
        {
            title: 'Critical Acclaim',
            explanation: `"${movieTitle}" received widespread praise from film critics for its storytelling, performances, and technical achievements.`,
        },
        {
            title: 'Improvised Moments',
            explanation: `Several iconic scenes in "${movieTitle}" were actually improvised by the cast, adding an authentic and spontaneous energy to the film.`,
        },
        {
            title: 'Unforgettable Soundtrack',
            explanation: `The music of "${movieTitle}" was meticulously crafted to amplify the emotional impact of every scene, becoming iconic in its own right.`,
        },
    ];
}
