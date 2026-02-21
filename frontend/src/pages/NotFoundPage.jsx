import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-in-up">
                <div className="w-24 h-24 bg-linear-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center animate-float">
                    <AlertCircle size={44} className="text-orange-400" />
                </div>
                <h1 className="text-7xl md:text-8xl font-black text-gradient">404</h1>
                <h2 className="text-2xl font-extrabold text-gray-800">Page Not Found</h2>
                <p className="text-gray-500 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
                <Button icon={Home} onClick={() => navigate('/')} size="lg">Go Home</Button>
            </div>
        </div>
    );
};

export default NotFoundPage;