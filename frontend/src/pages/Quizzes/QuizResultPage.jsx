import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, BookOpen } from 'lucide-react'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'
import { getScoreColor } from '../../utils/helpers'

const QuizResultPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const res = await quizService.getQuizResults(quizId); setResults(res.data); }
            catch { toast.error('Failed to load results'); navigate(-1); }
            finally { setLoading(false); }
        };
        fetch();
    }, [quizId]);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
    if (!results) return null;

    const score = results.score;

    return (
        <div className="flex flex-col gap-5 md:gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 animate-fade-in-up">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><ArrowLeft size={18} /></button>
                <h2 className="font-extrabold text-gray-800">Quiz Results</h2>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-6 md:p-8 text-center animate-fade-in-up stagger-1">
                <div className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-4 ${score >= 80 ? 'bg-emerald-50' : score >= 60 ? 'bg-amber-50' : 'bg-red-50'}`}>
                    <Trophy size={36} className={getScoreColor(score)} />
                </div>
                <p className={`text-4xl md:text-5xl font-black ${getScoreColor(score)}`}>{score}%</p>
                <p className="text-gray-500 mt-2 font-medium">
                    {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good effort!' : 'Keep practicing!'}
                </p>
                <div className="flex gap-3 justify-center mt-5 flex-wrap">
                    <Button variant="secondary" icon={RotateCcw} onClick={() => navigate(`/quizzes/${quizId}`)}>Retake Quiz</Button>
                    <Button icon={BookOpen} onClick={() => navigate('/documents')}>Study More</Button>
                </div>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-4">
                {results.results?.map((result, i) => (
                    <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 md:p-5 animate-fade-in-up stagger-${Math.min(i + 2, 8)}`}>
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${result.isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                {result.isCorrect ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                            </div>
                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">{result.question}</p>
                        </div>

                        <div className={`rounded-xl p-3 border ${result.isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
                            <div className="flex flex-col gap-2 text-sm">
                                {!result.isCorrect && (
                                    <div className="flex gap-2">
                                        <span className="text-red-400 font-medium shrink-0">Your answer:</span>
                                        <span className="text-red-600">{result.selectedAnswer || 'Not answered'}</span>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <span className="text-emerald-600 font-medium shrink-0">Correct:</span>
                                    <span className="text-emerald-700">{result.correctAnswer}</span>
                                </div>
                                {result.explaination && (
                                    <div className="bg-white rounded-lg p-3 mt-1 border border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 mb-1">Explanation</p>
                                        <p className="text-gray-600 text-sm">{result.explaination}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizResultPage;