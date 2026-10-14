// src/pages/MemberDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { calculateProfileCompletion, convertFileToBase64 } from "../utils/helpers";
import {
  User,
  GraduationCap,
  Award,
  Cpu,
  FileText,
  FolderGit2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Download,
  Upload,
  Eye,
  Save,
  Crop,
  Link2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ImageCropModal } from "../components/common/ImageCropModal";
import toast from "react-hot-toast";

export const MemberDashboardPage = () => {
  const { currentUser } = useAuth();
  const {
    loading,
    teamMembers,
    projects,
    updateMemberProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addSkill,
    updateSkill,
    deleteSkill,
    uploadResumeFile,
    downloadResumeFile,
    updateResume,
    deleteResume,
    submitProject,
    updateProject,
    deleteProject,
  } = useData();

  const [activeTab, setActiveTab] = useState("profile");

  // Get current active member profile data safely (no falling back to teamMembers[0])
  const currentMember = teamMembers.find(
    (m) =>
      m.uid === currentUser?.uid ||
      m.id === currentUser?.uid ||
      (m.email && currentUser?.email && m.email.toLowerCase() === currentUser.email.toLowerCase())
  );

  const targetUid = currentMember?.uid || currentMember?.id || currentUser?.uid;

  // Forms state
  const [profileForm, setProfileForm] = useState({
    fullName: currentMember?.fullName || currentUser?.displayName || "",
    title: currentMember?.title || "",
    avatar: currentMember?.avatar || "",
    bio: currentMember?.bio || "",
    aboutMe: currentMember?.aboutMe || "",
    careerObjective: currentMember?.careerObjective || "",
    areasOfInterest: currentMember?.areasOfInterest?.join(", ") || "",
    email: currentMember?.contact?.email || currentMember?.email || currentUser?.email || "",
    phone: currentMember?.contact?.phone || "",
    location: currentMember?.contact?.location || "",
    github: currentMember?.contact?.github || "",
    linkedin: currentMember?.contact?.linkedin || "",
    website: currentMember?.contact?.website || "",
  });

  // Sync profile form once member data loads from Firestore
  useEffect(() => {
    if (currentMember) {
      setProfileForm({
        fullName: currentMember.fullName || "",
        title: currentMember.title || "",
        avatar: currentMember.avatar || "",
        bio: currentMember.bio || "",
        aboutMe: currentMember.aboutMe || "",
        careerObjective: currentMember.careerObjective || "",
        areasOfInterest: currentMember.areasOfInterest?.join(", ") || "",
        email: currentMember.contact?.email || currentMember.email || currentUser?.email || "",
        phone: currentMember.contact?.phone || "",
        location: currentMember.contact?.location || "",
        github: currentMember.contact?.github || "",
        linkedin: currentMember.contact?.linkedin || "",
        website: currentMember.contact?.website || "",
      });
    }
  }, [currentMember, currentUser?.email]);

  // Modal states
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduForm, setEduForm] = useState({
    degree: "",
    institution: "",
    department: "",
    startYear: "",
    endYear: "",
    grade: "",
    description: "",
  });

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    name: "",
    organization: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    description: "",
  });

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "Programming",
    level: 85,
  });

  const [projModalOpen, setProjModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState(null);
  const [projForm, setProjForm] = useState({
    title: "",
    category: "AI/ML",
    shortDescription: "",
    description: "",
    technologies: "",
    bannerImage: "",
    githubUrl: "",
    liveUrl: "",
    documentationUrl: "",
    features: "",
    startDate: "",
    endDate: "",
  });

  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedRawImage, setSelectedRawImage] = useState("");

  // Resume states
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUrlInput, setResumeUrlInput] = useState("");
  const [isSavingResumeUrl, setIsSavingResumeUrl] = useState(false);

  const handleResumeFileUpload = async (file) => {
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error("Please upload a PDF format resume document.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      toast.error("File is too large. Please upload a PDF under 12 MB.");
      return;
    }

    const uid = targetUid;
    if (!uid) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    setIsUploadingResume(true);
    const toastId = toast.loading("Saving resume PDF...");

    try {
      await uploadResumeFile(uid, file);
      toast.dismiss(toastId);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error("Resume upload error:", err);
      toast.dismiss(toastId);
      toast.error(err.message || "Failed to upload resume file.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSaveResumeLink = async (e) => {
    e.preventDefault();
    if (!resumeUrlInput.trim()) {
      toast.error("Please enter a valid link.");
      return;
    }
    const uid = targetUid;
    if (!uid) {
      toast.error("User session not found.");
      return;
    }

    setIsSavingResumeUrl(true);
    try {
      let link = resumeUrlInput.trim();
      if (!link.startsWith("http://") && !link.startsWith("https://")) {
        link = `https://${link}`;
      }
      await updateResume(uid, link, "Resume_Document.pdf");
      toast.success("Resume link saved successfully!");
      setResumeUrlInput("");
    } catch (err) {
      console.error("Failed to save resume link:", err);
      toast.error("Failed to save resume link.");
    } finally {
      setIsSavingResumeUrl(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (loading && !currentMember) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your profile data..." />
      </div>
    );
  }

  const completion = calculateProfileCompletion(currentMember);
  const myProjects = projects.filter((p) => p.ownerUid === (currentMember?.uid || currentMember?.id));

  // Handlers
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!targetUid) {
      toast.error("User profile is still initializing. Please wait a moment.");
      return;
    }
    const interests = profileForm.areasOfInterest
      ? profileForm.areasOfInterest.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      await updateMemberProfile(targetUid, {
        fullName: profileForm.fullName,
        title: profileForm.title,
        avatar: profileForm.avatar,
        bio: profileForm.bio,
        aboutMe: profileForm.aboutMe,
        careerObjective: profileForm.careerObjective,
        areasOfInterest: interests,
        contact: {
          email: profileForm.email,
          phone: profileForm.phone,
          location: profileForm.location,
          github: profileForm.github,
          linkedin: profileForm.linkedin,
          website: profileForm.website,
        },
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    if (!targetUid) return;
    if (editingEdu) {
      await updateEducation(targetUid, editingEdu.id, eduForm);
      toast.success("Education updated");
    } else {
      await addEducation(targetUid, eduForm);
      toast.success("Education record added");
    }
    setEduModalOpen(false);
    setEditingEdu(null);
    setEduForm({ degree: "", institution: "", department: "", startYear: "", endYear: "", grade: "", description: "" });
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (!targetUid) return;
    if (editingCert) {
      await updateCertificate(targetUid, editingCert.id, certForm);
      toast.success("Certificate updated");
    } else {
      await addCertificate(targetUid, certForm);
      toast.success("Certificate added");
    }
    setCertModalOpen(false);
    setEditingCert(null);
    setCertForm({ name: "", organization: "", issueDate: "", credentialId: "", credentialUrl: "", description: "" });
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!targetUid) return;
    if (editingSkill) {
      await updateSkill(targetUid, editingSkill.id, {
        ...skillForm,
        level: Number(skillForm.level),
      });
      toast.success("Skill updated");
    } else {
      await addSkill(targetUid, {
        ...skillForm,
        level: Number(skillForm.level),
      });
      toast.success("Skill added");
    }
    setSkillModalOpen(false);
    setEditingSkill(null);
    setSkillForm({ name: "", category: "Programming", level: 85 });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!targetUid) return;
    const techArray = projForm.technologies
      ? projForm.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const featArray = projForm.features
      ? projForm.features.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];

    const payload = {
      title: projForm.title,
      category: projForm.category,
      shortDescription: projForm.shortDescription,
      description: projForm.description,
      technologies: techArray,
      features: featArray,
      bannerImage: projForm.bannerImage,
      screenshots: [projForm.bannerImage].filter(Boolean),
      githubUrl: projForm.githubUrl,
      liveUrl: projForm.liveUrl,
      documentationUrl: projForm.documentationUrl,
      startDate: projForm.startDate,
      endDate: projForm.endDate,
    };

    if (editingProj) {
      await updateProject(editingProj.id, payload);
      toast.success("Project updated!");
    } else {
      await submitProject(payload, targetUid);
      toast.success("Project added successfully! It is now live in Central Team Projects.");
    }
    setProjModalOpen(false);
    setEditingProj(null);
  };

  const tabs = [
    { id: "profile", label: "Basic Info & Bio", icon: User },
    { id: "education", label: "Education", icon: GraduationCap, count: currentMember?.education?.length },
    { id: "certificates", label: "Certificates", icon: Award, count: currentMember?.certificates?.length },
    { id: "skills", label: "Skills", icon: Cpu, count: currentMember?.skills?.length },
    { id: "resume", label: "Resume PDF", icon: FileText },
    { id: "projects", label: "My Project Submissions", icon: FolderGit2, count: myProjects.length },
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentMember?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
            alt=""
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-400 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                Welcome back, {currentMember?.fullName || "Member"}!
              </h1>
              <Badge variant="primary" size="sm">
                Active Member
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1">{currentMember?.title}</p>
            <p className="text-xs text-indigo-300 mt-1">{currentMember?.email}</p>
          </div>
        </div>

        {/* Profile Completion Widget */}
        <div className="w-full md:w-64 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-indigo-200">Profile Completion</span>
            <span className="text-emerald-400 font-bold">{completion}%</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-[10px] text-indigo-300">
            {completion === 100 ? "Your profile is 100% complete!" : "Complete all fields to boost your portfolio visibility."}
          </p>
        </div>
      </div>

      {/* Public Profile View Link */}
      <div className="flex items-center justify-between">
        <Link
          to={`/team/${currentMember?.id || currentMember?.uid}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <Eye className="w-4 h-4" />
          Preview My Live Public Profile
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Tabbed Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar / Horizontal Tab Bar on Mobile */}
        <div className="lg:col-span-3 flex lg:flex-col overflow-x-auto no-scrollbar gap-2 pb-2 lg:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:flex-shrink flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700/80"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isCurrent ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-9 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* TAB 1: Profile & Bio */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Personal & Professional Profile
                </h3>
                <Button type="submit" size="sm" icon={Save}>
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative flex-shrink-0">
                    {profileForm.avatar ? (
                      <img
                        src={profileForm.avatar}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-bold text-gray-900 dark:text-white">
                      Profile Photo (Crop, Position & Zoom Enabled)
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Upload any photo from your computer/mobile. You can drag to reposition, zoom in/out, and rotate before saving.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition">
                        <Upload className="w-3.5 h-3.5" />
                        Choose & Crop Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setSelectedRawImage(event.target.result);
                                setCropperOpen(true);
                              };
                              reader.readAsDataURL(file);
                              e.target.value = "";
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {profileForm.avatar && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRawImage(profileForm.avatar);
                            setCropperOpen(true);
                          }}
                          icon={Crop}
                        >
                          Re-adjust Current Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Short Bio (Shown on cards)
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Detailed About Me
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.aboutMe}
                    onChange={(e) => setProfileForm({ ...profileForm, aboutMe: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Career Objective
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.careerObjective}
                    onChange={(e) => setProfileForm({ ...profileForm, careerObjective: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Areas of Interest (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={profileForm.areasOfInterest}
                    onChange={(e) => setProfileForm({ ...profileForm, areasOfInterest: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                    placeholder="AI, Cloud Architecture, Mobile DevOps"
                  />
                </div>
              </div>

              {/* Contact info section */}
              <h4 className="text-sm font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-gray-700">
                Contact & Social Links
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Personal Portfolio / Website
                  </label>
                  <input
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" size="md" icon={Save}>
                  Save All Profile Details
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: Education */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Education History</h3>
                  <p className="text-xs text-gray-500">Manage your degrees, colleges, and academic achievements.</p>
                </div>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingEdu(null);
                    setEduForm({ degree: "", institution: "", department: "", startYear: "", endYear: "", grade: "", description: "" });
                    setEduModalOpen(true);
                  }}
                >
                  Add Education
                </Button>
              </div>

              <div className="space-y-4">
                {currentMember?.education?.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{edu.institution} {edu.department ? `• ${edu.department}` : ""}</p>
                      <p className="text-[11px] text-gray-500">{edu.startYear} – {edu.endYear || "Present"} {edu.grade ? `| Grade: ${edu.grade}` : ""}</p>
                      {edu.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{edu.description}</p>}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingEdu(edu);
                          setEduForm(edu);
                          setEduModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteEducation(currentMember.uid || currentMember.id, edu.id);
                          toast.success("Education removed");
                        }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Certificates */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Certifications & Licenses</h3>
                  <p className="text-xs text-gray-500">Showcase credentials from AWS, Google, Microsoft, Meta, etc.</p>
                </div>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingCert(null);
                    setCertForm({ name: "", organization: "", issueDate: "", credentialId: "", credentialUrl: "", description: "" });
                    setCertModalOpen(true);
                  }}
                >
                  Add Certificate
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentMember?.certificates?.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCert(cert);
                              setCertForm(cert);
                              setCertModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              deleteCertificate(currentMember.uid || currentMember.id, cert.id);
                              toast.success("Certificate deleted");
                            }}
                            className="p-1 text-gray-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{cert.name}</h4>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{cert.organization}</p>
                      <p className="text-[10px] text-gray-400">Issued: {cert.issueDate}</p>
                      {cert.credentialId && <p className="text-[10px] text-gray-400">ID: {cert.credentialId}</p>}
                    </div>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 text-xs text-indigo-600 font-semibold flex items-center gap-1"
                      >
                        Verify Credential
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Skills */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Technical Skills</h3>
                  <p className="text-xs text-gray-500">Add programming languages, frameworks, databases, tools, and cloud skills.</p>
                </div>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({ name: "", category: "Programming", level: 85 });
                    setSkillModalOpen(true);
                  }}
                >
                  Add Skill
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentMember?.skills?.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white mb-1">
                        <span>{sk.name}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{sk.level}%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-1.5">{sk.category}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${sk.level}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingSkill(sk);
                          setSkillForm(sk);
                          setSkillModalOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteSkill(currentMember.uid || currentMember.id, sk.id);
                          toast.success("Skill removed");
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Resume */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum Vitae / Resume</h3>
                <p className="text-xs text-gray-500">
                  Upload your PDF resume or provide a cloud link so visitors and recruiters can download it from your public portfolio.
                </p>
              </div>

              {currentMember?.resumeUrl ? (
                <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md">
                          {currentMember.resumeName || "Resume_Document.pdf"}
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active & Live on Public Portfolio</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => downloadResumeFile(currentMember)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      <button
                        onClick={async () => {
                          if (targetUid) {
                            await deleteResume(targetUid);
                            toast.success("Resume deleted");
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Option to replace existing file */}
                  <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <span className="text-gray-500">Want to replace this resume with an updated version?</span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:bg-gray-50 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New PDF</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={isUploadingResume}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleResumeFileUpload(file);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Upload Zone */}
                  <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl text-center space-y-4 bg-gray-50/50 dark:bg-gray-900/30 transition">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
                      {isUploadingResume ? (
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {isUploadingResume ? "Uploading Resume Document..." : "Upload Your Resume (PDF)"}
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 leading-relaxed">
                        Choose your PDF resume from your device. Optimized for both Firebase Cloud Storage and compressed direct sync.
                      </p>
                    </div>

                    <div className="pt-2 max-w-md mx-auto">
                      <label
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                          isUploadingResume
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 hover:scale-105"
                        }`}
                      >
                        {isUploadingResume ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Upload...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Select PDF Resume</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          disabled={isUploadingResume}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleResumeFileUpload(file);
                            e.target.value = "";
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Alternative URL Link input */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <Link2 className="w-4 h-4 text-indigo-500" />
                      <span>Or Provide a Cloud / Google Drive Resume Link</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      If you host your resume on Google Drive, Dropbox, or OneDrive, paste the public share link here.
                    </p>
                    <form onSubmit={handleSaveResumeLink} className="flex flex-col sm:flex-row gap-2 pt-1">
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/your-resume-link/view"
                        value={resumeUrlInput}
                        onChange={(e) => setResumeUrlInput(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={isSavingResumeUrl}
                        className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white text-xs font-semibold transition shrink-0 flex items-center justify-center gap-1.5"
                      >
                        {isSavingResumeUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save Link</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Project Submissions */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Added Projects</h3>
                  <p className="text-xs text-gray-500">
                    Projects you add are automatically published live in the Central Team Projects showcase.
                  </p>
                </div>
                <Button
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingProj(null);
                    setProjForm({
                      title: "",
                      category: "AI/ML",
                      shortDescription: "",
                      description: "",
                      technologies: "React, Python, Tailwind",
                      bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
                      githubUrl: "",
                      liveUrl: "",
                      documentationUrl: "",
                      features: "Real-time AI Processing\nMulti-modal architecture",
                      startDate: "",
                      endDate: "",
                    });
                    setProjModalOpen(true);
                  }}
                >
                  Add New Project
                </Button>
              </div>

              {myProjects.length > 0 ? (
                <div className="space-y-4">
                  {myProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={p.bannerImage || p.screenshots?.[0]}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-gray-900 dark:text-white">{p.title}</h4>
                            <Badge
                              variant={p.status === "rejected" ? "danger" : "success"}
                              size="sm"
                            >
                              {p.status === "rejected" ? "Rejected" : "Live Project"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">{p.shortDescription}</p>
                          <p className="text-[11px] text-gray-400 mt-1">{p.technologies?.join(" • ")}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingProj(p);
                            setProjForm({
                              title: p.title,
                              category: p.category,
                              shortDescription: p.shortDescription,
                              description: p.description,
                              technologies: p.technologies?.join(", "),
                              bannerImage: p.bannerImage,
                              githubUrl: p.githubUrl || "",
                              liveUrl: p.liveUrl || "",
                              documentationUrl: p.documentationUrl || "",
                              features: p.features?.join("\n") || "",
                              startDate: p.startDate || "",
                              endDate: p.endDate || "",
                            });
                            setProjModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-indigo-600 border border-gray-200 dark:border-gray-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            deleteProject(p.id);
                            toast.success("Project deleted");
                          }}
                          className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
                  <FolderGit2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">You haven't submitted any projects yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* Education Modal */}
      <Modal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        title={editingEdu ? "Edit Education Record" : "Add Education Record"}
      >
        <form onSubmit={handleSaveEdu} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Degree / Program *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. B.Tech in Computer Science"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Institution / University *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University"
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Engineering"
                value={eduForm.department}
                onChange={(e) => setEduForm({ ...eduForm, department: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Start Year *
              </label>
              <input
                type="text"
                required
                placeholder="2020"
                value={eduForm.startYear}
                onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                End Year
              </label>
              <input
                type="text"
                placeholder="2024 (or Present)"
                value={eduForm.endYear}
                onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Grade / CGPA
              </label>
              <input
                type="text"
                placeholder="3.9 GPA"
                value={eduForm.grade}
                onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description / Honors
            </label>
            <textarea
              rows={2}
              placeholder="Specialization, Capstone project, Awards..."
              value={eduForm.description}
              onChange={(e) => setEduForm({ ...eduForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEduModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Education
            </Button>
          </div>
        </form>
      </Modal>

      {/* Certificate Modal */}
      <Modal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={editingCert ? "Edit Certificate" : "Add Certificate"}
      >
        <form onSubmit={handleSaveCert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Certificate Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Certified Solutions Architect"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                placeholder="Amazon Web Services"
                value={certForm.organization}
                onChange={(e) => setCertForm({ ...certForm, organization: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Issue Date (YYYY-MM) *
              </label>
              <input
                type="text"
                required
                placeholder="2023-05"
                value={certForm.issueDate}
                onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Credential ID
              </label>
              <input
                type="text"
                placeholder="AWS-PSA-9912"
                value={certForm.credentialId}
                onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Credential Verification URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={certForm.credentialUrl}
                onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCertModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Certificate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. React.js, Kubernetes, PyTorch"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            >
              <option value="Programming">Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Frameworks">Frameworks</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Database">Database</option>
              <option value="Cloud">Cloud</option>
              <option value="DevOps">DevOps</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <span>Proficiency Level</span>
              <span className="text-indigo-600 font-bold">{skillForm.level}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Submission Modal */}
      <Modal
        isOpen={projModalOpen}
        onClose={() => setProjModalOpen(false)}
        title={editingProj ? "Edit Submitted Project" : "Submit New Team Project"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI Communication Assistant"
                value={projForm.title}
                onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Project Category
              </label>
              <select
                value={projForm.category}
                onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              >
                <option value="AI/ML">AI/ML</option>
                <option value="Web">Web Application</option>
                <option value="Mobile">Mobile Application</option>
                <option value="IoT">IoT / Embedded</option>
                <option value="Cloud">Cloud Infrastructure</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Short Description (Shown on cards) *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Brief summary of the project's purpose and impact..."
              value={projForm.shortDescription}
              onChange={(e) => setProjForm({ ...projForm, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Detailed Architecture & Description
            </label>
            <textarea
              rows={3}
              placeholder="Full system overview, technical architecture, problem statement..."
              value={projForm.description}
              onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Technologies (comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="React, TypeScript, PyTorch, Docker, Tailwind CSS"
              value={projForm.technologies}
              onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-2">
            <label className="block text-xs font-bold text-gray-900 dark:text-white">
              Project Banner & Screenshots (Upload Image to convert to Base64)
            </label>
            <p className="text-[11px] text-gray-500">
              Upload project preview screenshot. It will be stored as Base64 in Firestore.
            </p>
            <div className="flex items-center gap-4 pt-1">
              {projForm.bannerImage && (
                <img
                  src={projForm.bannerImage}
                  alt="Preview"
                  className="w-20 h-14 rounded-xl object-cover ring-2 ring-indigo-500 shadow-md"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const base64 = await convertFileToBase64(file, 900, 600, 0.8);
                      setProjForm((prev) => ({ ...prev, bannerImage: base64 }));
                      toast.success("Project screenshot loaded as Base64!");
                    } catch (err) {
                      toast.error("Failed to process image file.");
                    }
                  }
                }}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                GitHub Repo URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={projForm.githubUrl}
                onChange={(e) => setProjForm({ ...projForm, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                placeholder="https://demo.app"
                value={projForm.liveUrl}
                onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Documentation URL / PDF
              </label>
              <input
                type="url"
                placeholder="https://docs.app"
                value={projForm.documentationUrl}
                onChange={(e) => setProjForm({ ...projForm, documentationUrl: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Key Features (one per line)
            </label>
            <textarea
              rows={2}
              placeholder="Real-time voice synthesis&#10;Sub-50ms latency&#10;SOC2 Compliance"
              value={projForm.features}
              onChange={(e) => setProjForm({ ...projForm, features: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setProjModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Submit Project for Approval
            </Button>
          </div>
        </form>
      </Modal>

      {/* Profile Image Cropper & Adjustment Modal */}
      <ImageCropModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageSrc={selectedRawImage}
        onCropComplete={(croppedBase64) => {
          setProfileForm((prev) => ({ ...prev, avatar: croppedBase64 }));
          toast.success("Photo cropped & adjusted! Click 'Save Changes' to update in Firestore.");
        }}
      />
    </div>
  );
};
