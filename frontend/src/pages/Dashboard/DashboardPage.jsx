import React, { useEffect, useState } from 'react'
import { FileText, BookOpen, Brain, Star, Trophy, Flame, CheckCircle } from 'lucide-react'
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
            } catch {
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
        <div className="flex flex-col gap-5 md:gap-6 max-w-6xl mx-auto">
            {/* Welcome */}
            <div className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-400 rounded-2xl p-5 md:p-7 text-white shadow-xl shadow-orange-200/30 relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <h2 className="text-xl md:text-2xl font-extrabold mb-1">
                        Good day, {user?.username}! 👋
                    </h2>
                    <p className="text-orange-100 text-sm md:text-base">Ready to continue your learning journey?</p>
                    <div className="flex items-center gap-2 mt-3 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
                        <Flame size={15} className="text-yellow-300" />
                        <span className="text-sm font-semibold">{overview.studyStreak || 0}-day study streak!</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[
                    { title: 'Documents', value: overview.totalDocuments, icon: FileText, color: 'orange', delay: 'stagger-1' },
                    { title: 'Flashcard Sets', value: overview.totalFlashcardsSets, icon: BookOpen, color: 'blue', delay: 'stagger-2' },
                    { title: 'Quizzes Taken', value: overview.completedQuizzes, icon: Brain, color: 'purple', subtitle: `of ${overview.totalQuizzes} total`, delay: 'stagger-3' },
                    { title: 'Avg Score', value: `${overview.averageScore || 0}%`, icon: Trophy, color: 'green', delay: 'stagger-4' },
                ].map(({ delay, ...props }) => (
                    <div key={props.title} className={`animate-fade-in-up ${delay}`}>
                        <StatsCard {...props} />
                    </div>
                ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[
                    { title: 'Total Flashcards', value: overview.totalFlashcards, icon: BookOpen, color: 'blue', delay: 'stagger-5' },
                    { title: 'Reviewed', value: overview.reviewedFlashcards, icon: CheckCircle, color: 'green', subtitle: 'flashcards', delay: 'stagger-6' },
                    { title: 'Starred Cards', value: overview.starredFlashcards, icon: Star, color: 'yellow', delay: 'stagger-7' },
                    { title: 'Study Streak', value: `${overview.studyStreak}d`, icon: Flame, color: 'red', delay: 'stagger-8' },
                ].map(({ delay, ...props }) => (
                    <div key={props.title} className={`animate-fade-in-up ${delay}`}>
                        <StatsCard {...props} />
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="animate-fade-in-up stagger-5">
                    <RecentDocuments documents={recentActivity.documents || []} />
                </div>
                <div className="animate-fade-in-up stagger-6">
                    <RecentQuizzes quizzes={recentActivity.quizzes || []} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;