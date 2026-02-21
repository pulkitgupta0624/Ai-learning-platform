import React from 'react'

const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in-up">
            {Icon && (
                <div className="w-20 h-20 bg-linear-to-br from-orange-50 to-amber-50 rounded-3xl flex items-center justify-center mb-5 animate-float">
                    <Icon size={36} className="text-orange-400" />
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">{description}</p>
            )}
            {action && action}
        </div>
    );
};

export default EmptyState;