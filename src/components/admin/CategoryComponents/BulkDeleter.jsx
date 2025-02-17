import { Trash2 } from "lucide-react";

export const BulkDeleteBar = ({ selectedCount, onDelete }) => {
    if (selectedCount === 0) return null;
  
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between mb-4">
        <span className="text-sm text-blue-700 dark:text-blue-300">
          {selectedCount} {selectedCount === 1 ? "category" : "categories"} selected
        </span>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Selected</span>
        </button>
      </div>
    );
  };