"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import classNames from "classnames";
import ManageRoles from "./ManageRoles";

export default function UserRoles() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showManageRoles, setShowManageRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [blockRemarks, setBlockRemarks] = useState("");
  const [deleteRemarks, setDeleteRemarks] = useState("");
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // newUser state now stores first and last name separately
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "", // will store the role name (e.g., "Director")
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // Validate add user form
  const validateForm = () => {
    let isValid = true;
    const errors = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    };

    if (!newUser.first_name.trim()) {
      errors.first_name = "First name is required";
      isValid = false;
    }
    if (!newUser.last_name.trim()) {
      errors.last_name = "Last name is required";
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email.trim() || !emailRegex.test(newUser.email)) {
      errors.email = "Valid email is required";
      isValid = false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!newUser.phone.trim() || !phoneRegex.test(newUser.phone)) {
      errors.phone = "Valid 10-digit phone number is required";
      isValid = false;
    }
    if (!newUser.role) {
      errors.role = "Role is required";
      isValid = false;
    }
    if (!newUser.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (newUser.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Integrated API call to create a new user?.
  const handleAddUser = async () => {
    if (validateForm()) {
      const payload = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        role_id: newUser.role,
      };

      console.log("Creating user with payload:", payload);

      try {
        const response = await fetch("/api/auth/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to create user");
        }
        // Optionally, if the API returns the created user data, add it to the state.
        // setUsers([...users, data.data]);
        setShowAddUser(false);
        console.log(users)
        fetchUsers();
        setNewUser({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error creating user:", error);
        alert(error instanceof Error ? error.message : "Failed to create user");
      }
    }
  };

  // Open edit modal for a selected user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  // Update user after editing
  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) => (user?.id === selectedUser.id ? selectedUser : user))
      );
      setShowEditUser(false);
      setSelectedUser(null);
    }
  };

  // Open delete confirmation modal
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  // Confirm deletion of a user
  const handleConfirmDelete = () => {
    if (selectedUser && deleteRemarks.trim()) {
      setUsers(users.filter((user) => user?.id !== selectedUser.id));
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      setDeleteRemarks("");
    }
  };

  // Open block/unblock confirmation modal
  const handleBlockUser = (user) => {
    setSelectedUser(user);
    setShowBlockConfirm(true);
  };

  // Confirm block/unblock action
  const confirmBlock = () => {
    if (selectedUser && blockRemarks.trim()) {
      console.log(
        `Block remarks for ${selectedUser.first_name} ${selectedUser.last_name}: ${blockRemarks}`
      );
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: u.status === "active" ? "blocked" : "active" }
            : u
        )
      );
      setShowBlockConfirm(false);
      setSelectedUser(null);
      setBlockRemarks("");
    }
  };

  // Filter users based on selected role and search query
  const filteredUsers = users.filter((user) => {
    const matchesRole =
      selectedRole === "all" || user?.role_name === selectedRole;
    const fullName = `${user?.first_name} ${user?.last_name}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.registration_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      console.log("Users", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Users");
      }
      setUsers(data.data);
    } catch (error) {
      console.error("Fetch Users error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch Users. Please try again."
      );
    }
  };

  // Fetch roles from the API
  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const data = await response.json();
      console.log("Roles", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch Roles");
      }
      setRoles(data.data);
    } catch (error) {
      console.error("Fetch Roles error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to fetch Roles. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users &amp; Roles
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add, edit, and manage user accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddUser(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add New User</span>
          </button>
          <button
            onClick={() => setShowManageRoles(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Shield className="h-5 w-5" />
            <span>Manage Roles</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Registration ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                        {user?.first_name[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.first_name + " " + user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                      {user?.role_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user?.registration_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user?.status === "active" ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-500">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-red-500">{user?.status}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleBlockUser(user)}
                        className={classNames(
                          "p-1 rounded-lg transition-colors",
                          user?.status === "active"
                            ? "hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                            : "hover:bg-green-100 dark:hover:bg-green-900/20 text-green-500"
                        )}
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                      <button
                        onClick={() => console.log("More actions", user)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New User
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.first_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, first_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="Enter first name"
                />
                {formErrors.first_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.last_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, last_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="Enter last name"
                />
                {formErrors.last_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.last_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="Enter phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role<span className="text-red-500">*</span>
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => {
                    setNewUser({ ...newUser, role: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}

                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.role}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={newUser.confirmPassword}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit User
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={selectedUser.first_name}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      first_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={selectedUser.last_name}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      last_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={selectedUser.role_name}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditUser(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete/Block Confirmation Modal */}
      {(showDeleteConfirm || showBlockConfirm) && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {showDeleteConfirm ? "Confirm Deletion" : "Confirm Block/Unblock"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to{" "}
              {showDeleteConfirm
                ? "delete"
                : selectedUser.status === "active"
                  ? "block"
                  : "unblock"}{" "}
              the user "{selectedUser.first_name} {selectedUser.last_name}"?
              {showDeleteConfirm && " This action cannot be undone."}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Remarks<span className="text-red-500">*</span>
              </label>
              <textarea
                value={showDeleteConfirm ? deleteRemarks : blockRemarks}
                onChange={(e) =>
                  showDeleteConfirm
                    ? setDeleteRemarks(e.target.value)
                    : setBlockRemarks(e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder={`Enter remarks for ${
                  showDeleteConfirm ? "deletion" : "blocking/unblocking"
                }`}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  if (showDeleteConfirm) {
                    setShowDeleteConfirm(false);
                  } else {
                    setShowBlockConfirm(false);
                  }
                  setSelectedUser(null);
                  setDeleteRemarks("");
                  setBlockRemarks("");
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showDeleteConfirm ? handleConfirmDelete : confirmBlock}
                disabled={
                  showDeleteConfirm
                    ? !deleteRemarks.trim()
                    : !blockRemarks.trim()
                }
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  showDeleteConfirm
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {showDeleteConfirm ? "Delete" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {showManageRoles && (
        <ManageRoles onClose={() => setShowManageRoles(false)} />
      )}
    </div>
  );
}
