import React from 'react'

const StatsCard = ({ title, value, icon: Icon, color = 'orange', subtitle }) => {
    const colors = {
        orange: 'bg-orange-50 text-orange-500',
        blue: 'bg-blue-50 text-blue-500',
        green: 'bg-green-50 text-green-500',
        purple: 'bg-purple-50 text-purple-500',
        yellow: 'bg-yellow-50 text-yellow-500',
        red: 'bg-red-50 text-red-500',
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;