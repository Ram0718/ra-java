import type { DashboardStats } from '../types';

// Safe localStorage access wrapper
const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[RA-Java Storage] Failed to read '${key}':`, err);
    return null;
  }
};

const safeSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[RA-Java Storage] Failed to write '${key}':`, err);
  }
};

const safeRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[RA-Java Storage] Failed to remove '${key}':`, err);
  }
};

// -------------------------------------------------------------
// 0. Curriculum Topic Definitions & 3-Question Per Topic Mapping
// -------------------------------------------------------------
export interface TopicDefinition {
  id: number;
  order: number;
  slug: string;
  title: string;
  moduleOrder: number;
  moduleSlug: string;
  moduleTitle: string;
  questionSlugs: string[];
  requiresQuiz?: boolean;
}

export const TOPIC_DEFINITIONS: TopicDefinition[] = [
  {
    id: 1,
    order: 1,
    slug: 'intro-to-java',
    title: 'Introduction to Java & JVM Architecture',
    moduleOrder: 1,
    moduleSlug: 'java-fundamentals',
    moduleTitle: 'Java Fundamentals',
    questionSlugs: [],
    requiresQuiz: true,
  },
  {
    id: 2,
    order: 2,
    slug: 'main-method-and-syntax',
    title: 'Java Program Structure & The Main Method',
    moduleOrder: 1,
    moduleSlug: 'java-fundamentals',
    moduleTitle: 'Java Fundamentals',
    questionSlugs: ['print-welcome-message', 'print-multiline-bio', 'echo-greeting-input'],
  },
  {
    id: 3,
    order: 3,
    slug: 'variables-and-data-types',
    title: 'Variables, Data Types & Basic Arithmetic',
    moduleOrder: 1,
    moduleSlug: 'java-fundamentals',
    moduleTitle: 'Java Fundamentals',
    questionSlugs: ['swap-two-numbers', 'celsius-to-fahrenheit', 'rectangle-area-perimeter'],
  },
  {
    id: 4,
    order: 4,
    slug: 'if-else-statements',
    title: 'If-Else & Decision Logic',
    moduleOrder: 2,
    moduleSlug: 'conditional-statements',
    moduleTitle: 'Conditional Statements',
    questionSlugs: ['check-leap-year', 'find-quadrant', 'valid-triangle-type'],
  },
  {
    id: 5,
    order: 5,
    slug: 'for-loop',
    title: 'For Loop Mastery',
    moduleOrder: 3,
    moduleSlug: 'loops-and-iterations',
    moduleTitle: 'Loops & Iterations',
    questionSlugs: ['print-even-numbers-to-n', 'sum-of-digits', 'armstrong-numbers-in-range'],
  },
  {
    id: 6,
    order: 6,
    slug: 'while-and-do-while-loops',
    title: 'While & Do-While Loops',
    moduleOrder: 3,
    moduleSlug: 'loops-and-iterations',
    moduleTitle: 'Loops & Iterations',
    questionSlugs: ['count-digits-while', 'reverse-and-palindrome', 'digit-sum-divisible-number'],
  },
  {
    id: 7,
    order: 7,
    slug: 'methods-and-recursion',
    title: 'Methods & Recursion',
    moduleOrder: 4,
    moduleSlug: 'methods-and-recursion',
    moduleTitle: 'Methods & Recursion',
    questionSlugs: ['gcd-method', 'fibonacci-memo', 'tower-of-hanoi'],
  },
  {
    id: 8,
    order: 8,
    slug: 'array-algorithms',
    title: 'Array Data Structures & Algorithms',
    moduleOrder: 5,
    moduleSlug: 'arrays',
    moduleTitle: 'Arrays & Multi-dimensional Arrays',
    questionSlugs: ['array-min-max', 'two-sum-sorted', 'maximum-subarray-kadane'],
  },
  {
    id: 9,
    order: 9,
    slug: 'string-internals',
    title: 'Strings & String Pool',
    moduleOrder: 6,
    moduleSlug: 'strings',
    moduleTitle: 'Strings & String Pool',
    questionSlugs: ['check-valid-anagram', 'longest-substring-unique', 'longest-palindromic-substring'],
  },
  {
    id: 10,
    order: 10,
    slug: 'polymorphism-inheritance',
    title: 'Object-Oriented Programming & Polymorphism',
    moduleOrder: 7,
    moduleSlug: 'object-oriented-programming',
    moduleTitle: 'Object-Oriented Programming',
    questionSlugs: ['encapsulated-bank-account', 'shape-area-interface', 'design-lru-cache'],
  },
  {
    id: 11,
    order: 11,
    slug: 'exception-architecture',
    title: 'Exception Handling Architecture',
    moduleOrder: 8,
    moduleSlug: 'exception-handling',
    moduleTitle: 'Exception Handling & Advanced Java',
    questionSlugs: ['safe-integer-division', 'custom-age-validator', 'resource-leak-prevention'],
  },
  {
    id: 12,
    order: 12,
    slug: 'hashmap-internals',
    title: 'Collections Framework & HashMap Internals',
    moduleOrder: 9,
    moduleSlug: 'collections-framework',
    moduleTitle: 'Collections Framework',
    questionSlugs: ['frequency-counter-hashmap', 'kth-largest-priorityqueue', 'top-k-frequent-words'],
  },
  {
    id: 13,
    order: 13,
    slug: 'stream-api-lambdas',
    title: 'Stream API & Functional Lambdas',
    moduleOrder: 10,
    moduleSlug: 'generics-and-java-8',
    moduleTitle: 'Generics & Java 8 Streams',
    questionSlugs: ['stream-filter-square', 'stream-grouping-by-length', 'second-highest-salary-stream'],
  },
  {
    id: 14,
    order: 14,
    slug: 'concurrency-sync',
    title: 'Multithreading & Concurrency',
    moduleOrder: 11,
    moduleSlug: 'multithreading-concurrency',
    moduleTitle: 'Multithreading & Concurrency',
    questionSlugs: ['multithreaded-printer', 'atomic-counter-sim', 'deadlock-detection'],
  },
  {
    id: 15,
    order: 15,
    slug: 'jdbc-transactions',
    title: 'File Handling & JDBC Transactions',
    moduleOrder: 12,
    moduleSlug: 'file-handling-and-jdbc',
    moduleTitle: 'File Handling & JDBC',
    questionSlugs: ['sql-injection-sanitizer', 'csv-file-parser', 'acid-transaction-simulator'],
  },
];

export const MODULE_DEFINITIONS = [
  { moduleId: 1, title: 'Java Fundamentals', slug: 'java-fundamentals', moduleOrder: 1, topicIds: [1, 2, 3] },
  { moduleId: 2, title: 'Conditional Statements', slug: 'conditional-statements', moduleOrder: 2, topicIds: [4] },
  { moduleId: 3, title: 'Loops & Iterations', slug: 'loops-and-iterations', moduleOrder: 3, topicIds: [5, 6] },
  { moduleId: 4, title: 'Methods & Recursion', slug: 'methods-and-recursion', moduleOrder: 4, topicIds: [7] },
  { moduleId: 5, title: 'Arrays & Multi-dimensional Arrays', slug: 'arrays', moduleOrder: 5, topicIds: [8] },
  { moduleId: 6, title: 'Strings & String Pool', slug: 'strings', moduleOrder: 6, topicIds: [9] },
  { moduleId: 7, title: 'Object-Oriented Programming', slug: 'object-oriented-programming', moduleOrder: 7, topicIds: [10] },
  { moduleId: 8, title: 'Exception Handling & Advanced Java', slug: 'exception-handling', moduleOrder: 8, topicIds: [11] },
  { moduleId: 9, title: 'Collections Framework', slug: 'collections-framework', moduleOrder: 9, topicIds: [12] },
  { moduleId: 10, title: 'Generics & Java 8 Streams', slug: 'generics-and-java-8', moduleOrder: 10, topicIds: [13] },
  { moduleId: 11, title: 'Multithreading & Concurrency', slug: 'multithreading-concurrency', moduleOrder: 11, topicIds: [14] },
  { moduleId: 12, title: 'File Handling & JDBC', slug: 'file-handling-and-jdbc', moduleOrder: 12, topicIds: [15] },
];

export const getTopicDefinitionById = (topicId: number): TopicDefinition | undefined => {
  return TOPIC_DEFINITIONS.find(t => t.id === topicId);
};

export const getTopicDefinitionBySlug = (slug: string): TopicDefinition | undefined => {
  return TOPIC_DEFINITIONS.find(t => t.slug === slug);
};

export const getTopicDefinitionByOrder = (order: number): TopicDefinition | undefined => {
  return TOPIC_DEFINITIONS.find(t => t.order === order);
};

export const getTopicByQuestionSlug = (questionSlug: string): TopicDefinition | undefined => {
  return TOPIC_DEFINITIONS.find(t => t.questionSlugs.includes(questionSlug));
};

// -------------------------------------------------------------
// 1. Debounced Code Draft Auto-Saving (Per Problem Slug)
// -------------------------------------------------------------
const debounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

export const saveCodeDraft = (slug: string, code: string, onSaved?: () => void): void => {
  if (debounceTimers[slug]) {
    clearTimeout(debounceTimers[slug]);
  }

  debounceTimers[slug] = setTimeout(() => {
    safeSet(`rajava_draft_${slug}`, code);
    delete debounceTimers[slug];
    if (onSaved) onSaved();
  }, 800);
};

export const saveCodeDraftImmediate = (slug: string, code: string): void => {
  if (debounceTimers[slug]) {
    clearTimeout(debounceTimers[slug]);
    delete debounceTimers[slug];
  }
  safeSet(`rajava_draft_${slug}`, code);
};

export const getCodeDraft = (slug: string): string | null => {
  return safeGet(`rajava_draft_${slug}`);
};

export const clearCodeDraft = (slug: string): void => {
  if (debounceTimers[slug]) {
    clearTimeout(debounceTimers[slug]);
    delete debounceTimers[slug];
  }
  safeRemove(`rajava_draft_${slug}`);
};

// -------------------------------------------------------------
// 2. Solved Questions Tracking
// -------------------------------------------------------------
const SOLVED_KEY = 'rajava_solved_questions';

export const getSolvedQuestions = (): string[] => {
  const raw = safeGet(SOLVED_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const isQuestionSolved = (slug: string): boolean => {
  const solved = getSolvedQuestions();
  return solved.includes(slug);
};

export const markQuestionSolved = (slug: string): void => {
  const solved = getSolvedQuestions();
  if (!solved.includes(slug)) {
    solved.push(slug);
    safeSet(SOLVED_KEY, JSON.stringify(solved));
    updateStreak();

    // Auto check if this newly solved question completed the topic's 3 questions
    const topic = TOPIC_DEFINITIONS.find(t => t.questionSlugs.includes(slug));
    if (topic) {
      const topicSolvedCount = topic.questionSlugs.filter(s => solved.includes(s)).length;
      if (topicSolvedCount === 3) {
        getCompletedTopics(); // triggers sync and persist
      }
    }
  }
};

// -------------------------------------------------------------
// 3. Topic Progression & 3-Question Unlocking Rules
// -------------------------------------------------------------
const TOPICS_KEY = 'rajava_completed_topics';

/**
 * Counts how many of the 3 coding questions for a topic are currently solved.
 */
export const getTopicSolvedQuestionsCount = (topicIdOrSlug: number | string): number => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return 0;
  const solved = getSolvedQuestions();
  return topic.questionSlugs.filter(slug => solved.includes(slug)).length;
};

/**
 * Checks whether all requirements (Quiz or 3 coding challenges) for this topic are completed.
 */
export const isTopicQuestionsCompleted = (topicIdOrSlug: number | string): boolean => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return false;
  if (topic.requiresQuiz) {
    return isTopicQuizCompleted(topic.id);
  }
  return getTopicSolvedQuestionsCount(topic.id) === 3;
};

/**
 * Topic Quiz Completion Tracking (For conceptual architecture topics like JDK/JRE/JVM)
 */
export const isTopicQuizCompleted = (topicIdOrSlug: number | string): boolean => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return false;
  return safeGet(`rajava_quiz_passed_${topic.id}`) === 'true';
};

export const markTopicQuizCompleted = (topicIdOrSlug: number | string, scorePercent: number): void => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return;
  safeSet(`rajava_quiz_passed_${topic.id}`, 'true');
  safeSet(`rajava_quiz_score_${topic.id}`, String(scorePercent));
  markTopicTheoryRead(topic.id);
  getCompletedTopics();
  updateStreak();
};

export const getTopicQuizScore = (topicIdOrSlug: number | string): number => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return 0;
  const raw = safeGet(`rajava_quiz_score_${topic.id}`);
  return raw ? Number(raw) : 0;
};

/**
 * Topic progression gate:
 * Topic 1 is ALWAYS open.
 * For Topic N (N > 1), it is UNLOCKED if and only if the student
 * has completed Topic N-1 (either passed its Quiz or solved its 3 coding challenges).
 */
export const isTopicUnlocked = (topicIdOrSlug: number | string): boolean => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return true;
  if (topic.order === 1) return true; // Topic 1 is unlocked for everyone

  const prevTopic = getTopicDefinitionByOrder(topic.order - 1);
  if (!prevTopic) return true;

  return isTopicQuestionsCompleted(prevTopic.id);
};

/**
 * Returns detail on lock state and previous topic requirement
 */
export const getTopicLockStatus = (topicIdOrSlug: number | string) => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic || topic.order === 1) {
    return { isLocked: false, requiredTopic: null, solvedCount: 3, requiresQuiz: false };
  }

  const prevTopic = getTopicDefinitionByOrder(topic.order - 1);
  if (!prevTopic) {
    return { isLocked: false, requiredTopic: null, solvedCount: 3, requiresQuiz: false };
  }

  if (prevTopic.requiresQuiz) {
    const quizPassed = isTopicQuizCompleted(prevTopic.id);
    return {
      isLocked: !quizPassed,
      requiredTopic: prevTopic,
      solvedCount: quizPassed ? 1 : 0,
      requiresQuiz: true,
    };
  }

  const solvedCount = getTopicSolvedQuestionsCount(prevTopic.id);
  const isLocked = solvedCount < 3;

  return {
    isLocked,
    requiredTopic: prevTopic,
    solvedCount,
    requiresQuiz: false,
  };
};

/**
 * Theory Reading Status Tracking
 */
export const isTopicTheoryRead = (topicIdOrSlug: number | string): boolean => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return false;
  return safeGet(`rajava_theory_read_${topic.id}`) === 'true';
};

export const markTopicTheoryRead = (topicIdOrSlug: number | string): void => {
  const topic = typeof topicIdOrSlug === 'number'
    ? getTopicDefinitionById(topicIdOrSlug)
    : getTopicDefinitionBySlug(topicIdOrSlug);

  if (!topic) return;
  safeSet(`rajava_theory_read_${topic.id}`, 'true');
  updateStreak();
};

/**
 * Topic is completed when requirements (Quiz or 3 coding questions) are solved.
 */
export const isTopicCompleted = (topicIdOrSlug: number | string): boolean => {
  return isTopicQuestionsCompleted(topicIdOrSlug);
};

/**
 * Returns list of all topic IDs that are completed.
 */
export const getCompletedTopics = (): number[] => {
  const solved = getSolvedQuestions();
  const completed: number[] = [];
  for (const t of TOPIC_DEFINITIONS) {
    if (t.requiresQuiz) {
      if (isTopicQuizCompleted(t.id)) {
        completed.push(t.id);
      }
    } else {
      const count = t.questionSlugs.filter(s => solved.includes(s)).length;
      if (count === 3) {
        completed.push(t.id);
      }
    }
  }
  safeSet(TOPICS_KEY, JSON.stringify(completed));
  return completed;
};

export const markTopicCompleted = (topicId: number): void => {
  markTopicTheoryRead(topicId);
};

// -------------------------------------------------------------
// 4. Submissions History & Streak Tracking
// -------------------------------------------------------------
export interface LocalSubmissionRecord {
  id: string;
  slug: string;
  questionTitle: string;
  passed: boolean;
  passedTestCases: number;
  totalTestCases: number;
  timestamp: string;
}

const SUBMISSIONS_KEY = 'rajava_submissions';
const STREAK_KEY = 'rajava_streak';

export const getRecentSubmissions = (): LocalSubmissionRecord[] => {
  const raw = safeGet(SUBMISSIONS_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const recordSubmission = (entry: {
  slug: string;
  questionTitle: string;
  passed: boolean;
  passedTestCases: number;
  totalTestCases: number;
}): void => {
  const list = getRecentSubmissions();
  const newRecord: LocalSubmissionRecord = {
    id: 'sub-' + Date.now().toString(36),
    slug: entry.slug,
    questionTitle: entry.questionTitle,
    passed: entry.passed,
    passedTestCases: entry.passedTestCases,
    totalTestCases: entry.totalTestCases,
    timestamp: new Date().toISOString(),
  };

  const updated = [newRecord, ...list].slice(0, 25);
  safeSet(SUBMISSIONS_KEY, JSON.stringify(updated));

  if (entry.passed) {
    markQuestionSolved(entry.slug);
  }

  updateStreak();
};

export const getStreakDays = (): number => {
  const raw = safeGet(STREAK_KEY);
  if (!raw) return 1;
  try {
    const data = JSON.parse(raw);
    return typeof data.streakDays === 'number' ? data.streakDays : 1;
  } catch {
    return 1;
  }
};

const updateStreak = (): void => {
  const raw = safeGet(STREAK_KEY);
  const today = new Date().toISOString().slice(0, 10);
  let streak = 1;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.lastDate === today) {
        return;
      }
      const lastDate = new Date(parsed.lastDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        streak = (parsed.streakDays || 1) + 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } catch {
      streak = 1;
    }
  }

  safeSet(STREAK_KEY, JSON.stringify({ streakDays: streak, lastDate: today }));
};

// -------------------------------------------------------------
// 5. Offline / Local Dashboard Stats Generator (Aligned with Completed Topics)
// -------------------------------------------------------------
export const getLocalDashboardStats = (
  studentName = 'Student',
  studentEmail = 'student@rajava.dev'
): DashboardStats => {
  const solved = getSolvedQuestions();
  const completedTopics = getCompletedTopics();
  const submissions = getRecentSubmissions();
  const streak = getStreakDays();

  const totalCodingQuestions = 42; // 14 coding topics * 3 challenges
  const totalTopics = 15;
  const completedTopicsCount = completedTopics.length;
  const pendingTopicsCount = Math.max(0, totalTopics - completedTopicsCount);
  
  // Directly calculate progress based on topics completed (aligned everywhere)
  const topicCompletionPct = Math.min(100, Math.round((completedTopicsCount / totalTopics) * 100));

  const totalSubmissions = Math.max(submissions.length, solved.length);
  const solvedCount = solved.length;
  const failedCount = submissions.filter(s => !s.passed).length;
  const accuracy = totalSubmissions > 0 ? Math.round((solvedCount / totalSubmissions) * 100) : 100;

  // Synthesize module progress list aligned with completed topics
  const moduleProgressList = MODULE_DEFINITIONS.map((m) => {
    const totalTopicsInModule = m.topicIds.length;
    const completedInModule = m.topicIds.filter(tid => completedTopics.includes(tid)).length;
    return {
      moduleId: m.moduleId,
      title: m.title,
      slug: m.slug,
      moduleOrder: m.moduleOrder,
      totalTopics: totalTopicsInModule,
      completedTopics: completedInModule,
      completionPercentage: Math.round((completedInModule / totalTopicsInModule) * 100),
    };
  });

  // Recommended next topic: find first unlocked topic that is NOT yet completed
  const nextActiveTopic = TOPIC_DEFINITIONS.find(t => isTopicUnlocked(t.id) && !isTopicQuestionsCompleted(t.id)) || TOPIC_DEFINITIONS[0];

  const recommendedNextTopic = {
    id: nextActiveTopic.id,
    title: nextActiveTopic.title,
    slug: nextActiveTopic.slug,
    moduleTitle: nextActiveTopic.moduleTitle,
    estimatedMinutes: 35,
  };

  // Recent activity logs
  const recentActivities = submissions.slice(0, 5).map((s) => ({
    activityType: s.passed ? 'PROBLEM_SOLVED' : 'CODE_SUBMISSION',
    description: s.passed
      ? `Solved "${s.questionTitle}" with 100% test cases passed`
      : `Evaluated "${s.questionTitle}" (${s.passedTestCases}/${s.totalTestCases} passed)`,
    timestamp: s.timestamp,
  }));

  if (recentActivities.length === 0) {
    recentActivities.push({
      activityType: 'ENROLLMENT',
      description: 'Enrolled in RA-Java Free Full Access Curriculum',
      timestamp: new Date().toISOString(),
    });
  }

  return {
    studentName,
    studentEmail,
    overallProgressPercentage: topicCompletionPct,
    coreJavaCompletionPercentage: topicCompletionPct,
    totalTopics,
    completedTopics: completedTopicsCount,
    pendingTopics: pendingTopicsCount,
    totalCodingQuestions,
    solvedQuestions: solvedCount,
    failedQuestions: failedCount,
    totalSubmissions,
    codingAccuracy: accuracy,
    currentLearningStreakDays: streak,
    downloadedStudyMaterialsCount: 14,
    recommendedNextTopic,
    moduleProgressList,
    recentActivities,
  };
};
