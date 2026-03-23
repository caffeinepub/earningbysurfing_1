import { useCallback, useEffect, useState } from "react";

export type MemberSession = { id: number; name: string; email: string } | null;

const SESSION_KEY = "ebs_member_session";

export function useMemberAuth() {
  const [member, setMember] = useState<MemberSession>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === SESSION_KEY) {
        try {
          setMember(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setMember(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const loginMember = useCallback(
    (record: { id: number; name: string; email: string }) => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(record));
      // Keep legacy key in sync so DashboardPage still works during transition
      localStorage.setItem("ebs_current_member", JSON.stringify(record));
      setMember(record);
    },
    [],
  );

  const logoutMember = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("ebs_current_member");
    setMember(null);
  }, []);

  return { member, loginMember, logoutMember };
}
