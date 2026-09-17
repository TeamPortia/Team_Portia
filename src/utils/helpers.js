// src/utils/helpers.js

export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  } catch {
    return dateString;
  }
};

export const slugify = (text) => {
  return text
    ? text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
    : "";
};

export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    Boolean(profile.fullName),
    Boolean(profile.title),
    Boolean(profile.avatar),
    Boolean(profile.bio),
    Boolean(profile.aboutMe),
    Boolean(profile.careerObjective),
    Boolean(profile.contact?.email),
    Boolean(profile.contact?.phone || profile.contact?.location),
    Boolean(profile.education && profile.education.length > 0),
    Boolean(profile.skills && profile.skills.length > 0),
    Boolean(profile.certificates && profile.certificates.length > 0),
    Boolean(profile.resumeUrl),
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

// Convert image file to compressed Base64 Data URL
export const convertFileToBase64 = (file, maxWidth = 800, maxHeight = 800, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    // For non-image or PDF files (e.g. resume), convert directly
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      return;
    }

    // For images, resize and compress via canvas
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Base64 JPEG
        const base64Data = canvas.toDataURL("image/jpeg", quality);
        resolve(base64Data);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Format Firebase Authentication Error Messages with actionable guidance
export const formatAuthError = (err) => {
  if (!err) return "An unknown error occurred.";
  const code = err.code || "";
  const msg = err.message || "";

  if (
    code === "auth/operation-not-allowed" ||
    code === "auth/configuration-not-found" ||
    msg.includes("operation-not-allowed") ||
    msg.includes("CONFIGURATION_NOT_FOUND")
  ) {
    return "Firebase Email/Password provider is DISABLED in Firebase Console! Go to Firebase Console -> Authentication -> Sign-in method -> Enable Email/Password.";
  }
  if (code === "auth/email-already-in-use") {
    return "This email address is already registered in Firebase Authentication. Please use 'Sign In' instead.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Firebase requires passwords to be at least 6 characters long.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (
    code === "auth/user-not-found" ||
    code === "auth/invalid-credential" ||
    code === "auth/wrong-password"
  ) {
    return "Invalid email or password. Please check your credentials or click New Registration.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many failed login attempts. Firebase has temporarily locked logins for this email. Please wait 1-2 minutes and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error. Check your internet connection.";
  }
  return msg || "Authentication failed.";
};

// Fisher-Yates array shuffle for randomizing member display order
export const shuffleArray = (array) => {
  if (!array || array.length <= 1) return array || [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
