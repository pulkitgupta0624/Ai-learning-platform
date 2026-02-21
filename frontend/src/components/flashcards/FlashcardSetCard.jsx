import React, { useState } from 'react'
import { BookOpen, Trash2, ChevronRight, Star, RotateCcw, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import Badge from '../ui/Badge'
import { formatDate } from '../../utils/helpers'
import flashcardService from '../../services/flashcardService'
import toast from 'react-hot-toast'

const FlashcardSetCard = ({ flashcardSet, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const totalCards = flashcardSet.cards?.length || 0;
    const starredCards = flashcardSet.cards?.filter(c => c.isStarred).length || 0;
    const reviewedCards = flashcardSet.cards?.filter(c => c.reviewCount > 0).length || 0;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await flashcardService.deleteFlashcardSet(flashcardSet._id);
            toast.success('Flashcard set deleted');
            onDelete(flashcardSet._id);
        } catch { toast.error('Failed to delete'); }
        finally { setDeleting(false); setShowConfirm(false); }
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 flex flex-col gap-4 card-hover group">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/documents/${flashcardSet.documentId}/flashcards`)}>
                        <div className="w-11 h-11 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen size={20} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{flashcardSet.title || 'Flashcard Set'}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{totalCards} cards</p>
                        </div>
                    </div>
                    <button onClick={() => setShowConfirm(true)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0">
                        <Trash2 size={15} />
                    </button>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /> {starredCards}</div>
                    <div className="flex items-center gap-1 text-emerald-500"><RotateCcw size={12} /> {reviewedCards}</div>
                    <div className="flex items-center gap-1 text-gray-400 ml-auto"><Calendar size={11} /> {formatDate(flashcardSet.createdAt)}</div>
                </div>

                <button onClick={() => navigate(`/documents/${flashcardSet.documentId}/flashcards`)} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-xl transition-all">
                    Study Now <ChevronRight size={14} />
                </button>
            </div>

            <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Flashcard Set?" message="This will permanently delete all flashcards in this set." loading={deleting} />
        </>
    );
};

export default FlashcardSetCard;