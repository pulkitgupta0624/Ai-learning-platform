import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Menu, GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/documents': 'My Documents',
    '/flashcards': 'Flashcards',
    '/profile': 'Profile',
};

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const location = useLocation();

    const getTitle = () => {
        for (const path in pageTitles) {
            if (location.pathname.startsWith(path)) return pageTitles[path];
        }
        return 'StudyAI';
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100/80 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors lg:hidden"
                >
                    <Menu size={22} />
                </button>

                {/* Mobile logo */}
                <div className="flex items-center gap-2 lg:hidden">
                    <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <GraduationCap size={16} className="text-white" />
                    </div>
                </div>

                <div className="hidden lg:block">
                    <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
                </button>
                <div className="w-9 h-9 bg-linear-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-orange-200/40 cursor-pointer hover:shadow-lg transition-shadow">
                    {user?.profileImage
                        ? <img src={user.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                        : getInitials(user?.username)
                    }
                </div>
            </div>
        </header>
    );
};

export default Navbar;