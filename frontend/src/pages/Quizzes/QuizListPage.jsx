import React, { useEffect, useState } from 'react'
import { Brain } from 'lucide-react'
import QuizCard from '../../components/quizzes/QuizCard'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try { const res = await quizService.getAllQuizzes(); setQuizzes(res.data || []); }
            catch { toast.error('Failed to load quizzes'); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleDelete = (id) => setQuizzes(prev => prev.filter(q => q._id !== id));

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-5 md:gap-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">All Quizzes</h2>
                    <p className="text-sm text-gray-400">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}</p>
                </div>
            </div>

            {quizzes.length === 0 ? (
                <EmptyState icon={Brain} title="No quizzes yet" description="Upload a document and generate quizzes to start testing your knowledge" action={<Button onClick={() => navigate('/documents')}>Go to Documents</Button>} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {quizzes.map((quiz, i) => (
                        <div key={quiz._id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
                            <QuizCard quiz={quiz} onDelete={handleDelete} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizListPage;