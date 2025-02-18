"use client"; // Ensures client-side rendering in Next.js (especially if using the App Router)

import { useState, useRef } from "react";
// If you’re on Next.js 12 or the Pages Router, import from "next/router":
import { useRouter } from "next/router";
// (If on Next.js 13 App Router, you'd do: import { useRouter } from "next/navigation";)

import {
  ArrowLeft,
  Upload,
  Video,
  Music2,
  MapPin,
  Shirt,
  Sparkles,
  X,
  Play,
  Pause,
} from "lucide-react";

const tribes = ["Adi", "Apatani", "Galo", "Monpa", "Nyishi", "Tagin", "Tangsa"];
const danceTypes = [
  "Ritualistic",
  "Celebratory",
  "Ceremonial",
  "Harvest",
  "Festival",
  "Wedding",
  "War Dance",
  "Other",
];

export default function FolkDanceUpload() {
  const router = useRouter();
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    tribe: "",
    characters: "",
    danceType: "",
    region: "",
    costumes: "",
    music: "",
    instruments: "",
    steps: "",
    significance: "",
    historicalContext: "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errors, setErrors] = useState({});

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Please upload an image file",
        }));
      }
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreviewUrl(url);
      } else {
        setErrors((prev) => ({
          ...prev,
          video: "Please upload a video file",
        }));
      }
    }
  };

  const toggleVideoPlay = () => {
    if (videoPreviewRef.current) {
      if (isPlaying) {
        videoPreviewRef.current.pause();
      } else {
        videoPreviewRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    const newErrors = {};
    if (!thumbnailPreview) newErrors.thumbnail = "Thumbnail image is required";
    if (!videoFile) newErrors.video = "Video file is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.tribe) newErrors.tribe = "Tribe is required";
    if (!formData.danceType) newErrors.danceType = "Dance type is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form data or call API
    console.log("Form submitted:", {
      ...formData,
      thumbnailPreview,
      videoFile,
    });
    // Next.js navigation
    router.push("/admin/content");
  };

  const handleBack = () => {
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
              Upload Folk Dance
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add new traditional dance content
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Media Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className={`relative aspect-video rounded-xl border-2 border-dashed ${
                  errors.thumbnail
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                } transition-colors cursor-pointer group`}
              >
                {thumbnailPreview ? (
                  <>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnailPreview(null);
                        if (thumbnailInputRef.current) {
                          thumbnailInputRef.current.value = "";
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
                        16:9 aspect ratio recommended
                      </span>
                    </p>
                  </div>
                )}
              </div>
              {errors.thumbnail && (
                <p className="text-sm text-red-500">{errors.thumbnail}</p>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
            </div>

            {/* Video Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Video File <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => !videoFile && videoInputRef.current?.click()}
                className={`relative aspect-video rounded-xl border-2 border-dashed ${
                  errors.video
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                } transition-colors ${
                  !videoFile ? "cursor-pointer" : ""
                } overflow-hidden`}
              >
                {videoPreviewUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoPreviewRef}
                      src={videoPreviewUrl}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={toggleVideoPlay}
                        className="p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-white" />
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                        setVideoPreviewUrl(null);
                        if (videoInputRef.current) {
                          videoInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                      Upload Video
                      <span className="block text-xs mt-1">
                        MP4, WebM up to 100MB
                      </span>
                    </p>
                  </div>
                )}
              </div>
              {errors.video && (
                <p className="text-sm text-red-500">{errors.video}</p>
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>
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
                placeholder="Enter dance title"
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
                Characters Involved
              </label>
              <input
                type="text"
                value={formData.characters}
                onChange={(e) =>
                  setFormData({ ...formData, characters: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter characters involved"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type of Dance <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.danceType}
                onChange={(e) =>
                  setFormData({ ...formData, danceType: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select dance type</option>
                {danceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.danceType && (
                <p className="text-sm text-red-500 mt-1">{errors.danceType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region/Cultural Origin
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter region or cultural origin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Costumes/Attire
              </label>
              <div className="relative">
                <Shirt className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.costumes}
                  onChange={(e) =>
                    setFormData({ ...formData, costumes: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe traditional costumes"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Music
              </label>
              <div className="relative">
                <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.music}
                  onChange={(e) =>
                    setFormData({ ...formData, music: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe accompanying music"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instruments Used
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
          </div>

          {/* Larger Text Areas */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Steps/Choreography
              </label>
              <textarea
                value={formData.steps}
                onChange={(e) =>
                  setFormData({ ...formData, steps: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the dance steps and choreography"
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
                placeholder="Describe the social or cultural significance"
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
              Upload Dance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}