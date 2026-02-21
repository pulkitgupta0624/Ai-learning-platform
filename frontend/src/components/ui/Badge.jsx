import React from 'react'

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-600',
        primary: 'bg-orange-100 text-orange-600',
        success: 'bg-emerald-50 text-emerald-600',
        warning: 'bg-amber-50 text-amber-700',
        danger: 'bg-red-50 text-red-600',
        info: 'bg-blue-50 text-blue-600',
        processing: 'bg-blue-50 text-blue-600 animate-pulse',
        ready: 'bg-emerald-50 text-emerald-600',
        failed: 'bg-red-50 text-red-600',
    };

    const sizes = {
        xs: 'px-2 py-0.5 text-[10px]',
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-semibold rounded-full tracking-wide ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
};

export default Badge;