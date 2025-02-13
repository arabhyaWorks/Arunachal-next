"use client";

import { useState } from "react";
import {
  Database,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  Info,
  X,
} from "lucide-react";
import classNames from "classnames";

export default function MasterData() {
  // State variables
  const [activeTab, setActiveTab] = useState("tribes");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [newAttribute, setNewAttribute] = useState({ name: "", required: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAddTribe, setShowAddTribe] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", attributes: [] });
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoriesModal, setShowDeleteCategoriesModal] = useState(false);

  // Default tribes data
  const [tribes, setTribes] = useState([
    {
      id: "1",
      name: "Adi",
      about: "The Adi tribe is one of the major tribes of Arunachal Pradesh",
      history: "Rich cultural heritage dating back centuries",
      distribution: "Mainly found in East Siang and Upper Siang districts",
    },
  ]);

  // Default categories with attributes
  const [categories, setCategories] = useState([
    {
      id: "folk-music",
      name: "Folk Music",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Title of the music piece", required: true },
        { name: "Variation", required: false },
        { name: "Composer/Artist/Performer", required: true },
        { name: "Genre (e.g., ballad, lullaby, etc.)", required: true },
        { name: "Duration", required: true },
        { name: "Instruments used", required: true },
        { name: "Region or Cultural Origin", required: true },
        { name: "Social or cultural Significance", required: true },
        { name: "Historical/religious context and significance", required: true },
      ],
    },
    {
      id: "folk-songs",
      name: "Folk Songs",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Title of the song", required: true },
        { name: "Variation", required: false },
        { name: "Singer/Performer", required: true },
        { name: "Genre", required: true },
        { name: "Duration", required: true },
        { name: "Lyrics", required: true },
        { name: "Region or Cultural Origin", required: true },
        { name: "Social or cultural significance", required: true },
        { name: "Historical/religious context and significance", required: true },
      ],
    },
    {
      id: "folk-dance",
      name: "Folk Dance",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Name of the dance", required: true },
        { name: "Characters involved", required: true },
        { name: "Type of dance (ritualistic, celebratory, etc.)", required: true },
        { name: "Region or Cultural Origin", required: true },
        { name: "Costumes or attire associated", required: true },
        { name: "Music accompanying the dance", required: true },
        { name: "Instruments used", required: true },
        { name: "Steps or choreography", required: true },
        { name: "Social or cultural significance", required: true },
        { name: "Historical/religious context and significance", required: true },
      ],
    },
    {
      id: "folk-tales",
      name: "Folk Tales",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Title of the tale", required: true },
        { name: "Variations", required: false },
        { name: "Plot summary", required: true },
        { name: "Characters involved", required: true },
        { name: "Storyteller", required: false },
        { name: "Region or Cultural Origin", required: true },
        { name: "Moral (if applicable)", required: false },
        { name: "Historical/religious context and significance", required: true },
      ],
    },
    {
      id: "traditional-costumes",
      name: "Traditional Costumes/Dresses",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Type of traditional dress", required: true },
        { name: "Description of costume/dress", required: true },
        { name: "Occasions or events associated", required: true },
        { name: "Materials used", required: true },
        { name: "Symbolism of colours or patterns", required: true },
        { name: "Region or Cultural Origin", required: true },
        { name: "Historical/religious context and significance", required: true },
      ],
    },
    {
      id: "rituals",
      name: "Rituals",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Name of the ritual", required: true },
        { name: "Purpose or significance", required: true },
        { name: "Timing or occasions", required: true },
        { name: "Duration", required: true },
        { name: "Materials or objects used", required: true },
        { name: "Steps or procedures", required: true },
        { name: "Type(s) of sacrifices made", required: false },
        { name: "Region or Cultural Origin", required: true },
        { name: "Historical/religious context and significance", required: true },
      ],
    },
    {
      id: "festivals",
      name: "Festivals",
      attributes: [
        { name: "Tribe(s)", required: true },
        { name: "Name of the festival", required: true },
        { name: "Date of celebration", required: true },
        { name: "Duration", required: true },
        { name: "Rituals or ceremonies associated", required: true },
        { name: "Type(s) of sacrifices made", required: false },
        { name: "Traditional food or dishes associated", required: true },
        { name: "Dresses associated", required: true },
        { name: "Decorations or symbols", required: true },
        { name: "Region or Cultural Origin", required: true },
        { name: "Historical/Religious context and significance", required: true },
      ],
    },
  ]);

  // Event handlers

  const handleEditTribe = (tribe) => {
    // Implement edit tribe logic
  };

  const handleDeleteTribe = (tribeId) => {
    setTribes((prev) => prev.filter((tribe) => tribe.id !== tribeId));
  };

  const handleEditAttribute = (categoryId, index) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const attribute = category.attributes[index];
      setEditingAttribute({
        categoryId,
        index,
        name: attribute.name,
        required: attribute.required,
      });
    }
  };

  const handleSaveAttribute = () => {
    if (editingAttribute) {
      setCategories(
        categories.map((category) => {
          if (category.id === editingAttribute.categoryId) {
            const newAttributes = [...category.attributes];
            newAttributes[editingAttribute.index] = {
              name: editingAttribute.name,
              required: editingAttribute.required,
            };
            return { ...category, attributes: newAttributes };
          }
          return category;
        })
      );
      setEditingAttribute(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name,
        attributes: newCategory.attributes,
      };
      setCategories([...categories, category]);
      setShowAddCategory(false);
      setNewCategory({ name: "", attributes: [] });
    }
  };

  const handleAddAttribute = (categoryId) => {
    if (newAttribute.name.trim()) {
      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return { ...category, attributes: [...category.attributes, { ...newAttribute }] };
          }
          return category;
        })
      );
      setNewAttribute({ name: "", required: false });
      setShowAddAttribute(false);
    }
  };

  const handleDeleteAttribute = (categoryId, index) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          const newAttributes = [...category.attributes];
          newAttributes.splice(index, 1);
          return { ...category, attributes: newAttributes };
        }
        return category;
      })
    );
  };

  const handleEditCategory = (category, e) => {
    e.stopPropagation();
    setEditingCategory(category);
    setShowEditCategoryModal(true);
  };

  const handleDeleteCategories = () => {
    setCategories((prev) => prev.filter((cat) => !selectedCategories.includes(cat.id)));
    setSelectedCategories([]);
    setShowDeleteCategoriesModal(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))
      );
      setShowEditCategoryModal(false);
      setEditingCategory(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Master Data Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage tribes and categories data
          </p>
        </div>
        <button
          onClick={() =>
            activeTab === "tribes" ? setShowAddTribe(true) : setShowAddCategory(true)
          }
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New {activeTab === "tribes" ? "Tribe" : "Category"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab("tribes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "tribes"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Database className="h-5 w-5" />
          <span>Tribes</span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "categories"
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Database className="h-5 w-5" />
          <span>Categories</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "tribes" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tribes.map((tribe) => (
            <div
              key={tribe.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tribe.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditTribe(tribe)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteTribe(tribe.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    About
                  </label>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {tribe.about}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    History
                  </label>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {tribe.history}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Distribution
                  </label>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {tribe.distribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Bulk Actions */}
          {selectedCategories.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedCategories.length}{" "}
                {selectedCategories.length === 1 ? "category" : "categories"}{" "}
                selected
              </span>
              <button
                onClick={() => setShowDeleteCategoriesModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected</span>
              </button>
            </div>
          )}

          {/* Add Category Modal */}
          {showAddCategory && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add New Category
                  </h3>
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCategory}
                      disabled={!newCategory.name.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategorySelect(category.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center gap-3">
                  {expandedCategory === category.id ? (
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleEditCategory(category, e)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {expandedCategory === category.id && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mb-4 flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Attributes
                    </h4>
                    {!showAddAttribute && (
                      <button
                        onClick={() => setShowAddAttribute(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        + Add Attribute
                      </button>
                    )}
                  </div>

                  {showAddAttribute && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="space-y-4">
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
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                            placeholder="Enter attribute name"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="required"
                            checked={newAttribute.required}
                            onChange={(e) =>
                              setNewAttribute({ ...newAttribute, required: e.target.checked })
                            }
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <label htmlFor="required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Required field
                          </label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowAddAttribute(false)}
                            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddAttribute(category.id)}
                            disabled={!newAttribute.name.trim()}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {category.attributes.map((attr, index) => (
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
                            onClick={() => handleEditAttribute(category.id, index)}
                            className={classNames(
                              "p-1 rounded-lg transition-colors",
                              editingAttribute &&
                                editingAttribute.categoryId === category.id &&
                                editingAttribute.index === index
                                ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "hover:bg-gray-200 dark:hover:bg-gray-600"
                            )}
                          >
                            <Edit className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteAttribute(category.id, index)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Attribute Form */}
              {editingAttribute &&
                editingAttribute.categoryId === category.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Attribute Name
                        </label>
                        <input
                          type="text"
                          value={editingAttribute.name}
                          onChange={(e) =>
                            setEditingAttribute({
                              ...editingAttribute,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="edit-required"
                          checked={editingAttribute.required}
                          onChange={(e) =>
                            setEditingAttribute({
                              ...editingAttribute,
                              required: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <label htmlFor="edit-required" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Required field
                        </label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingAttribute(null)}
                          className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveAttribute}
                          disabled={!editingAttribute.name.trim()}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Category
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowEditCategoryModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Categories Modal */}
      {showDeleteCategoriesModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Categories
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete {selectedCategories.length}{" "}
              {selectedCategories.length === 1 ? "category" : "categories"}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteCategoriesModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategories}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}