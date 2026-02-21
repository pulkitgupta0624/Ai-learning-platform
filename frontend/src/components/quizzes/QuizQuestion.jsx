import React from 'react'

const QuizQuestion = ({ question, options, selectedAnswer, onSelect, questionIndex }) => {
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-3">
                    Question {questionIndex + 1}
                </p>
                <p className="text-lg font-semibold text-gray-800 leading-relaxed">{question}</p>
            </div>

            <div className="flex flex-col gap-3">
                {options.map((option, i) => {
                    const isSelected = selectedAnswer === option;
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(option)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                isSelected
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/40'
                            }`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                                isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {letters[i]}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
                                {option}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizQuestion;