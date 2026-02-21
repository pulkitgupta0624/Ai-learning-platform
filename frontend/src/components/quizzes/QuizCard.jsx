import React, { useState } from 'react'
import { Brain, Trash2, ChevronRight, CheckCircle, Clock, Calendar, Trophy, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import Badge from '../ui/Badge'
import { formatDate, getScoreColor, getScoreBg } from '../../utils/helpers'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'

const QuizCard = ({ quiz, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [retaking, setRetaking] = useState(false);
    const navigate = useNavigate();

    const isCompleted = !!quiz.completedAt;

    const handleDelete = async () => {
        setDeleting(true);
        try { await quizService.deleteQuiz(quiz._id); toast.success('Quiz deleted'); onDelete(quiz._id); }
        catch { toast.error('Failed to delete quiz'); }
        finally { setDeleting(false); setShowConfirm(false); }
    };

    const handleRetake = async () => {
        setRetaking(true);
        try {
            await quizService.retakeQuiz(quiz._id);
            toast.success('Quiz reset! Good luck!');
            navigate(`/quizzes/${quiz._id}`);
        } catch {
            toast.error('Failed to reset quiz');
        } finally {
            setRetaking(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 flex flex-col gap-4 card-hover group">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => navigate(isCompleted ? `/quizzes/${quiz._id}/results` : `/quizzes/${quiz._id}`)}>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-50' : 'bg-purple-50'}`}>
                            {isCompleted ? <Trophy size={20} className="text-emerald-500" /> : <Brain size={20} className="text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors">{quiz.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{quiz.questions?.length || 0} questions</p>
                        </div>
                    </div>
                    <button onClick={() => setShowConfirm(true)} className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0">
                        <Trash2 size={15} />
                    </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {isCompleted ? (
                        <>
                            <Badge variant="success">Completed</Badge>
                            <span className={`text-sm font-bold ${getScoreColor(quiz.score)}`}>{quiz.score}%</span>
                        </>
                    ) : (
                        <Badge variant="warning">Pending</Badge>
                    )}
                    <div className="flex items-center gap-1 ml-auto text-gray-400">
                        <Calendar size={11} />
                        <span className="text-xs">{formatDate(quiz.createdAt)}</span>
                    </div>
                </div>

                {isCompleted ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/quizzes/${quiz._id}/results`)}
                            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                        >
                            View Results <ChevronRight size={14} />
                        </button>
                        <button
                            onClick={handleRetake}
                            disabled={retaking}
                            className="flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-xl transition-all text-orange-500 bg-orange-50 hover:bg-orange-100 disabled:opacity-50"
                        >
                            <RotateCcw size={14} className={retaking ? 'animate-spin' : ''} />
                            {retaking ? '' : 'Retake'}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate(`/quizzes/${quiz._id}`)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all text-purple-500 bg-purple-50 hover:bg-purple-100"
                    >
                        Take Quiz <ChevronRight size={14} />
                    </button>
                )}
            </div>

            <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Quiz?" message="This quiz and all its results will be permanently deleted." loading={deleting} />
        </>
    );
};

export default QuizCard;