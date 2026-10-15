// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { convertFileToBase64 } from "../utils/helpers";
import {
  Shield,
  Users,
  FolderGit2,
  Award,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  UserPlus,
  Power,
  RotateCcw,
  Save,
  Check,
  X,
  Eye,
  Mail,
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import toast from "react-hot-toast";

export const AdminDashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const {
    teamMembers,
    activeMembers,
    projects,
    achievements,
    teamSettings,
    stats,
    createTeamMember,
    toggleUserStatus,
    deleteTeamMember,
    updateMemberProfile,
    approveProject,
    rejectProject,
    deleteProject,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    updateTeamSettings,
    resetToSampleData,
    messages = [],
    deleteContactMessage,
    markMessageRead,
  } = useData();

  const [activeTab, setActiveTab] = useState("members");

  // Create User Modal
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    title: "Software Engineer",
    tempPassword: "Password123!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80",
    phone: "",
    location: "San Francisco, CA",
  });

  // Edit User Modal
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Achievement Modal
  const [achModalOpen, setAchModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [achForm, setAchForm] = useState({
    title: "",
    category: "Hackathon",
    date: "2024-05",
    description: "",
    badge: "Winner",
    icon: "Trophy",
  });

  // Team settings form
  const [settingsForm, setSettingsForm] = useState(teamSettings || {});

  useEffect(() => {
    if (teamSettings && Object.keys(teamSettings).length > 0) {
      setSettingsForm(teamSettings);
    }
  }, [teamSettings]);

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const pendingProjects = projects.filter((p) => p.status === "pending_review");

  // Handlers
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email) {
      toast.error("Please fill in all required user fields.");
      return;
    }

    try {
      await createTeamMember(newUserForm);
      toast.success(`Account created for ${newUserForm.fullName}! User can now log in.`);
      setCreateUserOpen(false);
      setNewUserForm({
        fullName: "",
        email: "",
        title: "Software Engineer",
        tempPassword: "Password123!",
        avatar: "",
        phone: "",
        location: "San Francisco, CA",
      });
    } catch (err) {
      toast.error(err.message || "Failed to create user account.");
    }
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMemberProfile(editingMember.uid || editingMember.id, editingMember);
    toast.success("Team member updated!");
    setEditUserOpen(false);
  };

  const handleSaveAchievement = (e) => {
    e.preventDefault();
    if (editingAch) {
      updateAchievement(editingAch.id, achForm);
      toast.success("Achievement updated");
    } else {
      addAchievement(achForm);
      toast.success("Achievement added");
    }
    setAchModalOpen(false);
    setEditingAch(null);
    setAchForm({ title: "", category: "Hackathon", date: "2024-05", description: "", badge: "Winner", icon: "Trophy" });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateTeamSettings(settingsForm);
    toast.success("Team settings saved!");
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-gray-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/80 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                Admin Control Center
              </h1>
              <Badge variant="purple" size="sm">
                Root Admin
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Manage team members, approve project submissions, and configure the public portfolio.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <Button
            size="sm"
            variant="secondary"
            icon={UserPlus}
            onClick={() => setCreateUserOpen(true)}
            className="w-full sm:w-auto justify-center"
          >
            Create Team Member
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm("Reset all data back to the default sample dataset?")) {
                resetToSampleData();
                toast.success("Reset data to defaults");
              }
            }}
            className="w-full sm:w-auto justify-center"
          >
            Reset DB Defaults
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Total Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{teamMembers.length}</p>
          <p className="text-[10px] text-emerald-600 font-medium">{activeMembers.length} Active</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Public Projects</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats.totalProjects}</p>
          <p className="text-[10px] text-gray-400">Live on website</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Pending Reviews</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{pendingProjects.length}</p>
          <p className="text-[10px] text-amber-600 font-medium">Awaiting action</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Total Certs</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.totalCertificates}</p>
          <p className="text-[10px] text-gray-400">Across all members</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Skills Catalog</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalSkills}</p>
          <p className="text-[10px] text-gray-400">Unique technologies</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-[11px] font-semibold text-gray-500">Achievements</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{achievements.length}</p>
          <p className="text-[10px] text-gray-400">Awards & milestones</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "members"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
          }`}
        >
          <Users className="w-4 h-4" />
          Team Members ({teamMembers.length})
        </button>

        <button
          onClick={() => setActiveTab("approvals")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "approvals"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Project Approvals
          {pendingProjects.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
              {pendingProjects.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("all_projects")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "all_projects"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          All Projects ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "achievements"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
          }`}
        >
          <Award className="w-4 h-4" />
          Achievements ({achievements.length})
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === "settings"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
          }`}
        >
          <Settings className="w-4 h-4" />
          Team Settings
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === "messages"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
          }`}
        >
          <Mail className="w-4 h-4" />
          Visitor Messages ({messages.length})
          {messages.some((m) => !m.read) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>
      </div>

      {/* TAB 1: MEMBERS MANAGEMENT TABLE */}
      {activeTab === "members" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Member Directory</h3>
              <p className="text-xs text-gray-500">Create new member credentials, disable/enable, and manage profiles.</p>
            </div>
            <Button size="sm" icon={UserPlus} onClick={() => setCreateUserOpen(true)}>
              Add New Member
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-500 font-semibold border-y border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role & Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Education & Certs</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {teamMembers.map((m) => {
                  const mProjects = projects.filter((p) => p.ownerUid === (m.uid || m.id));
                  const isDisabled = m.status === "disabled";
                  return (
                    <tr key={m.id || m.uid} className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 ${isDisabled ? "opacity-60" : ""}`}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{m.fullName}</p>
                            <p className="text-[11px] text-gray-500">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{m.title}</p>
                        <Badge variant="primary" size="sm" className="mt-0.5">
                          {m.role || "MEMBER"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={isDisabled ? "danger" : "success"} size="sm">
                          {isDisabled ? "Disabled" : "Active"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                        {m.education?.length || 0} degrees • {m.certificates?.length || 0} certs
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-gray-200">
                        {mProjects.length} submitted
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/team/${m.id || m.uid}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600"
                            title="View Public Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => {
                              setEditingMember(m);
                              setEditUserOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600"
                            title="Edit Member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              toggleUserStatus(m.uid || m.id);
                              toast.success(`User marked ${isDisabled ? "Active" : "Disabled"}`);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600"
                            title={isDisabled ? "Enable User" : "Disable User"}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete user ${m.fullName}?`)) {
                                deleteTeamMember(m.uid || m.id);
                                toast.success("User deleted");
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT APPROVALS WORKFLOW */}
      {activeTab === "approvals" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project Approval Queue</h3>
            <p className="text-xs text-gray-500">
              Review projects submitted by team members before publishing them to the public centralized portfolio.
            </p>
          </div>

          {pendingProjects.length > 0 ? (
            <div className="space-y-4">
              {pendingProjects.map((p) => {
                const owner = teamMembers.find((m) => m.uid === p.ownerUid || m.id === p.ownerUid);
                return (
                  <div
                    key={p.id}
                    className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={p.bannerImage || p.screenshots?.[0]}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">{p.title}</h4>
                          <Badge variant="warning" size="sm">
                            Pending Review
                          </Badge>
                          <Badge variant="purple" size="sm">
                            {p.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{p.shortDescription}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.technologies?.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-400 pt-1">
                          Internal Author: <span className="font-semibold text-gray-700 dark:text-gray-300">{owner?.fullName || p.ownerUid}</span> (will be hidden on public view)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="success"
                        icon={Check}
                        onClick={async () => {
                          await approveProject(p.id);
                          toast.success(`"${p.title}" approved and published to Team Projects!`);
                        }}
                      >
                        Approve & Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={X}
                        onClick={async () => {
                          await rejectProject(p.id);
                          toast.error(`"${p.title}" rejected.`);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-gray-900 dark:text-white">All caught up!</h4>
              <p className="text-xs text-gray-500 mt-1">There are no pending project submissions awaiting review.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL PROJECTS */}
      {activeTab === "all_projects" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">All Projects Database</h3>
            <p className="text-xs text-gray-500">Manage, edit, or unpublish projects across the team.</p>
          </div>

          <div className="space-y-4">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={p.bannerImage || p.screenshots?.[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{p.title}</h4>
                      <Badge variant={p.status === "approved" ? "success" : "warning"} size="sm">
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{p.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/projects/${p.id}`} target="_blank">
                    <Button variant="outline" size="sm" icon={Eye}>
                      View
                    </Button>
                  </Link>
                  {p.status === "approved" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        rejectProject(p.id);
                        toast.success("Project unpublished");
                      }}
                    >
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        approveProject(p.id);
                        toast.success("Project approved");
                      }}
                    >
                      Publish
                    </Button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm("Permanently delete project?")) {
                        deleteProject(p.id);
                        toast.success("Project deleted");
                      }
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACHIEVEMENTS MANAGER */}
      {activeTab === "achievements" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Achievements & Awards</h3>
              <p className="text-xs text-gray-500">Manage public hackathon wins, milestones, and publication records.</p>
            </div>
            <Button
              size="sm"
              icon={Plus}
              onClick={() => {
                setEditingAch(null);
                setAchForm({ title: "", category: "Hackathon", date: "2024-05", description: "", badge: "Winner", icon: "Trophy" });
                setAchModalOpen(true);
              }}
            >
              Add Achievement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="warning" size="sm">
                      {ach.badge || ach.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingAch(ach);
                          setAchForm(ach);
                          setAchModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-purple-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteAchievement(ach.id);
                          toast.success("Achievement removed");
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{ach.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{ach.description}</p>
                </div>
                <div className="mt-3 text-[11px] text-gray-400 font-semibold">{ach.date} • {ach.category}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TEAM SETTINGS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Branding & Global Configuration</h3>
              <p className="text-xs text-gray-500">Configure team name, mission statement, contact details, and links.</p>
            </div>
            <Button type="submit" size="sm" icon={Save}>
              Save Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Team / Company Name *
              </label>
              <input
                type="text"
                required
                value={settingsForm.teamName || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, teamName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settingsForm.tagline || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Team Description
              </label>
              <textarea
                rows={2}
                value={settingsForm.description || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Mission Statement
              </label>
              <textarea
                rows={2}
                value={settingsForm.mission || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, mission: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settingsForm.contactEmail || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settingsForm.contactPhone || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" icon={Save}>
              Save Team Settings
            </Button>
          </div>
        </form>
      )}

      {/* TAB 5: VISITOR MESSAGES / INQUIRIES */}
      {activeTab === "messages" && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Visitor Contact Inquiries ({messages.length})
            </h3>
            <p className="text-xs text-gray-500">
              Messages submitted by visitors through the public Contact Us page form.
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">No messages received yet</p>
              <p className="text-xs text-gray-400 mt-1">
                When visitors fill out the Contact Us form, their messages will appear here in real-time!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    msg.read
                      ? "bg-gray-50/60 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700/60"
                      : "bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 dark:border-gray-700/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{msg.name}</h4>
                        {!msg.read && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Recently"}
                      </span>
                      {!msg.read && (
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={async () => {
                            if (markMessageRead) await markMessageRead(msg.id);
                            toast.success("Marked as read");
                          }}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        onClick={async () => {
                          if (deleteContactMessage) await deleteContactMessage(msg.id);
                          toast.success("Message deleted");
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Subject: <span className="font-normal text-gray-600 dark:text-gray-400">{msg.subject || "General Inquiry"}</span>
                    </p>
                    <p className="text-xs text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-wrap leading-relaxed bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE MEMBER MODAL */}
      <Modal
        isOpen={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        title="Create New Team Member Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Lin"
              value={newUserForm.fullName}
              onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="maya.lin@techteam.dev"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Temporary Password *
              </label>
              <input
                type="text"
                required
                value={newUserForm.tempPassword}
                onChange={(e) => setNewUserForm({ ...newUserForm, tempPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Professional Role / Title
            </label>
            <input
              type="text"
              placeholder="e.g. AI Research Scientist"
              value={newUserForm.title}
              onChange={(e) => setNewUserForm({ ...newUserForm, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
            <label className="block text-xs font-bold text-gray-900 dark:text-white">
              Profile Photo (Upload from device to store as Base64)
            </label>
            <div className="flex items-center gap-3">
              {newUserForm.avatar ? (
                <img
                  src={newUserForm.avatar}
                  alt="Avatar Preview"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500 shadow"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                  <Users className="w-6 h-6" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const base64 = await convertFileToBase64(file, 400, 400, 0.8);
                      setNewUserForm((prev) => ({ ...prev, avatar: base64 }));
                      toast.success("Photo converted to Base64!");
                    } catch (err) {
                      toast.error("Failed to convert image file.");
                    }
                  }
                }}
                className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCreateUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" icon={UserPlus}>
              Create Member Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <Modal
          isOpen={editUserOpen}
          onClose={() => setEditUserOpen(false)}
          title={`Edit ${editingMember.fullName}`}
        >
          <form onSubmit={handleUpdateMember} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editingMember.fullName || ""}
                onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editingMember.title || ""}
                onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
              <label className="block text-xs font-bold text-gray-900 dark:text-white">
                Update Profile Photo (Convert to Base64)
              </label>
              <div className="flex items-center gap-3">
                {editingMember.avatar ? (
                  <img
                    src={editingMember.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500 shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <Users className="w-6 h-6" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await convertFileToBase64(file, 400, 400, 0.8);
                        setEditingMember((prev) => ({ ...prev, avatar: base64 }));
                        toast.success("Photo converted to Base64!");
                      } catch (err) {
                        toast.error("Failed to convert image file.");
                      }
                    }
                  }}
                  className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditUserOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Updates
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ACHIEVEMENT MODAL */}
      <Modal
        isOpen={achModalOpen}
        onClose={() => setAchModalOpen(false)}
        title={editingAch ? "Edit Achievement" : "Add New Achievement"}
      >
        <form onSubmit={handleSaveAchievement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Achievement Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1st Place Smart India Hackathon"
              value={achForm.title}
              onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={achForm.category}
                onChange={(e) => setAchForm({ ...achForm, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Award">Award</option>
                <option value="Publication">Publication</option>
                <option value="Milestone">Milestone</option>
                <option value="Certification">Certification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Date (YYYY-MM)
              </label>
              <input
                type="text"
                placeholder="2024-05"
                value={achForm.date}
                onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={achForm.description}
              onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAchModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Achievement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
