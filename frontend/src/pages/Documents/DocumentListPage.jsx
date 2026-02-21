import React, { useEffect, useState } from 'react'
import { Plus, FileText, Search } from 'lucide-react'
import DocumentCard from '../../components/documents/DocumentCard'
import DocumentUploadModal from '../../components/documents/DocumentUploadModal'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import documentService from '../../services/documentService'
import toast from 'react-hot-toast'

const DocumentListPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const docs = await documentService.getDocuments();
            setDocuments(docs || []);
        } catch (err) {
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = (newDoc) => {
        setDocuments(prev => [newDoc, ...prev]);
    };

    const handleDelete = (id) => {
        setDocuments(prev => prev.filter(d => d._id !== id));
    };

    const filtered = documents.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.fileName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    />
                </div>
                <Button icon={Plus} onClick={() => setShowUpload(true)}>
                    Upload Document
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title={search ? 'No documents found' : 'No documents yet'}
                    description={search ? 'Try a different search term' : 'Upload your first PDF to get started with AI-powered studying'}
                    action={!search && (
                        <Button icon={Plus} onClick={() => setShowUpload(true)}>
                            Upload Your First Document
                        </Button>
                    )}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map(doc => (
                        <DocumentCard key={doc._id} document={doc} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            <DocumentUploadModal
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
};

export default DocumentListPage;