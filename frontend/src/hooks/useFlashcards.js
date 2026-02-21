import { useState, useEffect, useCallback } from 'react'
import flashcardService from '../services/flashcardService'
import aiService from '../services/aiService'
import toast from 'react-hot-toast'

const useFlashcards = (documentId = null) => {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    const fetchFlashcards = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let res;
            if (documentId) {
                res = await flashcardService.getFlashcardsForDocument(documentId);
            } else {
                res = await flashcardService.getAllFlashcardsSets();
            }
            setFlashcardSets(res.data || []);
        } catch (err) {
            setError(err.error || 'Failed to load flashcards');
            toast.error('Failed to load flashcards');
        } finally {
            setLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchFlashcards();
    }, [fetchFlashcards]);

    const generateFlashcards = async (docId, count = 10) => {
        setGenerating(true);
        try {
            const res = await aiService.generateFlashcards(docId, { count });
            setFlashcardSets(prev => [res.data, ...prev]);
            toast.success(`${count} flashcards generated!`);
            return res.data;
        } catch (err) {
            toast.error(err.error || 'Failed to generate flashcards');
            throw err;
        } finally {
            setGenerating(false);
        }
    };

    const deleteFlashcardSet = async (id) => {
        try {
            await flashcardService.deleteFlashcardSet(id);
            setFlashcardSets(prev => prev.filter(s => s._id !== id));
            toast.success('Flashcard set deleted');
        } catch {
            toast.error('Failed to delete flashcard set');
        }
    };

    const toggleStar = async (cardId, setId, cardIndex) => {
        try {
            await flashcardService.toggleStar(cardId);
            setFlashcardSets(prev =>
                prev.map(set => {
                    if (set._id !== setId) return set;
                    const updatedCards = [...set.cards];
                    updatedCards[cardIndex] = {
                        ...updatedCards[cardIndex],
                        isStarred: !updatedCards[cardIndex].isStarred
                    };
                    return { ...set, cards: updatedCards };
                })
            );
        } catch {
            toast.error('Failed to update star');
        }
    };

    const reviewCard = async (cardId, setId, cardIndex) => {
        try {
            await flashcardService.reviewFlashcard(cardId);
            setFlashcardSets(prev =>
                prev.map(set => {
                    if (set._id !== setId) return set;
                    const updatedCards = [...set.cards];
                    updatedCards[cardIndex] = {
                        ...updatedCards[cardIndex],
                        reviewCount: (updatedCards[cardIndex].reviewCount || 0) + 1,
                        lastReviewed: new Date().toISOString()
                    };
                    return { ...set, cards: updatedCards };
                })
            );
        } catch {
            // Silently fail review tracking
            console.error('Failed to track review');
        }
    };

    // Computed stats across all sets
    const stats = {
        totalSets: flashcardSets.length,
        totalCards: flashcardSets.reduce((sum, s) => sum + (s.cards?.length || 0), 0),
        starredCards: flashcardSets.reduce((sum, s) => sum + (s.cards?.filter(c => c.isStarred).length || 0), 0),
        reviewedCards: flashcardSets.reduce((sum, s) => sum + (s.cards?.filter(c => c.reviewCount > 0).length || 0), 0),
    };

    return {
        flashcardSets,
        loading,
        error,
        generating,
        stats,
        fetchFlashcards,
        generateFlashcards,
        deleteFlashcardSet,
        toggleStar,
        reviewCard,
    };
};

export default useFlashcards;