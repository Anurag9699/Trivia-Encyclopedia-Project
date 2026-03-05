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

        const prompt = `Act as an expert film historian and copywriter for a premium movie streaming app.

Write exactly 5 fascinating, mind-blowing trivia points for the movie: "${movieTitle}" focusing heavily on antigravity/zero-gravity concepts.

The goal is to make these trivia points so engaging that a user reading them in the app's UI will immediately want to watch the movie.

CRITICAL INSTRUCTIONS:
- You MUST use the exact 5 headings provided below. Do not change them.
- Keep the description for each heading between 2 to 3 sentences. It needs to be punchy and fit well inside a small UI card.
- Focus strictly on the sci-fi, physics-defying, and technical aspects of filming antigravity/zero-gravity scenes.

Use EXACTLY these headings in this order, formatted precisely with TITLE and DETAIL:

TITLE: Hidden Easter Egg in Production
DETAIL: [Focus on a hidden detail in the set design or background related to zero-G or physics]

TITLE: An Unexpected Casting Choice
DETAIL: [Focus on an actor who was surprisingly cast or almost played the lead]

TITLE: The Unscripted Masterpiece
DETAIL: [Focus on an unscripted moment that happened while filming in the antigravity rigs or harnesses]

TITLE: Grueling Physical Preparation
DETAIL: [Focus on the intense physical training, wirework, or "vomit comet" flights the actors endured]

TITLE: Record-Breaking Practical Effects
DETAIL: [Focus on a massive practical set piece built to simulate zero gravity, like a rotating hallway or complex wire system, rather than CGI]`;

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
            // Remove emojis like 1️⃣ from the title since our UI provides its own emojis
            title = title.replace(/^[\d️⃣\s\-]+/, '').trim();
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
    // If the API rate limits, provide interesting fallback facts tailored to the movie title name and antigravity theme
    return [
        {
            title: 'Hidden Easter Egg in Production',
            explanation: `During the filming of "${movieTitle}", the art department secretly hid a whiteboard equation calculating real orbital mechanics in the background of the main airlock set. Only actual physicists spotted the inside joke about zero-G trajectories.`,
        },
        {
            title: 'An Unexpected Casting Choice',
            explanation: `The lead role in "${movieTitle}" was originally written for a Hollywood veteran known for action pieces, but they dropped out due to severe motion sickness during initial centrifuge tests. The current star stepped in and completely owned the wirework.`,
        },
        {
            title: 'The Unscripted Masterpiece',
            explanation: `One of the most intense scenes in "${movieTitle}" features the actor genuinely struggling to grab a floating tether. The missed grab wasn't scripted; the actor actually slipped in the zero-G harness, and the director kept the authentic panic in the final cut.`,
        },
        {
            title: 'Grueling Physical Preparation',
            explanation: `To prepare for "${movieTitle}", the cast endured weeks of punishing abdominal and core training just to speak normally while suspended in harnesses. They also completed several intense parabolic "vomit comet" flights to experience true weightlessness.`,
        },
        {
            title: 'Record-Breaking Practical Effects',
            explanation: `Instead of relying entirely on CGI for the massive spacewalk sequence, the crew of "${movieTitle}" built a massive rotating set pieces spanning three soundstages. It took an unprecedented wire-rig system and over 100 technicians to safely float the cast through the practical corridors.`,
        },
    ];
}
