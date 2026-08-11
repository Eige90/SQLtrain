import type {
  MysteryLevel,
} from "@/types/mystery";

export const MYSTERY_LEVELS: MysteryLevel[] = [
  {
    "id": "knife-orders",
    "number": 1,
    "chapter": 1,
    "chapterTitle": "The First Suspects",
    "title": "Who Ordered the Knife?",
    "intro": "A suspicious shopping list was recovered from Nora Keller's laptop.",
    "objective": "Find everyone who ordered the KX-17 knife during the four weeks before the murder.",
    "outcome": "Five suspects remain: Elias Vogel, Mira Roth, Leon Berger, Sofia Hartmann, and Jonas Frei.",
    "skills": [
      "SELECT one column",
      "SELECT multiple columns",
      "SELECT *",
      "AS",
      "WHERE ="
    ],
    "taskIds": [
      "mystery-task-001",
      "mystery-task-002",
      "mystery-task-003",
      "mystery-task-004",
      "mystery-task-005"
    ]
  },
  {
    "id": "knife-deliveries",
    "number": 2,
    "chapter": 1,
    "chapterTitle": "The First Suspects",
    "title": "When Were the Knives Delivered?",
    "intro": "The weapon had to arrive before Nora entered the train.",
    "objective": "Inspect order, shipping, delivery, status, and delivery-address data.",
    "outcome": "All five knives arrived before the murder. One went to a station locker.",
    "skills": [
      "<> / !=",
      "< / >",
      "<= / >=",
      "AND",
      "OR"
    ],
    "taskIds": [
      "mystery-task-006",
      "mystery-task-007",
      "mystery-task-008",
      "mystery-task-009",
      "mystery-task-010"
    ]
  },
  {
    "id": "plastic-purchases",
    "number": 3,
    "chapter": 1,
    "chapterTitle": "The First Suspects",
    "title": "Who Bought Plastic Sheeting?",
    "intro": "Investigators believe the murder was prepared in advance.",
    "objective": "Find knife buyers who later bought plastic sheeting, tape, or protective gloves.",
    "outcome": "Four suspects remain: Elias Vogel, Mira Roth, Leon Berger, and Sofia Hartmann.",
    "skills": [
      "IN",
      "NOT IN",
      "BETWEEN",
      "LIKE",
      "_ wildcard"
    ],
    "taskIds": [
      "mystery-task-011",
      "mystery-task-012",
      "mystery-task-013",
      "mystery-task-014",
      "mystery-task-015"
    ]
  },
  {
    "id": "train-to-bern",
    "number": 4,
    "chapter": 1,
    "chapterTitle": "The First Suspects",
    "title": "Who Travelled to Bern?",
    "intro": "Nora died aboard night train Alpenstern 714.",
    "objective": "Find suspects travelling on train 714 toward Bern on the murder date.",
    "outcome": "Three suspects remain: Elias Vogel, Mira Roth, and Leon Berger.",
    "skills": [
      "NOT",
      "DISTINCT",
      "ORDER BY",
      "Multiple-column ORDER BY",
      "LIMIT"
    ],
    "taskIds": [
      "mystery-task-016",
      "mystery-task-017",
      "mystery-task-018",
      "mystery-task-019",
      "mystery-task-020"
    ]
  },
  {
    "id": "bloodstained-passengers",
    "number": 5,
    "chapter": 1,
    "chapterTitle": "The First Suspects",
    "title": "The Bloodstained Passengers",
    "intro": "A witness saw two bloodstained people leaving the luggage compartment.",
    "objective": "Match witness reports with passenger descriptions and incomplete data.",
    "outcome": "Two people remain: Elias Vogel and Mira Roth.",
    "skills": [
      "OFFSET",
      "IS NULL",
      "IS NOT NULL",
      "COALESCE",
      "CASE WHEN"
    ],
    "taskIds": [
      "mystery-task-021",
      "mystery-task-022",
      "mystery-task-023",
      "mystery-task-024",
      "mystery-task-025"
    ]
  },
  {
    "id": "missing-time-window",
    "number": 6,
    "chapter": 2,
    "chapterTitle": "Who Killed Nora?",
    "title": "The Missing Time Window",
    "intro": "The murder occurred between 22:18 and 22:31.",
    "objective": "Analyse seat sensor activity for Elias and Mira.",
    "outcome": "Elias was absent from his seat considerably longer.",
    "skills": [
      "COUNT(*)",
      "COUNT(column)",
      "MIN",
      "MAX",
      "AVG"
    ],
    "taskIds": [
      "mystery-task-026",
      "mystery-task-027",
      "mystery-task-028",
      "mystery-task-029",
      "mystery-task-030"
    ]
  },
  {
    "id": "heavy-suitcase",
    "number": 7,
    "chapter": 2,
    "chapterTitle": "Who Killed Nora?",
    "title": "The Heavy Suitcase",
    "intro": "Luggage weights changed between departure and Bern.",
    "objective": "Group baggage scans and identify suspicious weight changes.",
    "outcome": "Elias carried Nora's laptop and documents. Elias Vogel is the killer.",
    "skills": [
      "SUM",
      "ROUND",
      "Calculated columns",
      "GROUP BY",
      "HAVING"
    ],
    "taskIds": [
      "mystery-task-031",
      "mystery-task-032",
      "mystery-task-033",
      "mystery-task-034",
      "mystery-task-035"
    ]
  },
  {
    "id": "false-hotel-alibi",
    "number": 8,
    "chapter": 2,
    "chapterTitle": "Who Killed Nora?",
    "title": "The False Hotel Alibi",
    "intro": "Elias claims he spent the night in a Munich hotel.",
    "objective": "Connect reservations, rooms, keycards, guests, and door records.",
    "outcome": "The reservation existed, but Elias's keycard was never used.",
    "skills": [
      "INNER JOIN",
      "Aliases",
      "PK/FK JOIN",
      "Three-table JOIN",
      "Four-table JOIN"
    ],
    "taskIds": [
      "mystery-task-036",
      "mystery-task-037",
      "mystery-task-038",
      "mystery-task-039",
      "mystery-task-040"
    ]
  },
  {
    "id": "missing-checkin",
    "number": 9,
    "chapter": 2,
    "chapterTitle": "Who Killed Nora?",
    "title": "The Missing Check-in",
    "intro": "The hotel's official check-in conflicts with the access system.",
    "objective": "Find reservations without supporting access records.",
    "outcome": "A hotel employee manually registered Elias after an anonymous call.",
    "skills": [
      "LEFT JOIN",
      "Unmatched rows",
      "EXISTS",
      "NOT EXISTS",
      "Subquery IN"
    ],
    "taskIds": [
      "mystery-task-041",
      "mystery-task-042",
      "mystery-task-043",
      "mystery-task-044",
      "mystery-task-045"
    ]
  },
  {
    "id": "burner-phone",
    "number": 10,
    "chapter": 2,
    "chapterTitle": "Who Killed Nora?",
    "title": "The Burner Phone",
    "intro": "A burner phone is discovered in Elias's luggage.",
    "objective": "Trace calls, owners, common locations, and calls immediately before the murder.",
    "outcome": "The number belongs to train conductor Klara Meier.",
    "skills": [
      "Scalar subquery",
      "Correlated subquery",
      "Subquery FROM",
      "CTE",
      "Multiple CTEs"
    ],
    "taskIds": [
      "mystery-task-046",
      "mystery-task-047",
      "mystery-task-048",
      "mystery-task-049",
      "mystery-task-050"
    ]
  },
  {
    "id": "locker-417",
    "number": 11,
    "chapter": 3,
    "chapterTitle": "The Accomplice",
    "title": "Locker 417",
    "intro": "Klara entered the station locker area after arrival.",
    "objective": "Combine locker, camera, phone, train, and baggage data.",
    "outcome": "Locker 417 contained the knife, bloody gloves, Nora's ID, and a USB drive.",
    "skills": [
      "CTE aggregation",
      "Complex CASE",
      "CAST",
      "NULLIF",
      "Conditional aggregation"
    ],
    "taskIds": [
      "mystery-task-051",
      "mystery-task-052",
      "mystery-task-053",
      "mystery-task-054",
      "mystery-task-055"
    ]
  },
  {
    "id": "damaged-messages",
    "number": 12,
    "chapter": 3,
    "chapterTitle": "The Accomplice",
    "title": "Damaged Messages",
    "intro": "The burner phone contains corrupted message fragments.",
    "objective": "Clean text and identify recurring words.",
    "outcome": "Winter, Bern, report, fifty, and 23:10 recur.",
    "skills": [
      "LOWER",
      "UPPER",
      "LENGTH",
      "TRIM",
      "SUBSTR"
    ],
    "taskIds": [
      "mystery-task-056",
      "mystery-task-057",
      "mystery-task-058",
      "mystery-task-059",
      "mystery-task-060"
    ]
  },
  {
    "id": "winter-code",
    "number": 13,
    "chapter": 3,
    "chapterTitle": "The Accomplice",
    "title": "The Code 'Winter'",
    "intro": "The corrupted fragments form a coded instruction.",
    "objective": "Repair and reconstruct the message.",
    "outcome": "Winter confirmed. 50,000 after Bern. The report must not reach its destination.",
    "skills": [
      "REPLACE",
      "||",
      "INSTR",
      "PRINTF",
      "Nested text functions"
    ],
    "taskIds": [
      "mystery-task-061",
      "mystery-task-062",
      "mystery-task-063",
      "mystery-task-064",
      "mystery-task-065"
    ]
  },
  {
    "id": "manipulated-timestamps",
    "number": 14,
    "chapter": 3,
    "chapterTitle": "The Accomplice",
    "title": "Manipulated Timestamps",
    "intro": "Different systems report contradictory times.",
    "objective": "Normalize timestamps across all evidence sources.",
    "outcome": "The station camera clock was seven minutes fast.",
    "skills": [
      "DATE()",
      "TIME()",
      "DATETIME()",
      "STRFTIME()",
      "Date modifiers"
    ],
    "taskIds": [
      "mystery-task-066",
      "mystery-task-067",
      "mystery-task-068",
      "mystery-task-069",
      "mystery-task-070"
    ]
  },
  {
    "id": "luggage-compartment-access",
    "number": 15,
    "chapter": 3,
    "chapterTitle": "The Accomplice",
    "title": "Who Opened the Luggage Compartment?",
    "intro": "Only employee cards could open the compartment.",
    "objective": "Compare door access, staff shifts, and camera events.",
    "outcome": "Klara opened the compartment and disabled the camera. She is the accomplice.",
    "skills": [
      "JULIANDAY()",
      "Timestamp differences",
      "Overlaps",
      "Timezone offsets",
      "Time grouping"
    ],
    "taskIds": [
      "mystery-task-071",
      "mystery-task-072",
      "mystery-task-073",
      "mystery-task-074",
      "mystery-task-075"
    ]
  },
  {
    "id": "three-account-payment",
    "number": 16,
    "chapter": 4,
    "chapterTitle": "Who Ordered the Murder?",
    "title": "The Payment Through Three Accounts",
    "intro": "Payments to Elias were deliberately fragmented.",
    "objective": "Combine bank datasets and isolate suspicious companies.",
    "outcome": "Three companies remain, including Northstar Consulting.",
    "skills": [
      "UNION",
      "UNION ALL",
      "INTERSECT",
      "EXCEPT",
      "VALUES"
    ],
    "taskIds": [
      "mystery-task-076",
      "mystery-task-077",
      "mystery-task-078",
      "mystery-task-079",
      "mystery-task-080"
    ]
  },
  {
    "id": "shell-company",
    "number": 17,
    "chapter": 4,
    "chapterTitle": "Who Ordered the Murder?",
    "title": "The Shell Company",
    "intro": "Northstar Consulting appears to exist only on paper.",
    "objective": "Rank and analyse its financial transactions.",
    "outcome": "Northstar paid both Elias and Klara and is connected to the Voss Group.",
    "skills": [
      "ROW_NUMBER()",
      "RANK()",
      "DENSE_RANK()",
      "PARTITION BY",
      "Window ORDER BY"
    ],
    "taskIds": [
      "mystery-task-081",
      "mystery-task-082",
      "mystery-task-083",
      "mystery-task-084",
      "mystery-task-085"
    ]
  },
  {
    "id": "first-payment",
    "number": 18,
    "chapter": 4,
    "chapterTitle": "Who Ordered the Murder?",
    "title": "The First Payment",
    "intro": "The earliest payment may reveal who initiated the plot.",
    "objective": "Analyse transaction order and running totals.",
    "outcome": "The first payment traces back to Adrian Voss.",
    "skills": [
      "LAG()",
      "LEAD()",
      "SUM() OVER",
      "COUNT() OVER",
      "FIRST_VALUE()"
    ],
    "taskIds": [
      "mystery-task-086",
      "mystery-task-087",
      "mystery-task-088",
      "mystery-task-089",
      "mystery-task-090"
    ]
  },
  {
    "id": "secret-investigation-file",
    "number": 19,
    "chapter": 5,
    "chapterTitle": "The Complete Proof",
    "title": "Nora's Secret Investigation File",
    "intro": "The USB drive contains Nora's research into manipulated medical studies.",
    "objective": "Create a structured evidence database.",
    "outcome": "The motive becomes clear: Nora planned to publish the evidence the next morning.",
    "skills": [
      "CREATE TABLE",
      "Data types",
      "PRIMARY KEY",
      "FOREIGN KEY",
      "Constraints"
    ],
    "taskIds": [
      "mystery-task-091",
      "mystery-task-092",
      "mystery-task-093",
      "mystery-task-094",
      "mystery-task-095"
    ]
  },
  {
    "id": "final-query",
    "number": 20,
    "chapter": 5,
    "chapterTitle": "The Complete Proof",
    "title": "The Final Query",
    "intro": "The prosecution needs a complete and reproducible chain of evidence.",
    "objective": "Insert, correct, remove, transact, and create the final case view.",
    "outcome": "Elias Vogel killed Nora Keller, Klara Meier assisted him, and Adrian Voss ordered the murder.",
    "skills": [
      "INSERT",
      "UPDATE",
      "DELETE",
      "Transactions",
      "CREATE VIEW"
    ],
    "taskIds": [
      "mystery-task-096",
      "mystery-task-097",
      "mystery-task-098",
      "mystery-task-099",
      "mystery-task-100"
    ]
  }
];

export function getMysteryLevel(
  levelId: string,
): MysteryLevel | null {
  return (
    MYSTERY_LEVELS.find(
      (level) => level.id === levelId,
    ) ?? null
  );
}

export function getMysteryLevelByNumber(
  levelNumber: number,
): MysteryLevel | null {
  return (
    MYSTERY_LEVELS.find(
      (level) => level.number === levelNumber,
    ) ?? null
  );
}
