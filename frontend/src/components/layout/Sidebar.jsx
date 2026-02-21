import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard, FileText, BookOpen, Brain, User,
    LogOut, ChevronLeft, ChevronRight, GraduationCap, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/flashcards', icon: BookOpen, label: 'Flashcards' },
    { path: '/quizzes', icon: Brain, label: 'Quizzes' },
    { path: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`${collapsed ? 'w-18' : 'w-64'} h-screen bg-white border-r border-gray-100/80 flex-col transition-all duration-300 relative shrink-0 hidden lg:flex`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100/80">
                    <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200/50">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    {!collapsed && (
                        <span className="font-extrabold text-gray-800 text-lg tracking-tight">StudyAI</span>
                    )}
                </div>

                {/* Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-7 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10 text-gray-400 hover:text-orange-500 hover:border-orange-200"
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                                ${isActive
                                    ? 'bg-linear-to-r from-orange-50 to-amber-50 text-orange-600 font-semibold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                                    )}
                                    <Icon size={18} className="shrink-0" />
                                    {!collapsed && <span className="text-sm">{label}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="border-t border-gray-100/80 p-3">
                    <div className={`flex items-center gap-3 px-2 py-2 ${!collapsed ? 'mb-1' : ''}`}>
                        <div className="w-9 h-9 bg-linear-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-orange-200/40">
                            {user?.profileImage
                                ? <img src={user.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
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
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                        <LogOut size={16} className="shrink-0" />
                        {!collapsed && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col lg:hidden transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span className="font-extrabold text-gray-800 text-lg tracking-tight">StudyAI</span>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-linear-to-r from-orange-50 to-amber-50 text-orange-600 font-semibold shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`
                            }
                        >
                            <Icon size={20} className="shrink-0" />
                            <span className="text-sm font-medium">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="border-t border-gray-100/80 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {getInitials(user?.username)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user?.username}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); onClose(); }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;