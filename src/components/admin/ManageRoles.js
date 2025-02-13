"use client";

import { useState } from "react";
import {
  Shield,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
  Lock,
  Settings,
} from "lucide-react";
import classNames from "classnames";

// Sample default roles data
const defaultRoles = [
  {
    id: "1",
    name: "Admin (Director)",
    privileges: { view: true, edit: true, delete: true, upload: true },
    scope: "all",
  },
  {
    id: "2",
    name: "Deputy Director",
    privileges: { view: true, edit: false, delete: false, upload: false },
    scope: "all",
  },
  {
    id: "3",
    name: "Assistant Director",
    privileges: { view: true, edit: false, delete: false, upload: false },
    scope: "all",
  },
  {
    id: "4",
    name: "CBO Member",
    privileges: { view: true, edit: false, delete: false, upload: false },
    scope: "all",
  },
  {
    id: "5",
    name: "CMS Manager",
    privileges: { view: true, edit: true, delete: true, upload: true },
    scope: "all",
  },
  {
    id: "6",
    name: "Content Creator",
    privileges: { view: true, edit: true, delete: true, upload: true },
    scope: "own",
  },
  {
    id: "7",
    name: "Artist",
    privileges: { view: true, edit: true, delete: true, upload: true },
    scope: "own",
  },
  {
    id: "8",
    name: "Guest Public User",
    privileges: { view: true, edit: false, delete: false, upload: false },
    scope: "all",
  },
];

export default function ManageRoles({ onClose }) {
  const [roles, setRoles] = useState(defaultRoles);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);

  // Toggle selection of a role by its ID
  const handleRoleSelect = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  // Start editing a role by creating a shallow copy
  const handleEditRole = (role) => {
    setEditingRole({ ...role });
  };

  // Save changes to the currently edited role
  const handleSaveRole = () => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRole.id ? editingRole : role
        )
      );
      setEditingRole(null);
    }
  };

  // Delete the roles that are currently selected
  const handleDeleteSelected = () => {
    setRoles((prev) => prev.filter((role) => !selectedRoles.includes(role.id)));
    setSelectedRoles([]);
    setShowDeleteConfirm(false);
  };

  // Add a new role using the provided role name
  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newRole = {
        id: Date.now().toString(),
        name: newRoleName.trim(),
        privileges: { view: true, edit: false, delete: false, upload: false },
        scope: "all",
      };
      setRoles((prev) => [...prev, newRole]);
      setNewRoleName("");
      setShowAddRole(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Manage Roles
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure user roles and permissions
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddRole(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Role</span>
            </button>
          </div>
        </div>

        {/* Role List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleSelect(role.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    {editingRole && editingRole.id === role.id ? (
                      <input
                        type="text"
                        value={editingRole.name}
                        onChange={(e) =>
                          setEditingRole({ ...editingRole, name: e.target.value })
                        }
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded"
                      />
                    ) : (
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {role.name}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingRole && editingRole.id === role.id ? (
                      <>
                        <button
                          onClick={handleSaveRole}
                          className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditRole(role)}
                        className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Privileges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(role.privileges).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            editingRole && editingRole.id === role.id
                              ? editingRole.privileges[key]
                              : value
                          }
                          onChange={(e) => {
                            if (editingRole && editingRole.id === role.id) {
                              setEditingRole({
                                ...editingRole,
                                privileges: {
                                  ...editingRole.privileges,
                                  [key]: e.target.checked,
                                },
                              });
                            }
                          }}
                          disabled={!editingRole || editingRole.id !== role.id}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                          {key}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Scope */}
                <div className="mt-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Access Scope: {role.scope === "all" ? "All Content" : "Own Content"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={selectedRoles.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-5 w-5" />
                <span>Delete Selected</span>
              </button>
            </div>
            <button
              onClick={() => onClose()}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the selected roles? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Role
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="Enter role name"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddRole(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                disabled={!newRoleName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}