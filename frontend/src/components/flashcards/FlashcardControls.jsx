import React from 'react'
import { ChevronLeft, ChevronRight, Star, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'

const FlashcardControls = ({ onPrev, onNext, onStar, onMarkReviewed, isStarred, hasPrev, hasNext }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <Button variant="secondary" icon={ChevronLeft} onClick={onPrev} disabled={!hasPrev} size="md">
                Prev
            </Button>
            <div className="flex gap-2">
                <button
                    onClick={onStar}
                    className={`p-2.5 rounded-xl border transition-all duration-200 ${isStarred ? 'bg-yellow-50 border-yellow-200 text-yellow-500' : 'bg-white border-gray-200 text-gray-400 hover:border-yellow-200 hover:text-yellow-500'}`}
                >
                    <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
                </button>
                <button
                    onClick={onMarkReviewed}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-green-500 hover:border-green-200 transition-all"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
            <Button variant="secondary" onClick={onNext} disabled={!hasNext} size="md">
                Next <ChevronRight size={14} />
            </Button>
        </div>
    );
};

export default FlashcardControls;