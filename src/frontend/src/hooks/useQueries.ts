import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CareerQuizQuestion,
  CareerQuizResult,
  ChatMessage,
  Internship,
  MockTestQuestion,
  MockTestResult,
  Profile,
  Scholarship,
} from "../backend";
import { Variant_dark_light } from "../backend";
import { useActor } from "./useActor";

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Profile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ---- Career Quiz ----

export function useGetCareerQuizQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<CareerQuizQuestion[]>({
    queryKey: ["careerQuizQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCareerQuizQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitCareerQuiz() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answers: bigint[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitCareerQuiz(answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careerQuizResult"] });
    },
  });
}

export function useGetCareerQuizResult() {
  const { actor, isFetching } = useActor();

  return useQuery<CareerQuizResult | null>({
    queryKey: ["careerQuizResult"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCareerQuizResult();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Scholarships ----

export function useGetAllScholarships() {
  const { actor, isFetching } = useActor();

  return useQuery<Scholarship[]>({
    queryKey: ["scholarships"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScholarships();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSavedScholarships() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["savedScholarships"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getSavedScholarships();
      return result ?? [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveScholarship() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveScholarship(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedScholarships"] });
    },
  });
}

// ---- Internships ----

export function useGetAllInternships() {
  const { actor, isFetching } = useActor();

  return useQuery<Internship[]>({
    queryKey: ["internships"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInternships();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSavedInternships() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["savedInternships"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getSavedInternships();
      return result ?? [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveInternship() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveInternship(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedInternships"] });
    },
  });
}

// ---- Mock Test ----

export function useGetMockTest(subject: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MockTestQuestion[]>({
    queryKey: ["mockTest", subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMockTest(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useSubmitMockTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subject,
      answers,
    }: { subject: string; answers: bigint[] }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitMockTest(subject, answers);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["mockTestResult", variables.subject],
      });
    },
  });
}

// ---- Chatbot ----

export function useGetChatHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendMessageToChatbot(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });
}
