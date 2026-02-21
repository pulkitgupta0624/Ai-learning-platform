import React from 'react'
import { Brain, Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { timeAgo } from '../../utils/helpers'

const RecentQuizzes = ({ quizzes = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800">Recent Quizzes</h3>
                <button className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
                    View all <ArrowRight size={12} />
                </button>
            </div>
            <div className="divide-y divide-gray-50">
                {quizzes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No quizzes yet</p>
                ) : quizzes.map((quiz) => (
                    <div
                        key={quiz._id}
                        onClick={() => navigate(`/quizzes/${quiz._id}`)}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-purple-50/30 cursor-pointer transition-colors"
                    >
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                            <Brain size={16} className="text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{quiz.title}</p>
                            <p className="text-xs text-gray-400">{quiz.documentId?.title || 'Unknown Document'}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <Calendar size={11} className="text-gray-300" />
                            <span className="text-xs text-gray-400">{timeAgo(quiz.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentQuizzes;