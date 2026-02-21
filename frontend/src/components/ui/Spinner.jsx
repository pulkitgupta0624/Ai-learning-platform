import React from 'react'

const Spinner = ({ size = 'md', color = 'primary' }) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
    const colors = {
        primary: 'border-orange-500',
        white: 'border-white',
        gray: 'border-gray-500'
    };

    return (
        <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
    );
};

export default Spinner;