import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, BookOpen } from 'lucide-react'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'
import { getScoreColor, getScoreBg } from '../../utils/helpers'

const QuizResultPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await quizService.getQuizResults(quizId);
                setResult(res.data);
            } catch {
                toast.error('Failed to load results');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [quizId]);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
    if (!result) return null;

    const { quiz, results } = result;
    const correctCount = results.filter(r => r.isCorrect).length;

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                    <ArrowLeft size={18} />
                </button>
                <h2 className="font-bold text-gray-800">Quiz Results</h2>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f3f4f6" strokeWidth="2" />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={quiz.score >= 80 ? '#22c55e' : quiz.score >= 60 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="2"
                            strokeDasharray={`${quiz.score}, 100`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Trophy size={20} className={getScoreColor(quiz.score)} />
                        <p className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>{quiz.score}%</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{quiz.title}</h3>
                <p className="text-gray-500 mb-4">{correctCount} out of {quiz.totalQuestions} correct</p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <Button variant="secondary" icon={BookOpen} onClick={() => navigate(`/documents/${quiz.document?._id}`)}>
                        Back to Document
                    </Button>
                </div>
            </div>

            {/* Detailed Results */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800">Question Review</h3>
                {results.map((result, i) => (
                    <div
                        key={i}
                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${result.isCorrect ? 'border-green-100' : 'border-red-100'}`}
                    >
                        <button
                            className="w-full flex items-center gap-4 p-4 text-left"
                            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${result.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                                {result.isCorrect
                                    ? <CheckCircle size={16} className="text-green-600" />
                                    : <XCircle size={16} className="text-red-500" />
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 line-clamp-2">{result.question}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">Q{i + 1}</span>
                        </button>

                        {expandedIndex === i && (
                            <div className={`border-t px-4 pb-4 pt-3 ${result.isCorrect ? 'border-green-50 bg-green-50/30' : 'border-red-50 bg-red-50/30'}`}>
                                <div className="flex flex-col gap-2 text-sm">
                                    {!result.isCorrect && (
                                        <div className="flex gap-2">
                                            <span className="text-red-400 font-medium shrink-0">Your answer:</span>
                                            <span className="text-red-600">{result.selectedAnswer || 'Not answered'}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <span className="text-green-600 font-medium shrink-0">Correct:</span>
                                        <span className="text-green-700">{result.correctAnswer}</span>
                                    </div>
                                    {result.explaination && (
                                        <div className="bg-white rounded-xl p-3 mt-1 border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">Explanation</p>
                                            <p className="text-gray-600">{result.explaination}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizResultPage;