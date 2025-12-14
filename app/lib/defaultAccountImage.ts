const DEFAULT_AVATAR_URL = "/default-avatar.png";
const DEFAULT_HEADER_URL = "/default-header.png";

export const defaultAccountAvatar = (avatarUrl: string) =>
  avatarUrl === "" ? DEFAULT_AVATAR_URL : avatarUrl;

export const defaultAccountHeader = (headerUrl: string) =>
  headerUrl === "" ? DEFAULT_HEADER_URL : headerUrl;
