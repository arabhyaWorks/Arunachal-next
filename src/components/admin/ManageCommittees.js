"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import classNames from "classnames";

const tribes = [
  "Adi",
  "Apatani",
  "Galo",
  "Monpa",
  "Nyishi",
  "Tagin",
  "Tangsa",
];

const availableMembers = [
  { id: "1", name: "Director", role: "Director", isPermanent: true },
  { id: "2", name: "Deputy Director", role: "Deputy Director", isPermanent: true },
  { id: "3", name: "Assistant Director", role: "Assistant Director", isPermanent: true },
  { id: "4", name: "CBO Member 1", role: "CBO Member", isPermanent: false },
  { id: "5", name: "CBO Member 2", role: "CBO Member", isPermanent: false },
  { id: "6", name: "Content Manager", role: "Content Manager", isPermanent: false },
  { id: "7", name: "Cultural Expert", role: "Cultural Expert", isPermanent: false },
];

const defaultCommittees = [
  {
    id: "1",
    name: "Approval Committee for Tribe Adi",
    tribe: "Adi",
    purpose: "Approve contents for Tribe Adi",
    hierarchy: 1,
    members: [
      { id: "1", name: "Director", role: "Director", isPermanent: true },
      { id: "2", name: "Deputy Director", role: "Deputy Director", isPermanent: true },
      { id: "3", name: "Assistant Director", role: "Assistant Director", isPermanent: true },
      { id: "4", name: "CBO Member 1", role: "CBO Member", isPermanent: false },
      { id: "5", name: "CBO Member 2", role: "CBO Member", isPermanent: false },
    ],
  },
  {
    id: "2",
    name: "Expert Committee for RRP",
    tribe: "All",
    purpose: "Select artists to be rewarded",
    hierarchy: 2,
    members: [
      { id: "1", name: "Director", role: "Director", isPermanent: true },
      { id: "2", name: "Deputy Director", role: "Deputy Director", isPermanent: true },
      { id: "3", name: "Assistant Director", role: "Assistant Director", isPermanent: true },
    ],
  },
];

