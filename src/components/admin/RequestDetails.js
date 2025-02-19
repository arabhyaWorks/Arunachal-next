"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Clock,
  Calendar,
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
} from "lucide-react";

export default function PendingRequests() {
  const [activeTab, setActiveTab] = useState("active");
  const [expiredTab, setExpiredTab] = useState("internal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  // const [pagination, setPagination] = useState({
  //   total: 0,
  //   page: 1,
  //   limit: 10,
  //   total_pages: 0,
  // });
  
  // Static values for demo
  const level = 4; // Static level value
  const user_id = "USER123"; // Static user ID
  
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
  

      const response = await fetch(`/api/content?level=${4}`);
      const result = await response.json(); 

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch requests');
      }

      setRequests(result.data.map((item, index) => ({
        id: item.id,
        serialNo: index + 1,
        requestNumber: `REQ-${item.id}`,
        contentName: item.name.split('-')[1] || '',
        contentType: item.attribute_name.split('-').pop(), // Getting the last part of attribute name
        uploadDate: item.created_at,
        uploadedBy: item.created_by,
        status: item.approval_status,
        requestType: item.associated_table,
        currentLevel: item.current_level,
        committeeId: item.committee_id
      })));

      
      // setPagination({
      //   total: result.pagination.total,
      //   page: result.pagination.page,
      //   limit: result.pagination.limit,
      //   total_pages: result.pagination.total_pages,
      // });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  console.log(requests.contentName)
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewDetails = (requestId) => {
    router.push(`/admin/pending-requests/${requestId}`);
  };

  const filteredRequests = requests.filter((request) => {
    if (activeTab === "active") {
      return request.status === "pending";
    } else {
      return request.status === "archived" && request.requestType === expiredTab;
    }
  });

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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading requests...</p>
        </div>
      ) : (
        <>
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
                      Content Catgeory
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

          {/* Pagination */}
          {/* {pagination.total_pages > 1 && (
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.total_pages}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )} */}

          {/* Empty State */}
          {filteredRequests.length === 0 && !loading && (
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
        </>
      )}
    </div>
  );
}