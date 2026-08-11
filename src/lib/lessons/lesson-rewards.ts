import { SQL_LESSONS } from "@/data/lessons";

import type {
  LessonDifficulty,
} from "@/types/lesson";

const STREAK_STORAGE_KEY =
  "sqltrain.lesson-streak.v1";

const XP_PER_LEVEL = 100;

type StoredStreak = {
  streak: number;
  lastCompletionDate: string | null;
};

export type LessonBadge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type LessonBadgeStatus =
  LessonBadge & {
    earned: boolean;
  };

export type LessonRewardSummary = {
  totalXp: number;
  level: number;
  xpInsideLevel: number;
  xpRequiredForLevel: number;
  levelProgressPercent: number;
  completedLessonCount: number;
  courseComplete: boolean;
  badges: LessonBadge[];
};

type BadgeDefinition =
  LessonBadge & {
    isEarned: (
      completedLessonIds: string[],
    ) => boolean;
  };

function hasCompletedLesson(
  completedLessonIds: string[],
  lessonNumber: number,
): boolean {
  const lesson = SQL_LESSONS.find(
    (candidate) =>
      candidate.number === lessonNumber,
  );

  return Boolean(
    lesson &&
      completedLessonIds.includes(lesson.id),
  );
}

function completedRange(
  completedLessonIds: string[],
  start: number,
  end: number,
): boolean {
  for (
    let lessonNumber = start;
    lessonNumber <= end;
    lessonNumber += 1
  ) {
    if (
      !hasCompletedLesson(
        completedLessonIds,
        lessonNumber,
      )
    ) {
      return false;
    }
  }

  return true;
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first-ticket",
    title: "First Ticket",
    description:
      "Complete your first SQL lesson.",
    icon: "🎫",
    isEarned: (ids) => ids.length >= 1,
  },
  {
    id: "sql-starter",
    title: "SQL Starter",
    description:
      "Complete five SQL lessons.",
    icon: "🚂",
    isEarned: (ids) => ids.length >= 5,
  },
  {
    id: "query-conductor",
    title: "Query Conductor",
    description:
      "Complete fifteen lessons.",
    icon: "🎩",
    isEarned: (ids) => ids.length >= 15,
  },
  {
    id: "join-master",
    title: "Join Master",
    description:
      "Complete the INNER JOIN and LEFT JOIN lessons.",
    icon: "🔗",
    isEarned: (ids) =>
      completedRange(ids, 16, 18),
  },
  {
    id: "sql-express",
    title: "SQL Express",
    description:
      "Complete thirty lessons.",
    icon: "⚡",
    isEarned: (ids) => ids.length >= 30,
  },
  {
    id: "function-wizard",
    title: "Function Wizard",
    description:
      "Complete the SQL function lessons.",
    icon: "🪄",
    isEarned: (ids) =>
      completedRange(ids, 31, 40),
  },
  {
    id: "window-navigator",
    title: "Window Navigator",
    description:
      "Complete the window-function lessons.",
    icon: "🪟",
    isEarned: (ids) =>
      completedRange(ids, 46, 48),
  },
  {
    id: "schema-engineer",
    title: "Schema Engineer",
    description:
      "Understand primary keys and foreign keys.",
    icon: "🛠️",
    isEarned: (ids) =>
      completedRange(ids, 49, 50),
  },
  {
    id: "halfway-station",
    title: "Halfway Station",
    description:
      "Complete fifty SQL lessons.",
    icon: "🏆",
    isEarned: (ids) => ids.length >= 50,
  },
  {
    id: "table-builder",
    title: "Table Builder",
    description:
      "Create tables and apply SQL constraints.",
    icon: "🏗️",
    isEarned: (ids) =>
      completedRange(ids, 51, 57),
  },
  {
    id: "relationship-architect",
    title: "Relationship Architect",
    description:
      "Create a real foreign-key relationship.",
    icon: "🌉",
    isEarned: (ids) =>
      hasCompletedLesson(ids, 58),
  },
  {
    id: "data-operator",
    title: "Data Operator",
    description:
      "Complete the INSERT and UPDATE lessons.",
    icon: "⚙️",
    isEarned: (ids) =>
      completedRange(ids, 59, 60),
  },
  {
    id: "data-cleaner",
    title: "Data Cleaner",
    description:
      "Complete the DELETE lesson group.",
    icon: "🧹",
    isEarned: (ids) =>
      hasCompletedLesson(ids, 61) &&
      hasCompletedLesson(ids, 65),
  },
  {
    id: "bulk-loader",
    title: "Bulk Loader",
    description:
      "Insert several rows and copy query results.",
    icon: "📦",
    isEarned: (ids) =>
      completedRange(ids, 62, 63),
  },
  {
    id: "upsert-specialist",
    title: "Upsert Specialist",
    description:
      "Master INSERT ON CONFLICT.",
    icon: "♻️",
    isEarned: (ids) =>
      hasCompletedLesson(ids, 66),
  },
  {
    id: "schema-mechanic",
    title: "Schema Mechanic",
    description:
      "Add, rename, and remove database structures.",
    icon: "🔧",
    isEarned: (ids) =>
      completedRange(ids, 67, 70),
  },
  {
    id: "index-engineer",
    title: "Index Engineer",
    description:
      "Create standard and unique indexes.",
    icon: "🚀",
    isEarned: (ids) =>
      completedRange(ids, 71, 72),
  },
  {
    id: "view-designer",
    title: "View Designer",
    description:
      "Create your first reusable SQL view.",
    icon: "👁️",
    isEarned: (ids) =>
      hasCompletedLesson(ids, 73),
  },
  {
    id: "transaction-controller",
    title: "Transaction Controller",
    description:
      "Master COMMIT and ROLLBACK.",
    icon: "🛡️",
    isEarned: (ids) =>
      completedRange(ids, 74, 75),
  },
  {
    id: "three-quarter-station",
    title: "Three-Quarter Station",
    description:
      "Complete seventy-five SQL lessons.",
    icon: "🚄",
    isEarned: (ids) => ids.length >= 75,
  },
  {
    id: "composite-key-specialist",
    title: "Composite Key Specialist",
    description:
      "Master composite primary and foreign keys.",
    icon: "🧩",
    isEarned: (ids) =>
      completedRange(ids, 76, 77),
  },
  {
    id: "referential-action-controller",
    title: "Referential Action Controller",
    description:
      "Master CASCADE and SET NULL.",
    icon: "🎛️",
    isEarned: (ids) =>
      completedRange(ids, 78, 80),
  },
  {
    id: "trigger-engineer",
    title: "Trigger Engineer",
    description:
      "Create, use, and remove SQL triggers.",
    icon: "⚡",
    isEarned: (ids) =>
      completedRange(ids, 83, 85),
  },
  {
    id: "savepoint-navigator",
    title: "Savepoint Navigator",
    description:
      "Control partial transaction rollbacks.",
    icon: "🧭",
    isEarned: (ids) =>
      completedRange(ids, 86, 87),
  },
  {
    id: "recursive-thinker",
    title: "Recursive Thinker",
    description:
      "Complete the recursive CTE challenges.",
    icon: "🌀",
    isEarned: (ids) =>
      completedRange(ids, 88, 89),
  },
  {
    id: "query-optimizer",
    title: "Query Optimizer",
    description:
      "Master query plans and advanced indexes.",
    icon: "🏎️",
    isEarned: (ids) =>
      completedRange(ids, 90, 95),
  },
  {
    id: "sql-project-builder",
    title: "SQL Project Builder",
    description:
      "Complete the advanced SQL projects.",
    icon: "🏗️",
    isEarned: (ids) =>
      completedRange(ids, 96, 99),
  },
  {
    id: "sql-pro",
    title: "SQL Pro",
    description:
      "Complete all 100 SQLTrain lessons.",
    icon: "👑",
    isEarned: (ids) =>
      ids.length >= 100,
  },
];

