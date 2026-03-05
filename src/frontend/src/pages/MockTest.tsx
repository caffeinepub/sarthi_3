import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  Send,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import ProtectedRoute from "../components/ProtectedRoute";
import { useGetMockTest, useSubmitMockTest } from "../hooks/useQueries";

const SUBJECTS = [
  {
    id: "Mathematics",
    label: "Mathematics",
    icon: "📐",
    color: "from-teal to-teal-dark",
  },
  {
    id: "Science",
    label: "Science",
    icon: "🔬",
    color: "from-green-600 to-green-800",
  },
  {
    id: "English",
    label: "English",
    icon: "📝",
    color: "from-amber to-amber-dark",
  },
  {
    id: "General Knowledge",
    label: "General Knowledge",
    icon: "🌍",
    color: "from-purple-600 to-purple-800",
  },
  {
    id: "Reasoning",
    label: "Reasoning",
    icon: "🧩",
    color: "from-blue-600 to-blue-800",
  },
];

const TIMER_SECONDS = 600; // 10 minutes

// Fallback questions per subject
const FALLBACK_QUESTIONS: Record<
  string,
  Array<{ question: string; options: string[]; correctAnswer: bigint }>
> = {
  Mathematics: [
    {
      question: "What is the value of √144?",
      options: ["10", "11", "12", "13"],
      correctAnswer: 2n,
    },
    {
      question: "If 3x + 7 = 22, what is x?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 2n,
    },
    {
      question: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correctAnswer: 1n,
    },
    {
      question: "The LCM of 4 and 6 is:",
      options: ["8", "12", "16", "24"],
      correctAnswer: 1n,
    },
    {
      question: "What is the area of a circle with radius 7? (π = 22/7)",
      options: ["144", "154", "164", "174"],
      correctAnswer: 1n,
    },
    {
      question: "Simplify: (2³ × 2²)",
      options: ["2⁴", "2⁵", "2⁶", "2⁷"],
      correctAnswer: 1n,
    },
    {
      question: "What is 25% of 480?",
      options: ["100", "110", "120", "130"],
      correctAnswer: 2n,
    },
    {
      question: "The sum of angles in a triangle is:",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1n,
    },
    {
      question: "What is the HCF of 18 and 24?",
      options: ["3", "4", "6", "8"],
      correctAnswer: 2n,
    },
    {
      question: "If a = 5, b = 3, then a² - b² = ?",
      options: ["14", "16", "18", "20"],
      correctAnswer: 1n,
    },
  ],
  Science: [
    {
      question: "What is the chemical formula of water?",
      options: ["H₂O₂", "H₂O", "HO₂", "H₃O"],
      correctAnswer: 1n,
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      correctAnswer: 2n,
    },
    {
      question: "What is the unit of electric current?",
      options: ["Volt", "Watt", "Ampere", "Ohm"],
      correctAnswer: 2n,
    },
    {
      question: "Photosynthesis occurs in which part of the plant?",
      options: ["Root", "Stem", "Leaf", "Flower"],
      correctAnswer: 2n,
    },
    {
      question: "What is the speed of light?",
      options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"],
      correctAnswer: 1n,
    },
    {
      question: "Which gas is most abundant in Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: 2n,
    },
    {
      question: "DNA stands for:",
      options: [
        "Deoxyribonucleic Acid",
        "Diribonucleic Acid",
        "Deoxyribose Acid",
        "None",
      ],
      correctAnswer: 0n,
    },
    {
      question: "Newton's first law is also called:",
      options: [
        "Law of Acceleration",
        "Law of Inertia",
        "Law of Gravity",
        "Law of Motion",
      ],
      correctAnswer: 1n,
    },
    {
      question: "The powerhouse of the cell is:",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"],
      correctAnswer: 2n,
    },
    {
      question: "Which element has atomic number 1?",
      options: ["Helium", "Oxygen", "Hydrogen", "Carbon"],
      correctAnswer: 2n,
    },
  ],
  English: [
    {
      question: "Choose the correct synonym for 'Brave':",
      options: ["Cowardly", "Timid", "Courageous", "Fearful"],
      correctAnswer: 2n,
    },
    {
      question: "What is the plural of 'child'?",
      options: ["Childs", "Childes", "Children", "Childrens"],
      correctAnswer: 2n,
    },
    {
      question: "Identify the noun in: 'The dog runs fast.'",
      options: ["The", "dog", "runs", "fast"],
      correctAnswer: 1n,
    },
    {
      question: "Choose the correct antonym for 'Ancient':",
      options: ["Old", "Modern", "Historic", "Aged"],
      correctAnswer: 1n,
    },
    {
      question: "Which tense is: 'She has completed her work.'?",
      options: [
        "Simple Past",
        "Present Perfect",
        "Past Perfect",
        "Future Perfect",
      ],
      correctAnswer: 1n,
    },
    {
      question: "The passive voice of 'He writes a letter' is:",
      options: [
        "A letter is written by him",
        "A letter was written by him",
        "A letter will be written by him",
        "A letter has been written by him",
      ],
      correctAnswer: 0n,
    },
    {
      question: "Choose the correct spelling:",
      options: ["Accomodation", "Accommodation", "Acommodation", "Acomodation"],
      correctAnswer: 1n,
    },
    {
      question: "What is a metaphor?",
      options: [
        "A direct comparison using 'like' or 'as'",
        "An indirect comparison without 'like' or 'as'",
        "A type of rhyme",
        "A figure of speech using exaggeration",
      ],
      correctAnswer: 1n,
    },
    {
      question: "The word 'benevolent' means:",
      options: ["Cruel", "Kind and generous", "Selfish", "Angry"],
      correctAnswer: 1n,
    },
    {
      question: "Which is a compound sentence?",
      options: [
        "She sings.",
        "She sings and dances.",
        "Because she sings.",
        "She sings beautifully.",
      ],
      correctAnswer: 1n,
    },
  ],
  "General Knowledge": [
    {
      question: "Who is known as the Father of the Nation in India?",
      options: [
        "Jawaharlal Nehru",
        "Subhas Chandra Bose",
        "Mahatma Gandhi",
        "Bhagat Singh",
      ],
      correctAnswer: 2n,
    },
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "Kolkata", "Chennai", "New Delhi"],
      correctAnswer: 3n,
    },
    {
      question: "Which is the largest ocean in the world?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3n,
    },
    {
      question: "Who wrote the Indian National Anthem?",
      options: [
        "Bankim Chandra Chatterjee",
        "Rabindranath Tagore",
        "Sarojini Naidu",
        "Subramanya Bharati",
      ],
      correctAnswer: 1n,
    },
    {
      question: "The 2024 Olympics were held in:",
      options: ["Tokyo", "Paris", "London", "Los Angeles"],
      correctAnswer: 1n,
    },
    {
      question: "Which is the longest river in India?",
      options: ["Yamuna", "Brahmaputra", "Ganga", "Godavari"],
      correctAnswer: 2n,
    },
    {
      question: "Who invented the telephone?",
      options: [
        "Thomas Edison",
        "Alexander Graham Bell",
        "Nikola Tesla",
        "James Watt",
      ],
      correctAnswer: 1n,
    },
    {
      question: "The United Nations was founded in:",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1n,
    },
    {
      question: "Which country has the largest population?",
      options: ["USA", "Russia", "India", "China"],
      correctAnswer: 2n,
    },
    {
      question: "What is the national animal of India?",
      options: ["Lion", "Elephant", "Tiger", "Peacock"],
      correctAnswer: 2n,
    },
  ],
  Reasoning: [
    {
      question: "If APPLE = 50, MANGO = 56, then GRAPE = ?",
      options: ["48", "50", "52", "54"],
      correctAnswer: 1n,
    },
    {
      question: "Find the odd one out: 2, 3, 5, 7, 9, 11",
      options: ["2", "9", "11", "3"],
      correctAnswer: 1n,
    },
    {
      question: "Complete the series: 1, 4, 9, 16, ?",
      options: ["20", "24", "25", "30"],
      correctAnswer: 2n,
    },
    {
      question: "If A = 1, B = 2, C = 3... then CAB = ?",
      options: ["312", "321", "123", "213"],
      correctAnswer: 0n,
    },
    {
      question: "A is taller than B. B is taller than C. Who is shortest?",
      options: ["A", "B", "C", "Cannot determine"],
      correctAnswer: 2n,
    },
    {
      question: "Mirror image: If CLOCK shows 3:00, what does the mirror show?",
      options: ["3:00", "9:00", "6:00", "12:00"],
      correctAnswer: 1n,
    },
    {
      question: "Complete: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "46"],
      correctAnswer: 1n,
    },
    {
      question:
        "If Monday is 2 days after Saturday, what day is 3 days before Wednesday?",
      options: ["Sunday", "Monday", "Saturday", "Friday"],
      correctAnswer: 0n,
    },
    {
      question: "Find the missing number: 3, 6, 11, 18, 27, ?",
      options: ["36", "38", "40", "42"],
      correctAnswer: 1n,
    },
    {
      question: "Which number replaces '?': 4 : 16 :: 7 : ?",
      options: ["42", "49", "56", "63"],
      correctAnswer: 1n,
    },
  ],
};

