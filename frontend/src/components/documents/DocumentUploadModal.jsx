import React, { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import documentService from '../../services/documentService'
import toast from 'react-hot-toast'
import { formatFileSize } from '../../utils/helpers'

const DocumentUploadModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (f) => {
        if (f && f.type === 'application/pdf') {
            setFile(f);
            if (!title) setTitle(f.name.replace('.pdf', ''));
        } else {
            toast.error('Please select a PDF file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        handleFile(f);
    };

    const handleSubmit = async () => {
        if (!title.trim()) { toast.error('Please enter a title'); return; }
        if (!file) { toast.error('Please select a file'); return; }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title.trim());

        setLoading(true);
        try {
            const res = await documentService.uploadDocument(formData);
            toast.success('Document uploaded! Processing...');
            onSuccess(res.data);
            handleClose();
        } catch (err) {
            toast.error(err.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setFile(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Upload Document" size="md">
            <div className="flex flex-col gap-5">
                <Input
                    label="Document Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. ReactJS Notes"
                    required
                />

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'}`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                    {file ? (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <FileText size={24} className="text-orange-500" />
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 mt-1"
                            >
                                <X size={12} /> Remove
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Upload size={22} className="text-gray-400" />
                            </div>
                            <p className="font-semibold text-gray-700 text-sm">Drop your PDF here</p>
                            <p className="text-xs text-gray-400">or click to browse (max 10MB)</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleClose} fullWidth disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} fullWidth loading={loading}>
                        Upload
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DocumentUploadModal;