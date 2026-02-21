import React, { useState } from 'react'
import { FileText, Trash2, BookOpen, Brain, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DocumentStatusBadge from './DocumentStatusBadge'
import ConfirmDialog from '../ui/ConfirmDialog'
import { formatDate, formatFileSize } from '../../utils/helpers'
import documentService from '../../services/documentService'
import toast from 'react-hot-toast'

const DocumentCard = ({ document, onDelete }) => {
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await documentService.deleteDocument(document._id);
            toast.success('Document deleted');
            onDelete(document._id);
        } catch {
            toast.error('Failed to delete document');
        } finally {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    const handleCardClick = () => {
        if (document.status === 'ready') navigate(`/documents/${document._id}`);
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm p-5 flex flex-col gap-4 card-hover group">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer" onClick={handleCardClick}>
                        <div className="w-11 h-11 bg-linear-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow">
                            <FileText size={20} className="text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">{document.title}</h3>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{document.fileName}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                        className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 shrink-0"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <DocumentStatusBadge status={document.status} />
                    <span className="text-xs text-gray-400">{formatFileSize(document.fileSize)}</span>
                    <div className="flex items-center gap-1 ml-auto">
                        <Calendar size={11} className="text-gray-300" />
                        <span className="text-xs text-gray-400">{formatDate(document.uploadDate)}</span>
                    </div>
                </div>

                {document.status === 'ready' && (
                    <div className="flex gap-2 pt-1">
                        <button onClick={() => navigate(`/documents/${document._id}/flashcards`)} className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all">
                            <BookOpen size={12} /> Flashcards
                        </button>
                        <button onClick={() => navigate(`/documents/${document._id}`)} className="flex items-center gap-1.5 text-xs font-medium text-purple-500 hover:text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-all">
                            <Brain size={12} /> Quiz
                        </button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Document?"
                message="This will permanently delete the document and all its flashcards and quizzes."
                loading={deleting}
            />
        </>
    );
};

export default DocumentCard;