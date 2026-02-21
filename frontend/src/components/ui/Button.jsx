import React from 'react'
import Spinner from './Spinner'

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon: Icon,
    fullWidth = false,
}) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

    const variants = {
        primary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white focus:ring-orange-400 shadow-md shadow-orange-200/40 hover:shadow-lg hover:shadow-orange-200/60',
        secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-300 shadow-sm hover:shadow-md hover:border-gray-300',
        danger: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white focus:ring-red-400 shadow-md shadow-red-200/40',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300',
        success: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white focus:ring-emerald-400 shadow-md shadow-emerald-200/40',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {loading ? (
                <Spinner size="sm" color={variant === 'secondary' || variant === 'ghost' ? 'gray' : 'white'} />
            ) : Icon ? (
                <Icon size={16} />
            ) : null}
            {children}
        </button>
    );
};

export default Button;