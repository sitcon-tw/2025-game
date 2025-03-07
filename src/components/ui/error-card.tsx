import React from "react";
import { ErrorCardProps } from "@/lib/interface";

function ErrorCard({
  title = "發生錯誤",
  errorItems,
  onReload,
}: ErrorCardProps) {
  // 檢查是否有錯誤存在
  const hasErrors = errorItems && errorItems.length > 0;

  if (!hasErrors) return null;

  return (
    <div className="mx-auto mt-8 max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-3 h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="mb-5 space-y-3 text-sm">
        {errorItems.map((item, index) => (
          <div key={index} className="rounded-lg bg-red-50 p-3">
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
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <span className="mr-2">🔄</span> 重新載入
      </button>
    </div>
  );
}

export default ErrorCard;
