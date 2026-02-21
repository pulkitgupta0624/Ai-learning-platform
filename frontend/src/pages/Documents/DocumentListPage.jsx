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
        const fetch = async () => {
            try {
                const docs = await documentService.getDocuments();
                setDocuments(docs || []);
            } catch { toast.error('Failed to load documents'); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleDelete = (id) => setDocuments(prev => prev.filter(d => d._id !== id));
    const handleUploadSuccess = (doc) => setDocuments(prev => [doc, ...prev]);
    const filtered = documents.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col gap-5 md:gap-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in-up">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-800">My Documents</h2>
                    <p className="text-sm text-gray-400">{documents.length} document{documents.length !== 1 ? 's' : ''} uploaded</p>
                </div>
                <Button icon={Plus} onClick={() => setShowUpload(true)}>Upload Document</Button>
            </div>

            {/* Search */}
            {documents.length > 0 && (
                <div className="relative animate-fade-in-up stagger-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full sm:max-w-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
                    />
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title={search ? 'No documents found' : 'No documents yet'}
                    description={search ? 'Try a different search term' : 'Upload your first PDF to get started with AI-powered studying'}
                    action={!search && <Button icon={Plus} onClick={() => setShowUpload(true)}>Upload Your First Document</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((doc, i) => (
                        <div key={doc._id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}>
                            <DocumentCard document={doc} onDelete={handleDelete} />
                        </div>
                    ))}
                </div>
            )}

            <DocumentUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onSuccess={handleUploadSuccess} />
        </div>
    );
};

export default DocumentListPage;