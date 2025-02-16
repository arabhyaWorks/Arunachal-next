import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  Image as ImageIcon,
  Edit,
  Trash2,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import ManageAttributes from "./ManageAttributes";

export default function ManageTribes() {
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

  // Default tribes data
  const [tribes, setTribes] = useState([]);

  useEffect(() => {
    async function fetchTribes() {
      try {
        const response = await fetch("http://localhost:3000/api/tribe");
        const data = await response.json();
        if (data?.data) {
          const transformedTribes = data.data.map((tribe) => ({
            id: tribe.tribe_id,
            name: tribe.name,
            location:
              tribe.attributes["tribe-Regions"]?.attribute_value?.value?.[0] ||
              "Unknown",
            population:
              tribe.attributes["tribe-PopulationInNumbers"]?.attribute_value
                ?.value || "N/A",
            image:
              tribe.attributes["tribe-BannerImage"]?.attribute_value?.value ||
              "/placeholder.jpg",
          }));
          setTribes(transformedTribes);
        }
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    }
    fetchTribes();
  }, []);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tribes.map((tribe, index) => (
                <motion.div
                  key={tribe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
                    <img
                      src={tribe.image}
                      alt={tribe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {tribe.name}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Created{" "}
                            {new Date(tribe.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Created by: {tribe.createdBy}
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
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <ManageAttributes />
          )}
        </div>
      </div>
    </div>
  );
}
