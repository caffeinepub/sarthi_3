import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  GraduationCap,
  RefreshCw,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function MockTestResult() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    subject?: string;
    score?: number;
    total?: number;
    rating?: string;
  };

  const subject = search.subject || "Unknown";
  const score = search.score ?? 0;
  const total = search.total ?? 10;
  const rating = search.rating || "Needs Improvement";
  const percentage = Math.round((score / total) * 100);

  const ratingConfig = {
    Excellent: {
      color: "from-teal to-teal-dark",
      emoji: "🏆",
      message: "Outstanding performance! You have mastered this subject.",
    },
    Good: {
      color: "from-amber to-amber-dark",
      emoji: "👍",
      message: "Good job! Keep practicing to reach excellence.",
    },
    "Needs Improvement": {
      color: "from-red-500 to-red-700",
      emoji: "📚",
      message: "Keep studying! Consistent practice will improve your score.",
    },
  };

  const config =
    ratingConfig[rating as keyof typeof ratingConfig] ||
    ratingConfig["Needs Improvement"];

  const getCircleColor = () => {
    if (percentage >= 80) return "stroke-teal";
    if (percentage >= 50) return "stroke-amber";
    return "stroke-destructive";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/mock-test" })}
          className="mb-6 gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mock Tests
        </Button>

        <div className="space-y-5">
          {/* Result Hero */}
          <div
            className={`bg-gradient-to-br ${config.color} rounded-2xl p-8 text-white text-center shadow-card`}
          >
            <div className="text-4xl mb-3">{config.emoji}</div>
            <h1 className="font-heading text-2xl font-bold mb-1">{rating}!</h1>
            <p className="text-white/80 text-sm">{subject} Test Result</p>
          </div>

          {/* Score Circle */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-8 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg
                className="w-32 h-32 -rotate-90"
                viewBox="0 0 100 100"
                aria-label="Score circle"
                role="img"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={getCircleColor()}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-bold text-foreground">
                  {score}
                </span>
                <span className="text-xs text-muted-foreground">/ {total}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="font-heading text-xl font-bold text-foreground">
                {percentage}%
              </p>
              <p className="text-muted-foreground text-sm">{config.message}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Correct",
                value: score,
                icon: Target,
                color: "text-teal",
              },
              {
                label: "Wrong",
                value: total - score,
                icon: TrendingUp,
                color: "text-destructive",
              },
              {
                label: "Score %",
                value: `${percentage}%`,
                icon: Trophy,
                color: "text-amber",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-card rounded-xl border border-border p-4 text-center shadow-xs"
                >
                  <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate({ to: "/mock-test" })}
              variant="outline"
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Another Test
            </Button>
            <Button
              onClick={() => navigate({ to: "/dashboard" })}
              className="flex-1 gradient-teal text-white border-0 hover:opacity-90"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
