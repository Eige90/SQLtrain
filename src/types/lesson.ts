export type LessonDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type LessonExecutionMode =
  | "query"
  | "sandbox";

export type SqlLesson = {
  id: string;
  number: number;
  title: string;
  topic: string;
  difficulty: LessonDifficulty;
  description: string;
  task: string;
  starterSql: string;
  solutionSql: string;
  hints: string[];
  resultOrderMatters: boolean;

  executionMode?: LessonExecutionMode;
  setupSql?: string;
  verificationSql?: string;
};

export type LessonValidationResult = {
  correct: boolean;
  message: string;
};

export type LessonSandboxInput = {
  setupSql: string;
  sql: string;
  verificationSql: string;
};
