import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { BookOpen, LogOut, Settings, User } from "lucide-react";
import React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function TopNav() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const displayName = profile?.name || "Student";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/assets/generated/sarthi-logo.dim_256x256.png"
            alt="Sarthi"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="font-heading font-bold text-xl text-teal">
            Sarthi
          </span>
        </button>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Career Quiz", path: "/career-quiz" },
            { label: "Scholarships", path: "/scholarships" },
            { label: "Internships", path: "/internships" },
            { label: "Mock Test", path: "/mock-test" },
            { label: "Chatbot", path: "/chatbot" },
          ].map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-teal hover:bg-teal/5 rounded-md transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            >
              <Avatar className="h-9 w-9 border-2 border-teal/30">
                <AvatarFallback className="bg-teal text-white font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                {displayName}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
              <BookOpen className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
