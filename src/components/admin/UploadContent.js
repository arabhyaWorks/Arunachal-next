"use client"; // Ensures client-side rendering (especially in Next.js 13+ with the App Router)

import { useState } from "react";
// For Next.js Pages Router (<= v12 or pages dir in v13):
import { useRouter } from "next/router";
// If you’re on Next.js 13 App Router, import from "next/navigation" instead
// import { useRouter } from "next/navigation";

import {
  Music2,
  Video,
  BookText,
  Shirt,
  Sparkles,
  Calendar,
  Utensils,
  Hammer,
  Book,
  ScrollText,
  Languages,
  ArrowLeft,
  Upload,
} from "lucide-react";

const contentTypes = [
  {
    id: "folk-music",
    name: "Folk Music",
    icon: Music2,
    description: "Traditional songs and musical performances",
  },
  {
    id: "folk-dance",
    name: "Folk Dance",
    icon: Video,
    description: "Traditional dance performances and ceremonies",
  },
  {
    id: "folk-tales",
    name: "Folk Tales",
    icon: BookText,
    description: "Stories passed down through generations",
  },
  {
    id: "costumes",
    name: "Traditional Costumes",
    icon: Shirt,
    description: "Traditional dress and attire",
  },
  {
    id: "rituals",
    name: "Rituals",
    icon: Sparkles,
    description: "Sacred ceremonies and practices",
  },
  {
    id: "festivals",
    name: "Festivals",
    icon: Calendar,
    description: "Cultural celebrations and events",
  },
  {
    id: "cuisine",
    name: "Cuisine",
    icon: Utensils,
    description: "Traditional food and recipes",
  },
  {
    id: "handicrafts",
    name: "Handicrafts",
    icon: Hammer,
    description: "Traditional arts and crafts",
  },
  {
    id: "books",
    name: "Books",
    icon: Book,
    description: "Published works about culture",
  },
  {
    id: "scripts",
    name: "Scripts",
    icon: ScrollText,
    description: "Traditional writing systems",
  },
  {
    id: "languages",
    name: "Languages",
    icon: Languages,
    description: "Indigenous languages and dialects",
  },
];

export default function UploadContent() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    // Next.js route push (replace or push as needed):
    router.push(`/admin/${typeId}`);
  };

  const handleBack = () => {
    // Go back to admin content page or wherever suits your structure
    router.push("/admin/content");
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Content</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload New Content
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select the type of content you want to upload
          </p>
        </div>

        {/* Content Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-teal-500/10 group-hover:from-blue-500 group-hover:to-teal-500 transition-all">
                  <type.icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {type.name}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {type.description}
              </p>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Start Upload</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}