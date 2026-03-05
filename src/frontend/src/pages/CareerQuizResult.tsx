import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  Target,
} from "lucide-react";
import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useGetCareerQuizResult } from "../hooks/useQueries";

const streamDetails: Record<
  string,
  { subjects: string[]; scope: string; color: string }
> = {
  "Science/Engineering": {
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Computer Science",
      "Biology (optional)",
    ],
    scope:
      "Careers in Software Engineering, Data Science, Mechanical Engineering, Civil Engineering, Electronics, Research & Development, and more.",
    color: "from-teal to-teal-dark",
  },
  Medical: {
    subjects: ["Biology", "Chemistry", "Physics", "Psychology", "Biochemistry"],
    scope:
      "Careers in Medicine (MBBS), Dentistry, Pharmacy, Nursing, Physiotherapy, Biotechnology, and Healthcare Management.",
    color: "from-green-600 to-green-800",
  },
  Commerce: {
    subjects: [
      "Accountancy",
      "Business Studies",
      "Economics",
      "Mathematics",
      "Statistics",
    ],
    scope:
      "Careers in Chartered Accountancy, MBA, Banking, Finance, Marketing, Entrepreneurship, and Business Analytics.",
    color: "from-amber to-amber-dark",
  },
  Arts: {
    subjects: [
      "History",
      "Political Science",
      "Sociology",
      "Psychology",
      "Literature",
      "Fine Arts",
    ],
    scope:
      "Careers in Law, Journalism, Civil Services (IAS/IPS), Teaching, Social Work, Design, and Media.",
    color: "from-purple-600 to-purple-800",
  },
};

export default function CareerQuizResult() {
  const navigate = useNavigate();
  const { data: result, isLoading } = useGetCareerQuizResult();

  const stream = result?.recommendedStream || "Science/Engineering";
  const details = streamDetails[stream] || streamDetails["Science/Engineering"];
  const subjects = result?.suggestedSubjects?.length
    ? result.suggestedSubjects
    : details.subjects;
  const scope = result?.careerScope || details.scope;

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/dashboard" })}
          className="mb-6 gap-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Result Hero */}
            <div
              className={`bg-gradient-to-br ${details.color} rounded-2xl p-8 text-white shadow-card`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    Your Recommended Stream
                  </p>
                  <h1 className="font-heading text-2xl font-bold">{stream}</h1>
                </div>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Analysis Complete</span>
              </div>
            </div>

            {/* Suggested Subjects */}
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-teal" />
                <h2 className="font-heading font-semibold text-lg text-foreground">
                  Suggested Subjects
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="bg-teal/10 text-teal border-teal/20 px-3 py-1 text-sm"
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Career Scope */}
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-amber" />
                <h2 className="font-heading font-semibold text-lg text-foreground">
                  Future Career Scope
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{scope}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate({ to: "/career-quiz" })}
                variant="outline"
                className="flex-1 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Quiz
              </Button>
              <Button
                onClick={() => navigate({ to: "/scholarships" })}
                className="flex-1 gradient-teal text-white border-0 hover:opacity-90"
              >
                Find Scholarships →
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
