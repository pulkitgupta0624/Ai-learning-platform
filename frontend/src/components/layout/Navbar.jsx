import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/documents': 'My Documents',
    '/flashcards': 'Flashcards',
    '/profile': 'Profile',
};

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const getTitle = () => {
        for (const path in pageTitles) {
            if (location.pathname.startsWith(path)) return pageTitles[path];
        }
        return 'StudyAI';
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
            <div>
                <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <Bell size={18} />
                </button>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Navbar;