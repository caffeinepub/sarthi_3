import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Loader2,
  MessageCircle,
} from "lucide-react";
import React, { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/dashboard" });
    }
  }, [identity, navigate]);

  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Career Quiz",
      desc: "Discover your ideal career stream through our AI-powered aptitude assessment.",
      color: "bg-teal/10 text-teal",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Scholarships",
      desc: "Find government and private scholarships with direct links to apply.",
      color: "bg-amber/20 text-amber-dark",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Internships",
      desc: "Explore internships by domain — Engineering, Medical, Commerce, Arts.",
      color: "bg-teal/10 text-teal",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Mock Tests",
      desc: "Practice with subject-wise mock tests and track your performance.",
      color: "bg-amber/20 text-amber-dark",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "AI Chatbot",
      desc: "Get personalized guidance from our AI mentor, available 24/7.",
      color: "bg-teal/10 text-teal",
    },
  ];

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/sarthi-logo.dim_256x256.png"
              alt="Sarthi"
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="font-heading font-bold text-xl text-teal">
              Sarthi
            </span>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="gradient-teal text-white border-0 hover:opacity-90 font-semibold px-6"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-white space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                AI-Powered Career Guidance
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                Your Digital Mentor for{" "}
                <span className="text-amber">Career Success</span>
              </h1>
              <p className="text-white/85 text-lg leading-relaxed">
                Sarthi helps school and college students discover the right
                career path, find scholarships, explore internships, and get
                AI-powered guidance — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  size="lg"
                  className="bg-amber text-amber-foreground hover:bg-amber-dark border-0 font-bold text-base shadow-amber"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Get Started Free
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-white/60 text-sm">
                Secure login with Internet Identity · No password needed
              </p>
            </div>
            <div className="hidden md:block">
              <img
                src="/assets/generated/dashboard-hero.dim_1200x400.png"
                alt="Sarthi Dashboard"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From career discovery to skill building, Sarthi is your all-in-one
            educational companion.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border shadow-card card-hover"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-2xl border border-border p-10 shadow-card">
          <GraduationCap className="h-12 w-12 text-teal mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
            Ready to Find Your Path?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of students who have discovered their ideal career
            with Sarthi.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="gradient-teal text-white border-0 hover:opacity-90 font-bold px-8"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Start Your Journey"
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        <p>
          Built with <span className="text-red-500">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "sarthi-app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal hover:underline"
          >
            caffeine.ai
          </a>{" "}
          · © {new Date().getFullYear()} Sarthi
        </p>
      </footer>
    </div>
  );
}
