import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined')
}

export const generateFlashcards = async (text, count = 10) => {
    const prompt = `Generate exactly ${count} flashcards from the following text: ${text}
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [concise, accurate answer]
    D: [Difficulty level: easy, medium or hard]

    Seperate each flashcard with "---"

    Text:
    ${text.substring(0, 15000)};
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt
        })

        const generatedText = response.text;

        const flashcards = [];
        const cards = generatedText.split('---').filter(c => c.trim());

        for (const card of cards) {
            const lines = card.trim().split('\n');
            let question = '', answer = '', difficulty = 'medium';

            for (const line of lines) {
                if (line.startsWith('Q:')) {
                    question = line.substring(2).trim();
                } else if (line.startsWith('A:')) {
                    answer = line.substring(2).trim();
                } else if (line.startsWith('D:')) {
                    const diff = line.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            if (question && answer) {
                flashcards.push({
                    question,
                    answer,
                    difficulty
                })
            }
        }

        return flashcards.slice(0, count);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw new Error('Failed to generate flashcards');
    }
}

export const generateQuiz = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text: ${text}
    Format each question as:
    Q: [Question]
    O1: [Option 1]
    O2: [Option 2]
    O3: [Option 3]
    O4: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief explaination]
    D: [Difficulty level: easy, medium or hard]

    Seperate each question with "---"

    Text:
    ${text.substring(0, 15000)};
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt
        })

        const generatedText =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            '';

        const questions = [];
        const questionBlocks = generatedText.split('---').filter(c => c.trim());

        for (const block of questionBlocks) {
            const lines = block.trim().split('\n');
            let question = '', options = [], correctAnswer = '', explaination = '', difficulty = 'medium';

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('Q:')) {
                    question = trimmed.substring(2).trim();
                } else if (/^O[1-4]:/i.test(trimmed)) {
                    options.push(trimmed.replace(/^O\d[:).]\s*/i, '').trim());
                } else if (trimmed.startsWith('C:')) {
                    correctAnswer = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('E:')) {
                    explaination = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            if (question && options.length === 4 && correctAnswer && explaination) {
                questions.push({
                    question,
                    options,
                    correctAnswer,
                    explaination,
                    difficulty
                })
            }
        }

        return questions.slice(0, numQuestions);
    } catch (error) {
        console.log('Error generating quiz:', error);
        throw new Error('Failed to generate quiz');
    }
}

export const generateSummary = async (text) => {
    const prompt = `Generate a concise summary of the following text: ${text}
    Provide a concise summary for the following text , highlighting the key concepts,
    main ideas and keep the sumary clear and structured
    Text:
    ${text.substring(0, 20000)};
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt
        })

        const generatedText = response.text;

        return generatedText;
    } catch (error) {
        console.log('Error generating summary:', error);
        throw new Error('Failed to generate summary');
    }
}

export const chatWithContext = async (question, chunks) => {
    const context = chunks.map((c, i) => `[Chunk ${i + 1}]: ${c.content}`).join('\n');

    const prompt = `Based on the following context from a document, Analyse the context and answer the user input
    If the answer is not in the context say so.

    Context:
    ${context}
    User Input:
    ${question};

    Answer:
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt
        });

        const generatedText = response.text;

        return generatedText;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to process chat request');
    }
}

export const explainConcept = async (concept, context) => {
    const prompt = `Explain the concept of "${concept}" based on the following context.
    Provise a clear , educational explaination that's easy to understand.
    Includes examples if relavant

    Context:
    ${context.substring(0, 10000)};
    `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt
        })

        const generatedText = response.text;

        return generatedText;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to explain concept');
    }
}