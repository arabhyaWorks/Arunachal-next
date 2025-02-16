import { useState, useRef } from "react";
import { Image as ImageIcon, Plus, X, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateTribeForm({ setShowAddTribe }) {
  const [formFields, setFormFields] = useState([
    {
      name: "tribeName",
      type: "text",
      value: "",
      label: "Tribe Name",
      required: true,
    },
    {
      name: "description",
      type: "text",
      value: "",
      label: "Description about the tribe",
      required: true,
    },
    {
      name: "history",
      type: "text",
      value: "",
      label: "Historical information of tribe",
      required: true,
    },
    {
      name: "regions",
      type: "array",
      value: [""],
      label: "Regions of the tribe",
      required: true,
    },
    {
      name: "population",
      type: "text",
      value: "",
      label: "Population of the tribe",
      required: true,
    },
    {
      name: "settlements",
      type: "text",
      value: "",
      label: "Settlements of the tribe",
      required: true,
    },
    {
      name: "language",
      type: "text",
      value: "",
      label: "Language of the tribe",
      required: true,
    },
    {
      name: "traditionalDresses",
      type: "array",
      value: [""],
      label: "Traditional dresses of the tribe",
      required: true,
    },
    {
      name: "artsAndCrafts",
      type: "array",
      value: [""],
      label: "Arts & Crafts of the tribe",
      required: true,
    },
    {
      name: "cuisine",
      type: "array",
      value: [""],
      label: "Traditional Cuisine of the tribe",
      required: true,
    },
    {
      name: "bannerImage",
      type: "image",
      value: "",
      label: "Banner Image (1519 x 369 px)",
      required: true,
    },
    {
      name: "thumbnailImage",
      type: "image",
      value: "",
      label: "Thumbnail Image (1:1)",
      required: true,
    },
    {
      name: "images",
      type: "array",
      value: [""],
      label: "Images of the tribe",
      required: true,
    },
  ]);

  // Previews for banner and thumbnail
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleTextChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;
    setFormFields(updatedFields);
  };

  const handleArrayChange = (fieldIndex, itemIndex, value) => {
    const updatedFields = [...formFields];
    const arrayField = updatedFields[fieldIndex];
    if (Array.isArray(arrayField.value)) {
      arrayField.value[itemIndex] = value;
      setFormFields(updatedFields);
    }
  };

  const addArrayItem = (fieldIndex) => {
    const updatedFields = [...formFields];
    const arrayField = updatedFields[fieldIndex];
    if (Array.isArray(arrayField.value)) {
      arrayField.value.push("");
      setFormFields(updatedFields);
    }
  };

  const removeArrayItem = (fieldIndex, itemIndex) => {
    const updatedFields = [...formFields];
    const arrayField = updatedFields[fieldIndex];
    if (Array.isArray(arrayField.value) && arrayField.value.length > 1) {
      arrayField.value.splice(itemIndex, 1);
      setFormFields(updatedFields);
    }
  };

  // Updated handleImageUpload to accept a fieldName instead of fieldIndex
  const handleImageUpload = (fieldName, files) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Find the field index in formFields
      const updatedFields = [...formFields];
      const fieldIndex = updatedFields.findIndex((f) => f.name === fieldName);
      if (fieldIndex === -1) return;

      // Set the base64 data as the field value
      updatedFields[fieldIndex].value = reader.result;
      setFormFields(updatedFields);

      // Also update preview if banner or thumbnail
      if (fieldName === "bannerImage") {
        setBannerPreview(reader.result);
      } else if (fieldName === "thumbnailImage") {
        setThumbnailPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formFields);
  };

  const renderField = (field, index) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleTextChange(index, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          </div>
        );

      case "array":
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {Array.isArray(field.value) &&
              field.value.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange(index, itemIndex, e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={field.required}
                  />
                  {field.value.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, itemIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            <button
              type="button"
              onClick={() => addArrayItem(index)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add {field.label}</span>
            </button>
          </div>
        );

      case "image":
        // For reference if you want a direct in-form image field
        // (But banner/thumbnail are handled separately below)
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {/* Add your custom image logic here if needed */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto relative"
    >
      {/* Thumbnail Image Upload */}
      <div className="mb-8">
        <div className="relative w-48 h-48 mx-auto">
          <div
            className="w-full h-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors overflow-hidden group cursor-pointer"
            onClick={() => thumbnailInputRef.current?.click()}
          >
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                  Upload Thumbnail Image
                  <span className="block text-xs text-red-500 mt-1">
                    1:1 aspect ratio, max 2MB
                  </span>
                </p>
              </div>
            )}
          </div>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleImageUpload("thumbnailImage", e.target.files)
            }
          />
        </div>
      </div>

      {/* Dynamic Fields */}
      {formFields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {renderField(field, index)}
        </motion.div>
      ))}

      {/* Banner Image Upload */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Banner Image
          <span className="text-red-500 ml-1">*</span>
          <span className="text-xs text-red-500 ml-2">
            (1519 x 369 px, max 2MB)
          </span>
        </label>
        <div
          className="aspect-[1519/369] relative rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors overflow-hidden group cursor-pointer"
          onClick={() => bannerInputRef.current?.click()}
        >
          {bannerPreview ? (
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload Banner Image
              </p>
            </div>
          )}
        </div>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload("bannerImage", e.target.files)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setShowAddTribe(false)}
          className="px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Tribe
        </button>
      </div>
    </form>
  );
}
