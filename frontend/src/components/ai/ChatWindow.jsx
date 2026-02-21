import React, { useEffect, useRef, useState } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import Spinner from '../ui/Spinner'
import { MessageCircle } from 'lucide-react'
import aiService from '../../services/aiService'
import toast from 'react-hot-toast'

const ChatWindow = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const bottomRef = useRef(null);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await aiService.getChatHistory(documentId);
                setMessages(res.data || []);
            } catch {
                setMessages([]);
            } finally {
                setLoadingHistory(false);
            }
        };
        loadHistory();
    }, [documentId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (question) => {
        const userMsg = { role: 'user', content: question, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setSending(true);
        try {
            const res = await aiService.chat(documentId, question);
            const aiMsg = { role: 'assistant', content: res.data.response, timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            toast.error('Failed to get response');
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setSending(false);
        }
    };

    if (loadingHistory) {
        return <div className="flex items-center justify-center h-64"><Spinner /></div>;
    }

    return (
        <div className="flex flex-col h-125 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                            <MessageCircle size={28} className="text-orange-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Chat with your document</p>
                            <p className="text-sm text-gray-400 mt-1">Ask any question about the content</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
                )}
                {sending && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <Spinner size="sm" color="white" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <ChatInput onSend={handleSend} disabled={sending} />
        </div>
    );
};

export default ChatWindow;