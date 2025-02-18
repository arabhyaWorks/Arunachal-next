"use client"; // Ensures client-side rendering if you're using Next.js 13 App Router

import { useState } from "react";
import { useRouter } from "next/router"; // For Next.js 12 or the Pages Router
// If Next.js 13 App Router, import { useRouter } from "next/navigation";
import {
  Clock,
  Calendar,
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";

// For brevity, we keep the TypeScript interface logic out or convert it to plain JS
const mockRequests = [
  {
    id: "1",
    serialNo: 1,
    requestNumber: "REQ001",
    tribeName: "Adi",
    contentName: "Traditional Harvest Song",
    contentType: "Folk Music",
    uploadDate: "2024-02-15",
    uploadedBy: "John Doe",
    status: "pending",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
    description: "Traditional harvest celebration song of the Adi tribe",
    details: {
      "Tribe(s)": "Adi",
      Title: "Harvest Celebration",
      Variation: "Traditional",
      "Composer/Artist": "Traditional",
      Genre: "Folk",
      Duration: "4:30",
      Instruments: "Drums, Flute",
      Region: "East Siang",
      Significance: "Celebrates harvest season",
      "Historical Context": "Passed down through generations",
    },
  },
  {
    id: "2",
    serialNo: 2,
    requestNumber: "REQ002",
    tribeName: "Apatani",
    contentName: "Festival Dance",
    contentType: "Folk Dance",
    uploadDate: "2024-01-15",
    uploadedBy: "Sarah Smith",
    status: "expired",
    requestType: "creator",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
    description: "Traditional festival dance performance",
    details: {
      "Tribe(s)": "Apatani",
      "Dance Name": "Festival Dance",
      Performers: "8 dancers",
      Duration: "15:00",
      Costumes: "Traditional Apatani attire",
      Music: "Live traditional music",
      Region: "Ziro Valley",
      Significance: "Part of major festival celebrations",
    },
  },
];

export default function PendingRequests() {
  const [activeTab, setActiveTab] = useState("active"); // "active" or "expired"
  const [expiredTab, setExpiredTab] = useState("internal"); // "internal" or "creator"
  const router = useRouter();

  const filteredRequests = mockRequests.filter((request) => {
    if (activeTab === "active") {
      return request.status === "pending";
    } else {
      return (
        request.status === "expired" && request.requestType === expiredTab
      );
    }
  });

  const handleViewDetails = (requestId) => {
    // Navigate to a dynamic route page in Next.js
    // e.g. pages/admin/pending-requests/[requestId].jsx
    router.push(`/admin/pending-requests/${requestId}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pending Requests
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage content approval requests
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "active"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Active Requests
            </button>
            <button
              onClick={() => setActiveTab("expired")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "expired"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Expired Requests
            </button>
          </nav>
        </div>

        {activeTab === "expired" && (
          <div className="flex gap-4">
            <button
              onClick={() => setExpiredTab("internal")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                expiredTab === "internal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Internal Requests
            </button>
            <button
              onClick={() => setExpiredTab("creator")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                expiredTab === "creator"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Creator Requests
            </button>
          </div>
        )}
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Serial No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Request Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tribe Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {request.serialNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {request.requestNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {request.tribeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {request.contentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                      {request.contentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(request.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {request.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(request.id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 justify-end"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No requests found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === "active"
              ? "There are no active requests at the moment"
              : `There are no expired ${expiredTab} requests`}
          </p>
        </div>
      )}
    </div>
  );
}