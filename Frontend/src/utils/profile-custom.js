export const PROFILE_CUSTOM_UPDATED_EVENT = "profile-custom-updated";

export const getCustomProfileKey = (memberId) => `profile-custom:${memberId}`;

export const getInitials = (name, fallback = "TV") => {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return fallback;
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

export const readCustomProfile = (memberId) => {
  if (!memberId || typeof window === "undefined") {
    return { avatar: "", skills: [] };
  }

  try {
    const raw = window.localStorage.getItem(getCustomProfileKey(memberId));
    if (!raw) return { avatar: "", skills: [] };

    const parsed = JSON.parse(raw);
    return {
      avatar: typeof parsed.avatar === "string" ? parsed.avatar : "",
      skills: Array.isArray(parsed.skills)
        ? parsed.skills.filter((skill) => typeof skill === "string")
        : [],
    };
  } catch {
    return { avatar: "", skills: [] };
  }
};

export const writeCustomProfile = (memberId, customProfile) => {
  if (!memberId || typeof window === "undefined") return;

  const nextProfile = {
    avatar: customProfile.avatar || "",
    skills: Array.isArray(customProfile.skills) ? customProfile.skills : [],
  };

  window.localStorage.setItem(
    getCustomProfileKey(memberId),
    JSON.stringify(nextProfile)
  );
  window.dispatchEvent(
    new CustomEvent(PROFILE_CUSTOM_UPDATED_EVENT, {
      detail: { memberId, profile: nextProfile },
    })
  );
};
