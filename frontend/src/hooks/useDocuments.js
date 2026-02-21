import { useState, useEffect, useCallback } from 'react'
import documentService from '../services/documentService'
import toast from 'react-hot-toast'

const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const docs = await documentService.getDocuments();
            setDocuments(docs || []);
        } catch (err) {
            setError(err.error || 'Failed to load documents');
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const uploadDocument = async (formData) => {
        try {
            const res = await documentService.uploadDocument(formData);
            setDocuments(prev => [res.data, ...prev]);
            toast.success('Document uploaded! Processing...');
            return res.data;
        } catch (err) {
            toast.error(err.error || 'Upload failed');
            throw err;
        }
    };

    const deleteDocument = async (id) => {
        try {
            await documentService.deleteDocument(id);
            setDocuments(prev => prev.filter(d => d._id !== id));
            toast.success('Document deleted');
        } catch (err) {
            toast.error('Failed to delete document');
            throw err;
        }
    };

    const getDocumentById = async (id) => {
        try {
            const doc = await documentService.getDocumentById(id);
            return doc;
        } catch (err) {
            toast.error('Document not found');
            throw err;
        }
    };

    // Poll a single document's status until it becomes 'ready' or 'failed'
    const pollDocumentStatus = useCallback((documentId, intervalMs = 3000) => {
        const interval = setInterval(async () => {
            try {
                const doc = await documentService.getDocumentById(documentId);
                if (doc.status === 'ready' || doc.status === 'failed') {
                    clearInterval(interval);
                    setDocuments(prev =>
                        prev.map(d => d._id === documentId ? { ...d, status: doc.status } : d)
                    );
                    if (doc.status === 'ready') toast.success('Document is ready!');
                    if (doc.status === 'failed') toast.error('Document processing failed');
                }
            } catch {
                clearInterval(interval);
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, []);

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        uploadDocument,
        deleteDocument,
        getDocumentById,
        pollDocumentStatus,
    };
};

export default useDocuments;