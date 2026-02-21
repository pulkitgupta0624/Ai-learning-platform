import React from 'react'
import { ChevronLeft, ChevronRight, Star, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'

const FlashcardControls = ({ onPrev, onNext, onStar, onMarkReviewed, isStarred, hasPrev, hasNext }) => {
    return (
        <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" icon={ChevronLeft} onClick={onPrev} disabled={!hasPrev} size="md">
                <span className="hidden sm:inline">Prev</span>
            </Button>
            <div className="flex gap-2">
                <button
                    onClick={onStar}
                    className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 ${isStarred ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-sm' : 'bg-white border-gray-200 text-gray-400 hover:border-amber-200 hover:text-amber-500'}`}
                >
                    <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
                </button>
                <button onClick={onMarkReviewed} className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-all active:scale-95">
                    <RotateCcw size={16} />
                </button>
            </div>
            <Button variant="secondary" onClick={onNext} disabled={!hasNext} size="md">
                <span className="hidden sm:inline">Next</span> <ChevronRight size={14} />
            </Button>
        </div>
    );
};

export default FlashcardControls;