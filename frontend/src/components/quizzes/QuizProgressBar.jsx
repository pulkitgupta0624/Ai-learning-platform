import React from 'react'

const QuizProgressBar = ({ current, total }) => {
    const progress = (current / total) * 100;
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-400">
                <span>Question {current} of {total}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default QuizProgressBar;