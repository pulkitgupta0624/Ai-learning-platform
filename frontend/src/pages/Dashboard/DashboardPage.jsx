import React, { useEffect, useState } from 'react'
import { FileText, BookOpen, Brain, Star, Trophy, Flame, CheckCircle, BarChart2 } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import RecentDocuments from '../../components/dashboard/RecentDocuments'
import RecentQuizzes from '../../components/dashboard/RecentQuizzes'
import Spinner from '../../components/ui/Spinner'
import progressService from '../../services/progressService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await progressService.getDashboardData();
                setData(res.data);
            } catch (err) {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    const overview = data?.overview || {};
    const recentActivity = data?.recentActivity || {};

    return (
        <div className="flex flex-col gap-6 max-w-6xl">
            {/* Welcome */}
            <div className="bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-100">
                <h2 className="text-2xl font-bold mb-1">
                    Good day, {user?.username}! 👋
                </h2>
                <p className="text-orange-100">Ready to continue your learning journey?</p>
                <div className="flex items-center gap-2 mt-3">
                    <Flame size={16} className="text-yellow-300" />
                    <span className="text-sm font-semibold">{overview.studyStreak || 0}-day study streak!</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Documents" value={overview.totalDocuments} icon={FileText} color="orange" />
                <StatsCard title="Flashcard Sets" value={overview.totalFlashcardsSets} icon={BookOpen} color="blue" />
                <StatsCard title="Quizzes Taken" value={overview.completedQuizzes} icon={Brain} color="purple" subtitle={`of ${overview.totalQuizzes} total`} />
                <StatsCard title="Avg Score" value={`${overview.averageScore || 0}%`} icon={Trophy} color="green" />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Flashcards" value={overview.totalFlashcards} icon={BookOpen} color="blue" />
                <StatsCard title="Reviewed" value={overview.reviewedFlashcards} icon={CheckCircle} color="green" subtitle="flashcards" />
                <StatsCard title="Starred Cards" value={overview.starredFlashcards} icon={Star} color="yellow" />
                <StatsCard title="Study Streak" value={`${overview.studyStreak}d`} icon={Flame} color="red" />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RecentDocuments documents={recentActivity.documents || []} />
                <RecentQuizzes quizzes={recentActivity.quizzes || []} />
            </div>
        </div>
    );
};

export default DashboardPage;