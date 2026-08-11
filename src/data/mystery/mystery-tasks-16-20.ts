import type {
  MysteryTask,
} from "@/types/mystery";

const CASE_EVIDENCE_SCHEMA = `
CREATE TABLE case_evidence (
  evidence_id INTEGER PRIMARY KEY,
  evidence_type TEXT NOT NULL,
  person_id INTEGER,
  occurred_at TEXT NOT NULL,
  description TEXT NOT NULL UNIQUE,
  confidence_level INTEGER NOT NULL DEFAULT 3
    CHECK (
      confidence_level BETWEEN 1 AND 5
    ),
  source TEXT NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);
`;

const FINAL_CASE_SETUP = `
CREATE TABLE case_roles (
  role TEXT PRIMARY KEY,
  person_name TEXT NOT NULL
);

INSERT INTO case_roles VALUES
  ('murderer', 'Elias Vogel'),
  ('accomplice', 'Klara Meier'),
  ('mastermind', 'Adrian Voss'),
  ('victim', 'Nora Keller');

CREATE TABLE case_motive (
  motive TEXT NOT NULL
);

INSERT INTO case_motive VALUES (
  'Preventing the publication of manipulated medical research results'
);
`;

export const MYSTERY_TASKS_16_20:
  MysteryTask[] = [
  // ==========================================================
  // LEVEL 16 — THE PAYMENT THROUGH THREE ACCOUNTS
  // ==========================================================

  {
    id: "mystery-task-076",
    number: 76,
    levelNumber: 16,
    position: 1,
    title: "Combine the Financial Leads",
    skill: "UNION",
    difficulty: "Advanced",
    story:
      "With Klara confirmed as an accomplice, investigators turn to the money. Two independent teams produced company lists: one from suspicious bank transfers and another from corporate-registry anomalies.",
    evidenceQuestion:
      "Which unique companies appear in either investigation?",
    prompt:
      "Return company_name from Bank Monitor leads UNION company_name from Corporate Registry leads. Order by company_name.",
    starterSql: "",
    solutionSql:
      "SELECT company_name FROM financial_lead_sources WHERE source = 'Bank Monitor' UNION SELECT company_name FROM financial_lead_sources WHERE source = 'Corporate Registry' ORDER BY company_name;",
    hints: [
      "UNION combines two SELECT result sets.",
      "UNION removes duplicates automatically.",
    ],
    successStory:
      "Four unique companies appear. One is a legitimate transport company; the other three require deeper investigation.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "UNION",
    ],
  },

  {
    id: "mystery-task-077",
    number: 77,
    levelNumber: 16,
    position: 2,
    title: "Preserve the Duplicate Leads",
    skill: "UNION ALL",
    difficulty: "Advanced",
    story:
      "Duplicates are useful here: a company appearing in both independent investigations deserves more attention, not less.",
    evidenceQuestion:
      "Which companies appear repeatedly when duplicate evidence is preserved?",
    prompt:
      "Combine Bank Monitor and Corporate Registry company_name values using UNION ALL. Order by company_name.",
    starterSql: "",
    solutionSql:
      "SELECT company_name FROM financial_lead_sources WHERE source = 'Bank Monitor' UNION ALL SELECT company_name FROM financial_lead_sources WHERE source = 'Corporate Registry' ORDER BY company_name;",
    hints: [
      "UNION ALL preserves duplicate rows.",
      "Companies found by both teams will appear twice.",
    ],
    successStory:
      "Northstar Consulting, Alpine Research GmbH and Voss Beteiligungen AG each appear in both investigations.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "UNION ALL",
    ],
  },

  {
    id: "mystery-task-078",
    number: 78,
    levelNumber: 16,
    position: 3,
    title: "Find the Shared Companies",
    skill: "INTERSECT",
    difficulty: "Advanced",
    story:
      "Detective Baum asks for only the companies found independently by both the banking team and the corporate-registry team.",
    evidenceQuestion:
      "Which companies appear in both investigations?",
    prompt:
      "Return the company_name values from Bank Monitor INTERSECT the company_name values from Corporate Registry. Order by company_name.",
    starterSql: "",
    solutionSql:
      "SELECT company_name FROM financial_lead_sources WHERE source = 'Bank Monitor' INTERSECT SELECT company_name FROM financial_lead_sources WHERE source = 'Corporate Registry' ORDER BY company_name;",
    hints: [
      "INTERSECT keeps rows found in both result sets.",
    ],
    successStory:
      "Exactly three companies survive: Alpine Research GmbH, Northstar Consulting and Voss Beteiligungen AG.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "INTERSECT",
    ],
  },

  {
    id: "mystery-task-079",
    number: 79,
    levelNumber: 16,
    position: 4,
    title: "Remove the Cleared Company",
    skill: "EXCEPT",
    difficulty: "Advanced",
    story:
      "Bern Mobility Services has already supplied invoices proving its transactions were legitimate transport expenses. It must be removed from the financial suspect pool.",
    evidenceQuestion:
      "Which companies remain after the cleared audit list is excluded?",
    prompt:
      "Return company_name from Bank Monitor and Corporate Registry leads, then EXCEPT company_name values from Cleared Audit. Order by company_name.",
    starterSql: "",
    solutionSql:
      "SELECT company_name FROM financial_lead_sources WHERE source IN ('Bank Monitor', 'Corporate Registry') EXCEPT SELECT company_name FROM financial_lead_sources WHERE source = 'Cleared Audit' ORDER BY company_name;",
    hints: [
      "EXCEPT removes rows returned by the second query.",
    ],
    successStory:
      "Three financial leads remain: Northstar Consulting, Alpine Research GmbH and Voss Beteiligungen AG.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "EXCEPT",
    ],
  },

  {
    id: "mystery-task-080",
    number: 80,
    levelNumber: 16,
    position: 5,
    title: "Compare the Three Candidates",
    skill: "VALUES",
    difficulty: "Advanced",
    story:
      "The three companies are placed on the evidence board. Their registry profiles reveal an immediate anomaly: one company moves money despite having no employees.",
    evidenceQuestion:
      "How many employees does each of the three candidate companies officially have?",
    prompt:
      "Create a CTE named candidates(company_name) using VALUES for the three company names. Join it to companies and return company_name and employee_count ordered by company_name.",
    starterSql: "",
    solutionSql:
      "WITH candidates(company_name) AS (VALUES ('Northstar Consulting'), ('Alpine Research GmbH'), ('Voss Beteiligungen AG')) SELECT c.company_name, co.employee_count FROM candidates AS c INNER JOIN companies AS co ON co.company_name = c.company_name ORDER BY c.company_name;",
    hints: [
      "VALUES can create rows without reading a table.",
      "Use WITH candidates(company_name) AS (VALUES ...).",
    ],
    successStory:
      "Northstar Consulting has zero employees. Yet it received and distributed enormous payments. The shell company becomes the central financial lead.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "VALUES",
    ],
  },

  // ==========================================================
  // LEVEL 17 — THE SHELL COMPANY
  // ==========================================================

  {
    id: "mystery-task-081",
    number: 81,
    levelNumber: 17,
    position: 1,
    title: "Number Northstar's Payments",
    skill: "ROW_NUMBER()",
    difficulty: "Advanced",
    story:
      "Investigators isolate every payment sent from Northstar Consulting to individual people. Three transfers stand out.",
    evidenceQuestion:
      "What is the payment order when Northstar's outgoing transfers are ranked from largest to smallest?",
    prompt:
      "Return recipient_name, amount and ROW_NUMBER() over amount descending as payment_row. Use transaction_id as a tie-breaker. Order by payment_row.",
    starterSql: "",
    solutionSql:
      "SELECT recipient_name, amount, ROW_NUMBER() OVER (ORDER BY amount DESC, transaction_id) AS payment_row FROM northstar_outgoing_payments ORDER BY payment_row;",
    hints: [
      "ROW_NUMBER() OVER (...) assigns a unique sequence number.",
      "Put ORDER BY inside OVER().",
    ],
    successStory:
      "The largest payment is 40,000 to Elias Vogel. Klara Meier also received 15,000.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "ROW_NUMBER(",
    ],
  },

  {
    id: "mystery-task-082",
    number: 82,
    levelNumber: 17,
    position: 2,
    title: "Rank the Funding Sources",
    skill: "RANK()",
    difficulty: "Advanced",
    story:
      "Now examine the money entering Northstar. Several incoming transfers have exactly the same amount.",
    evidenceQuestion:
      "How do Northstar's funding sources rank by transfer amount when equal amounts share a rank?",
    prompt:
      "Return source_company, amount and RANK() over amount descending as amount_rank from northstar_incoming_funds. Order by amount descending, then source_company.",
    starterSql: "",
    solutionSql:
      "SELECT source_company, amount, RANK() OVER (ORDER BY amount DESC) AS amount_rank FROM northstar_incoming_funds ORDER BY amount DESC, source_company;",
    hints: [
      "RANK() gives tied values the same rank.",
      "The next rank may contain a gap.",
    ],
    successStory:
      "A 75,000 transfer sits at rank 1. Two 15,000 transfers share the next rank.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "RANK(",
    ],
  },

  {
    id: "mystery-task-083",
    number: 83,
    levelNumber: 17,
    position: 3,
    title: "Remove the Rank Gaps",
    skill: "DENSE_RANK()",
    difficulty: "Advanced",
    story:
      "The financial analyst wants the same ranking without gaps after ties.",
    evidenceQuestion:
      "How does the ranking change with DENSE_RANK()?",
    prompt:
      "Return source_company, amount and DENSE_RANK() over amount descending as dense_amount_rank from northstar_incoming_funds. Order by amount descending, then source_company.",
    starterSql: "",
    solutionSql:
      "SELECT source_company, amount, DENSE_RANK() OVER (ORDER BY amount DESC) AS dense_amount_rank FROM northstar_incoming_funds ORDER BY amount DESC, source_company;",
    hints: [
      "DENSE_RANK() does not leave gaps after ties.",
    ],
    successStory:
      "The transfer values collapse into a small number of distinct funding tiers.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "DENSE_RANK(",
    ],
  },

  {
    id: "mystery-task-084",
    number: 84,
    levelNumber: 17,
    position: 4,
    title: "Count Payments per Recipient",
    skill: "PARTITION BY",
    difficulty: "Advanced",
    story:
      "Northstar did not pay every recipient equally often. Repeated transfers may expose the main operative.",
    evidenceQuestion:
      "How many Northstar payments did each recipient receive?",
    prompt:
      "Return recipient_name, transaction_at, amount and COUNT(*) OVER (PARTITION BY recipient_name) as recipient_payment_count. Order by recipient_name and transaction_at.",
    starterSql: "",
    solutionSql:
      "SELECT recipient_name, transaction_at, amount, COUNT(*) OVER (PARTITION BY recipient_name) AS recipient_payment_count FROM northstar_outgoing_payments ORDER BY recipient_name, transaction_at;",
    hints: [
      "PARTITION BY creates a separate window for each recipient.",
    ],
    successStory:
      "Elias received two separate Northstar transfers. Klara received one payment for operational support.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "PARTITION BY",
    ],
  },

  {
    id: "mystery-task-085",
    number: 85,
    levelNumber: 17,
    position: 5,
    title: "Put the Payments in Window Order",
    skill: "Window ORDER BY",
    difficulty: "Advanced",
    story:
      "The final corporate-registry result arrives while you order Northstar's payments chronologically. Northstar does not stand alone: its parent_company_id points directly to another corporation.",
    evidenceQuestion:
      "What was the chronological payment sequence, and which parent company controls Northstar?",
    prompt:
      "Return transaction_id, recipient_name, transaction_at, ROW_NUMBER() OVER (ORDER BY transaction_at) as payment_sequence and Northstar's parent company as parent_company. Order by payment_sequence.",
    starterSql: "",
    solutionSql:
      "SELECT n.transaction_id, n.recipient_name, n.transaction_at, ROW_NUMBER() OVER (ORDER BY n.transaction_at) AS payment_sequence, parent.company_name AS parent_company FROM northstar_outgoing_payments AS n CROSS JOIN companies AS shell LEFT JOIN companies AS parent ON parent.company_id = shell.parent_company_id WHERE shell.company_name = 'Northstar Consulting' ORDER BY payment_sequence;",
    hints: [
      "Use ORDER BY inside OVER().",
      "Northstar's parent_company_id points back into companies.",
    ],
    successStory:
      "Northstar paid Elias before the murder and both Elias and Klara afterward. Corporate records show that Northstar Consulting is controlled by the Voss Group.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "OVER",
      "ORDER BY",
    ],
  },

  // ==========================================================
  // LEVEL 18 — THE FIRST PAYMENT
  // ==========================================================

  {
    id: "mystery-task-086",
    number: 86,
    levelNumber: 18,
    position: 1,
    title: "Look Behind Each Transfer",
    skill: "LAG()",
    difficulty: "Advanced",
    story:
      "The later transfers were deliberately fragmented. The financial team therefore reconstructs the funding sequence one payment at a time.",
    evidenceQuestion:
      "What amount came immediately before each incoming Northstar payment?",
    prompt:
      "Return source_company, transaction_at, amount and LAG(amount) over transaction_at as previous_amount. Order chronologically.",
    starterSql: "",
    solutionSql:
      "SELECT source_company, transaction_at, amount, LAG(amount) OVER (ORDER BY transaction_at) AS previous_amount FROM northstar_incoming_funds ORDER BY transaction_at;",
    hints: [
      "LAG(column) reads a value from the previous row in the window.",
    ],
    successStory:
      "The first transfer has no previous amount. It is the beginning of the money trail.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "LAG(",
    ],
  },

  {
    id: "mystery-task-087",
    number: 87,
    levelNumber: 18,
    position: 2,
    title: "Look Ahead",
    skill: "LEAD()",
    difficulty: "Advanced",
    story:
      "Next, investigators trace how each funding event was followed by another transfer.",
    evidenceQuestion:
      "Which company appears immediately after each funding source?",
    prompt:
      "Return source_company, transaction_at and LEAD(source_company) over transaction_at as next_source. Order chronologically.",
    starterSql: "",
    solutionSql:
      "SELECT source_company, transaction_at, LEAD(source_company) OVER (ORDER BY transaction_at) AS next_source FROM northstar_incoming_funds ORDER BY transaction_at;",
    hints: [
      "LEAD() reads from the following row.",
    ],
    successStory:
      "The funding chain moves through several companies, making the original source harder to see.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "LEAD(",
    ],
  },

  {
    id: "mystery-task-088",
    number: 88,
    levelNumber: 18,
    position: 3,
    title: "Build the Running Total",
    skill: "Running SUM",
    difficulty: "Advanced",
    story:
      "The prosecutor wants to see how rapidly money accumulated inside Northstar before the payments to Elias and Klara.",
    evidenceQuestion:
      "What was Northstar's running funded total after each incoming transfer?",
    prompt:
      "Return transaction_at, source_company, amount and SUM(amount) OVER ordered by transaction_at with an unbounded-preceding window. Name it running_total.",
    starterSql: "",
    solutionSql:
      "SELECT transaction_at, source_company, amount, SUM(amount) OVER (ORDER BY transaction_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total FROM northstar_incoming_funds ORDER BY transaction_at;",
    hints: [
      "Use SUM(amount) OVER (...).",
      "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW creates a running total.",
    ],
    successStory:
      "The first transfer provides most of Northstar's available money before smaller transfers are layered on top.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "SUM(",
      "OVER",
    ],
  },

  {
    id: "mystery-task-089",
    number: 89,
    levelNumber: 18,
    position: 4,
    title: "Count the Chain as It Grows",
    skill: "COUNT() OVER",
    difficulty: "Advanced",
    story:
      "The transfer chain can also be viewed as a cumulative number of funding events.",
    evidenceQuestion:
      "How many incoming transactions had occurred at each point in time?",
    prompt:
      "Return transaction_at, source_company and COUNT(*) OVER ordered by transaction_at with an unbounded-preceding window. Name it cumulative_payments.",
    starterSql: "",
    solutionSql:
      "SELECT transaction_at, source_company, COUNT(*) OVER (ORDER BY transaction_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_payments FROM northstar_incoming_funds ORDER BY transaction_at;",
    hints: [
      "COUNT(*) can also be used as a window function.",
    ],
    successStory:
      "The sequence now has a clear first event. That first source becomes the critical question.",
    resultOrderMatters: true,
    executionMode: "query",
    requiredSqlPatterns: [
      "COUNT(",
      "OVER",
    ],
  },

  {
    id: "mystery-task-090",
    number: 90,
    levelNumber: 18,
    position: 5,
    title: "Name the First Source",
    skill: "FIRST_VALUE()",
    difficulty: "Advanced",
    story:
      "The companies in the middle of the chain may be camouflage. Investigators trace the earliest funding company to its registered beneficial owner.",
    evidenceQuestion:
      "Which company supplied the first money, and who ultimately owns it?",
    prompt:
      "Use FIRST_VALUE(source_company) OVER (ORDER BY transaction_at) in a CTE. Join the first source to companies and then people. Return first_source and beneficial_owner.",
    starterSql: "",
    solutionSql:
      "WITH ordered_funds AS (SELECT source_company, transaction_at, FIRST_VALUE(source_company) OVER (ORDER BY transaction_at) AS first_source FROM northstar_incoming_funds) SELECT DISTINCT ofu.first_source, p.full_name AS beneficial_owner FROM ordered_funds AS ofu INNER JOIN companies AS c ON c.company_name = ofu.first_source INNER JOIN people AS p ON p.person_id = c.beneficial_owner_person_id;",
    hints: [
      "FIRST_VALUE() returns the first value according to the window order.",
      "Resolve the resulting company through beneficial_owner_person_id.",
    ],
    successStory:
      "The first source is Voss Group. Its beneficial owner is Adrian Voss. The man behind the money finally has a name.",
    resultOrderMatters: false,
    executionMode: "query",
    requiredSqlPatterns: [
      "FIRST_VALUE(",
    ],
  },

  // ==========================================================
  // LEVEL 19 — NORA'S SECRET INVESTIGATION FILE
  // ==========================================================

  {
    id: "mystery-task-091",
    number: 91,
    levelNumber: 19,
    position: 1,
    title: "Create the Evidence Table",
    skill: "CREATE TABLE",
    difficulty: "Expert",
    story:
      "The encrypted USB drive contains Nora's research files. To prepare the evidence for prosecutors, you now move into an isolated SQL sandbox and create a structured case-evidence table.",
    evidenceQuestion:
      "Can you create the table that will hold the prosecution's evidence?",
    prompt:
      "CREATE TABLE case_evidence with these columns: evidence_id INTEGER, evidence_type TEXT, person_id INTEGER, occurred_at TEXT, description TEXT, confidence_level INTEGER and source TEXT.",
    starterSql: "",
    solutionSql:
      "CREATE TABLE case_evidence (evidence_id INTEGER, evidence_type TEXT, person_id INTEGER, occurred_at TEXT, description TEXT, confidence_level INTEGER, source TEXT);",
    hints: [
      "Start with CREATE TABLE case_evidence.",
      "Put the column definitions inside parentheses.",
    ],
    successStory:
      "The prosecution now has a structured container for the evidence chain.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql: "",
    verificationSql:
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'case_evidence';",
    requiredSqlPatterns: [
      "CREATE TABLE",
    ],
  },

  {
    id: "mystery-task-092",
    number: 92,
    levelNumber: 19,
    position: 2,
    title: "Choose the SQLite Data Types",
    skill: "SQLite data types",
    difficulty: "Expert",
    story:
      "The table exists, but the evidence office requires sensible SQLite types so IDs remain numeric and descriptive evidence remains searchable text.",
    evidenceQuestion:
      "Are the evidence columns stored using appropriate SQLite data types?",
    prompt:
      "Create case_evidence again in this fresh sandbox. Use INTEGER for evidence_id, person_id and confidence_level. Use TEXT for evidence_type, occurred_at, description and source.",
    starterSql: "",
    solutionSql:
      "CREATE TABLE case_evidence (evidence_id INTEGER, evidence_type TEXT, person_id INTEGER, occurred_at TEXT, description TEXT, confidence_level INTEGER, source TEXT);",
    hints: [
      "SQLite commonly uses INTEGER and TEXT for this structure.",
      "Each task receives a fresh sandbox database.",
    ],
    successStory:
      "The evidence structure now preserves IDs and confidence levels as numbers while keeping descriptions and timestamps readable.",
    resultOrderMatters: true,
    executionMode: "sandbox",
    setupSql: "",
    verificationSql:
      "SELECT name, type FROM pragma_table_info('case_evidence') ORDER BY cid;",
    requiredSqlPatterns: [
      "INTEGER",
      "TEXT",
    ],
  },

  {
    id: "mystery-task-093",
    number: 93,
    levelNumber: 19,
    position: 3,
    title: "Give Every Evidence Item a Key",
    skill: "PRIMARY KEY",
    difficulty: "Expert",
    story:
      "Evidence records must never be ambiguous. Every item needs one unique identifier.",
    evidenceQuestion:
      "Which column should uniquely identify an evidence record?",
    prompt:
      "Create case_evidence with the same seven columns, but define evidence_id INTEGER PRIMARY KEY.",
    starterSql: "",
    solutionSql:
      "CREATE TABLE case_evidence (evidence_id INTEGER PRIMARY KEY, evidence_type TEXT, person_id INTEGER, occurred_at TEXT, description TEXT, confidence_level INTEGER, source TEXT);",
    hints: [
      "Add PRIMARY KEY after INTEGER on evidence_id.",
    ],
    successStory:
      "Every prosecution evidence item now has a unique identity.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql: "",
    verificationSql:
      "SELECT name, pk FROM pragma_table_info('case_evidence') WHERE name = 'evidence_id';",
    requiredSqlPatterns: [
      "PRIMARY KEY",
    ],
  },

  {
    id: "mystery-task-094",
    number: 94,
    levelNumber: 19,
    position: 4,
    title: "Link Evidence to People",
    skill: "FOREIGN KEY",
    difficulty: "Expert",
    story:
      "The person_id in each evidence record should point to a real person already present in the murder database.",
    evidenceQuestion:
      "Can the evidence table enforce its relationship to people?",
    prompt:
      "Create case_evidence with evidence_id as the primary key and add FOREIGN KEY (person_id) REFERENCES people(person_id). Keep all seven evidence columns.",
    starterSql: "",
    solutionSql:
      "CREATE TABLE case_evidence (evidence_id INTEGER PRIMARY KEY, evidence_type TEXT, person_id INTEGER, occurred_at TEXT, description TEXT, confidence_level INTEGER, source TEXT, FOREIGN KEY (person_id) REFERENCES people(person_id));",
    hints: [
      "Add the FOREIGN KEY definition after the column definitions.",
      "Reference people(person_id).",
    ],
    successStory:
      "Evidence can now be tied directly to Elias, Klara, Adrian or Nora without using free-form names.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql: "",
    verificationSql:
      "SELECT \"table\", \"from\", \"to\" FROM pragma_foreign_key_list('case_evidence') ORDER BY id;",
    requiredSqlPatterns: [
      "FOREIGN KEY",
      "REFERENCES",
    ],
  },

  {
    id: "mystery-task-095",
    number: 95,
    levelNumber: 19,
    position: 5,
    title: "Lock Down the Evidence Rules",
    skill: "Constraints",
    difficulty: "Expert",
    story:
      "Nora's files show that Voss Group manipulated medical research results and that publication was scheduled for the following morning. Before the motive enters the prosecution file, the final evidence table must reject weak or malformed records.",
    evidenceQuestion:
      "Can you enforce the integrity rules required for the final case file?",
    prompt:
      "Create case_evidence with evidence_id INTEGER PRIMARY KEY; evidence_type, occurred_at, description, confidence_level and source NOT NULL; description UNIQUE; confidence_level DEFAULT 3 with CHECK between 1 and 5; and a FOREIGN KEY from person_id to people(person_id).",
    starterSql: "",
    solutionSql:
      "CREATE TABLE case_evidence (evidence_id INTEGER PRIMARY KEY, evidence_type TEXT NOT NULL, person_id INTEGER, occurred_at TEXT NOT NULL, description TEXT NOT NULL UNIQUE, confidence_level INTEGER NOT NULL DEFAULT 3 CHECK (confidence_level BETWEEN 1 AND 5), source TEXT NOT NULL, FOREIGN KEY (person_id) REFERENCES people(person_id));",
    hints: [
      "Combine NOT NULL, UNIQUE, DEFAULT and CHECK directly in column definitions.",
      "Keep the foreign-key relationship from the previous task.",
    ],
    successStory:
      "The motive is now clear. Nora planned to publish evidence of manipulated medical research the next morning. Adrian Voss needed the report stopped before publication.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql: "",
    verificationSql:
      "SELECT (SELECT COUNT(*) FROM pragma_table_info('case_evidence') WHERE \"notnull\" = 1) AS not_null_columns, COALESCE((SELECT dflt_value FROM pragma_table_info('case_evidence') WHERE name = 'confidence_level'), '') AS confidence_default, (SELECT COUNT(*) FROM pragma_index_list('case_evidence') WHERE \"unique\" = 1) AS unique_indexes, CASE WHEN INSTR(UPPER((SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'case_evidence')), 'CHECK') > 0 THEN 1 ELSE 0 END AS has_check, (SELECT COUNT(*) FROM pragma_foreign_key_list('case_evidence')) AS foreign_keys;",
    requiredSqlPatterns: [
      "NOT NULL",
      "UNIQUE",
      "CHECK",
      "DEFAULT",
    ],
  },

  // ==========================================================
  // LEVEL 20 — THE FINAL QUERY
  // ==========================================================

  {
    id: "mystery-task-096",
    number: 96,
    levelNumber: 20,
    position: 1,
    title: "Enter the Murder Evidence",
    skill: "INSERT",
    difficulty: "Expert",
    story:
      "The prosecution table is ready. The first official evidence record identifies the direct killer established by the knife, DNA, timeline and luggage evidence.",
    evidenceQuestion:
      "Can you insert the murderer evidence into the final evidence table?",
    prompt:
      "INSERT evidence_id 1, evidence_type 'Murderer', person_id 2, occurred_at '2026-02-14 22:24', description 'Elias Vogel killed Nora Keller in the luggage compartment', confidence_level 5 and source 'forensic + timeline' into case_evidence.",
    starterSql: "",
    solutionSql:
      "INSERT INTO case_evidence (evidence_id, evidence_type, person_id, occurred_at, description, confidence_level, source) VALUES (1, 'Murderer', 2, '2026-02-14 22:24', 'Elias Vogel killed Nora Keller in the luggage compartment', 5, 'forensic + timeline');",
    hints: [
      "Use INSERT INTO table (columns...) VALUES (...).",
    ],
    successStory:
      "Elias Vogel is formally entered into the prosecution file as Nora's murderer.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql:
      CASE_EVIDENCE_SCHEMA,
    verificationSql:
      "SELECT evidence_id, evidence_type, person_id, occurred_at, description, confidence_level, source FROM case_evidence ORDER BY evidence_id;",
    requiredSqlPatterns: [
      "INSERT INTO",
    ],
  },

  {
    id: "mystery-task-097",
    number: 97,
    levelNumber: 20,
    position: 2,
    title: "Correct the False Accomplice",
    skill: "UPDATE",
    difficulty: "Expert",
    story:
      "A deliberately planted draft record names hotel receptionist Paula Stein as the accomplice. The evidence proves that this is wrong. Paula only followed an anonymous instruction; Klara actively opened the compartment and disabled the camera.",
    evidenceQuestion:
      "Can you correct the false accomplice record?",
    prompt:
      "UPDATE evidence_id 2 so person_id becomes 7, description becomes 'Klara Meier opened the luggage compartment and disabled its camera', and source becomes 'access_logs + locker_events'.",
    starterSql: "",
    solutionSql:
      "UPDATE case_evidence SET person_id = 7, description = 'Klara Meier opened the luggage compartment and disabled its camera', source = 'access_logs + locker_events' WHERE evidence_id = 2;",
    hints: [
      "Use UPDATE ... SET ... WHERE evidence_id = 2.",
    ],
    successStory:
      "The false lead is corrected. Klara Meier is now recorded as the accomplice.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql:
      CASE_EVIDENCE_SCHEMA +
      "\nINSERT INTO case_evidence VALUES (2, 'Accomplice', 9, '2026-02-14 22:16', 'Paula Stein helped Elias aboard train 714', 2, 'hotel record');",
    verificationSql:
      "SELECT evidence_id, person_id, description, source FROM case_evidence WHERE evidence_id = 2;",
    requiredSqlPatterns: [
      "UPDATE",
    ],
  },

  {
    id: "mystery-task-098",
    number: 98,
    levelNumber: 20,
    position: 3,
    title: "Delete the Decoy",
    skill: "DELETE",
    difficulty: "Expert",
    story:
      "One final decoy remains in the draft prosecution file: Jonas Frei. Earlier evidence already cleared him. Leaving the record would weaken the case.",
    evidenceQuestion:
      "Can you remove only the decoy without deleting genuine evidence?",
    prompt:
      "DELETE the row from case_evidence where evidence_type equals 'Decoy'.",
    starterSql: "",
    solutionSql:
      "DELETE FROM case_evidence WHERE evidence_type = 'Decoy';",
    hints: [
      "DELETE FROM removes rows.",
      "Use WHERE so genuine evidence remains.",
    ],
    successStory:
      "Jonas Frei is removed from the prosecution file. Only genuine evidence remains.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql:
      CASE_EVIDENCE_SCHEMA +
      "\nINSERT INTO case_evidence VALUES (1, 'Murderer', 2, '2026-02-14 22:24', 'Direct murder evidence', 5, 'forensic');" +
      "\nINSERT INTO case_evidence VALUES (2, 'Accomplice', 7, '2026-02-14 22:16', 'Compartment access evidence', 5, 'access logs');" +
      "\nINSERT INTO case_evidence VALUES (99, 'Decoy', 6, '2026-02-14 20:00', 'Jonas Frei false lead', 1, 'discarded lead');",
    verificationSql:
      "SELECT COUNT(*) AS remaining_evidence, SUM(CASE WHEN evidence_type = 'Decoy' THEN 1 ELSE 0 END) AS decoy_count FROM case_evidence;",
    requiredSqlPatterns: [
      "DELETE",
    ],
  },

  {
    id: "mystery-task-099",
    number: 99,
    levelNumber: 20,
    position: 4,
    title: "Commit the Verified Case",
    skill: "Transactions",
    difficulty: "Expert",
    story:
      "Before the prosecution file is sealed, you must demonstrate that an incorrect change can be rolled back and the verified status committed safely.",
    evidenceQuestion:
      "Can you use BEGIN, ROLLBACK and COMMIT to protect the final case state?",
    prompt:
      "BEGIN a transaction, UPDATE case_status to 'Temporary', then ROLLBACK. Start another transaction, UPDATE it to 'Verified', and COMMIT. The final status must be Verified.",
    starterSql: "",
    solutionSql:
      "BEGIN; UPDATE case_status SET status = 'Temporary' WHERE id = 1; ROLLBACK; BEGIN; UPDATE case_status SET status = 'Verified' WHERE id = 1; COMMIT;",
    hints: [
      "BEGIN starts a transaction.",
      "ROLLBACK cancels the first change.",
      "The second transaction should end with COMMIT.",
    ],
    successStory:
      "The temporary change disappears. The verified prosecution state is committed safely.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql:
      "CREATE TABLE case_status (id INTEGER PRIMARY KEY, status TEXT NOT NULL); INSERT INTO case_status VALUES (1, 'Draft');",
    verificationSql:
      "SELECT id, status FROM case_status WHERE id = 1;",
    requiredSqlPatterns: [
      "BEGIN",
      "ROLLBACK",
      "COMMIT",
    ],
  },

  {
    id: "mystery-task-100",
    number: 100,
    levelNumber: 20,
    position: 5,
    title: "Create the Final Case File",
    skill: "CREATE VIEW",
    difficulty: "Expert",
    story:
      "One hundred SQL investigation steps lead to this final command. The prosecutor wants one permanent view containing the murderer, accomplice, mastermind, victim and motive.",
    evidenceQuestion:
      "Can you produce the single final row that closes Case #714?",
    prompt:
      "CREATE VIEW final_case_file with exactly these columns: murderer, accomplice, mastermind, victim and motive. Read the four names from case_roles and the motive from case_motive.",
    starterSql: "",
    solutionSql:
      "CREATE VIEW final_case_file AS SELECT (SELECT person_name FROM case_roles WHERE role = 'murderer') AS murderer, (SELECT person_name FROM case_roles WHERE role = 'accomplice') AS accomplice, (SELECT person_name FROM case_roles WHERE role = 'mastermind') AS mastermind, (SELECT person_name FROM case_roles WHERE role = 'victim') AS victim, (SELECT motive FROM case_motive LIMIT 1) AS motive;",
    hints: [
      "A view is created with CREATE VIEW name AS SELECT ...",
      "Use scalar subqueries for each role.",
      "The result must contain exactly one row.",
    ],
    successStory:
      "CASE CLOSED. Elias Vogel murdered Nora Keller. Klara Meier enabled and concealed the crime. Adrian Voss financed and ordered it to prevent Nora from publishing evidence of manipulated medical research.",
    resultOrderMatters: false,
    executionMode: "sandbox",
    setupSql:
      FINAL_CASE_SETUP,
    verificationSql:
      "SELECT murderer, accomplice, mastermind, victim, motive FROM final_case_file;",
    requiredSqlPatterns: [
      "CREATE VIEW",
    ],
  },
];
