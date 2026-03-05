import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookmarkCheck,
  Briefcase,
  Globe,
  Loader2,
  LogOut,
  Moon,
  Save,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Variant_dark_light } from "../backend";
import type { Profile as ProfileType } from "../backend";
import ProtectedRoute from "../components/ProtectedRoute";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetSavedInternships,
  useGetSavedScholarships,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export default function Profile() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: savedScholarships = [] } = useGetSavedScholarships();
  const { data: savedInternships = [] } = useGetSavedInternships();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [school, setSchool] = useState("");
  const [classYear, setClassYear] = useState("");
  const [language, setLanguage] = useState("en");

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setDateOfBirth(profile.dateOfBirth || "");
      setSchool(profile.school || "");
      setClassYear(profile.classYear || "");
      setLanguage(profile.language || "en");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const updatedProfile: ProfileType = {
        name: name.trim(),
        dateOfBirth,
        school,
        classYear,
        language,
        appearance:
          theme === "dark" ? Variant_dark_light.dark : Variant_dark_light.light,
      };
      await saveProfile.mutateAsync(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Save appearance preference to backend
    if (profile) {
      try {
        await saveProfile.mutateAsync({
          ...profile,
          name: name || profile.name,
          appearance:
            newTheme === "dark"
              ? Variant_dark_light.dark
              : Variant_dark_light.light,
        });
      } catch {
        // Non-critical, just update theme locally
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const displayName = profile?.name || name || "Student";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
          {profileLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-teal/30">
                <AvatarFallback className="gradient-teal text-white font-bold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">
                  {displayName}
                </h1>
                {profile?.school && (
                  <p className="text-muted-foreground text-sm">
                    {profile.school}
                  </p>
                )}
                {profile?.classYear && (
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-teal/10 text-teal border-teal/20 text-xs"
                  >
                    {profile.classYear}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="edit">
          <TabsList className="w-full mb-6 bg-muted/50">
            <TabsTrigger value="edit" className="flex-1 gap-1.5">
              <User className="h-4 w-4" />
              Edit Profile
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-1 gap-1.5">
              <BookmarkCheck className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 gap-1.5">
              <Globe className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Edit Profile Tab */}
          <TabsContent value="edit">
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-5">
                Edit Profile
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="focus-visible:ring-teal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="focus-visible:ring-teal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School / College Name</Label>
                  <Input
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="focus-visible:ring-teal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classYear">Class / Year</Label>
                  <Input
                    id="classYear"
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    placeholder="e.g. Class 12 / 2nd Year B.Tech"
                    className="focus-visible:ring-teal"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={saveProfile.isPending}
                    className="w-full gradient-teal text-white border-0 hover:opacity-90 font-semibold gap-2"
                  >
                    {saveProfile.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections">
            <div className="space-y-5">
              {/* Saved Scholarships */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-5 w-5 text-amber" />
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Saved Scholarships
                  </h2>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-amber/20 text-amber-dark border-amber/20"
                  >
                    {savedScholarships.length}
                  </Badge>
                </div>
                {savedScholarships.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No saved scholarships yet.</p>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/scholarships" })}
                      className="text-teal text-sm font-medium hover:underline mt-1"
                    >
                      Browse Scholarships →
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {savedScholarships.map((title) => (
                      <li
                        key={title}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/40 border border-border"
                      >
                        <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">
                          {title}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate({ to: "/scholarships" })}
                          className="text-xs text-teal hover:underline flex-shrink-0"
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Saved Internships */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-teal" />
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Saved Internships
                  </h2>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-teal/10 text-teal border-teal/20"
                  >
                    {savedInternships.length}
                  </Badge>
                </div>
                {savedInternships.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No saved internships yet.</p>
                    <button
                      type="button"
                      onClick={() => navigate({ to: "/internships" })}
                      className="text-teal text-sm font-medium hover:underline mt-1"
                    >
                      Browse Internships →
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {savedInternships.map((title) => (
                      <li
                        key={title}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/40 border border-border"
                      >
                        <span className="text-sm font-medium text-foreground truncate flex-1 mr-2">
                          {title}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate({ to: "/internships" })}
                          className="text-xs text-teal hover:underline flex-shrink-0"
                        >
                          View
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-4">
              {/* Language */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-teal" />
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Language
                  </h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={language}
                    onValueChange={(val) => setLanguage(val)}
                  >
                    <SelectTrigger id="language" className="focus:ring-teal">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="hi">🇮🇳 Hindi (हिंदी)</SelectItem>
                      <SelectItem value="mr">Maharashtra (मराठी)</SelectItem>
                      <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                      <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Language preference is saved with your profile.
                  </p>
                </div>
              </div>

              {/* Appearance */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-teal" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber" />
                  )}
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    Appearance
                  </h2>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {theme === "dark" ? "Dark Mode" : "Light Mode"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {theme === "dark"
                        ? "Switch to light theme"
                        : "Switch to dark theme"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleThemeToggle}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      theme === "dark" ? "bg-teal" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Settings */}
              <Button
                onClick={handleSaveProfile}
                disabled={saveProfile.isPending}
                className="w-full gradient-teal text-white border-0 hover:opacity-90 font-semibold gap-2"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>

              {/* Logout */}
              <div className="bg-card rounded-2xl border border-destructive/20 shadow-card p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Account
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Logging out will end your current session. Your data will be
                  preserved.
                </p>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
