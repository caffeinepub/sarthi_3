import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const featureCards = [
  {
    title: "Career Quiz",
    description:
      "Discover your ideal career stream with our AI-powered aptitude assessment.",
    icon: BookOpen,
    path: "/career-quiz",
    color: "from-teal to-teal-dark",
    badge: "Popular",
    badgeColor: "bg-amber/20 text-amber-dark",
  },
  {
    title: "Scholarships",
    description:
      "Find government and private scholarships with direct application links.",
    icon: Award,
    path: "/scholarships",
    color: "from-amber to-amber-dark",
    badge: "New",
    badgeColor: "bg-teal/10 text-teal",
  },
  {
    title: "Internships",
    description:
      "Explore internships by domain — Engineering, Medical, Commerce, Arts.",
    icon: Briefcase,
    path: "/internships",
    color: "from-teal-dark to-teal",
    badge: null,
    badgeColor: "",
  },
  {
    title: "Mock Tests",
    description:
      "Practice with subject-wise timed tests and evaluate your performance.",
    icon: GraduationCap,
    path: "/mock-test",
    color: "from-amber-dark to-amber",
    badge: null,
    badgeColor: "",
  },
  {
    title: "AI Chatbot",
    description:
      "Get personalized career and education guidance from our AI mentor.",
    icon: MessageCircle,
    path: "/chatbot",
    color: "from-teal to-teal-dark",
    badge: "AI",
    badgeColor: "bg-amber/20 text-amber-dark",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();

  const displayName = profile?.name || "Student";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-card">
          <img
            src="/assets/generated/dashboard-hero.dim_1200x400.png"
            alt="Dashboard Hero"
            className="w-full h-48 md:h-56 object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-80" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber" />
              <span className="text-white/80 text-sm font-medium">
                {greeting}!
              </span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">
              Welcome back, <span className="text-amber">{displayName}</span> 👋
            </h1>
            <p className="text-white/75 mt-1 text-sm md:text-base">
              Your journey to a bright future starts here.
            </p>
          </div>
        </div>

        {/* Section heading */}
        <div className="mb-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Explore Features
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Choose a module to get started on your career journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                type="button"
                key={card.path}
                onClick={() => navigate({ to: card.path })}
                className="group text-left bg-card rounded-xl border border-border shadow-card card-hover p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {card.badge && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-1.5 group-hover:text-teal transition-colors">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
                <div className="flex items-center text-teal text-sm font-medium">
                  Explore
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Scholarships", value: "10+", icon: Award },
            { label: "Internships", value: "8+", icon: Briefcase },
            { label: "Mock Tests", value: "5", icon: GraduationCap },
            { label: "AI Mentor", value: "24/7", icon: MessageCircle },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card rounded-xl border border-border p-4 text-center shadow-xs"
              >
                <Icon className="h-5 w-5 text-teal mx-auto mb-2" />
                <div className="font-heading font-bold text-xl text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