export function getLessonXp(
  difficulty: LessonDifficulty,
): number {
  switch (difficulty) {
    case "Advanced":
      return 30;

    case "Intermediate":
      return 20;

    default:
      return 10;
  }
}

function getLocalDateKey(
  date = new Date(),
): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function previousLocalDateKey(): string {
  const date = new Date();

  date.setDate(date.getDate() - 1);

  return getLocalDateKey(date);
}

export function readLessonStreak(): StoredStreak {
  if (typeof window === "undefined") {
    return {
      streak: 0,
      lastCompletionDate: null,
    };
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        STREAK_STORAGE_KEY,
      );

    if (!storedValue) {
      return {
        streak: 0,
        lastCompletionDate: null,
      };
    }

    const parsedValue = JSON.parse(
      storedValue,
    ) as Partial<StoredStreak>;

    return {
      streak:
        typeof parsedValue.streak === "number"
          ? Math.max(0, parsedValue.streak)
          : 0,

      lastCompletionDate:
        typeof parsedValue.lastCompletionDate ===
        "string"
          ? parsedValue.lastCompletionDate
          : null,
    };
  } catch {
    return {
      streak: 0,
      lastCompletionDate: null,
    };
  }
}

export function recordLessonCompletionDate(): number {
  const currentState =
    readLessonStreak();

  const today = getLocalDateKey();

  if (
    currentState.lastCompletionDate === today
  ) {
    return currentState.streak;
  }

  const nextStreak =
    currentState.lastCompletionDate ===
    previousLocalDateKey()
      ? currentState.streak + 1
      : 1;

  const nextState: StoredStreak = {
    streak: nextStreak,
    lastCompletionDate: today,
  };

  window.localStorage.setItem(
    STREAK_STORAGE_KEY,
    JSON.stringify(nextState),
  );

  return nextStreak;
}

export function getAllLessonBadges(
  completedLessonIds: string[],
): LessonBadgeStatus[] {
  return BADGE_DEFINITIONS.map(
    ({ isEarned, ...badge }) => ({
      ...badge,
      earned: isEarned(completedLessonIds),
    }),
  );
}

export function getLessonRewardSummary(
  completedLessonIds: string[],
): LessonRewardSummary {
  const validLessonIds =
    new Set(
      SQL_LESSONS.map(
        (lesson) => lesson.id,
      ),
    );

  const normalizedCompletedIds = [
    ...new Set(
      completedLessonIds.filter(
        (lessonId) =>
          validLessonIds.has(
            lessonId,
          ),
      ),
    ),
  ];

  const completedIdSet =
    new Set(
      normalizedCompletedIds,
    );

  const completedLessons =
    SQL_LESSONS.filter(
      (lesson) =>
        completedIdSet.has(
          lesson.id,
        ),
    );

  const completedLessonCount =
    completedLessons.length;

  const courseComplete =
    completedLessonCount ===
    SQL_LESSONS.length;

  const totalXp =
    completedLessons.reduce(
      (sum, lesson) =>
        sum +
        getLessonXp(
          lesson.difficulty,
        ),
      0,
    );

  const level =
    Math.floor(
      totalXp / XP_PER_LEVEL,
    ) + 1;

  const rawXpInsideLevel =
    totalXp % XP_PER_LEVEL;

  const xpInsideLevel =
    courseComplete
      ? XP_PER_LEVEL
      : rawXpInsideLevel;

  const levelProgressPercent =
    courseComplete
      ? 100
      : Math.round(
          (
            rawXpInsideLevel /
            XP_PER_LEVEL
          ) * 100,
        );

  const badges =
    BADGE_DEFINITIONS
      .filter(
        (definition) =>
          definition.isEarned(
            normalizedCompletedIds,
          ),
      )
      .map(
        (definition) => ({
          id:
            definition.id,
          title:
            definition.title,
          description:
            definition.description,
          icon:
            definition.icon,
        }),
      );

  return {
    totalXp,
    level,
    xpInsideLevel,
    xpRequiredForLevel:
      XP_PER_LEVEL,
    levelProgressPercent,
    completedLessonCount,
    courseComplete,
    badges,
  };
}
