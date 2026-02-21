import React from 'react'
import { Brain, Calendar } from 'lucide-react'
import { timeAgo, getScoreColor } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const RecentQuizzes = ({ quizzes = [] }) => {
    const navigate = useNavigate();

    if (!quizzes.length) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Quizzes</h3>
                <p className="text-sm text-gray-400 text-center py-6">No quizzes yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Quizzes</h3>
            <div className="flex flex-col gap-3">
                {quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        onClick={() => navigate(`/quizzes/${quiz._id}/results`)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                            <Brain size={16} className="text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{quiz.title}</p>
                            <p className="text-xs text-gray-400">{quiz.documentId?.title || 'Unknown Document'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{timeAgo(quiz.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentQuizzes;