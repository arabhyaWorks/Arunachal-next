import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export const AttributeForm = ({
  onCancel,
  isEditing,
  categoryId,
  categoryName,
  onSuccess, // Added callback for successful submission
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    category_id: categoryId,
    category_name: categoryName,
    attribute_name: "",
    description: "",
    attribute_type_id: 1,
    is_required: false,
    user_id: 1,
  });

  // Update form when props change
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      category_id: categoryId,
      category_name: categoryName,
    }));
  }, [categoryId, categoryName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Ensure required fields are provided
    const requestData = {
      category_id: Number(form.category_id),
      category_name: String(form.category_name),
      attribute_name: String(form.attribute_name),
      description: String(form.description || ""),
      attribute_type_id: Number(form.attribute_type_id),
      is_required: Boolean(form.is_required),
      user_id: Number(form.user_id),
    };

    console.log(requestData)

    if (
      !form.category_id ||
      !form.attribute_name.trim() ||
      !form.attribute_type_id ||
      !form.user_id
    ) {
      setError("Missing required fields");
      setLoading(false);
      return;
    }

    console.log("Sending request data:", requestData); // Debugging line

    try {
      const response = await fetch(
        "http://localhost:3000/api/category/attributes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      if (onSuccess) onSuccess(result);
      onCancel(); // Close form on success
    } catch (error) {
      console.error("Error adding attribute:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Attribute Name
        </label>
        <input
          type="text"
          placeholder="e.g., About the Food"
          value={form.attribute_name}
          onChange={(e) => setForm({ ...form, attribute_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          placeholder="Description of the attribute"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Attribute Type
        </label>
        <select
          value={form.attribute_type_id}
          onChange={(e) =>
            setForm({ ...form, attribute_type_id: Number(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          required
        >
          <option value={1}>Text - Simple text content</option>
          <option value={2}>Array - List of values with labels</option>
          <option value={3}>Date - Date values</option>
          <option value={4}>Number - Numeric values</option>
          <option value={5}>Boolean - True/False values</option>
          <option value={6}>
            Relations - Stores references to other tables
          </option>
          <option value={7}>Image - Simple image storage</option>
          <option value={8}>Audio - Audio storage with extended fields</option>
          <option value={9}>Video - Video storage with extended fields</option>
          <option value={10}>Document - PDF or doc file storage</option>
          <option value={11}>Advanced Image - Advanced image storage</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="required"
          checked={form.is_required}
          onChange={(e) => setForm({ ...form, is_required: e.target.checked })}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label
          htmlFor="required"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Required Attribute
        </label>
      </div>

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
          disabled={!form.attribute_name.trim() || loading}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[60px]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span>{isEditing ? "Save" : "Add"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AttributeForm;
