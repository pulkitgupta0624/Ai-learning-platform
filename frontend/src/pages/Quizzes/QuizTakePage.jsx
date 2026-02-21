import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckSquare } from 'lucide-react'
import QuizQuestion from '../../components/quizzes/QuizQuestion'
import QuizProgressBar from '../../components/quizzes/QuizProgressBar'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'

const QuizTakePage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await quizService.getQuizById(quizId);
                if (res.data.completedAt) { navigate(`/quizzes/${quizId}/results`, { replace: true }); return; }
                setQuiz(res.data);
            } catch { toast.error('Quiz not found'); navigate(-1); }
            finally { setLoading(false); }
        };
        fetchQuiz();
    }, [quizId]);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
    if (!quiz) return null;

    const currentQ = quiz.questions[currentIndex];
    const isLast = currentIndex === quiz.questions.length - 1;
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === quiz.questions.length;

    const handleSelect = (answer) => setAnswers(prev => ({ ...prev, [currentIndex]: answer }));

    const handleSubmit = async () => {
        if (!allAnswered) { toast.error(`Please answer all questions (${answeredCount}/${quiz.questions.length})`); return; }
        const formatted = Object.entries(answers).map(([idx, ans]) => ({ questionIndex: parseInt(idx), selectedAnswer: ans }));
        setSubmitting(true);
        try { await quizService.submitQuiz(quizId, formatted); toast.success('Quiz submitted!'); navigate(`/quizzes/${quizId}/results`); }
        catch { toast.error('Failed to submit quiz'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="flex flex-col gap-5 md:gap-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 md:gap-4 animate-fade-in-up">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors shrink-0"><ArrowLeft size={18} /></button>
                <div className="flex-1 min-w-0">
                    <h2 className="font-extrabold text-gray-800 truncate">{quiz.title}</h2>
                    <p className="text-sm text-gray-400">{answeredCount} of {quiz.questions.length} answered</p>
                </div>
            </div>

            <QuizProgressBar current={currentIndex + 1} total={quiz.questions.length} />

            {/* Question Nav Dots */}
            <div className="flex flex-wrap gap-2">
                {quiz.questions.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${i === currentIndex ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-200/40' : answers[i] ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >{i + 1}</button>
                ))}
            </div>

            <QuizQuestion question={currentQ.question} options={currentQ.options} selectedAnswer={answers[currentIndex]} onSelect={handleSelect} questionIndex={currentIndex} />

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}>Previous</Button>
                {isLast ? (
                    <Button icon={CheckSquare} onClick={handleSubmit} loading={submitting} disabled={!allAnswered}>Submit Quiz</Button>
                ) : (
                    <Button onClick={() => setCurrentIndex(i => i + 1)}>Next <ArrowRight size={14} /></Button>
                )}
            </div>

            {!allAnswered && isLast && (
                <p className="text-center text-sm text-gray-400">Answer all questions before submitting ({quiz.questions.length - answeredCount} remaining)</p>
            )}
        </div>
    );
};

export default QuizTakePage;