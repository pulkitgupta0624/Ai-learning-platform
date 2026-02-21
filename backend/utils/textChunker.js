// Helper to escape special characters in regex
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Splits a long text into overlapping chunks of words.
 * @param {string} text - The input text.
 * @param {number} chunkSize - Maximum number of words per chunk.
 * @param {number} overlap - Number of words to overlap between consecutive chunks.
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) return [];

    // Ensure overlap is less than chunkSize (otherwise step becomes non-positive)
    if (overlap >= chunkSize) {
        overlap = chunkSize - 1; // at least one word step
    }

    // Normalize whitespace
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .trim();

    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If a single paragraph is longer than chunkSize, split it independently
        if (paragraphWordCount > chunkSize) {
            // Flush any accumulated previous chunk
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                currentChunk = [];
                currentWordCount = 0;
            }

            // Split the long paragraph into chunks with overlap
            for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),  // FIXED: was using empty currentChunk
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                // Stop when the next slice would exceed the array length
                if (i + chunkSize >= paragraphWords.length) break;
            }
            continue; // Move to next paragraph
        }

        // Normal paragraph: try to add to current chunk
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
            // Current chunk is full – push it
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            // Prepare overlap for the next chunk
            const prevChunkText = currentChunk.join('\n\n');
            const prevWords = prevChunkText.split(/\s+/);
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
        } else {
            // Add paragraph to current chunk
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }
    }

    // Push any remaining content
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });
    }

    // Fallback: if no chunks were created but text exists, split by words directly
    if (chunks.length === 0 && cleanedText.length > 0) {
        const allWords = cleanedText.split(/\s+/);
        for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
            const chunkWords = allWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });
            if (i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};

/**
 * Finds the most relevant chunks for a given query using a simple word‑matching score.
 * @param {Array} chunks - Array of chunk objects (must have content, chunkIndex, pageNumber, _id).
 * @param {string} query - The search query.
 * @param {number} maxChunks - Maximum number of chunks to return.
 * @returns {Array} Sorted and filtered chunks with relevance scores.
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if (!chunks || chunks.length === 0 || !query) return [];

    const stopWords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
        'in', 'with', 'to', 'of', 'for', 'by', 'as', 'this', 'that', 'it',
    ]);

    // Tokenize query and filter out stop words & short words
    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    // If no meaningful query words, return the first maxChunks chunks
    if (queryWords.length === 0) {
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }

    // Score each chunk
    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;

        let score = 0;
        let matchedWords = 0;

        for (const word of queryWords) {
            const escapedWord = escapeRegex(word); // FIXED: prevent regex injection

            // Exact word matches (word boundaries) – weight 3
            const exactMatches = (content.match(new RegExp(`\\b${escapedWord}\\b`, 'g')) || []).length;
            score += exactMatches * 3;

            // Partial matches (any occurrence) – weight 1.5 (excluding exact matches already counted)
            const partialMatches = (content.match(new RegExp(escapedWord, 'g')) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;

            if (partialMatches > 0) matchedWords++;
        }

        // Normalize by chunk length (square root reduces bias toward long chunks)
        const normalizedScore = score / Math.sqrt(contentWords);

        // Small position bonus: earlier chunks get a tiny boost
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: matchedWords
        };
    });

    // Filter out chunks with zero score, then sort by score, matchedWords, and finally chunkIndex
    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.matchedWords !== a.matchedWords) return b.matchedWords - a.matchedWords;
            return a.chunkIndex - b.chunkIndex;
        })
        .slice(0, maxChunks);
};