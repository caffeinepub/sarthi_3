import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  useGetCareerQuizQuestions,
  useSubmitCareerQuiz,
} from "../hooks/useQueries";

// Fallback questions if backend returns empty
const FALLBACK_QUESTIONS = [
  {
    question: "Which subject do you enjoy the most?",
    options: ["Mathematics", "Biology", "Economics", "History"],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "What activity do you prefer in free time?",
    options: [
      "Solving puzzles",
      "Helping others",
      "Analyzing data",
      "Writing stories",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "Which career sounds most exciting to you?",
    options: [
      "Software Engineer",
      "Doctor",
      "Chartered Accountant",
      "Journalist",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "How do you prefer to work?",
    options: [
      "With machines/computers",
      "With people/patients",
      "With numbers/finance",
      "With creativity/art",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "What type of problems do you like solving?",
    options: [
      "Technical problems",
      "Health problems",
      "Business problems",
      "Social problems",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "Which skill do you want to develop most?",
    options: [
      "Coding/Programming",
      "Medical knowledge",
      "Financial analysis",
      "Communication",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "What motivates you most?",
    options: [
      "Building technology",
      "Saving lives",
      "Creating wealth",
      "Expressing creativity",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "Which environment do you prefer working in?",
    options: [
      "Tech company/lab",
      "Hospital/clinic",
      "Office/bank",
      "Studio/field",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "What is your strongest skill?",
    options: [
      "Logical thinking",
      "Empathy/care",
      "Analytical thinking",
      "Creative thinking",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
  {
    question: "Which subject would you study for 5 years?",
    options: [
      "Computer Science",
      "Medicine/Biology",
      "Commerce/Finance",
      "Arts/Humanities",
    ],
    categoryScores: [3n, 1n, 2n, 0n],
  },
];

export default function CareerQuiz() {
  const navigate = useNavigate();
  const { data: backendQuestions, isLoading } = useGetCareerQuizQuestions();
  const submitQuiz = useSubmitCareerQuiz();

  const questions =
    backendQuestions && backendQuestions.length > 0
      ? backendQuestions
      : FALLBACK_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQuestion = questions[currentIndex];
  // Progress = number of answered questions / total questions * 100
  // Starts at 0% on first question, reaches 100% only after all are answered
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const _isAnswered = answers[currentIndex] !== undefined;
  const allAnswered = answeredCount === questions.length;

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    try {
      const answersArray = questions.map((_, i) => BigInt(answers[i] ?? 0));
      await submitQuiz.mutateAsync(answersArray);
      navigate({ to: "/career-quiz/result" });
    } catch (_err) {
      toast.error("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Career Quiz
            </h1>
            <p className="text-muted-foreground text-sm">
              Discover your ideal career stream
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="rounded-xl overflow-hidden mb-6 shadow-card">
          <img
            src="/assets/generated/quiz-illustration.dim_600x400.png"
            alt="Career Quiz"
            className="w-full h-40 object-cover"
          />
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
              {currentQuestion?.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion?.options.map((option, i) => (
                <button
                  type="button"
                  key={`opt-${i}-${option}`}
                  onClick={() => handleAnswer(i)}
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
                onClick={handlePrev}
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
                    key={`q-dot-${q.question.slice(0, 10)}-${i}`}
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
                  onClick={handleNext}
                  className="gradient-teal text-white border-0 hover:opacity-90 gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitQuiz.isPending}
                  className="gradient-teal text-white border-0 hover:opacity-90 gap-1"
                >
                  {submitQuiz.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
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

        {/* Answered count */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          {answeredCount} of {questions.length} questions answered
        </p>
      </div>
    </ProtectedRoute>
  );
}
