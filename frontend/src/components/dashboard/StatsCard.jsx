import React from 'react'

const StatsCard = ({ title, value, icon: Icon, color = 'orange', subtitle }) => {
    const colors = {
        orange: 'bg-orange-50 text-orange-500 shadow-orange-100/50',
        blue: 'bg-blue-50 text-blue-500 shadow-blue-100/50',
        green: 'bg-emerald-50 text-emerald-500 shadow-emerald-100/50',
        purple: 'bg-purple-50 text-purple-500 shadow-purple-100/50',
        yellow: 'bg-amber-50 text-amber-500 shadow-amber-100/50',
        red: 'bg-red-50 text-red-500 shadow-red-100/50',
    };

    return (
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100/80 shadow-sm card-hover">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 mb-1 font-medium">{title}</p>
                    <p className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">{value ?? 0}</p>
                    {subtitle && <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]} shadow-md`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;