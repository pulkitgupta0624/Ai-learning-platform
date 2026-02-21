import React, { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import flashcardService from '../../services/flashcardService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const FlashcardListPage = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try { const res = await flashcardService.getAllFlashcardsSets(); setSets(res.data || []); }
            catch { toast.error('Failed to load flashcard sets'); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleDelete = (id) => setSets(prev => prev.filter(s => s._id !== id));

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

    return (
        <div className="flex flex-col gap-5 md:gap-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">All Flashcard Sets</h2>
                    <p className="text-sm text-gray-400">{sets.length} set{sets.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {sets.length === 0 ? (
                <EmptyState icon={BookOpen} title="No flashcard sets yet" description="Upload a document and generate flashcards to start studying" action={<Button onClick={() => navigate('/documents')}>Go to Documents</Button>} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {sets.map((set, i) => (
                        <div key={set._id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
                            <FlashcardSetCard flashcardSet={set} onDelete={handleDelete} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FlashcardListPage;