// src/contexts/DataContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { db, registerUserWithSecondaryAuth } from "../services/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { initialTeamSettings } from "../services/mockData";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [teamSettings, setTeamSettings] = useState(initialTeamSettings);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore real-time listeners
  useEffect(() => {
    // 1. Projects listener
    const unsubProjects = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjects(list);
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore projects listener warning:", error);
        setLoading(false);
      }
    );

    // 2. Users listener
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTeamMembers(list);
      },
      (error) => {
        console.warn("Firestore users listener warning:", error);
      }
    );

    // 3. Achievements listener
    const unsubAchievements = onSnapshot(
      collection(db, "achievements"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAchievements(list);
      },
      (error) => {
        console.warn("Firestore achievements listener warning:", error);
      }
    );

    // 4. Settings listener
    const unsubSettings = onSnapshot(
      collection(db, "settings"),
      (snapshot) => {
        if (!snapshot.empty) {
          setTeamSettings((prev) => ({ ...prev, ...snapshot.docs[0].data() }));
        }
      },
      (error) => {
        console.warn("Firestore settings listener warning:", error);
      }
    );

    // 5. Messages listener
    const unsubMessages = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setMessages(list);
      },
      (error) => {
        console.warn("Firestore messages listener warning:", error);
      }
    );

    return () => {
      unsubProjects();
      unsubUsers();
      unsubAchievements();
      unsubSettings();
      unsubMessages();
    };
  }, []);

  // Public live projects (owner info is strictly separated)
  const publicProjects = useMemo(() => {
    return projects.filter((p) => p.status !== "rejected" && p.status !== "disabled");
  }, [projects]);

  // Helper to verify if user tab is currently active and sending heartbeats
  const checkIsOnline = (member) => {
    if (!member || member.isOnline !== true) return false;
    if (!member.lastSeen) return Boolean(member.isOnline);
    const diffMs = Date.now() - new Date(member.lastSeen).getTime();
    return diffMs < 40000; // Active within last 40 seconds
  };

  const activeMembers = useMemo(() => {
    return teamMembers
      .filter((m) => m.status !== "disabled" && m.role !== "ADMIN" && !m.isAdmin)
      .map((m) => ({
        ...m,
        isOnline: checkIsOnline(m),
      }));
  }, [teamMembers]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalCerts = teamMembers.reduce((acc, m) => acc + (m.certificates?.length || 0), 0);
    const allSkills = new Set();
    teamMembers.forEach((m) => {
      m.skills?.forEach((s) => {
        if (s.name) allSkills.add(s.name.toLowerCase());
      });
    });

    return {
      totalMembers: activeMembers.length,
      totalProjects: publicProjects.length,
      totalCertificates: totalCerts,
      totalSkills: allSkills.size,
      totalAchievements: achievements.length,
      pendingProjectsCount: projects.filter((p) => p.status === "pending_review").length,
    };
  }, [teamMembers, activeMembers, publicProjects, achievements, projects]);

  // Getters
  const getMemberById = (id) => {
    return teamMembers.find((m) => m.id === id || m.uid === id);
  };

  const getProjectById = (id) => {
    return projects.find((p) => p.id === id);
  };

  // MEMBER ACTIONS (Direct to Firestore)
  const updateMemberProfile = async (uid, updates) => {
    try {
      await setDoc(doc(db, "users", uid), updates, { merge: true });
    } catch (err) {
      console.error("Firestore update profile error:", err);
      throw err;
    }
  };

  // Education CRUD
  const addEducation = async (uid, eduItem) => {
    const member = getMemberById(uid);
    const newItem = { id: `edu-${Date.now()}`, ...eduItem };
    const currentEdu = member?.education || [];
    await updateMemberProfile(uid, { education: [...currentEdu, newItem] });
  };

  const updateEducation = async (uid, eduId, eduItem) => {
    const member = getMemberById(uid);
    const updatedEdu = (member?.education || []).map((e) =>
      e.id === eduId ? { ...e, ...eduItem } : e
    );
    await updateMemberProfile(uid, { education: updatedEdu });
  };

  const deleteEducation = async (uid, eduId) => {
    const member = getMemberById(uid);
    const filteredEdu = (member?.education || []).filter((e) => e.id !== eduId);
    await updateMemberProfile(uid, { education: filteredEdu });
  };

  // Certificates CRUD
  const addCertificate = async (uid, certItem) => {
    const member = getMemberById(uid);
    const newItem = { id: `cert-${Date.now()}`, ...certItem };
    const currentCerts = member?.certificates || [];
    await updateMemberProfile(uid, { certificates: [...currentCerts, newItem] });
  };

  const updateCertificate = async (uid, certId, certItem) => {
    const member = getMemberById(uid);
    const updatedCerts = (member?.certificates || []).map((c) =>
      c.id === certId ? { ...c, ...certItem } : c
    );
    await updateMemberProfile(uid, { certificates: updatedCerts });
  };

  const deleteCertificate = async (uid, certId) => {
    const member = getMemberById(uid);
    const filteredCerts = (member?.certificates || []).filter((c) => c.id !== certId);
    await updateMemberProfile(uid, { certificates: filteredCerts });
  };

  // Skills CRUD
  const addSkill = async (uid, skillItem) => {
    const member = getMemberById(uid);
    const newItem = { id: `sk-${Date.now()}`, ...skillItem };
    const currentSkills = member?.skills || [];
    await updateMemberProfile(uid, { skills: [...currentSkills, newItem] });
  };

  const updateSkill = async (uid, skillId, skillItem) => {
    const member = getMemberById(uid);
    const updatedSkills = (member?.skills || []).map((s) =>
      s.id === skillId ? { ...s, ...skillItem } : s
    );
    await updateMemberProfile(uid, { skills: updatedSkills });
  };

  const deleteSkill = async (uid, skillId) => {
    const member = getMemberById(uid);
    const filteredSkills = (member?.skills || []).filter((s) => s.id !== skillId);
    await updateMemberProfile(uid, { skills: filteredSkills });
  };

  // Resume Management
  const updateResume = async (uid, resumeUrl, resumeName) => {
    await updateMemberProfile(uid, { resumeUrl, resumeName });
  };

  const deleteResume = async (uid) => {
    await updateMemberProfile(uid, { resumeUrl: "", resumeName: "" });
  };

  // Projects CRUD (Direct to Firestore)
  const submitProject = async (projectData, ownerUid) => {
    const projectId = `proj-${Date.now()}`;
    const newProject = {
      id: projectId,
      ownerUid: ownerUid || "anonymous",
      status: "approved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bannerImage: projectData.bannerImage || "",
      screenshots: projectData.screenshots || [],
      technologies: projectData.technologies || [],
      features: projectData.features || [],
      ...projectData,
    };

    await setDoc(doc(db, "projects", projectId), newProject);
    return newProject;
  };

  const updateProject = async (projectId, updates) => {
    await updateDoc(doc(db, "projects", projectId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteProject = async (projectId) => {
    await deleteDoc(doc(db, "projects", projectId));
  };

  // ADMIN ACTIONS
  const createTeamMember = async (memberData, targetUid = null) => {
    const cleanEmail = memberData.email?.trim().toLowerCase();
    let autoDocId = targetUid;

    // Create Firebase Auth user account if temporary password is provided
    if (!autoDocId && cleanEmail && memberData.tempPassword) {
      try {
        autoDocId = await registerUserWithSecondaryAuth(cleanEmail, memberData.tempPassword);
      } catch (authErr) {
        console.warn("Secondary auth creation notice:", authErr);
      }
    }

    // Auto-generate native Firestore Document ID
    if (!autoDocId) {
      autoDocId = doc(collection(db, "users")).id;
    }

    const newMember = {
      id: autoDocId,
      uid: autoDocId,
      role: "MEMBER",
      status: "active",
      fullName: memberData.fullName,
      email: cleanEmail,
      tempPassword: memberData.tempPassword || "Password123!",
      title: memberData.title || "Software Engineer",
      avatar: memberData.avatar || "",
      bio: memberData.bio || "",
      aboutMe: memberData.aboutMe || "",
      careerObjective: memberData.careerObjective || "",
      areasOfInterest: memberData.areasOfInterest || [],
      contact: {
        email: memberData.email,
        phone: memberData.phone || "",
        location: memberData.location || "",
        linkedin: "",
        github: "",
        website: "",
      },
      socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
      },
      education: [],
      certificates: [],
      skills: [],
      resumeUrl: "",
      resumeName: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", autoDocId), newMember);
    return newMember;
  };

  const toggleUserStatus = async (uid) => {
    const member = getMemberById(uid);
    const nextStatus = member?.status === "disabled" ? "active" : "disabled";
    await updateMemberProfile(uid, { status: nextStatus });
  };

  const deleteTeamMember = async (uid) => {
    await deleteDoc(doc(db, "users", uid));
  };

  const approveProject = async (projectId) => {
    await updateProject(projectId, { status: "approved" });
  };

  const rejectProject = async (projectId) => {
    await updateProject(projectId, { status: "rejected" });
  };

  // Achievements
  const addAchievement = async (achievement) => {
    const achId = `ach-${Date.now()}`;
    const newAch = { id: achId, ...achievement, createdAt: new Date().toISOString() };
    await setDoc(doc(db, "achievements", achId), newAch);
  };

  const updateAchievement = async (achId, updates) => {
    await updateDoc(doc(db, "achievements", achId), updates);
  };

  const deleteAchievement = async (achId) => {
    await deleteDoc(doc(db, "achievements", achId));
  };

  // Contact messages
  const sendContactMessage = async (messageData) => {
    const docRef = doc(collection(db, "messages"));
    const newMsg = {
      id: docRef.id,
      name: messageData.name,
      email: messageData.email,
      subject: messageData.subject || "General Inquiry",
      message: messageData.message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newMsg);
  };

  const deleteContactMessage = async (messageId) => {
    await deleteDoc(doc(db, "messages", messageId));
  };

  const markMessageRead = async (messageId) => {
    await setDoc(doc(db, "messages", messageId), { read: true }, { merge: true });
  };

  // Team settings
  const updateTeamSettingsData = async (settings) => {
    await setDoc(doc(db, "settings", "general"), settings, { merge: true });
    setTeamSettings((prev) => ({ ...prev, ...settings }));
  };

  return (
    <DataContext.Provider
      value={{
        teamMembers,
        activeMembers,
        projects,
        publicProjects,
        achievements,
        teamSettings,
        messages,
        stats,
        loading,
        getMemberById,
        getProjectById,
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
        updateResume,
        deleteResume,
        submitProject,
        updateProject,
        deleteProject,
        createTeamMember,
        toggleUserStatus,
        deleteTeamMember,
        approveProject,
        rejectProject,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        updateTeamSettings: updateTeamSettingsData,
        sendContactMessage,
        deleteContactMessage,
        markMessageRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
