import { CategoryHeader } from "./CategoryComponents/CategoryHeader";
import { BulkDeleteBar } from "./CategoryComponents/BulkDeleter";
import { AttributeModal } from "./CategoryComponents/AttributeModal";
import { CategoryCard } from "./CategoryComponents/CategoryCard";
import { useState, useEffect } from "react";
import AddCategoryModal from "./CategoryComponents/AddCategoryModal";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchCategoryAttributes = async (categoryId) => {
      try {
        const response = await fetch(
          `/api/category/attributes?category_id=${categoryId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.data;
      } catch (err) {
        console.error(
          `Error fetching attributes for category ${categoryId}:`,
          err
        );
        return [];
      }
    };

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // Fetch main categories
        const categoriesResponse = await fetch(
          "/api/category"
        );

        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
        }

        const categoriesResult = await categoriesResponse.json();

        // Fetch attributes for each category
        const categoriesWithAttributes = await Promise.all(
          categoriesResult.data.map(async (category) => {
            const attributes = await fetchCategoryAttributes(category.id);
            return {
              ...category,
              attributes,
            };
          })
        );

        setCategories(categoriesWithAttributes);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Category add/edit states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    attributes: [],
  });

  // Modal state for attribute add/edit
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [attributeModalCategoryId, setAttributeModalCategoryId] =
    useState(null);

  // For adding a new attribute
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    description: "",
    attributeType: "",
    required: false,
  });

  // For editing an existing attribute
  const [editingAttribute, setEditingAttribute] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };


  const handleEditCategory = (category, e) => {
    e.stopPropagation();
    setEditingCategory(category);
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setEditingCategory(null);
    }
  };

  const handleDeleteCategories = () => {
    setCategories((prev) =>
      prev.filter((cat) => !selectedCategories.includes(cat.id))
    );
    setSelectedCategories([]);
  };

  // --- Attribute Handlers (Modal based) ---
  // For adding a new attribute via modal
  const openAddAttributeModal = (categoryId) => {
    setAttributeModalCategoryId(categoryId);
    setNewAttribute({
      name: "",
      description: "",
      attributeType: "",
      required: false,
    });
    setShowAttributeModal(true);
    setEditingAttribute(null);
  };

  // For editing an attribute via modal
  const openEditAttributeModal = (categoryId, index) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const attr = category.attributes[index];
      setEditingAttribute({
        categoryId,
        index,
        name: attr.name,
        description: attr.description || "",
        attributeType: attr.attributeType || "",
        required: attr.required,
      });
      setShowAttributeModal(true);
      setAttributeModalCategoryId(null);
    }
  };

  const handleSaveAttributeModal = () => {
    // If we're editing an existing attribute
    if (editingAttribute) {
      setCategories((prev) =>
        prev.map((category) => {
          if (category.id === editingAttribute.categoryId) {
            const newAttrs = [...category.attributes];
            newAttrs[editingAttribute.index] = {
              name: editingAttribute.name,
              description: editingAttribute.description,
              attributeType: editingAttribute.attributeType,
              required: editingAttribute.required,
            };
            return { ...category, attributes: newAttrs };
          }
          return category;
        })
      );
      setEditingAttribute(null);
      setShowAttributeModal(false);
    }
    // If we're adding a new attribute
    else if (attributeModalCategoryId) {
      if (newAttribute.name.trim()) {
        setCategories((prev) =>
          prev.map((category) => {
            if (category.id === attributeModalCategoryId) {
              return {
                ...category,
                attributes: [...category.attributes, { ...newAttribute }],
              };
            }
            return category;
          })
        );
        setShowAttributeModal(false);
        setAttributeModalCategoryId(null);
      }
    }
  };

  const handleDeleteAttribute = (categoryId, index) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const newAttributes = [...category.attributes];
          newAttributes.splice(index, 1);
          return { ...category, attributes: newAttributes };
        }
        return category;
      })
    );
  };

  const handleAddCategory = async (categoryData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Add the new category to the state with empty attributes array
      setCategories((prev) => [...prev, { ...result.data, attributes: [] }]);
      setShowAddCategory(false);
    } catch (error) {
      setError(error.message);
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <CategoryHeader onAddCategory={() => setShowAddCategory(true)} />

      <BulkDeleteBar
        selectedCount={selectedCategories.length}
        onDelete={handleDeleteCategories}
      />

      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isExpanded={expandedCategory === category.id}
            isSelected={selectedCategories.includes(category.id)}
            onToggleExpand={() =>
              setExpandedCategory(
                expandedCategory === category.id ? null : category.id
              )
            }
            onSelect={() => handleCategorySelect(category.id)}
            onEdit={(e) => handleEditCategory(category, e)}
            onAddAttribute={() => openAddAttributeModal(category.id)}
            onEditAttribute={(index) =>
              openEditAttributeModal(category.id, index)
            }
            onDeleteAttribute={(index) =>
              handleDeleteAttribute(category.id, index)
            }
            editingAttributeInfo={editingAttribute}
          />
        ))}
      </div>

      <AddCategoryModal
        show={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSubmit={handleAddCategory}
      />

      <AttributeModal
        isOpen={showAttributeModal}
        categoryId={attributeModalCategoryId}
        attribute={editingAttribute || newAttribute}
        onClose={() => {
          setShowAttributeModal(false);
          setEditingAttribute(null);
          setAttributeModalCategoryId(null);
        }}
        onSave={handleSaveAttributeModal}
        isEditing={!!editingAttribute}
      />
    </div>
  );
}
