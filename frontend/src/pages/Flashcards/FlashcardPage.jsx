import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import FlashcardViewer from '../../components/flashcards/FlashcardViewer'
import FlashcardControls from '../../components/flashcards/FlashcardControls'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import flashcardService from '../../services/flashcardService'
import toast from 'react-hot-toast'

const FlashcardPage = () => {
    const { id: documentId } = useParams();
    const navigate = useNavigate();
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const res = await flashcardService.getFlashcardsForDocument(documentId);
                setSets(res.data || []);
            } catch {
                toast.error('Failed to load flashcards');
            } finally {
                setLoading(false);
            }
        };
        fetchSets();
    }, [documentId]);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    if (!sets.length) {
        return (
            <EmptyState
                icon={CheckCircle}
                title="No flashcard sets"
                description="Generate flashcards from this document first"
                action={<Button onClick={() => navigate(`/documents/${documentId}`)}>Back to Document</Button>}
            />
        );
    }

    const currentSet = sets[currentSetIndex];
    const currentCard = currentSet?.cards[currentCardIndex];

    const handleNext = async () => {
        await flashcardService.reviewFlashcard(currentCard._id).catch(() => {});
        if (currentCardIndex < currentSet.cards.length - 1) {
            setCurrentCardIndex(i => i + 1);
        } else if (currentSetIndex < sets.length - 1) {
            setCurrentSetIndex(i => i + 1);
            setCurrentCardIndex(0);
        }
    };

    const handlePrev = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(i => i - 1);
        } else if (currentSetIndex > 0) {
            setCurrentSetIndex(i => i - 1);
            setCurrentCardIndex(sets[currentSetIndex - 1].cards.length - 1);
        }
    };

    const handleStar = async () => {
        try {
            await flashcardService.toggleStar(currentCard._id);
            setSets(prev => {
                const updated = [...prev];
                updated[currentSetIndex].cards[currentCardIndex].isStarred = !currentCard.isStarred;
                return updated;
            });
        } catch {
            toast.error('Failed to update');
        }
    };

    const totalCards = sets.reduce((sum, s) => sum + s.cards.length, 0);
    const globalCardIndex = sets.slice(0, currentSetIndex).reduce((sum, s) => sum + s.cards.length, 0) + currentCardIndex;

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(`/documents/${documentId}`)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="font-bold text-gray-800">Study Mode</h2>
                    <p className="text-sm text-gray-400">{currentSet.documentId?.title || 'Flashcards'}</p>
                </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{globalCardIndex + 1} / {totalCards}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${((globalCardIndex + 1) / totalCards) * 100}%` }}
                    />
                </div>
            </div>

            {/* Card */}
            <FlashcardViewer
                card={currentCard}
                cardNumber={globalCardIndex + 1}
                total={totalCards}
            />

            {/* Controls */}
            <FlashcardControls
                onPrev={handlePrev}
                onNext={handleNext}
                onStar={handleStar}
                onMarkReviewed={handleNext}
                isStarred={currentCard.isStarred}
                hasPrev={globalCardIndex > 0}
                hasNext={globalCardIndex < totalCards - 1}
            />

            {/* Completed State */}
            {globalCardIndex === totalCards - 1 && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                    <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-green-800">You've reached the last card!</p>
                    <p className="text-sm text-green-600 mt-1">Great study session 🎉</p>
                </div>
            )}
        </div>
    );
};

export default FlashcardPage;