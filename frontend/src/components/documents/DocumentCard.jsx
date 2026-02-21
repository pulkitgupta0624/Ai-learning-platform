import React, { useState } from 'react'
import { FileText, Trash2, ChevronRight, BookOpen, Brain, Calendar } from 'lucide-react'
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
        } catch (err) {
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
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                    <div
                        className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer group"
                        onClick={handleCardClick}
                    >
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                                {document.title}
                            </h3>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{document.fileName}</p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                        className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <DocumentStatusBadge status={document.status} />
                    <span className="text-xs text-gray-400">{formatFileSize(document.fileSize)}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1">
                        <BookOpen size={12} />
                        <span>{document.flashcardCount || 0} sets</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Brain size={12} />
                        <span>{document.quizCount || 0} quizzes</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                        <Calendar size={12} />
                        <span>{formatDate(document.uploadDate)}</span>
                    </div>
                </div>

                {document.status === 'ready' && (
                    <button
                        onClick={handleCardClick}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-orange-50 text-orange-600 text-sm font-semibold rounded-xl hover:bg-orange-100 transition-colors"
                    >
                        Open Document <ChevronRight size={14} />
                    </button>
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