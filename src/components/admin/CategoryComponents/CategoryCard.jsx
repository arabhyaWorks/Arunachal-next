import { ChevronRight, ChevronDown } from "lucide-react";
import { Edit } from "lucide-react";
import { AttributeList } from "./AttributeList";

export const CategoryCard = ({
    category,
    isExpanded,
    isSelected,
    onToggleExpand,
    onSelect,
    onEdit,
    onAddAttribute,
    onEditAttribute,
    onDeleteAttribute,
    editingAttributeInfo
  }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div
          className="p-4 flex items-center gap-4 cursor-pointer"
          onClick={onToggleExpand}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.name}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({category.attributes.length} attributes)
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
  
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-4 flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Attributes
              </h4>
              <button
                onClick={onAddAttribute}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Attribute
              </button>
            </div>
            <AttributeList
              attributes={category.attributes}
              onEditAttribute={onEditAttribute}
              onDeleteAttribute={onDeleteAttribute}
              editingAttributeInfo={editingAttributeInfo}
            />
          </div>
        )}
      </div>
    );
  };