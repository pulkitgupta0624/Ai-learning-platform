import React from 'react'

const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {Icon && (
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                    <Icon size={32} className="text-orange-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
            )}
            {action && action}
        </div>
    );
};

export default EmptyState;