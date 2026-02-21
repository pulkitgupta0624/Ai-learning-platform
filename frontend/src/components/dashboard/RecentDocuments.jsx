import React from 'react'
import { FileText, Clock } from 'lucide-react'
import { timeAgo } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const RecentDocuments = ({ documents = [] }) => {
    const navigate = useNavigate();

    if (!documents.length) {
        return (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Documents</h3>
                <p className="text-sm text-gray-400 text-center py-6">No documents yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Documents</h3>
            <div className="flex flex-col gap-3">
                {documents.map((doc) => (
                    <div
                        key={doc._id}
                        onClick={() => navigate(`/documents/${doc._id}`)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                                {doc.title}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={11} className="text-gray-400" />
                                <p className="text-xs text-gray-400">{timeAgo(doc.lastAccessed)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentDocuments;