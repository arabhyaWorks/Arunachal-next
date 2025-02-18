"use client"; // Ensure client-side if using Next.js 13 App Router

import { useState } from "react";
// In Next.js (Pages Router):
import { useRouter } from "next/router";
// If using Next.js 13 App Router: import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";
// import MusicPlayerScreen from "../MusicPlayerScreen"; // Adjust path as needed

// Mock data for demonstration
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
  // ...
];

// Example approval steps
const approvalSteps = [
  { level: "Upload Date", status: "approved", date: "2024-02-15" },
  { level: "CBO Manager 2", status: "approved", date: "2024-02-16" },
  { level: "CBO Manager 1", status: "approved", date: "2024-02-17" },
  { level: "Deputy Director", status: "pending" },
  { level: "Director", status: "pending" },
];

export default function RequestDetailsPage() {
  const router = useRouter();
  const { requestId } = router.query; // dynamic param from [requestId].jsx
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Find the request in mock data (or fetch from API)
  const request = mockRequests.find((r) => r.id === requestId);

  if (!request) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Request not found
          </h3>
          <button
            onClick={() => router.push("/admin/pending-requests")}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go back to requests
          </button>
        </div>
      </div>
    );
  }

  const daysPassed = Math.floor(
    (Date.now() - new Date(request.uploadDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleApprove = () => {
    console.log("Approved request:", request.id);
    // For example, push to listing page
    router.push("/admin/pending-requests");
  };

  const handleReject = () => {
    if (!rejectRemarks.trim()) return;
    console.log("Rejected request:", request.id, "Remarks:", rejectRemarks);
    setShowRejectModal(false);
    router.push("/admin/pending-requests");
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/pending-requests")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Request Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Request Number: {request.requestNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative aspect-video w-48 rounded-lg overflow-hidden">
                  <img
                    src={request.thumbnail}
                    alt={request.contentName}
                    className="w-full h-full object-cover"
                  />
                  {request.contentType === "Folk Music" && (
                    <button
                      onClick={() => setShowMusicPlayer(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <span className="sr-only">Play Music</span>
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" />
                      </div>
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {request.contentName}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Type: {request.contentType}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Tribe: {request.tribeName}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Uploaded on{" "}
                        {new Date(request.uploadDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">
                        •
                      </span>
                      <Clock className="h-4 w-4" />
                      <span>{daysPassed} days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {request.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(request.details).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {key}
                    </p>
                    <p className="text-gray-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Approval Status */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Approval Status
              </h3>

              <div className="space-y-6">
                {approvalSteps.map((step, index) => (
                  <div key={step.level} className="relative">
                    {index !== approvalSteps.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${
                            step.status === "approved"
                              ? "bg-green-100 dark:bg-green-900/20"
                              : step.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/20"
                              : "bg-gray-100 dark:bg-gray-800"
                          }
                        `}
                      >
                        {step.status === "approved" && (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        {step.status === "rejected" && (
                          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        {step.status === "pending" && (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {step.level}
                        </p>
                        {step.date && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(step.date).toLocaleDateString()}
                          </p>
                        )}
                        {step.remarks && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Remarks: {step.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Reject Request
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Please provide a reason for rejecting this request.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <textarea
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter rejection remarks..."
                />
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleReject}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Music Player */}
      {showMusicPlayer && request.contentType === "Folk Music" && (
        <MusicPlayerScreen
          song={{
            "Music Name": request.contentName,
            "Thumb Image Link": request.thumbnail || "",
            "Singer Name": request.details["Composer/Artist"] || "Traditional",
            "Tribe Name": request.tribeName,
            "Duration": request.details["Duration"] || "0:00",
            "Music Link":
              "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81236KONGKU_RAYO_DANCE_OF_ADI.mp3",
            Category: "Folk",
          }}
          isOpen={showMusicPlayer}
          onClose={() => setShowMusicPlayer(false)}
        />
      )}
    </div>
  );
}