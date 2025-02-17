import { X } from "lucide-react";
import { AttributeForm } from "./AttributeForm";

export const AttributeModal = ({
    isOpen,
    categoryId,
    attribute,
    onClose,
    onSave,
    isEditing
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Edit Attribute" : "Add New Attribute"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <AttributeForm
          categoryId={categoryId}
            attribute={attribute}
            onSave={onSave}
            onCancel={onClose}
            isEditing={isEditing}
          />
        </div>
      </div>
    );
  };