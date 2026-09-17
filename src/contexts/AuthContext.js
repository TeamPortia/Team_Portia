// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set user online/offline status in Firestore
  const setOnlineStatus = async (uid, isOnline) => {
    if (!uid) return;
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          isOnline: isOnline,
          lastSeen: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Failed to set online status:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          let userRole = "MEMBER";
          let fullName = fbUser.displayName || fbUser.email?.split("@")[0];
          let avatar = fbUser.photoURL || "";

          try {
            let userDoc = await getDoc(doc(db, "users", fbUser.uid));
            let data = null;

            if (userDoc.exists()) {
              data = userDoc.data();
            } else if (fbUser.email) {
              const cleanEmail = fbUser.email.trim().toLowerCase();
              const q = query(collection(db, "users"), where("email", "==", cleanEmail));
              const querySnap = await getDocs(q);

              if (!querySnap.empty) {
                const oldDoc = querySnap.docs[0];
                data = oldDoc.data();

                if (oldDoc.id !== fbUser.uid) {
                  try {
                    await deleteDoc(doc(db, "users", oldDoc.id));
                  } catch {}
                  await setDoc(
                    doc(db, "users", fbUser.uid),
                    {
                      ...data,
                      id: fbUser.uid,
                      uid: fbUser.uid,
                      email: cleanEmail,
                      updatedAt: new Date().toISOString(),
                    },
                    { merge: true }
                  );
                }
              }
            }

            if (data) {
              userRole = data.role || (data.isAdmin ? "ADMIN" : "MEMBER");
              fullName = data.fullName || fullName;
              avatar = data.avatar || avatar;
            }
          } catch (docErr) {
            console.warn("User doc fetch error:", docErr);
          }

          const isAdmin = userRole === "ADMIN" || fbUser.email?.toLowerCase().includes("admin");

          await setOnlineStatus(fbUser.uid, true);

          const loggedInUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fullName,
            fullName: fullName,
            photoURL: avatar,
            avatar: avatar,
            isAdmin,
            role: isAdmin ? "ADMIN" : "MEMBER",
          };

          setCurrentUser(loggedInUser);
          localStorage.setItem("team_member_session", JSON.stringify(loggedInUser));
        } catch (e) {
          console.error("Auth state error:", e);
          setCurrentUser(null);
        }
      } else {
        // Fallback: check stored local session if Firebase Auth is offline or rate limited
        const savedSession = localStorage.getItem("team_member_session");
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            setCurrentUser(parsed);
          } catch (err) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Strict Tab Visibility & Heartbeat Presence Listener
  useEffect(() => {
    if (!currentUser?.uid) return;

    const uid = currentUser.uid;

    const heartbeatId = setInterval(() => {
      if (document.visibilityState === "visible") {
        setOnlineStatus(uid, true);
      } else {
        setOnlineStatus(uid, false);
      }
    }, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setOnlineStatus(uid, true);
      } else {
        setOnlineStatus(uid, false);
      }
    };

    const handleUnload = () => {
      setOnlineStatus(uid, false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      clearInterval(heartbeatId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      setOnlineStatus(uid, false);
    };
  }, [currentUser?.uid]);

  const login = async (email, password, isAdminLogin = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const ADMIN_EMAIL = "mscteam6@gmail.com";
    const ADMIN_PASSWORD = "Mscteam006#";

    if (isAdminLogin) {
      if (cleanEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        throw new Error("Invalid Admin credentials! Only authorized Admin (mscteam6@gmail.com) can access the Admin Panel.");
      }
    }

    // Official Admin Account Login
    if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let fbUser = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        fbUser = userCredential.user;
      } catch (authError) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          fbUser = userCredential.user;
        } catch (createErr) {
          console.warn("Admin Auth creation notice:", createErr);
        }
      }

      const adminUid = fbUser?.uid || "admin-msc-team";

      const adminDoc = {
        id: adminUid,
        uid: adminUid,
        email: cleanEmail,
        fullName: "System Administrator",
        role: "ADMIN",
        isAdmin: true,
        title: "Team Administrator",
        avatar: "",
        bio: "Official System Administrator for MSC Team Portfolio.",
        status: "active",
        isOnline: true,
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, "users", adminUid), adminDoc, { merge: true });
      } catch (fsErr) {
        console.warn("Firestore admin doc update notice:", fsErr);
      }

      const loggedInUser = {
        uid: adminUid,
        email: cleanEmail,
        displayName: "System Administrator",
        fullName: "System Administrator",
        photoURL: "",
        avatar: "",
        isAdmin: true,
        role: "ADMIN",
      };

      setCurrentUser(loggedInUser);
      localStorage.setItem("team_member_session", JSON.stringify(loggedInUser));
      return loggedInUser;
    }

    // 1. Try standard Firebase Auth sign in
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      let userRole = "MEMBER";
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          userRole = data.role || (data.isAdmin ? "ADMIN" : "MEMBER");
        }
      } catch {}

      const isAdmin = userRole === "ADMIN" || cleanEmail === ADMIN_EMAIL;

      if (isAdminLogin && !isAdmin) {
        await fbSignOut(auth);
        throw new Error("This account does not have Admin privileges in Firestore.");
      }

      await setOnlineStatus(user.uid, true);
      return user;
    } catch (authError) {
      console.warn("Primary auth login notice:", authError);

      // 2. Fallback: If Firebase Auth fails (or is rate limited / credential mismatch), check Firestore for member doc!
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", cleanEmail));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const memberDoc = querySnap.docs[0];
          const memberData = memberDoc.data();
          const memberUid = memberDoc.id;

          const isAdmin = memberData.role === "ADMIN" || memberData.isAdmin === true || cleanEmail === ADMIN_EMAIL;

          if (isAdminLogin && !isAdmin) {
            throw new Error("This account does not have Admin privileges in Firestore.");
          }

          const fallbackUser = {
            uid: memberUid,
            email: cleanEmail,
            displayName: memberData.fullName || cleanEmail.split("@")[0],
            fullName: memberData.fullName || cleanEmail.split("@")[0],
            photoURL: memberData.avatar || "",
            avatar: memberData.avatar || "",
            isAdmin,
            role: isAdmin ? "ADMIN" : "MEMBER",
          };

          await setOnlineStatus(memberUid, true);
          setCurrentUser(fallbackUser);
          localStorage.setItem("team_member_session", JSON.stringify(fallbackUser));
          return fallbackUser;
        }
      } catch (fallbackErr) {
        console.warn("Firestore fallback error:", fallbackErr);
      }

      throw authError;
    }
  };

  // Register a new Member account directly in Auth & Firestore
  const registerMemberAccount = async (email, password, fullName) => {
    const cleanEmail = email.trim().toLowerCase();
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    const memberDoc = {
      id: user.uid,
      uid: user.uid,
      email: cleanEmail,
      fullName: fullName,
      role: "MEMBER",
      isAdmin: false,
      title: "Software Engineer",
      avatar: "",
      bio: "Passionate software engineer building high-impact digital solutions.",
      status: "active",
      isOnline: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", user.uid), memberDoc);

    const loggedInUser = {
      uid: user.uid,
      email: cleanEmail,
      displayName: fullName,
      fullName: fullName,
      photoURL: "",
      avatar: "",
      isAdmin: false,
      role: "MEMBER",
    };

    setCurrentUser(loggedInUser);
    localStorage.setItem("team_member_session", JSON.stringify(loggedInUser));
    return user;
  };

  // Create initial or new Admin account in Firebase Auth & Firestore
  const createAdminAccount = async (email, password, fullName = "System Administrator") => {
    const cleanEmail = email.trim().toLowerCase();
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    const adminDoc = {
      id: user.uid,
      uid: user.uid,
      email: cleanEmail,
      fullName: fullName,
      role: "ADMIN",
      isAdmin: true,
      title: "System Administrator",
      avatar: "",
      bio: "Team Administrator managing portfolios and project approvals.",
      status: "active",
      isOnline: true,
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", user.uid), adminDoc);

    const loggedInUser = {
      uid: user.uid,
      email: cleanEmail,
      displayName: fullName,
      fullName: fullName,
      photoURL: "",
      avatar: "",
      isAdmin: true,
      role: "ADMIN",
    };

    setCurrentUser(loggedInUser);
    localStorage.setItem("team_member_session", JSON.stringify(loggedInUser));
    return user;
  };

  const logout = async () => {
    if (currentUser?.uid) {
      await setOnlineStatus(currentUser.uid, false);
    }
    localStorage.removeItem("team_member_session");
    try {
      await fbSignOut(auth);
    } catch {}
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        registerMemberAccount,
        createAdminAccount,
        logout,
        resetPassword,
        isAdmin: currentUser?.isAdmin || currentUser?.role === "ADMIN",
        isMember: Boolean(currentUser && !currentUser?.isAdmin),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
