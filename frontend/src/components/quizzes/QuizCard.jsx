import React, { useState } from 'react'
import { Brain, Trash2, ChevronRight, CheckCircle, Clock, Calendar, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import Badge from '../ui/Badge'
import { formatDate, getScoreColor, getScoreBg } from '../../utils/helpers'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'

const QuizCard = ({ quiz, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const isCompleted = !!quiz.completedAt;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await quizService.deleteQuiz(quiz._id);
            toast.success('Quiz deleted');
            onDelete(quiz._id);
        } catch {
            toast.error('Failed to delete quiz');
        } finally {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    const handleNavigate = () => {
        if (isCompleted) {
            navigate(`/quizzes/${quiz._id}/results`);
        } else {
            navigate(`/quizzes/${quiz._id}`);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                            <Brain size={18} className="text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{quiz.title}</h3>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                {quiz.documentId?.title || 'Unknown Document'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                        className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-xl p-2">
                        <Brain size={14} className="text-purple-400 mx-auto mb-1" />
                        <p className="text-xs font-bold text-gray-700">{quiz.totalQuestions}</p>
                        <p className="text-xs text-gray-400">Questions</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                        {isCompleted ? (
                            <>
                                <Trophy size={14} className={`${getScoreColor(quiz.score)} mx-auto mb-1`} />
                                <p className={`text-xs font-bold ${getScoreColor(quiz.score)}`}>{quiz.score}%</p>
                                <p className="text-xs text-gray-400">Score</p>
                            </>
                        ) : (
                            <>
                                <Clock size={14} className="text-yellow-400 mx-auto mb-1" />
                                <p className="text-xs font-bold text-gray-700">Pending</p>
                                <p className="text-xs text-gray-400">Score</p>
                            </>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                        <CheckCircle size={14} className={`mx-auto mb-1 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                        <p className="text-xs font-bold text-gray-700">{isCompleted ? 'Done' : 'Open'}</p>
                        <p className="text-xs text-gray-400">Status</p>
                    </div>
                </div>

                {/* Score Bar (only if completed) */}
                {isCompleted && (
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Score</span>
                            <span className={`font-semibold ${getScoreColor(quiz.score)}`}>{quiz.score}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getScoreBg(quiz.score)}`}
                                style={{ width: `${quiz.score}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} />
                        <span>{formatDate(quiz.createdAt)}</span>
                    </div>
                    <button
                        onClick={handleNavigate}
                        className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        {isCompleted ? 'View Results' : 'Take Quiz'}
                        <ChevronRight size={14} />
                    </button>
                </div>

                {/* Status Badge */}
                <div className="flex gap-2">
                    <Badge variant={isCompleted ? 'success' : 'warning'}>
                        {isCompleted ? 'Completed' : 'Not Started'}
                    </Badge>
                    {isCompleted && quiz.score >= 80 && <Badge variant="primary">Excellent</Badge>}
                    {isCompleted && quiz.score >= 60 && quiz.score < 80 && <Badge variant="info">Good</Badge>}
                    {isCompleted && quiz.score < 60 && <Badge variant="danger">Needs Review</Badge>}
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Quiz?"
                message="This quiz and all its results will be permanently deleted."
                loading={deleting}
            />
        </>
    );
};

export default QuizCard;