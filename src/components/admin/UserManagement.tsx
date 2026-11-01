"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Lock,
  Mail,
  User,
  MapPin,
  X,
  Key,
  Eye,
  EyeOff,
  Filter,
  Check,
  ShieldCheck,
} from "lucide-react";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  location?: string | null;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    submissions: number;
    comments: number;
    articles: number;
  };
}

interface UserManagementProps {
  initialUsers: ManagedUser[];
  currentUserId: string;
  currentUserRole: string;
}

const ROLES = [
  {
    key: "SUPERADMIN",
    label: "Super Admin",
    icon: "🛡️",
    desc: "Full root access, RBAC governance, master system configuration",
    badgeClass: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 border-red-300 dark:border-red-800",
  },
  {
    key: "ADMIN",
    label: "Admin",
    icon: "👑",
    desc: "Portal administration, user management, category and comment governance",
    badgeClass: "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800",
  },
  {
    key: "EDITOR",
    label: "Editor",
    icon: "✍️",
    desc: "Review submissions, edit articles, schedule and publish news",
    badgeClass: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800",
  },
  {
    key: "REPORTER",
    label: "Reporter",
    icon: "🎙️",
    desc: "Bureau field reporting, author stories, publish assigned beats",
    badgeClass: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-800",
  },
  {
    key: "CONTRIBUTOR",
    label: "Contributor",
    icon: "📝",
    desc: "Submit citizen journalism stories for editorial review",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
  },
  {
    key: "READER",
    label: "Reader",
    icon: "👤",
    desc: "Verified subscriber: read, comment, reply, like, and bookmark news",
    badgeClass: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
  },
];

export function UserManagement({
  initialUsers,
  currentUserId,
  currentUserRole,
}: UserManagementProps) {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
    location: "New Delhi Bureau",
    bio: "",
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    location: "",
    isActive: true,
    newPassword: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Global Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateForm((prev) => ({ ...prev, password: pwd + "@1" }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user login.");
      }

      setUsers([data.user, ...users]);
      setSuccessMsg(`New login for "${data.user.name}" (${data.user.role}) created successfully!`);
      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "EDITOR",
        location: "New Delhi Bureau",
        bio: "",
        isActive: true,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create user login.");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditModal = (user: ManagedUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || "",
      isActive: user.isActive,
      newPassword: "",
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setEditSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload: any = {
        userId: editingUser.id,
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        location: editForm.location,
        isActive: editForm.isActive,
      };

      if (editForm.newPassword && editForm.newPassword.trim().length >= 6) {
        payload.password = editForm.newPassword.trim();
      }

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user login.");
      }

      setUsers(users.map((u) => (u.id === editingUser.id ? data.user : u)));
      setSuccessMsg(`Account for "${data.user.name}" updated successfully.`);
      setIsEditOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update user login.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: ManagedUser) => {
    if (!confirm(`Are you sure you want to delete login "${user.name}" (${user.email})? This action is permanent.`)) {
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user.");
      }

      setUsers(users.filter((u) => u.id !== user.id));
      setSuccessMsg(`User "${user.name}" has been removed.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete user.");
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.location && u.location.toLowerCase().includes(q));
    return matchesRole && matchesQuery;
  });

  const getRoleBadge = (role: string) => {
    const roleDef = ROLES.find((r) => r.key === role) || ROLES[5];
    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-xs ${roleDef.badgeClass}`}
      >
        <span>{roleDef.icon}</span>
        <span>{roleDef.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#ea580c]" />
            <span>User & Role Governance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-tier editorial staff, correspondents, administrators, and SuperAdmin logins across BNA bureaus.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreateOpen(true);
            setSuccessMsg("");
            setErrorMsg("");
          }}
          className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center space-x-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Create New Login</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      {/* 2. Filters & Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, email ID, or bureau location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
            />
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex items-center shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Roles:
          </span>
          <button
            onClick={() => setSelectedRoleFilter("ALL")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              selectedRoleFilter === "ALL"
                ? "bg-[#0b2545] text-white shadow"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Accounts ({users.length})
          </button>
          {ROLES.map((r) => {
            const count = users.filter((u) => u.role === r.key).length;
            const isSelected = selectedRoleFilter === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setSelectedRoleFilter(r.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 flex items-center space-x-1 ${
                  isSelected
                    ? "bg-[#ea580c] text-white shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
                <span className="opacity-75 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">User / Contact Name</th>
                <th className="p-3.5">Login Email ID</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Articles</th>
                <th className="p-3.5 text-center">Submissions</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0b2545] to-[#ea580c] flex items-center justify-center font-black text-white text-xs shadow-xs shrink-0">
                          {u.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white block truncate">
                            {u.name}
                          </span>
                          {u.location && (
                            <span className="text-[11px] text-slate-400 flex items-center mt-0.5 truncate">
                              <MapPin className="w-3 h-3 mr-0.5 text-[#ea580c] shrink-0" />
                              {u.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {u.email}
                    </td>

                    <td className="p-3.5">
                      {getRoleBadge(u.role)}
                    </td>

                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3.5 text-center font-bold text-slate-700 dark:text-slate-300">
                      {u._count?.articles ?? 0}
                    </td>

                    <td className="p-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {u._count?.submissions ?? 0}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#ea580c] hover:text-white text-slate-600 dark:text-slate-300 transition"
                          title="Edit login, role, or password"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {u.id !== currentUserId && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 transition"
                            title="Delete user account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No accounts found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal: CREATE NEW LOGIN */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border-2 border-[#ea580c] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-950/60 rounded-xl text-[#ea580c]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Create New User Login
                  </h2>
                  <p className="text-xs text-slate-500">
                    Provision credentials with SuperAdmin, Admin, Editor, or Reporter role.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Field 1: Contact Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Full Contact Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Sharma"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Field 2: Email ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Official Login Email ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="ramesh.editor@bnanews.in"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Field 3: Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-[#ea580c] hover:underline flex items-center space-x-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 4: Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Assign System Role *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const isSelected = createForm.role === r.key;
                    // Only SuperAdmin can assign SuperAdmin
                    const isSuperOption = r.key === "SUPERADMIN" && currentUserRole !== "SUPERADMIN";

                    return (
                      <button
                        key={r.key}
                        type="button"
                        disabled={isSuperOption}
                        onClick={() => setCreateForm({ ...createForm, role: r.key })}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? "border-[#ea580c] bg-orange-50/80 dark:bg-orange-950/40 ring-1 ring-[#ea580c]"
                            : "border-gray-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        } ${isSuperOption ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-1">
                            <span>{r.icon}</span>
                            <span>{r.label}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#ea580c]" />}
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 5: Location / Bureau */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Bureau / Location (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. New Delhi Bureau, Mumbai Headquarters"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {createSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Login Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: EDIT USER & ROLE */}
      {isEditOpen && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-gray-300 dark:border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-4 h-4 text-[#ea580c]" />
                <span>Edit User Account & Role</span>
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Login Email ID
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  System Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.icon} {r.label} ({r.key})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reset Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (optional)"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="rounded text-[#ea580c] focus:ring-[#ea580c]"
                />
                <label htmlFor="activeCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Account is Active (Allow Login)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 bg-[#0b2545] hover:bg-[#103058] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
