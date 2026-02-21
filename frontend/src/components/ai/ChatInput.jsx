import React, { useState, useRef } from 'react'
import { Send } from 'lucide-react'

const ChatInput = ({ onSend, disabled }) => {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);

    const handleSend = () => {
        if (!value.trim() || disabled) return;
        onSend(value.trim());
        setValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-end gap-2 p-3 bg-white border-t border-gray-100">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about this document..."
                rows={1}
                disabled={disabled}
                className="flex-1 resize-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent disabled:opacity-50 max-h-32 overflow-y-auto"
            />
            <button
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
                <Send size={15} />
            </button>
        </div>
    );
};

export default ChatInput;