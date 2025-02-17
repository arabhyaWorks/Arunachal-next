import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ManageAttributes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateAttribute, setShowCreateAttribute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    description: "",
    attribute_type_id: 1,
    is_required: false,
    is_active: true,
  });
  const [initialAttributes, setInitialAttributes] = useState([]);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      const response = await fetch("/api/tribe/attributes");
      const data = await response.json();
      if (data.success) {
        setInitialAttributes(data.data);
      }
    } catch (error) {
      console.error("Error fetching attributes:", error);
    }
  };

  const filteredAttributes = initialAttributes.filter(
    (attr) =>
      attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attr.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get attribute type name based on attribute_type_id
  const getAttributeTypeName = (typeId) => {
    const types = {
      1: "Text",
      2: "Array",
      3: "Date",
      4: "Number",
      5: "Boolean",
      6: "Relations",
      7: "Image",
      8: "Audio",
      9: "Video",
      10: "Document",
      11: "Advanced Image",
    };
    return types[typeId] || "Unknown";
  };

  const handleCreateAttribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tribe/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attributes: [
            {
              name: newAttribute.name,
              description: newAttribute.description,
              is_required: newAttribute.is_required,
              attribute_type_id: parseInt(newAttribute.attribute_type_id),
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewAttribute({
          name: "",
          description: "",
          is_required: false,
          attribute_type_id: "",
        });
        fetchAttributes();
        setError("");
      } else {
        setError(data.error || "Failed to create attribute");
      }
    } catch (error) {
      setError("Error creating attribute: " + error.message);
    }
    setLoading(false);
    setShowCreateAttribute(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search attributes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowCreateAttribute(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Attribute</span>
        </button>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAttributes.map((attr, index) => (
          <motion.div
            key={attr.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {attr.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type: {getAttributeTypeName(attr.attribute_type_id)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit className="h-4 w-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {attr.description}
            </p>

            <div className="flex items-center gap-2">
              {attr.is_required ? (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                  Required
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                  Optional
                </span>
              )}
              {!attr.is_active && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                  Inactive
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Attribute Modal */}
      {showCreateAttribute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create New Attribute
            </h3>

            <form className="space-y-4" onSubmit={handleCreateAttribute}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attribute Name
                </label>
                <input
                  type="text"
                  value={newAttribute.name}
                  onChange={(e) =>
                    setNewAttribute({ ...newAttribute, name: e.target.value })
                  }
                  placeholder="e.g., tribe-History"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newAttribute.description}
                  onChange={(e) =>
                    setNewAttribute({
                      ...newAttribute,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description of what this attribute represents"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Attribute Type
                </label>
                <select
                  value={newAttribute.attribute_type_id}
                  onChange={(e) =>
                    setNewAttribute({
                      ...newAttribute,
                      attribute_type_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
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
                  <option value={8}>
                    Audio - Audio storage with extended fields
                  </option>
                  <option value={9}>
                    Video - Video storage with extended fields
                  </option>
                  <option value={10}>Document - PDF or doc file storage</option>
                  <option value={11}>
                    Advanced Image - Advanced image storage
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={newAttribute.is_required}
                  onChange={(e) =>
                    setNewAttribute({
                      ...newAttribute,
                      is_required: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label
                  htmlFor="required"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Required Attribute
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={newAttribute.is_active}
                  onChange={(e) =>
                    setNewAttribute({
                      ...newAttribute,
                      is_active: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label
                  htmlFor="active"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Active Attribute
                </label>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateAttribute(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {loading?<Loader2 className="w-4 h-4 animate-spin" />:<span>Create Attribute</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
