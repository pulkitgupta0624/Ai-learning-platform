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
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen size={18} className="text-blue-500" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{flashcardSet.documentId?.title || 'Untitled'}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{totalCards} cards total</p>
                        </div>
                    </div>
                    <button onClick={() => setShowConfirm(true)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                        { icon: BookOpen, label: 'Total', value: totalCards, color: 'text-blue-500' },
                        { icon: Star, label: 'Starred', value: starredCards, color: 'text-yellow-500' },
                        { icon: RotateCcw, label: 'Reviewed', value: reviewedCards, color: 'text-green-500' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-2">
                            <Icon size={14} className={`${color} mx-auto mb-1`} />
                            <p className="text-xs font-bold text-gray-700">{value}</p>
                            <p className="text-xs text-gray-400">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} /> {formatDate(flashcardSet.createdAt)}
                    </div>
                    <button
                        onClick={() => navigate(`/documents/${flashcardSet.documentId?._id}/flashcards`)}
                        className="flex items-center gap-1 text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                    >
                        Study <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Flashcard Set?"
                message="All cards in this set will be permanently deleted."
                loading={deleting}
            />
        </>
    );
};

export default FlashcardSetCard;