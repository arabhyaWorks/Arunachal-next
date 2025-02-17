import { Suspense, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ManageAttributes from "./ManageAttributes";
import ManageTribes from "./ManageTribes";
import CreateTribeForm from "./createTribeForm";
import SuspenseWrapper from "./Suspense";

export default function MasterData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateTribe, setShowCreateTribe] = useState(false);
  const [activeTab, setActiveTab] = useState("view"); // 'view' or 'attributes'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddAttribute, setShowAddAttribute] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    required: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showAddTribe, setShowAddTribe] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    attributes: [],
  });
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoriesModal, setShowDeleteCategoriesModal] =
    useState(false);

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
        {
          name: "Historical/religious context and significance",
          required: true,
        },
      ],
    },
  ]);

  const handleEditTribe = (tribe) => {
    // Implement edit tribe logic
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
            return {
              ...category,
              attributes: [...category.attributes, { ...newAttribute }],
            };
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
    setCategories((prev) =>
      prev.filter((cat) => !selectedCategories.includes(cat.id))
    );
    setSelectedCategories([]);
    setShowDeleteCategoriesModal(false);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setShowEditCategoryModal(false);
      setEditingCategory(null);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Master Data Management
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage tribes and categories data
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("tribes")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "tribes"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tribes
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "categories"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Categories
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "tribes" ? (
            // Tribes view
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Tribes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddTribe(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Tribe</span>
                </button>
              </div>
              {showAddTribe ? (
                <CreateTribeForm  setShowAddTribe={setShowAddTribe}  />
              ) : (
                <ManageTribes />
                )
            }
            </div>
          ) : (
            <ManageAttributes />
          )}
        </div>
      </div>
    </div>
  );
}
