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
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400 shadow-sm hover:shadow-md',
        secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-300 shadow-sm',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 shadow-sm',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300',
        success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 shadow-sm',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
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