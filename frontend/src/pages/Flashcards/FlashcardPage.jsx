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
            try { const res = await flashcardService.getFlashcardsForDocument(documentId); setSets(res.data || []); }
            catch { toast.error('Failed to load flashcards'); }
            finally { setLoading(false); }
        };
        fetchSets();
    }, [documentId]);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    const currentSet = sets[currentSetIndex];
    const cards = currentSet?.cards || [];
    const currentCard = cards[currentCardIndex];

    const handleStar = async () => {
        if (!currentCard) return;
        try {
            await flashcardService.toggleStar(currentSet._id);
            const updatedSets = [...sets];
            updatedSets[currentSetIndex].cards[currentCardIndex].isStarred = !currentCard.isStarred;
            setSets(updatedSets);
        } catch { toast.error('Failed to toggle star'); }
    };

    const handleReview = async () => {
        if (!currentCard) return;
        try {
            await flashcardService.reviewFlashcard(currentSet._id, currentCardIndex);
            toast.success('Marked as reviewed');
        } catch { toast.error('Failed to mark reviewed'); }
    };

    if (!currentSet || cards.length === 0) {
        return (
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors">
                    <ArrowLeft size={18} /> Back
                </button>
                <EmptyState icon={CheckCircle} title="No flashcards available" description="Generate flashcards from the document detail page" action={<Button onClick={() => navigate(`/documents/${documentId}`)}>Go to Document</Button>} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 animate-fade-in-up">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors shrink-0"><ArrowLeft size={18} /></button>
                <div className="flex-1 min-w-0">
                    <h2 className="font-extrabold text-gray-800 truncate">{currentSet.title || 'Flashcards'}</h2>
                    <p className="text-sm text-gray-400">{currentCardIndex + 1} of {cards.length} cards</p>
                </div>
            </div>

            {/* Progress */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }} />
            </div>

            <FlashcardViewer card={currentCard} />
            <FlashcardControls
                onPrev={() => setCurrentCardIndex(i => Math.max(0, i - 1))}
                onNext={() => setCurrentCardIndex(i => Math.min(cards.length - 1, i + 1))}
                onStar={handleStar}
                onMarkReviewed={handleReview}
                isStarred={currentCard?.isStarred}
                hasPrev={currentCardIndex > 0}
                hasNext={currentCardIndex < cards.length - 1}
            />
        </div>
    );
};

export default FlashcardPage;