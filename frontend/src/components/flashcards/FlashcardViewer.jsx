import React, { useState } from 'react'
import { getDifficultyColor } from '../../utils/helpers'

const FlashcardViewer = ({ card }) => {
    const [flipped, setFlipped] = useState(false);

    if (!card) return null;

    return (
        <div className="w-full max-w-lg mx-auto" style={{ perspective: '1200px' }}>
            <div
                onClick={() => setFlipped(!flipped)}
                className="relative w-full cursor-pointer"
                style={{ minHeight: '280px', transformStyle: 'preserve-3d' }}
            >
                <div
                    className="w-full transition-transform duration-500 ease-in-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 md:p-8 text-center" style={{ backfaceVisibility: 'hidden' }}>
                        <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-4">Question</p>
                        <p className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">{card.question}</p>
                        <p className="text-xs text-gray-400 mt-6">Tap to reveal answer</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 md:p-8 text-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-4">Answer</p>
                        <p className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">{card.answer}</p>
                        <div className="mt-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getDifficultyColor(card.difficulty)}`}>{card.difficulty}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardViewer;