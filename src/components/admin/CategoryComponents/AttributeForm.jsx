export const AttributeForm = ({ attribute, onSave, onCancel, isEditing }) => {
    const [form, setForm] = useState(attribute);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(form);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Attribute Name
          </label>
          <input
            type="text"
            placeholder="eg, video"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>
        
        {/* Additional form fields... */}
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.name.trim()}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isEditing ? "Save" : "Add"}
          </button>
        </div>
      </form>
    );
  };