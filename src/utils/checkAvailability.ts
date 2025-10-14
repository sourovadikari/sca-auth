// utils/checkAvailability.ts
import axios from "axios";
import { debounce } from "./debounce";

const checkEmail = async (
  email: string,
  setAvailable: (v: boolean | null) => void,
  setChecking: (v: boolean) => void
) => {
  if (!email || !email.includes("@")) {
    setAvailable(null);
    setChecking(false);
    return;
  }

  setChecking(true);
  try {
    const res = await axios.get(`/api/check-email?email=${encodeURIComponent(email)}`);
    setAvailable(res.data.available);
  } catch {
    setAvailable(null);
  } finally {
    setChecking(false);
  }
};

export const debouncedCheckEmail = debounce(
  checkEmail as (...args: unknown[]) => void,
  500
);

// Similarly for username

const checkUsername = async (
  username: string,
  setAvailable: (v: boolean | null) => void,
  setChecking: (v: boolean) => void
) => {
  if (!username || username.length < 3) {
    setAvailable(null);
    setChecking(false);
    return;
  }

  setChecking(true);
  try {
    const res = await axios.get(`/api/check-username?username=${encodeURIComponent(username)}`);
    setAvailable(res.data.available);
  } catch {
    setAvailable(null);
  } finally {
    setChecking(false);
  }
};

export const debouncedCheckUsername = debounce(
  checkUsername as (...args: unknown[]) => void,
  500
);
