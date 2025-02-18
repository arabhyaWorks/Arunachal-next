"use client"; // Ensure this is a client component (esp. in Next.js 13 App Router)

import { useState, useRef } from "react";
// In Next.js 12 or pages directory (v13), import from next/router:
import { useRouter } from "next/router"; 
// If you're using the Next.js 13 App Router, import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Upload,
  Music2,
  Clock,
  Info,
  X
} from "lucide-react";

// Sample tribes & genres data
const tribes = ["Adi", "Apatani", "Galo", "Monpa", "Nyishi", "Tagin", "Tangsa"];
const genres = [
  "Ballad",
  "Lullaby",
  "Wedding Song",
  "Harvest Song",
  "Festival Song",
  "Prayer Song",
  "Other",
];

export default function FolkMusicUpload() {
  const router = useRouter(); // Replaces useNavigate from react-router-dom
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    tribe: "",
    variation: "",
    composer: "",
    genre: "",
    duration: "",
    instruments: "",
    region: "",
    significance: "",
    historicalContext: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file",
        }));
      }
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        setAudioFile(file);
      } else {
        setErrors((prev) => ({
          ...prev,
          audio: "Please upload an audio file",
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    const newErrors = {};
    if (!imagePreview) newErrors.image = "Thumbnail image is required";
    if (!audioFile) newErrors.audio = "Audio file is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.tribe) newErrors.tribe = "Tribe is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (!formData.duration) newErrors.duration = "Duration is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data logic
    console.log("Form submitted:", { ...formData, imagePreview, audioFile });
    // Use Next.js router instead of navigate:
    router.push("/admin/content");
  };

  const handleBack = () => {
    // Replace with desired route
    router.push("/admin/upload");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Folk Music
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add new traditional music content
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Thumbnail Image <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square w-48 rounded-xl border-2 border-dashed ${
                errors.image
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              } transition-colors cursor-pointer group`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                    Upload Thumbnail
                    <span className="block text-xs mt-1">
                      1:1 aspect ratio recommended
                    </span>
                  </p>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Audio Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Audio File <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => audioInputRef.current?.click()}
              className={`relative p-4 rounded-xl border-2 border-dashed ${
                errors.audio
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              } transition-colors cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <Music2 className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  {audioFile ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {audioFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAudioFile(null);
                          if (audioInputRef.current) {
                            audioInputRef.current.value = "";
                          }
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload audio file
                      </p>
                      <p className="text-xs text-gray-400">
                        MP3, WAV up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {errors.audio && (
              <p className="text-sm text-red-500">{errors.audio}</p>
            )}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter music title"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tribe <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tribe}
                onChange={(e) =>
                  setFormData({ ...formData, tribe: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select tribe</option>
                {tribes.map((tribe) => (
                  <option key={tribe} value={tribe}>
                    {tribe}
                  </option>
                ))}
              </select>
              {errors.tribe && (
                <p className="text-sm text-red-500 mt-1">{errors.tribe}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Variation
              </label>
              <input
                type="text"
                value={formData.variation}
                onChange={(e) =>
                  setFormData({ ...formData, variation: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter variation if any"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Composer/Artist/Performer (comma-separated)
              </label>
              <input
                type="text"
                value={formData.composer}
                onChange={(e) =>
                  setFormData({ ...formData, composer: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter composer or performer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Genre (comma-separated) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="text-sm text-red-500 mt-1">{errors.genre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 4:30"
                />
              </div>
              {errors.duration && (
                <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instruments Used (comma-separated)
              </label>
              <input
                type="text"
                value={formData.instruments}
                onChange={(e) =>
                  setFormData({ ...formData, instruments: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter instruments used"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region/Cultural Origin
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter region or cultural origin"
              />
            </div>
          </div>

          {/* Larger Text Areas */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.significance}
                onChange={(e) =>
                  setFormData({ ...formData, significance: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Write the description for the music"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Social or Cultural Significance
              </label>
              <textarea
                value={formData.significance}
                onChange={(e) =>
                  setFormData({ ...formData, significance: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the social or cultural significance of this music"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Historical/Religious Context
              </label>
              <textarea
                value={formData.historicalContext}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    historicalContext: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the historical or religious context"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/content/upload")}
              className="px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
            >
              Upload Music
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}