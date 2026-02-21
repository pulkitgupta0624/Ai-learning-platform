import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center">
                <AlertCircle size={40} className="text-orange-400" />
            </div>
            <h1 className="text-6xl font-black text-gray-200">404</h1>
            <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
            <p className="text-gray-500 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
            <Button icon={Home} onClick={() => navigate('/')}>Go Home</Button>
        </div>
    );
};

export default NotFoundPage;