"use client";

import { useState } from "react";
import {
  Music,
  Video,
  BookText,
  Utensils,
  Hammer,
  Book,
  Filter,
  Search,
  Eye,
  Calendar,
  Clock,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import classNames from "classnames";

const mockContent = [
  {
    id: "1",
    type: "music",
    contentType: "Folk Music",
    title: "Traditional Folk Song",
    tribe: "Adi",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
    uploadedBy: "John Doe",
    uploadDate: "2024-02-10",
    approvalDate: "2024-02-11",
    status: "approved",
    details: {
      genre: "Folk",
      duration: "4:30",
      composer: "Traditional",
      instruments: "Flute, Drums",
      significance: "Harvest celebration song",
    },
  },
  {
    id: "2",
    type: "folk-dance",
    contentType: "Folk Dance",
    title: "Ceremonial Dance",
    tribe: "Apatani",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
    uploadedBy: "Sarah Smith",
    uploadDate: "2024-02-12",
    status: "pending",
    details: {
      characters: "4 dancers",
      type: "Ceremonial",
      costumes: "Traditional attire",
      music: "Live instrumental",
      significance: "Wedding ceremony dance",
    },
  },
  {
    id: "3",
    type: "handicraft",
    contentType: "Handicraft",
    title: "Traditional Weaving",
    tribe: "Monpa",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/Monpa1.jpg",
    uploadedBy: "Mike Johnson",
    uploadDate: "2024-02-09",
    status: "blocked",
    blockReason: "Content quality does not meet standards",
    details: {
      materials: "Cotton, Natural dyes",
      technique: "Traditional loom weaving",
      purpose: "Ceremonial dress making",
      significance: "Ancient weaving patterns",
    },
  },
  {
    id: "4",
    type: "video",
    contentType: "Video",
    title: "Festival Celebration",
    tribe: "Nyishi",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/nyishi1.jpg",
    uploadedBy: "David Wilson",
    uploadDate: "2024-02-08",
    status: "pending",
    details: {
      duration: "15:30",
      event: "Annual Festival",
      location: "Lower Subansiri",
      participants: "200+",
    },
  },
  {
    id: "5",
    type: "folk-tale",
    contentType: "Folk Tale",
    title: "Legend of the Mountains",
    tribe: "Galo",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/galo1.jpg",
    uploadedBy: "Emma Thompson",
    uploadDate: "2024-02-07",
    approvalDate: "2024-02-08",
    status: "approved",
    details: {
      duration: "Long Form",
      theme: "Creation Myth",
      narrator: "Village Elder",
      significance: "Origin Story",
    },
  },
  {
    id: "6",
    type: "recipe",
    contentType: "Recipe",
    title: "Traditional Bamboo Dish",
    tribe: "Tangsa",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/tangsa1.jpg",
    uploadedBy: "Lisa Chen",
    uploadDate: "2024-02-06",
    status: "pending",
    details: {
      ingredients: "Bamboo shoots, herbs",
      cookingTime: "45 minutes",
      difficulty: "Medium",
      servings: "4-6",
    },
  },
  {
    id: "7",
    type: "music",
    contentType: "Folk Music",
    title: "Harvest Celebration Song",
    tribe: "Tagin",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/tagin1.jpg",
    uploadedBy: "Robert Brown",
    uploadDate: "2024-02-05",
    approvalDate: "2024-02-06",
    status: "approved",
    details: {
      genre: "Traditional",
      duration: "5:45",
      instruments: "Drums, Flute",
      occasion: "Harvest Festival",
    },
  },
  {
    id: "8",
    type: "book",
    contentType: "Book",
    title: "Tribal Art Forms",
    tribe: "Multiple",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/Monpa1.jpg",
    uploadedBy: "Prof. James Wilson",
    uploadDate: "2024-02-04",
    status: "pending",
    details: {
      pages: "245",
      language: "English",
      publisher: "Cultural Press",
      year: "2024",
    },
  },
  {
    id: "9",
    type: "handicraft",
    contentType: "Handicraft",
    title: "Traditional Jewelry Making",
    tribe: "Apatani",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
    uploadedBy: "Sarah Lee",
    uploadDate: "2024-02-03",
    status: "blocked",
    blockReason: "Incomplete documentation",
    details: {
      materials: "Silver, Beads",
      technique: "Traditional",
      purpose: "Ceremonial",
      significance: "Cultural Identity",
    },
  },
  {
    id: "10",
    type: "video",
    contentType: "Video",
    title: "Dance Performance",
    tribe: "Nocte",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/nocte1.jpg",
    uploadedBy: "Michael Chang",
    uploadDate: "2024-02-02",
    approvalDate: "2024-02-03",
    status: "approved",
    details: {
      duration: "12:20",
      event: "Cultural Festival",
      location: "Tirap",
      participants: "15 dancers",
    },
  },
];

const contentTypes = [
  { id: "all", label: "All Content", icon: Eye },
  { id: "music", label: "Folk Music", icon: Music },
  { id: "video", label: "Videos", icon: Video },
  { id: "folk-tale", label: "Folk Tales", icon: BookText },
  { id: "folk-dance", label: "Folk Dance", icon: Music },
  { id: "recipe", label: "Recipes", icon: Utensils },
  { id: "handicraft", label: "Handicrafts", icon: Hammer },
  { id: "book", label: "Books", icon: Book },
];

const tribesList = [
  "All Tribes",
  "Adi",
  "Apatani",
  "Galo",
  "Monpa",
  "Nyishi",
  "Tagin",
  "Tangsa",
];

export default function ManageContent() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTribe, setSelectedTribe] = useState("All Tribes");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortField, setSortField] = useState("uploadDate");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter and sort content based on current criteria.
  const filteredContent = mockContent
    .filter((content) => {
      const matchesType = selectedType === "all" || content.type === selectedType;
      const matchesTribe =
        selectedTribe === "All Tribes" || content.tribe === selectedTribe;
      const matchesStatus =
        selectedStatus === "all" || content.status === selectedStatus;
      const matchesSearch =
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tribe.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesTribe && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "uploadDate":
          return (
            direction *
            (new Date(b.uploadDate).getTime() -
              new Date(a.uploadDate).getTime())
          );
        case "title":
          return direction * a.title.localeCompare(b.title);
        case "tribe":
          return direction * a.tribe.localeCompare(b.tribe);
        case "status":
          return direction * a.status.localeCompare(b.status);
        case "contentType":
          return direction * a.contentType.localeCompare(b.contentType);
        case "approvalDate":
          if (!a.approvalDate) return 1;
          if (!b.approvalDate) return -1;
          return (
            direction *
            (new Date(b.approvalDate).getTime() -
              new Date(a.approvalDate).getTime())
          );
        default:
          return 0;
      }
    });

  const handleBlock = () => {
    if (selectedContent && blockReason.trim()) {
      // Normally, an API call would be made here to block the content.
      console.log(
        `Blocking content ${selectedContent.id} with reason: ${blockReason}`
      );
      setShowBlockDialog(false);
      setSelectedContent(null);
      setBlockReason("");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map((item) => item.id));
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions (approve or block) as needed.
    console.log(`Bulk ${action} for items:`, selectedItems);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "blocked":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "pending":
        return Clock;
      case "blocked":
        return X;
      default:
        return AlertTriangle;
    }
  };

  return (
    <div className="p-6">
      {/* Filters, search inputs, and bulk action controls can be added here */}

      {/* Main content table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredContent.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                </th>
                <th className="px-4 py-3">
                  <button
                    onClick={() => handleSort("contentType")}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Content Type
                    {sortField === "contentType" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Title
                    {sortField === "title" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                {/* Additional table header columns (e.g., tribe, status, etc.) can be added here */}
                <th className="px-4 py-3">
                  <button
                    onClick={() => handleSort("uploadDate")}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Upload Date
                    {sortField === "uploadDate" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button
                    onClick={() => handleSort("approvalDate")}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Approval Date
                    {sortField === "approvalDate" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                {/* Actions column */}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContent.map((content) => {
                const StatusIcon = getStatusIcon(content.status);
                return (
                  <tr
                    key={content.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(content.id)}
                        onChange={() => handleSelectItem(content.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {content.contentType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={content.thumbnail}
                          alt={content.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {content.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            By: {content.uploadedBy}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(content.uploadDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {content.approvalDate
                          ? new Date(content.approvalDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedContent(content);
                            setShowDetailsDialog(true);
                          }}
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          View
                        </button>
                        {content.status === "pending" && (
                          <button
                            className="px-2 py-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                          >
                            Approve
                          </button>
                        )}
                        {content.status !== "blocked" && (
                          <button
                            onClick={() => {
                              setSelectedContent(content);
                              setShowBlockDialog(true);
                            }}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    
    </div>
  );
}