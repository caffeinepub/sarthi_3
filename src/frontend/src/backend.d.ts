import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CareerQuizResult {
    careerScope: string;
    score: bigint;
    recommendedStream: string;
    suggestedSubjects: Array<string>;
}
export type Time = bigint;
export interface MockTestResult {
    performanceRating: string;
    subject: string;
    score: bigint;
    correctAnswers: Array<bigint>;
}
export interface Scholarship {
    title: string;
    link: string;
    description: string;
    eligibility: string;
}
export interface Internship {
    title: string;
    duration: string;
    link: string;
    description: string;
    eligibility: string;
    company: string;
}
export interface ChatMessage {
    sender: string;
    message: string;
    timestamp: Time;
}
export interface Profile {
    dateOfBirth: string;
    appearance: Variant_dark_light;
    school: string;
    name: string;
    language: string;
    classYear: string;
}
export interface MockTestQuestion {
    question: string;
    correctAnswer: bigint;
    options: Array<string>;
}
export interface CareerQuizQuestion {
    question: string;
    categoryScores: Array<bigint>;
    options: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_dark_light {
    dark = "dark",
    light = "light"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllInternships(): Promise<Array<Internship>>;
    getAllScholarships(): Promise<Array<Scholarship>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCareerQuizQuestions(): Promise<Array<CareerQuizQuestion>>;
    getCareerQuizResult(): Promise<CareerQuizResult | null>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getLastMessage(): Promise<ChatMessage | null>;
    getMockTest(subject: string): Promise<Array<MockTestQuestion>>;
    getProfile(): Promise<Profile>;
    getSavedInternships(): Promise<Array<string> | null>;
    getSavedScholarships(): Promise<Array<string> | null>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    logout(): Promise<void>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    saveInternship(internshipTitle: string): Promise<void>;
    saveProfile(profile: Profile): Promise<void>;
    saveScholarship(scholarshipTitle: string): Promise<void>;
    sendMessageToChatbot(message: string): Promise<ChatMessage>;
    submitCareerQuiz(answers: Array<bigint>): Promise<CareerQuizResult>;
    submitMockTest(subject: string, answers: Array<bigint>): Promise<MockTestResult>;
}
