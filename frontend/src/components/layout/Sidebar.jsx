import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, FileText, BookOpen, Brain, User,
    LogOut, ChevronLeft, ChevronRight, GraduationCap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/flashcards', icon: BookOpen, label: 'Flashcards' },
    { path: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <aside className={`${collapsed ? 'w-16' : 'w-60'} h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative shrink-0`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap size={20} className="text-white" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-gray-800 text-lg leading-none">StudyAI</span>
                )}
            </div>

            {/* Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10 text-gray-500 hover:text-gray-700"
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-orange-50 text-orange-600 font-semibold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }`
                        }
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="text-sm">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User */}
            <div className="border-t border-gray-100 p-3">
                <div className={`flex items-center gap-3 px-2 py-2 ${!collapsed ? 'mb-1' : ''}`}>
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.profileImage
                            ? <img src={user.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" />
                            : getInitials(user?.username)
                        }
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut size={16} className="shrink-0" />
                    {!collapsed && 'Logout'}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;