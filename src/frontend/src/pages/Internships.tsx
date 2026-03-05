import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  useGetAllInternships,
  useGetSavedInternships,
  useSaveInternship,
} from "../hooks/useQueries";

type Category = "All" | "Engineering" | "Medical" | "Commerce" | "Arts";

const STATIC_INTERNSHIPS = [
  {
    title: "Software Development Intern",
    description:
      "Work on real-world web and mobile applications using modern tech stack.",
    company: "TechNova Solutions",
    duration: "3 months",
    eligibility: "B.Tech/BCA students, 2nd year+",
    link: "https://internshala.com/internships/computer-science-internship",
    category: "Engineering",
  },
  {
    title: "Data Science Intern",
    description:
      "Analyze datasets, build ML models, and create data visualizations.",
    company: "DataMinds Analytics",
    duration: "2 months",
    eligibility: "B.Tech/BSc students with Python knowledge",
    link: "https://internshala.com/internships/data-science-internship",
    category: "Engineering",
  },
  {
    title: "Civil Engineering Intern",
    description:
      "Site supervision, AutoCAD design, and project management experience.",
    company: "BuildRight Constructions",
    duration: "6 weeks",
    eligibility: "Civil Engineering students, 3rd year+",
    link: "https://internshala.com/internships/civil-engineering-internship",
    category: "Engineering",
  },
  {
    title: "Clinical Research Intern",
    description:
      "Assist in clinical trials, data collection, and medical documentation.",
    company: "MedResearch Institute",
    duration: "3 months",
    eligibility: "MBBS/BPharm students",
    link: "https://internshala.com/internships/medical-internship",
    category: "Medical",
  },
  {
    title: "Hospital Administration Intern",
    description:
      "Learn healthcare management, patient coordination, and hospital operations.",
    company: "Apollo Hospitals",
    duration: "2 months",
    eligibility: "Healthcare management students",
    link: "https://internshala.com/internships/hospital-management-internship",
    category: "Medical",
  },
  {
    title: "Finance & Accounting Intern",
    description:
      "Assist with financial reporting, budgeting, and tax compliance.",
    company: "FinEdge Consulting",
    duration: "3 months",
    eligibility: "B.Com/CA students",
    link: "https://internshala.com/internships/finance-internship",
    category: "Commerce",
  },
  {
    title: "Digital Marketing Intern",
    description:
      "Manage social media, SEO, content creation, and ad campaigns.",
    company: "GrowthHive Agency",
    duration: "2 months",
    eligibility: "Any stream, marketing interest",
    link: "https://internshala.com/internships/digital-marketing-internship",
    category: "Commerce",
  },
  {
    title: "Graphic Design Intern",
    description:
      "Create visual content, branding materials, and UI/UX designs.",
    company: "CreativePixel Studio",
    duration: "2 months",
    eligibility: "Design/Arts students with portfolio",
    link: "https://internshala.com/internships/graphic-design-internship",
    category: "Arts",
  },
  {
    title: "Content Writing Intern",
    description:
      "Write articles, blogs, and marketing copy for digital platforms.",
    company: "WordCraft Media",
    duration: "1 month",
    eligibility: "Any stream, strong writing skills",
    link: "https://internshala.com/internships/content-writing-internship",
    category: "Arts",
  },
  {
    title: "Journalism & Media Intern",
    description:
      "Report news stories, conduct interviews, and produce media content.",
    company: "NewsFirst Digital",
    duration: "3 months",
    eligibility: "Mass Communication/Journalism students",
    link: "https://internshala.com/internships/journalism-internship",
    category: "Arts",
  },
];

const categoryColors: Record<string, string> = {
  Engineering: "bg-teal/10 text-teal border-teal/20",
  Medical:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  Commerce: "bg-amber/20 text-amber-dark border-amber/20",
  Arts: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
};

export default function Internships() {
  const { data: backendInternships, isLoading } = useGetAllInternships();
  const { data: savedTitles = [] } = useGetSavedInternships();
  const saveInternship = useSaveInternship();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [savingTitle, setSavingTitle] = useState<string | null>(null);

  const allInternships = React.useMemo(() => {
    const backendTitles = new Set(
      (backendInternships || []).map((i) => i.title),
    );
    const staticFiltered = STATIC_INTERNSHIPS.filter(
      (i) => !backendTitles.has(i.title),
    );
    return [
      ...(backendInternships || []).map((i) => ({
        ...i,
        category: "Engineering" as const,
      })),
      ...staticFiltered,
    ];
  }, [backendInternships]);

  const filtered = allInternships.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || i.category === category;
    return matchSearch && matchCat;
  });

  const handleSave = async (title: string) => {
    if (savedTitles.includes(title)) {
      toast.info("Already saved to your collection!");
      return;
    }
    setSavingTitle(title);
    try {
      await saveInternship.mutateAsync(title);
      toast.success("Internship saved to your collection!");
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
            src="/assets/generated/internship-illustration.dim_600x400.png"
            alt="Internships"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 gradient-hero opacity-75" />
          <div className="absolute inset-0 flex items-center px-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-5 w-5 text-amber" />
                <span className="text-white/80 text-sm font-medium">
                  Gain Experience
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">
                Internships
              </h1>
              <p className="text-white/75 text-sm">
                Explore opportunities by domain
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search internships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                "All",
                "Engineering",
                "Medical",
                "Commerce",
                "Arts",
              ] as Category[]
            ).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat
                    ? "gradient-teal text-white shadow-teal"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-teal/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Showing {filtered.length} internship{filtered.length !== 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {["i1", "i2", "i3", "i4", "i5", "i6"].map((k) => (
              <Skeleton key={k} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((internship) => {
              const isSaved = savedTitles.includes(internship.title);
              const isSaving = savingTitle === internship.title;
              return (
                <div
                  key={internship.title}
                  className="bg-card rounded-xl border border-border shadow-card card-hover p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={
                        categoryColors[internship.category] ||
                        categoryColors.Engineering
                      }
                    >
                      {internship.category}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleSave(internship.title)}
                      disabled={isSaving}
                      className="text-muted-foreground hover:text-amber transition-colors"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="h-5 w-5 text-amber" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1 leading-snug">
                    {internship.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {internship.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {internship.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2 flex-1 leading-relaxed">
                    {internship.description}
                  </p>
                  <div className="bg-muted/50 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Eligibility:{" "}
                      </span>
                      {internship.eligibility}
                    </p>
                  </div>
                  <a
                    href={internship.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg gradient-teal text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    View Details
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No internships found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
