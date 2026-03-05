import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  useGetAllScholarships,
  useGetSavedScholarships,
  useSaveScholarship,
} from "../hooks/useQueries";

// Augmented static data to supplement backend
const STATIC_SCHOLARSHIPS = [
  {
    title: "National Talent Search Scholarship (NTSE)",
    description:
      "Prestigious national scholarship for talented students in Class X.",
    eligibility: "Class X students, merit-based",
    link: "https://ncert.nic.in/national-talent-examination.php",
    type: "Government",
  },
  {
    title: "Prime Minister's Scholarship Scheme",
    description: "For wards of ex-servicemen and ex-coast guard personnel.",
    eligibility: "Wards of ex-servicemen, min 60% marks",
    link: "https://ksb.gov.in/pm-scholarship.htm",
    type: "Government",
  },
  {
    title: "Central Sector Scheme of Scholarships",
    description:
      "For college and university students from low-income families.",
    eligibility: "12th pass, family income < ₹8 lakh/year",
    link: "https://scholarships.gov.in",
    type: "Government",
  },
  {
    title: "Inspire Scholarship (DST)",
    description: "For students pursuing natural and basic sciences.",
    eligibility: "Top 1% in Class XII, pursuing BSc/BS/Int. MSc",
    link: "https://online-inspire.gov.in",
    type: "Government",
  },
  {
    title: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
    description:
      "Fellowship for students interested in research careers in science.",
    eligibility: "Class XI to 1st year BSc/BS/Int. MSc",
    link: "https://kvpy.iisc.ac.in",
    type: "Government",
  },
  {
    title: "Aditya Birla Scholarship",
    description:
      "For students admitted to premier institutions like IITs, IIMs, BITS.",
    eligibility: "Students at IIT/IIM/BITS, merit-based",
    link: "https://adityabirlascholars.net",
    type: "Private",
  },
  {
    title: "Tata Scholarship (Cornell University)",
    description:
      "For Indian students pursuing undergraduate studies at Cornell.",
    eligibility: "Indian nationals, financial need-based",
    link: "https://tatascholarship.cornell.edu",
    type: "Private",
  },
  {
    title: "Reliance Foundation Scholarship",
    description: "For undergraduate students in STEM and humanities.",
    eligibility: "1st year UG students, merit + need based",
    link: "https://reliancefoundation.org/scholarships",
    type: "Private",
  },
  {
    title: "Sitaram Jindal Foundation Scholarship",
    description: "For meritorious students from economically weaker sections.",
    eligibility: "Class XI onwards, family income < ₹2 lakh/year",
    link: "https://sitaramjindalfoundation.org",
    type: "Private",
  },
  {
    title: "Buddy4Study Scholarship",
    description:
      "Platform aggregating multiple scholarships for Indian students.",
    eligibility: "Various — check portal for details",
    link: "https://buddy4study.com",
    type: "Private",
  },
];

export default function Scholarships() {
  const { data: backendScholarships, isLoading } = useGetAllScholarships();
  const { data: savedTitles = [] } = useGetSavedScholarships();
  const saveScholarship = useSaveScholarship();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Government" | "Private">("All");
  const [savingTitle, setSavingTitle] = useState<string | null>(null);

  // Merge backend + static, deduplicate by title
  const allScholarships = React.useMemo(() => {
    const backendTitles = new Set(
      (backendScholarships || []).map((s) => s.title),
    );
    const staticFiltered = STATIC_SCHOLARSHIPS.filter(
      (s) => !backendTitles.has(s.title),
    );
    return [
      ...(backendScholarships || []).map((s) => ({
        ...s,
        type: "Government" as const,
      })),
      ...staticFiltered,
    ];
  }, [backendScholarships]);

  const filtered = allScholarships.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.type === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = async (title: string) => {
    if (savedTitles.includes(title)) {
      toast.info("Already saved to your collection!");
      return;
    }
    setSavingTitle(title);
    try {
      await saveScholarship.mutateAsync(title);
      toast.success("Scholarship saved to your collection!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSavingTitle(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="rounded-2xl overflow-hidden mb-6 shadow-card relative">
          <img
            src="/assets/generated/scholarship-illustration.dim_600x400.png"
            alt="Scholarships"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-75" />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-5 w-5 text-amber" />
                <span className="text-white/80 text-sm font-medium">
                  Financial Support
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">
                Scholarships
              </h1>
              <p className="text-white/75 text-sm">
                Find the right scholarship for your education
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Government", "Private"] as const).map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? "gradient-teal text-white shadow-teal"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-teal/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filtered.length} scholarship
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Cards */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((scholarship) => {
              const isSaved = savedTitles.includes(scholarship.title);
              const isSaving = savingTitle === scholarship.title;
              return (
                <div
                  key={scholarship.title}
                  className="bg-card rounded-xl border border-border shadow-card card-hover p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={
                        scholarship.type === "Government"
                          ? "bg-teal/10 text-teal border-teal/20"
                          : "bg-amber/20 text-amber-dark border-amber/20"
                      }
                    >
                      {scholarship.type}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleSave(scholarship.title)}
                      disabled={isSaving}
                      className="text-muted-foreground hover:text-amber transition-colors"
                      title={isSaved ? "Saved" : "Save to collection"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-5 w-5 text-amber" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 leading-snug">
                    {scholarship.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 flex-1 leading-relaxed">
                    {scholarship.description}
                  </p>
                  <div className="bg-muted/50 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Eligibility:{" "}
                      </span>
                      {scholarship.eligibility}
                    </p>
                  </div>
                  <a
                    href={scholarship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg gradient-teal text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply Now
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No scholarships found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
