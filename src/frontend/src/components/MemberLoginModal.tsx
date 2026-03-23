import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { MemberSession } from "../hooks/useMemberAuth";

type MemberRecord = { id: number; name: string; email: string };

interface MemberLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (member: NonNullable<MemberSession>) => void;
}

export default function MemberLoginModal({
  open,
  onOpenChange,
  onLogin,
}: MemberLoginModalProps) {
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const input = value.trim();
    if (!input) {
      setError("Please enter your Member ID or email.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const raw = localStorage.getItem("ebs_members");
      if (!raw) {
        setError("Member data not available. Please contact admin.");
        setLoading(false);
        return;
      }
      const members: MemberRecord[] = JSON.parse(raw);
      const numId = Number.parseInt(input, 10);
      let found: MemberRecord | undefined;

      if (!Number.isNaN(numId)) {
        found = members.find((m) => m.id === numId);
      }
      if (!found) {
        found = members.find(
          (m) => m.email.toLowerCase() === input.toLowerCase(),
        );
      }

      if (!found) {
        setError("Member not found. Check your ID or email.");
        setLoading(false);
        return;
      }

      if (password.trim() !== String(found.id)) {
        setError(
          "Incorrect password. Your default password is your Member ID.",
        );
        setLoading(false);
        return;
      }

      onLogin(found);
      setValue("");
      setPassword("");
      setError("");
      onOpenChange(false);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="member_login.dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-[#FF9933]">
            Member Login
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="member-id-input"
              className="text-sm font-semibold text-foreground"
            >
              Member ID or Email
            </Label>
            <Input
              id="member-id-input"
              type="text"
              placeholder="e.g. 1234 or james.smith1@earningbysurfing.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border-[#FF9933]/40 focus-visible:ring-[#FF9933] focus-visible:border-[#FF9933]"
              autoFocus
              data-ocid="member_login.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="member-password-input"
              className="text-sm font-semibold text-foreground"
            >
              Password
            </Label>
            <Input
              id="member-password-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[#FF9933]/40 focus-visible:ring-[#FF9933] focus-visible:border-[#FF9933]"
              data-ocid="member_login.input"
            />
          </div>

          {error && (
            <p
              className="text-sm text-red-500 font-medium"
              data-ocid="member_login.error_state"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#FF9933] hover:bg-orange-600 text-white font-bold uppercase tracking-wider"
            disabled={loading}
            data-ocid="member_login.submit_button"
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Use your Member ID (1–4000) as your default password.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
