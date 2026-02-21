import { useState, useEffect, useCallback, useRef } from 'react'
import aiService from '../services/aiService'
import toast from 'react-hot-toast'

const useChat = (documentId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);

    // Load chat history on mount
    useEffect(() => {
        if (!documentId) return;
        const loadHistory = async () => {
            setLoading(true);
            try {
                const res = await aiService.getChatHistory(documentId);
                setMessages(res.data || []);
            } catch {
                // No history yet, that's fine
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, [documentId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = useCallback(async (question) => {
        if (!question.trim() || sending) return;

        const userMessage = {
            role: 'user',
            content: question.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setSending(true);
        setError(null);

        try {
            const res = await aiService.chat(documentId, question.trim());
            const aiMessage = {
                role: 'assistant',
                content: res.data.response,
                timestamp: new Date().toISOString(),
                relevantChunks: res.data.relevantChunks || [],
            };
            setMessages(prev => [...prev, aiMessage]);
            return aiMessage;
        } catch (err) {
            // Remove the user message we optimistically added
            setMessages(prev => prev.slice(0, -1));
            const errMsg = err.error || 'Failed to get a response';
            setError(errMsg);
            toast.error(errMsg);
            throw err;
        } finally {
            setSending(false);
        }
    }, [documentId, sending]);

    const explainConcept = useCallback(async (concept) => {
        if (!concept.trim() || sending) return;

        const userMessage = {
            role: 'user',
            content: `Explain: ${concept.trim()}`,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setSending(true);
        setError(null);

        try {
            const res = await aiService.explainConcept(documentId, concept.trim());
            const aiMessage = {
                role: 'assistant',
                content: res,
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
            return aiMessage;
        } catch (err) {
            setMessages(prev => prev.slice(0, -1));
            const errMsg = err.error || 'Failed to explain concept';
            setError(errMsg);
            toast.error(errMsg);
            throw err;
        } finally {
            setSending(false);
        }
    }, [documentId, sending]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        loading,
        sending,
        error,
        bottomRef,
        sendMessage,
        explainConcept,
        clearMessages,
    };
};

export default useChat;