export default function ManageCommittees() {
  const [committees, setCommittees] = useState(defaultCommittees);
  const [selectedCommittees, setSelectedCommittees] = useState([]);
  const [showAddCommittee, setShowAddCommittee] = useState(false);
  const [showEditCommittee, setShowEditCommittee] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedCommittee, setExpandedCommittee] = useState(null);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [newCommittee, setNewCommittee] = useState({
    name: "",
    tribe: "",
    purpose: "",
    members: [],
    hierarchy: 1,
  });

  const handleCommitteeSelect = (committeeId) => {
    setSelectedCommittees((prev) =>
      prev.includes(committeeId)
        ? prev.filter((id) => id !== committeeId)
        : [...prev, committeeId]
    );
  };

  const handleAddCommittee = () => {
    if (newCommittee.name.trim() && newCommittee.purpose.trim()) {
      const committee = {
        id: Date.now().toString(),
        ...newCommittee,
      };
      setCommittees([...committees, committee]);
      setShowAddCommittee(false);
      setNewCommittee({
        name: "",
        tribe: "",
        purpose: "",
        members: [],
        hierarchy: 1,
      });
    }
  };

  const handleDuplicateCommittee = (committee) => {
    const newCommitteeData = {
      ...committee,
      id: Date.now().toString(),
      name: `${committee.name} (Copy)`,
      members: [...committee.members],
    };
    setCommittees([...committees, newCommitteeData]);
  };

  const handleEditCommittee = (committee) => {
    setEditingCommittee(committee);
    setShowEditCommittee(true);
  };

  const handleUpdateCommittee = () => {
    if (editingCommittee) {
      setCommittees((prev) =>
        prev.map((committee) =>
          committee.id === editingCommittee.id ? editingCommittee : committee
        )
      );
      setShowEditCommittee(false);
      setEditingCommittee(null);
    }
  };

  const handleDeleteCommittees = () => {
    setCommittees((prev) =>
      prev.filter((committee) => !selectedCommittees.includes(committee.id))
    );
    setSelectedCommittees([]);
    setShowDeleteConfirm(false);
  };

  const filteredCommittees = committees.filter(
    (committee) =>
      committee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      committee.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Committees
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and manage approval committees
          </p>
        </div>
        <button
          onClick={() => setShowAddCommittee(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all shadow-md hover:shadow-lg text-base font-medium"
          aria-label="Create New Committee"
        >
          <Plus className="h-5 w-5" />
          <span>Create Committee</span>
        </button>
      </div>

      {/* Search and Actions */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search committees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              aria-label="Search committees"
            />
          </div>
          {selectedCommittees.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-medium"
              aria-label={`Delete ${selectedCommittees.length} selected committees`}
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete Selected ({selectedCommittees.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Committees List */}
      <div className="space-y-6">
        {filteredCommittees.map((committee) => (
          <div
            key={committee.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500"
          >
            <div
              className="p-6 flex items-center gap-4 cursor-pointer"
              onClick={() =>
                setExpandedCommittee(
                  expandedCommittee === committee.id ? null : committee.id
                )
              }
              role="button"
              tabIndex={0}
              aria-expanded={expandedCommittee === committee.id}
              aria-controls={`committee-details-${committee.id}`}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setExpandedCommittee(
                    expandedCommittee === committee.id ? null : committee.id
                  );
                }
              }}
            >
              <input
                type="checkbox"
                checked={selectedCommittees.includes(committee.id)}
                onChange={() => handleCommitteeSelect(committee.id)}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                aria-label={`Select ${committee.name}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {committee.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {committee.purpose}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateCommittee(committee);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500"
                  aria-label={`Duplicate ${committee.name}`}
                >
                  <Copy className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCommittee(committee);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500"
                  aria-label={`Edit ${committee.name}`}
                >
                  <Edit className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                {expandedCommittee === committee.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Committee Details */}
            {expandedCommittee === committee.id && (
              <div
                id={`committee-details-${committee.id}`}
                className="border-t border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Committee Members
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {committee.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white font-semibold">
                            {member.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {member.role}
                              {member.isPermanent && " (Permanent)"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hierarchy Level
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm">
                        Level {committee.hierarchy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCommittees.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No committees found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "No committees match your search criteria"
              : "Start by creating a new committee"}
          </p>
        </div>
      )}

      {/* Add Committee Modal */}
      {showAddCommittee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Committee
              </h3>
              <button
                onClick={() => setShowAddCommittee(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Committee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCommittee.name}
                  onChange={(e) =>
                    setNewCommittee({ ...newCommittee, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="e.g., Approval Committee for Tribe Adi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Associated Tribe <span className="text-red-500">*</span>
                </label>
                <select
                  value={newCommittee.tribe}
                  onChange={(e) =>
                    setNewCommittee({
                      ...newCommittee,
                      name: `Approval Committee for Tribe ${e.target.value}`,
                      tribe: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="">Select a tribe</option>
                  <option value="All">All Tribes</option>
                  {tribes.map((tribe) => (
                    <option key={tribe} value={tribe}>
                      {tribe}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newCommittee.purpose}
                  onChange={(e) =>
                    setNewCommittee({ ...newCommittee, purpose: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base resize-none"
                  placeholder="e.g., Approve contents for Tribe Adi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Committee Members <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  {/* Permanent Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Permanent Members
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableMembers
                        .filter((member) => member.isPermanent)
                        .map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white text-lg font-semibold">
                              {member.name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Additional (Optional) Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Additional Members
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableMembers
                        .filter((member) => !member.isPermanent)
                        .map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-colors"
                            onClick={() => {
                              const isSelected = newCommittee.members.some(
                                (m) => m.id === member.id
                              );
                              setNewCommittee({
                                ...newCommittee,
                                members: isSelected
                                  ? newCommittee.members.filter((m) => m.id !== member.id)
                                  : [...newCommittee.members, member],
                              });
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={newCommittee.members.some((m) => m.id === member.id)}
                              onChange={() => {}}
                              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white text-lg font-semibold">
                              {member.name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hierarchy Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={newCommittee.hierarchy}
                  onChange={(e) =>
                    setNewCommittee({
                      ...newCommittee,
                      hierarchy: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base"
                  placeholder="Enter hierarchy level (1 being highest)"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAddCommittee(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCommittee}
                  disabled={
                    !newCommittee.name.trim() ||
                    !newCommittee.purpose.trim() ||
                    !newCommittee.tribe ||
                    newCommittee.members.length === 0
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-base font-medium"
                >
                  Create Committee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Committee Modal */}
      {showEditCommittee && editingCommittee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Committee
              </h3>
              <button
                onClick={() => setShowEditCommittee(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Committee Name
                </label>
                <input
                  type="text"
                  value={editingCommittee.name}
                  onChange={(e) =>
                    setEditingCommittee({
                      ...editingCommittee,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <textarea
                  value={editingCommittee.purpose}
                  onChange={(e) =>
                    setEditingCommittee({
                      ...editingCommittee,
                      purpose: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hierarchy Level
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingCommittee.hierarchy}
                  onChange={(e) =>
                    setEditingCommittee({
                      ...editingCommittee,
                      hierarchy: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowEditCommittee(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCommittee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delete Committees
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete {selectedCommittees.length}{" "}
              {selectedCommittees.length === 1 ? "committee" : "committees"}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCommittees}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}