export default function MockTest() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [testStarted, setTestStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: backendQuestions, isLoading } = useGetMockTest(
    selectedSubject || "",
  );
  const submitMockTest = useSubmitMockTest();

  const questions = React.useMemo(() => {
    if (selectedSubject && backendQuestions && backendQuestions.length > 0)
      return backendQuestions;
    if (selectedSubject && FALLBACK_QUESTIONS[selectedSubject])
      return FALLBACK_QUESTIONS[selectedSubject];
    return [];
  }, [selectedSubject, backendQuestions]);

  useEffect(() => {
    if (!testStarted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted]);

  const handleStartTest = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(TIMER_SECONDS);
    setTestStarted(true);
  };

  const handleSubmit = async (_autoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!selectedSubject) return;
    try {
      const answersArray = questions.map((_, i) => BigInt(answers[i] ?? 0));
      const result = await submitMockTest.mutateAsync({
        subject: selectedSubject,
        answers: answersArray,
      });
      navigate({
        to: "/mock-test/result",
        search: {
          subject: selectedSubject,
          score: Number(result.score),
          total: questions.length,
          rating: result.performanceRating,
        },
      });
    } catch (_err) {
      toast.error("Failed to submit test. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Progress = answered questions / total questions * 100
  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Subject selection screen
  if (!testStarted) {
    return (
      <ProtectedRoute>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Mock Test
              </h1>
              <p className="text-muted-foreground text-sm">
                Test your knowledge with timed quizzes
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden mb-6 shadow-card">
            <img
              src="/assets/generated/quiz-illustration.dim_600x400.png"
              alt="Mock Test"
              className="w-full h-40 object-cover"
            />
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-6 mb-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
              Choose a Subject
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              Select a subject to start your 10-minute mock test with 10
              questions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <button
                  type="button"
                  key={subject.id}
                  onClick={() => handleStartTest(subject.id)}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-teal/50 hover:bg-teal/5 transition-all text-left group"
                >
                  <span className="text-2xl">{subject.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-teal transition-colors">
                      {subject.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      10 questions · 10 min
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber/10 border border-amber/30 rounded-xl p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">
                Instructions
              </p>
              <ul className="text-muted-foreground text-xs mt-1 space-y-1 list-disc list-inside">
                <li>You have 10 minutes to complete the test</li>
                <li>Each question has one correct answer</li>
                <li>You can navigate between questions freely</li>
                <li>Test auto-submits when time runs out</li>
              </ul>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                {selectedSubject}
              </h1>
              <p className="text-muted-foreground text-xs">Mock Test</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono font-bold text-sm ${
              timeLeft <= 60
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span>
                  {answeredCount} of {questions.length} answered
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <h2 className="font-heading text-lg font-semibold text-foreground mb-5">
              {questions[currentIndex]?.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {questions[currentIndex]?.options.map((option, i) => (
                <button
                  type="button"
                  key={`mock-opt-${i}-${option}`}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentIndex]: i }))
                  }
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                    answers[currentIndex] === i
                      ? "border-teal bg-teal/10 text-teal"
                      : "border-border bg-background hover:border-teal/40 hover:bg-teal/5 text-foreground"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                      answers[currentIndex] === i
                        ? "bg-teal text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {questions.map((q, i) => (
                  <button
                    type="button"
                    key={`mock-q-dot-${q.question.slice(0, 10)}-${i}`}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex
                        ? "bg-teal w-4"
                        : answers[i] !== undefined
                          ? "bg-teal/40"
                          : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {currentIndex < questions.length - 1 ? (
                <Button
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1),
                    )
                  }
                  className="gradient-teal text-white border-0 hover:opacity-90 gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={submitMockTest.isPending}
                  className="gradient-teal text-white border-0 hover:opacity-90 gap-1"
                >
                  {submitMockTest.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-4">
          {answeredCount} of {questions.length} questions answered
        </p>
      </div>
    </ProtectedRoute>
  );
}
