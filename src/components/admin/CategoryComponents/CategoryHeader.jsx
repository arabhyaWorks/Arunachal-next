// CategoryHeader.jsx
"use client";

import { Plus } from "lucide-react";

export const CategoryHeader = ({ onAddCategory }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Master Data Management
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage categories and attributes
        </p>
      </div>
      <button
        onClick={onAddCategory}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
        <span>Add New Category</span>
      </button>
    </div>
  );
};