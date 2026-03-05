import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Variant_dark_light } from "../backend";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    await saveProfile.mutateAsync({
      name: name.trim(),
      dateOfBirth: "",
      school: "",
      classYear: "",
      language: "en",
      appearance: Variant_dark_light.light,
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl gradient-teal flex items-center justify-center shadow-teal">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center font-heading text-2xl">
            Welcome to Sarthi!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your AI-powered educational and career guidance companion. Let's
            start by setting up your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-visible:ring-teal"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full gradient-teal text-white border-0 hover:opacity-90 font-semibold"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? "Setting up..." : "Get Started →"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
