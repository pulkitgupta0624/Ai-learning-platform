import React from 'react'

const QuizQuestion = ({ question, options, selectedAnswer, onSelect, questionIndex }) => {
    const letters = ['A', 'B', 'C', 'D'];

    return (
        <div className="flex flex-col gap-4 md:gap-5">
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 md:p-6">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3">Question {questionIndex + 1}</p>
                <p className="text-base md:text-lg font-semibold text-gray-800 leading-relaxed">{question}</p>
            </div>

            <div className="flex flex-col gap-2.5">
                {options.map((option, i) => {
                    const isSelected = selectedAnswer === option;
                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(option)}
                            className={`w-full flex items-center gap-3 md:gap-4 p-3.5 md:p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] ${isSelected ? 'border-orange-500 bg-orange-50 shadow-sm shadow-orange-100/50' : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30'}`}
                        >
                            <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shrink-0 transition-all ${isSelected ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/40' : 'bg-gray-100 text-gray-600'}`}>
                                {letters[i]}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizQuestion;