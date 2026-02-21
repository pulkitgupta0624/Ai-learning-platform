import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Sparkles, BookOpen, Brain, MessageCircle, Lightbulb, RefreshCw } from 'lucide-react'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import DocumentStatusBadge from '../../components/documents/DocumentStatusBadge'
import ChatWindow from '../../components/ai/ChatWindow'
import SummaryViewer from '../../components/ai/SummaryViewer'
import Modal from '../../components/ui/Modal'
import documentService from '../../services/documentService'
import aiService from '../../services/aiService'
import toast from 'react-hot-toast'
import { formatFileSize, formatDate } from '../../utils/helpers'

const TABS = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'summary', label: 'AI Summary', icon: Sparkles },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: Brain },
];

const DocumentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // AI states
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [flashcardLoading, setFlashcardLoading] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);

    // Generate options modals
    const [flashcardCount, setFlashcardCount] = useState(10);
    const [quizCount, setQuizCount] = useState(5);
    const [showFlashcardModal, setShowFlashcardModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const doc = await documentService.getDocumentById(id);
                setDocument(doc);
            } catch {
                toast.error('Document not found');
                navigate('/documents');
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleGenerateSummary = async () => {
        if (summary) return;
        setSummaryLoading(true);
        try {
            const res = await aiService.generateSummary(id);
            setSummary(res);
        } catch {
            toast.error('Failed to generate summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        setFlashcardLoading(true);
        try {
            await aiService.generateFlashcards(id, { count: flashcardCount });
            toast.success(`${flashcardCount} flashcards generated!`);
            setShowFlashcardModal(false);
            navigate(`/documents/${id}/flashcards`);
        } catch {
            toast.error('Failed to generate flashcards');
        } finally {
            setFlashcardLoading(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setQuizLoading(true);
        try {
            const res = await aiService.generateQuiz(id, { numQuestions: quizCount });
            toast.success('Quiz created!');
            setShowQuizModal(false);
            navigate(`/quizzes/${res.data._id}`);
        } catch {
            toast.error('Failed to generate quiz');
        } finally {
            setQuizLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'summary' && !summary && !summaryLoading) {
            handleGenerateSummary();
        }
    }, [activeTab]);

    if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
    if (!document) return null;

    const isReady = document.status === 'ready';

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/documents')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-800 truncate">{document.title}</h1>
                        <DocumentStatusBadge status={document.status} />
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{document.fileName} • {formatFileSize(document.fileSize)} • {formatDate(document.uploadDate)}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 w-fit">
                {TABS.map(({ id: tabId, label, icon: Icon }) => (
                    <button
                        key={tabId}
                        onClick={() => setActiveTab(tabId)}
                        disabled={!isReady && tabId !== 'overview'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed
                            ${activeTab === tabId ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Icon size={15} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4">Document Info</h3>
                            <div className="flex flex-col gap-3 text-sm">
                                {[
                                    { label: 'Status', value: <DocumentStatusBadge status={document.status} /> },
                                    { label: 'File Size', value: formatFileSize(document.fileSize) },
                                    { label: 'Uploaded', value: formatDate(document.uploadDate) },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <span className="text-gray-500">{label}</span>
                                        <span className="font-medium text-gray-800">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isReady && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <h3 className="font-semibold text-gray-800 mb-4">AI Tools</h3>
                                <div className="flex flex-col gap-3">
                                    <Button icon={Sparkles} onClick={() => setActiveTab('summary')} variant="secondary" fullWidth>
                                        Generate Summary
                                    </Button>
                                    <Button icon={BookOpen} onClick={() => setShowFlashcardModal(true)} variant="secondary" fullWidth>
                                        Generate Flashcards
                                    </Button>
                                    <Button icon={Brain} onClick={() => setShowQuizModal(true)} variant="secondary" fullWidth>
                                        Generate Quiz
                                    </Button>
                                    <Button icon={MessageCircle} onClick={() => setActiveTab('chat')} variant="secondary" fullWidth>
                                        Chat with Document
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'chat' && (
                    <ChatWindow documentId={id} />
                )}

                {activeTab === 'summary' && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Sparkles size={18} className="text-orange-500" /> AI Summary
                            </h3>
                            {summary && (
                                <Button icon={RefreshCw} variant="ghost" size="sm" onClick={() => { setSummary(null); handleGenerateSummary(); }}>
                                    Regenerate
                                </Button>
                            )}
                        </div>
                        {summaryLoading ? (
                            <div className="flex items-center justify-center h-40 gap-3 flex-col">
                                <Spinner />
                                <p className="text-sm text-gray-400">Generating summary with AI...</p>
                            </div>
                        ) : summary ? (
                            <SummaryViewer summary={summary} />
                        ) : null}
                    </div>
                )}

                {activeTab === 'flashcards' && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center gap-4 py-12">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <BookOpen size={28} className="text-blue-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-800">Generate Flashcards</h3>
                            <p className="text-sm text-gray-400 mt-1">Create AI-powered flashcards from this document</p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => navigate(`/documents/${id}/flashcards`)} variant="secondary">
                                View Existing Sets
                            </Button>
                            <Button icon={Sparkles} onClick={() => setShowFlashcardModal(true)}>
                                Generate New Set
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center gap-4 py-12">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                            <Brain size={28} className="text-purple-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-gray-800">Generate Quiz</h3>
                            <p className="text-sm text-gray-400 mt-1">Test your knowledge with AI-generated MCQs</p>
                        </div>
                        <Button icon={Sparkles} onClick={() => setShowQuizModal(true)}>
                            Generate Quiz
                        </Button>
                    </div>
                )}
            </div>

            {/* Flashcard Modal */}
            <Modal isOpen={showFlashcardModal} onClose={() => setShowFlashcardModal(false)} title="Generate Flashcards" size="sm">
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Number of Flashcards: <span className="text-orange-500 font-bold">{flashcardCount}</span>
                        </label>
                        <input
                            type="range" min={5} max={30} step={5}
                            value={flashcardCount}
                            onChange={(e) => setFlashcardCount(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5</span><span>30</span></div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setShowFlashcardModal(false)} fullWidth>Cancel</Button>
                        <Button onClick={handleGenerateFlashcards} loading={flashcardLoading} fullWidth>
                            Generate
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Quiz Modal */}
            <Modal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} title="Generate Quiz" size="sm">
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Number of Questions: <span className="text-orange-500 font-bold">{quizCount}</span>
                        </label>
                        <input
                            type="range" min={3} max={15} step={1}
                            value={quizCount}
                            onChange={(e) => setQuizCount(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>3</span><span>15</span></div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setShowQuizModal(false)} fullWidth>Cancel</Button>
                        <Button onClick={handleGenerateQuiz} loading={quizLoading} fullWidth>
                            Generate
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DocumentDetailPage;