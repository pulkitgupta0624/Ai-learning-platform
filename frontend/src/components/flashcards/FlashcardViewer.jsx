import React, { useState } from 'react'
import { getDifficultyColor } from '../../utils/helpers'
import Badge from '../ui/Badge'

const FlashcardViewer = ({ card, cardNumber, total }) => {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => setFlipped(f => !f);

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-gray-400 font-medium">
                Card {cardNumber} of {total}
            </p>

            {/* 3D Flip Card */}
            <div
                onClick={handleFlip}
                className="w-full max-w-2xl h-64 cursor-pointer"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="relative w-full h-full transition-transform duration-500"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {/* Front */}
                    <div
                        className="absolute inset-0 bg-white border border-gray-100 rounded-2xl shadow-md flex flex-col items-center justify-center p-8 text-center"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-4">Question</p>
                        <p className="text-xl font-semibold text-gray-800 leading-relaxed">{card.question}</p>
                        <p className="text-xs text-gray-400 mt-6">Click to reveal answer</p>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl shadow-md flex flex-col items-center justify-center p-8 text-center"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-4">Answer</p>
                        <p className="text-xl font-semibold text-gray-800 leading-relaxed">{card.answer}</p>
                        <div className="mt-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(card.difficulty)}`}>
                                {card.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardViewer;