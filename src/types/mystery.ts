export type MysteryDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export type MysteryExecutionMode =
  | "query"
  | "sandbox";

export type MysteryTask = {
  id: string;
  number: number;
  levelNumber: number;
  position: number;

  title: string;
  skill: string;
  difficulty: MysteryDifficulty;

  story: string;
  evidenceQuestion: string;
  prompt: string;

  starterSql: string;
  solutionSql: string;

  hints: string[];
  successStory: string;

  resultOrderMatters: boolean;
  executionMode: MysteryExecutionMode;

  setupSql?: string;
  verificationSql?: string;
  requiredSqlPatterns?: string[];
};

export type MysteryLevel = {
  id: string;
  number: number;

  chapter: number;
  chapterTitle: string;

  title: string;
  intro: string;
  objective: string;
  outcome: string;

  skills: string[];
  taskIds: string[];
};

export type MysteryTaskValidationResult = {
  correct: boolean;
  message: string;
};

export type MysteryProgress = {
  completedTaskIds: string[];
  completedLevelIds: string[];

  activeLevelId: string | null;
  activeTaskId: string | null;
};

export type MysterySuspectStatus =
  | "Person of Interest"
  | "Suspect"
  | "Prime Suspect"
  | "Cleared"
  | "New Lead";

export type MysterySuspect = {
  name: string;
  status: MysterySuspectStatus;
  reason: string;
};

export type MysteryResolution = {
  levelNumber: number;

  title: string;
  summary: string;

  clearedSuspects: string[];
  remainingSuspects: string[];
  unlockedEvidence: string[];
};
