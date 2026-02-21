import React from 'react'
import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
            <div className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center animate-scale-in">
                    <AlertTriangle size={32} className="text-red-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>
                <div className="flex gap-3 w-full">
                    <Button variant="secondary" onClick={onClose} fullWidth disabled={loading}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm} fullWidth loading={loading}>{confirmText}</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;