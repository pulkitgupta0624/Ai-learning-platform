import { useState, useEffect, useCallback } from 'react'
import quizService from '../services/quizService'
import aiService from '../services/aiService'
import toast from 'react-hot-toast'

const useQuiz = (documentId = null) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchQuizzes = useCallback(async () => {
        if (!documentId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await quizService.getQuizzesForDocument(documentId);
            setQuizzes(res.data || []);
        } catch (err) {
            setError(err.error || 'Failed to load quizzes');
            toast.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const generateQuiz = async (docId, numQuestions = 5, title = '') => {
        setGenerating(true);
        try {
            const res = await aiService.generateQuiz(docId, { numQuestions, title });
            setQuizzes(prev => [res.data, ...prev]);
            toast.success('Quiz generated!');
            return res.data;
        } catch (err) {
            toast.error(err.error || 'Failed to generate quiz');
            throw err;
        } finally {
            setGenerating(false);
        }
    };

    const getQuizById = async (quizId) => {
        try {
            const res = await quizService.getQuizById(quizId);
            return res.data;
        } catch (err) {
            toast.error('Quiz not found');
            throw err;
        }
    };

    const submitQuiz = async (quizId, answers) => {
        setSubmitting(true);
        try {
            const res = await quizService.submitQuiz(quizId, answers);
            // Update local quiz status if it's in our list
            setQuizzes(prev =>
                prev.map(q =>
                    q._id === quizId
                        ? { ...q, score: res.data.score, completedAt: new Date().toISOString() }
                        : q
                )
            );
            toast.success('Quiz submitted!');
            return res.data;
        } catch (err) {
            toast.error(err.error || 'Failed to submit quiz');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const retakeQuiz = async (quizId) => {
        try {
            const res = await quizService.retakeQuiz(quizId);
            // Update local quiz status — mark as not completed
            setQuizzes(prev =>
                prev.map(q =>
                    q._id === quizId
                        ? { ...q, score: 0, completedAt: null, userAnswers: [] }
                        : q
                )
            );
            toast.success('Quiz reset! Good luck!');
            return res.data;
        } catch (err) {
            toast.error(err.error || 'Failed to reset quiz');
            throw err;
        }
    };

    const getQuizResults = async (quizId) => {
        try {
            const res = await quizService.getQuizResults(quizId);
            return res.data;
        } catch (err) {
            toast.error('Failed to load results');
            throw err;
        }
    };

    const deleteQuiz = async (quizId) => {
        try {
            await quizService.deleteQuiz(quizId);
            setQuizzes(prev => prev.filter(q => q._id !== quizId));
            toast.success('Quiz deleted');
        } catch {
            toast.error('Failed to delete quiz');
        }
    };

    // Computed stats
    const stats = {
        total: quizzes.length,
        completed: quizzes.filter(q => q.completedAt).length,
        averageScore: (() => {
            const completed = quizzes.filter(q => q.completedAt && q.score != null);
            if (!completed.length) return 0;
            return Math.round(completed.reduce((sum, q) => sum + q.score, 0) / completed.length);
        })(),
        bestScore: quizzes.length
            ? Math.max(...quizzes.filter(q => q.completedAt).map(q => q.score || 0))
            : 0,
    };

    return {
        quizzes,
        loading,
        error,
        generating,
        submitting,
        stats,
        fetchQuizzes,
        generateQuiz,
        getQuizById,
        submitQuiz,
        retakeQuiz,
        getQuizResults,
        deleteQuiz,
    };
};

export default useQuiz;