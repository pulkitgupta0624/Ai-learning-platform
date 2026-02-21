import React from 'react'

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-600',
        primary: 'bg-orange-100 text-orange-600',
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-600',
        info: 'bg-blue-100 text-blue-600',
        processing: 'bg-blue-100 text-blue-600 animate-pulse',
        ready: 'bg-green-100 text-green-600',
        failed: 'bg-red-100 text-red-600',
    };

    const sizes = {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

export default Badge;