import classNames from "classnames";
import { Edit, Trash2 } from "lucide-react";

export const AttributeList = ({ 
    attributes, 
    onEditAttribute, 
    onDeleteAttribute, 
    editingAttributeInfo 
  }) => {
    return (
      <div className="space-y-2">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900 dark:text-white">
                {attr.name}
              </span>
              {attr.required && (
                <span className="text-xs text-red-500">*</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditAttribute(index)}
                className={classNames(
                  "p-1 rounded-lg transition-colors",
                  editingAttributeInfo?.index === index
                    ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                <Edit className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={() => onDeleteAttribute(index)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  