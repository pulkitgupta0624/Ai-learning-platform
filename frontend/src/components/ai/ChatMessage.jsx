import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GraduationCap, User } from 'lucide-react'

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${isUser ? 'bg-linear-to-br from-orange-400 to-amber-500 shadow-orange-200/40' : 'bg-linear-to-br from-gray-700 to-gray-800 shadow-gray-300/30'}`}>
                {isUser ? <User size={14} className="text-white" /> : <GraduationCap size={14} className="text-white" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-tr-sm shadow-md shadow-orange-200/30' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'}`}>
                {isUser ? (
                    <p>{message.content}</p>
                ) : (
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;