import React from 'react';
import { ErrorCardProps } from '@/lib/interface';


function ErrorCard({ title = '發生錯誤', errorItems, onReload }: ErrorCardProps) {
    // 檢查是否有錯誤存在
    const hasErrors = errorItems && errorItems.length > 0;

    if (!hasErrors) return null;

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md border border-red-200">
            <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>

            <div className="space-y-3 mb-5 text-sm">
                {errorItems.map((item, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                        <p className="font-medium">
                            <span className="mr-2">{item.icon}</span>
                            <span className="text-red-700">{item.label}:</span>
                            <span className="ml-1 text-gray-700">{item.message}</span>
                        </p>
                    </div>
                ))}
            </div>

            <button
                onClick={onReload}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
            >
                <span className="mr-2">🔄</span> 重新載入
            </button>
        </div>
    );
};

export default ErrorCard;