export interface User {
  id: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  role: 'ROLE_STUDENT' | 'ROLE_ADMIN';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FREE';
  courseAccess: boolean;
  createdAt: string;
}

export interface CourseModule {
  id: number;
  moduleOrder: number;
  title: string;
  slug: string;
  description: string;
  iconName: string;
  totalTopics: number;
  completedTopics: number;
  completionPercentage: number;
}

export interface Subtopic {
  id: number;
  subtopicOrder: number;
  title: string;
  contentMarkdown: string;
  videoUrl?: string;
}

export interface LearningMaterial {
  id: number;
  title: string;
  pdfUrl: string;
  fileSizeBytes: number;
  version: number;
  downloadCount: number;
  uploadedAt: string;
  topicTitle?: string;
  topicSlug?: string;
  moduleTitle?: string;
}

export interface TopicDetails {
  id: number;
  title: string;
  slug: string;
  moduleTitle: string;
  moduleSlug: string;
  estimatedMinutes: number;
  subtopics: Subtopic[];
  materials: LearningMaterial[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  materialRead: boolean;
  exercisesCompleted: boolean;
  assessmentPassed: boolean;
  timeSpentSeconds: number;
}

export interface QuestionSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  expectedTimeComplexity?: string;
  expectedSpaceComplexity?: string;
  solved: boolean;
}

export interface TestCase {
  id: number;
  inputData: string;
  expectedOutput: string;
  hidden: boolean;
  testOrder: number;
}

export interface QuestionDetails {
  id: string;
  title: string;
  slug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topicTitle: string;
  topicSlug: string;
  moduleTitle: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  expectedTimeComplexity?: string;
  expectedSpaceComplexity?: string;
  hints?: string;
  solved: boolean;
  sampleTestCases: TestCase[];
  starterCode: string;
}

export interface TestCaseResult {
  testCaseId: number;
  testOrder: number;
  passed: boolean;
  hidden: boolean;
  inputData?: string;
  expectedOutput?: string;
  actualOutput?: string;
  errorMessage?: string;
  executionTimeMs?: number;
}

export interface CodeRunResult {
  stdout: string;
  stderr: string;
  compileOutput?: string;
  status: string;
  executionTimeMs?: number;
  memoryUsedKb?: number;
}

export interface CodeSubmitResult {
  submissionId: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED';
  passedTestCases: number;
  totalTestCases: number;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  testCaseResults: TestCaseResult[];
  solved: boolean;
  message: string;
}

export interface DashboardStats {
  studentName: string;
  studentEmail: string;
  overallProgressPercentage: number;
  coreJavaCompletionPercentage: number;
  totalTopics: number;
  completedTopics: number;
  pendingTopics: number;
  totalCodingQuestions: number;
  solvedQuestions: number;
  failedQuestions: number;
  totalSubmissions: number;
  codingAccuracy: number;
  currentLearningStreakDays: number;
  downloadedStudyMaterialsCount: number;
  recommendedNextTopic?: {
    id: number;
    title: string;
    slug: string;
    moduleTitle: string;
    estimatedMinutes: number;
  };
  moduleProgressList: {
    moduleId: number;
    title: string;
    slug: string;
    moduleOrder: number;
    totalTopics: number;
    completedTopics: number;
    completionPercentage: number;
  }[];
  recentActivities: {
    activityType: string;
    description: string;
    timestamp: string;
  }[];
}

export interface AssessmentQuestion {
  id: number;
  questionType: string;
  questionText: string;
  codeSnippet?: string;
  options: string[];
}

export interface AssessmentReviewItem {
  questionId: number;
  questionText: string;
  codeSnippet?: string;
  options: string[];
  selectedOptionIndex: number;
  correctOptionIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface AssessmentResult {
  attemptId: string;
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  reviewItems: AssessmentReviewItem[];
}
