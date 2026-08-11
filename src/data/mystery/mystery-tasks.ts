import {
  MYSTERY_TASKS_11_15,
} from "@/data/mystery/mystery-tasks-11-15";

import {
  MYSTERY_TASKS_16_20,
} from "@/data/mystery/mystery-tasks-16-20";

import type {
  MysteryTask,
} from "@/types/mystery";

export const MYSTERY_TASKS: MysteryTask[] = [
  // ==========================================================
  // LEVEL 1 — WHO ORDERED THE KNIFE?
  // ==========================================================

  {
    id: "mystery-task-001",
    number: 1,
    levelNumber: 1,
    position: 1,
    title: "Open Nora's Purchase File",
    skill: "SELECT one column",
    difficulty: "Beginner",
    story:
      "At 23:52 investigators recover Nora Keller's laptop. One file was still open when she died: an export of online purchases she had been investigating. Police believe the murder weapon may appear somewhere inside it.",
    evidenceQuestion:
      "What kinds of products appear in Nora's recovered purchase records?",
    prompt:
      "Inspect purchase_history. Return only the product_name column.",
    starterSql: "",
    solutionSql:
      "SELECT product_name FROM purchase_history;",
    hints: [
      "Open purchase_history in the Case Database.",
      "You need only one column: product_name.",
      "Use SELECT column FROM table.",
    ],
    successStory:
      "Several knives appear among ordinary purchases. One model will soon become extremely important.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-002",
    number: 2,
    levelNumber: 1,
    position: 2,
    title: "Put Names to the Orders",
    skill: "SELECT multiple columns",
    difficulty: "Beginner",
    story:
      "A list of products is not enough. Detective Lena Baum needs to know who bought each item and which exact model was ordered.",
    evidenceQuestion:
      "Who bought which model?",
    prompt:
      "Return order_id, full_name and model from purchase_history.",
    starterSql: "",
    solutionSql:
      "SELECT order_id, full_name, model FROM purchase_history;",
    hints: [
      "Separate several column names with commas.",
      "Use order_id, full_name and model.",
    ],
    successStory:
      "Names now appear beside the purchases. Several buyers ordered the exact same tactical knife.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-003",
    number: 3,
    levelNumber: 1,
    position: 3,
    title: "Inspect Every Detail",
    skill: "SELECT *",
    difficulty: "Beginner",
    story:
      "The purchase export contains more than names. Dates, prices and delivery locations may later distinguish an innocent purchase from a planned murder.",
    evidenceQuestion:
      "What other details are hidden in Nora's file?",
    prompt:
      "Display every column and every row from purchase_history.",
    starterSql: "",
    solutionSql:
      "SELECT * FROM purchase_history;",
    hints: [
      "The * symbol selects all columns.",
      "Use SELECT * FROM purchase_history.",
    ],
    successStory:
      "You uncover order dates and delivery addresses. One destination is not a home address at all.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-004",
    number: 4,
    levelNumber: 1,
    position: 4,
    title: "Build the Suspect Report",
    skill: "AS aliases",
    difficulty: "Beginner",
    story:
      "The raw database headings are too technical for the official case file. Lena asks you to prepare a clean report before the forensic results arrive.",
    evidenceQuestion:
      "Can you turn the raw fields into a readable suspect report?",
    prompt:
      "Return full_name as suspect and model as product_model from purchase_history.",
    starterSql: "",
    solutionSql:
      "SELECT full_name AS suspect, model AS product_model FROM purchase_history;",
    hints: [
      "AS gives a result column a new name.",
      "Rename full_name to suspect.",
      "Rename model to product_model.",
    ],
    successStory:
      "The report is ready. Seconds later the forensic laboratory calls with a breakthrough.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-005",
    number: 5,
    levelNumber: 1,
    position: 5,
    title: "Identify the KX-17 Buyers",
    skill: "WHERE =",
    difficulty: "Beginner",
    story:
      "At 00:17 the pathologist confirms that Nora's wound dimensions match a KX-17 tactical knife. Anyone who purchased that exact model shortly before the murder enters the suspect pool.",
    evidenceQuestion:
      "Who ordered a KX-17?",
    prompt:
      "Return full_name from purchase_history where model equals 'KX-17'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name FROM purchase_history WHERE model = 'KX-17';",
    hints: [
      "Filtering is done with WHERE.",
      "Compare model with 'KX-17'.",
      "Text values require quotes.",
    ],
    successStory:
      "Five names enter the case file: Elias Vogel, Mira Roth, Leon Berger, Sofia Hartmann and Jonas Frei.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 2 — WHEN WERE THE KNIVES DELIVERED?
  // ==========================================================

  {
    id: "mystery-task-006",
    number: 6,
    levelNumber: 2,
    position: 1,
    title: "Check for Failed Deliveries",
    skill: "!= / <>",
    difficulty: "Beginner",
    story:
      "A purchase proves very little unless the buyer actually received the knife. Police obtain the courier records for all five KX-17 orders.",
    evidenceQuestion:
      "Which KX-17 deliveries were not still pending?",
    prompt:
      "Return full_name and delivery_status from knife_delivery_history where delivery_status is not equal to 'Pending'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, delivery_status FROM knife_delivery_history WHERE delivery_status <> 'Pending';",
    hints: [
      "<> means not equal in SQL.",
      "SQLite also accepts !=.",
    ],
    successStory:
      "None of the five orders remained pending. Every suspect had an opportunity to receive the knife.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-007",
    number: 7,
    levelNumber: 2,
    position: 2,
    title: "Reconstruct the Delivery Window",
    skill: "< and >",
    difficulty: "Beginner",
    story:
      "Investigators now compare the deliveries with the timeline leading to February 14. You need to see whether each package falls inside the critical period.",
    evidenceQuestion:
      "Which deliveries occurred after January 27 and before February 8?",
    prompt:
      "Return full_name and delivered_at where delivered_at is greater than '2026-01-27' and less than '2026-02-08'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, delivered_at FROM knife_delivery_history WHERE delivered_at > '2026-01-27' AND delivered_at < '2026-02-08';",
    hints: [
      "> means later than the first timestamp.",
      "< means earlier than the second timestamp.",
      "Combine both conditions with AND.",
    ],
    successStory:
      "All five suspect deliveries fall inside the relevant preparation period.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-008",
    number: 8,
    levelNumber: 2,
    position: 3,
    title: "Confirm the Exact Boundaries",
    skill: "<= and >=",
    difficulty: "Beginner",
    story:
      "The prosecutor wants the delivery window documented precisely, including the first and last relevant days.",
    evidenceQuestion:
      "Which knife deliveries occurred on or after January 28 and on or before February 7?",
    prompt:
      "Return full_name and delivered_at using >= for the lower boundary and <= for the upper boundary.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, delivered_at FROM knife_delivery_history WHERE delivered_at >= '2026-01-28 00:00' AND delivered_at <= '2026-02-07 23:59';",
    hints: [
      "Use >= for the lower boundary.",
      "Use <= for the upper boundary.",
    ],
    successStory:
      "The courier timeline is confirmed: every suspect possessed the knife before the night train departed.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-009",
    number: 9,
    levelNumber: 2,
    position: 4,
    title: "Prove Opportunity",
    skill: "AND",
    difficulty: "Beginner",
    story:
      "A defence lawyer could still argue that a delivery record was incomplete. You must prove both facts at once: delivered status and arrival before train 714 left Munich.",
    evidenceQuestion:
      "Which knives were confirmed delivered before 20:45 on February 14?",
    prompt:
      "Return full_name and delivered_at where delivery_status equals 'Delivered' AND delivered_at is before '2026-02-14 20:45'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, delivered_at FROM knife_delivery_history WHERE delivery_status = 'Delivered' AND delivered_at < '2026-02-14 20:45';",
    hints: [
      "Both conditions must be true.",
      "Join them with AND.",
    ],
    successStory:
      "All five suspects definitely had access to their knives before Nora boarded the train.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-010",
    number: 10,
    levelNumber: 2,
    position: 5,
    title: "The Strange Delivery Address",
    skill: "OR",
    difficulty: "Beginner",
    story:
      "One address catches Lena's attention: Munich Central Station Locker 417. To compare it against an ordinary delivery, she asks you to place Elias Vogel and Jonas Frei side by side.",
    evidenceQuestion:
      "Where were the packages for Elias Vogel or Jonas Frei delivered?",
    prompt:
      "Return full_name and delivery_address where the buyer is Elias Vogel OR Jonas Frei.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, delivery_address FROM knife_delivery_history WHERE full_name = 'Elias Vogel' OR full_name = 'Jonas Frei';",
    hints: [
      "OR allows either condition to be true.",
      "Compare full_name twice.",
    ],
    successStory:
      "Jonas received his parcel at home. Elias Vogel used Munich Central Station Locker 417. The locker number is added to the evidence board.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 3 — WHO BOUGHT PLASTIC SHEETING?
  // ==========================================================

  {
    id: "mystery-task-011",
    number: 11,
    levelNumber: 3,
    position: 1,
    title: "Search the Hardware Purchases",
    skill: "IN",
    difficulty: "Beginner",
    story:
      "Police search store receipts made after the knife deliveries. They are looking for materials that could have been used to control blood and hide evidence.",
    evidenceQuestion:
      "Who bought plastic, tape or gloves?",
    prompt:
      "Return full_name, item_name and category where category is IN Plastic, Tape or Gloves.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, item_name, category FROM store_purchase_history WHERE category IN ('Plastic', 'Tape', 'Gloves');",
    hints: [
      "IN checks one column against several values.",
      "Put the values inside parentheses.",
    ],
    successStory:
      "Four knife suspects appear repeatedly among purchases of plastic, tape and gloves.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-012",
    number: 12,
    levelNumber: 3,
    position: 2,
    title: "Remove Ordinary Shopping",
    skill: "NOT IN",
    difficulty: "Beginner",
    story:
      "The receipt archive also contains groceries, office supplies and clothing. Those purchases create noise in the investigation.",
    evidenceQuestion:
      "What remains after obvious everyday categories are removed?",
    prompt:
      "Return full_name, item_name and category where category is NOT IN Food, Office or Clothing.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, item_name, category FROM store_purchase_history WHERE category NOT IN ('Food', 'Office', 'Clothing');",
    hints: [
      "NOT IN excludes several values at once.",
      "Exclude Food, Office and Clothing.",
    ],
    successStory:
      "The harmless purchases disappear. The suspicious preparation materials remain.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-013",
    number: 13,
    levelNumber: 3,
    position: 3,
    title: "Narrow the Preparation Window",
    skill: "BETWEEN",
    difficulty: "Beginner",
    story:
      "The suspicious materials were not bought months earlier. They cluster tightly between February 9 and February 12, only days before Nora's death.",
    evidenceQuestion:
      "Which suspicious materials were purchased during that preparation window?",
    prompt:
      "Return full_name, item_name and purchased_at for suspicious categories purchased BETWEEN February 9 and February 12.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, item_name, purchased_at FROM store_purchase_history WHERE purchased_at BETWEEN '2026-02-09 00:00' AND '2026-02-12 23:59' AND category IN ('Plastic', 'Tape', 'Gloves');",
    hints: [
      "BETWEEN includes both boundaries.",
      "Keep only the suspicious categories with IN.",
    ],
    successStory:
      "The purchases form a clear preparation pattern immediately before the murder.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-014",
    number: 14,
    levelNumber: 3,
    position: 4,
    title: "Find the Plastic Purchases",
    skill: "LIKE %",
    difficulty: "Beginner",
    story:
      "Plastic sheeting is especially significant. Detectives search the item descriptions even though each store used a slightly different product name.",
    evidenceQuestion:
      "Which buyers purchased an item containing the word Plastic?",
    prompt:
      "Return full_name and item_name where item_name LIKE '%Plastic%' and category equals 'Plastic'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, item_name FROM store_purchase_history WHERE item_name LIKE '%Plastic%' AND category = 'Plastic';",
    hints: [
      "% means any number of characters.",
      "'%Plastic%' finds Plastic anywhere in the text.",
    ],
    successStory:
      "Exactly four of the five knife suspects bought plastic material.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-015",
    number: 15,
    levelNumber: 3,
    position: 5,
    title: "Confirm the Four Names",
    skill: "LIKE _",
    difficulty: "Beginner",
    story:
      "Lena asks for one final independent filter before removing a suspect. The category itself can be matched with a single-character wildcard.",
    evidenceQuestion:
      "Who appears in the Plastic category?",
    prompt:
      "Return full_name and item_name where category LIKE 'P_astic'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, item_name FROM store_purchase_history WHERE category LIKE 'P_astic';",
    hints: [
      "_ represents exactly one character.",
      "'P_astic' matches 'Plastic'.",
    ],
    successStory:
      "Four suspects remain: Elias Vogel, Mira Roth, Leon Berger and Sofia Hartmann. Jonas Frei drops out of the active suspect pool.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 4 — WHO TRAVELLED TO BERN?
  // ==========================================================

  {
    id: "mystery-task-016",
    number: 16,
    levelNumber: 4,
    position: 1,
    title: "Check the Tickets",
    skill: "NOT",
    difficulty: "Beginner",
    story:
      "The investigation moves from shopping records to railway data. Nora died aboard Alpenstern 714, so the killer had to be close enough to reach her.",
    evidenceQuestion:
      "Which of the four suspects had a ticket that was not cancelled?",
    prompt:
      "Return full_name, train_name and ticket_status for the four suspects where NOT ticket_status equals 'Cancelled'.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, train_name, ticket_status FROM train_passengers WHERE full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger', 'Sofia Hartmann') AND NOT ticket_status = 'Cancelled';",
    hints: [
      "Use NOT before the condition.",
      "The four active suspects are Elias, Mira, Leon and Sofia.",
    ],
    successStory:
      "All four hold valid tickets somewhere in the rail system that evening.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-017",
    number: 17,
    levelNumber: 4,
    position: 2,
    title: "How Many Trains?",
    skill: "DISTINCT",
    difficulty: "Beginner",
    story:
      "The four names do not all appear on the same service. Before examining individual seats, you need to identify the unique trains involved.",
    evidenceQuestion:
      "Which different trains carried the remaining suspects?",
    prompt:
      "Return the DISTINCT train_name values for Elias, Mira, Leon and Sofia.",
    starterSql: "",
    solutionSql:
      "SELECT DISTINCT train_name FROM train_passengers WHERE full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger', 'Sofia Hartmann');",
    hints: [
      "DISTINCT removes duplicate result values.",
      "Select only train_name.",
    ],
    successStory:
      "Two services appear: Alpenstern 714 to Bern and Alpenstern 715 to Vienna.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-018",
    number: 18,
    levelNumber: 4,
    position: 3,
    title: "Build the Departure Timeline",
    skill: "ORDER BY",
    difficulty: "Beginner",
    story:
      "The departure board gives investigators a simple way to separate the journeys chronologically.",
    evidenceQuestion:
      "In what order did the suspects' trains depart?",
    prompt:
      "Return full_name, train_name and departure_at for the four suspects ordered by departure_at.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, train_name, departure_at FROM train_passengers WHERE full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger', 'Sofia Hartmann') ORDER BY departure_at;",
    hints: [
      "ORDER BY sorts the result.",
      "Sort using departure_at.",
    ],
    successStory:
      "Sofia's journey separates from the others. Her ticket belongs to a different service.",
    resultOrderMatters: true,
    executionMode: "query",
  },
  {
    id: "mystery-task-019",
    number: 19,
    levelNumber: 4,
    position: 4,
    title: "Map the Bern Train",
    skill: "Multiple-column sorting",
    difficulty: "Beginner",
    story:
      "Police focus on train 714 and reconstruct the seating arrangement to see where each remaining suspect was located.",
    evidenceQuestion:
      "Where were the suspects seated on train 714?",
    prompt:
      "Return full_name, coach and seat_number for the suspects on train 714, ordered by coach and then seat_number.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, coach, seat_number FROM train_passengers WHERE train_number = '714' AND full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger', 'Sofia Hartmann') ORDER BY coach, seat_number;",
    hints: [
      "ORDER BY can contain more than one column.",
      "Sort by coach first, then seat_number.",
    ],
    successStory:
      "Only Elias, Mira and Leon appear aboard Alpenstern 714. Sofia was travelling toward Vienna.",
    resultOrderMatters: true,
    executionMode: "query",
  },
  {
    id: "mystery-task-020",
    number: 20,
    levelNumber: 4,
    position: 5,
    title: "The Three on the Night Train",
    skill: "LIMIT",
    difficulty: "Beginner",
    story:
      "The active suspect list can now be reduced to people who were physically aboard the murder train and travelling to Bern.",
    evidenceQuestion:
      "Which three suspects travelled aboard train 714 to Bern?",
    prompt:
      "Return the first three matching full_name values for the remaining suspects on train 714 to Bern, ordered by full_name.",
    starterSql: "",
    solutionSql:
      "SELECT full_name FROM train_passengers WHERE train_number = '714' AND destination = 'Bern' AND full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger', 'Sofia Hartmann') ORDER BY full_name LIMIT 3;",
    hints: [
      "LIMIT controls how many rows are returned.",
      "Filter train_number and destination first.",
    ],
    successStory:
      "Three suspects remain on the train: Elias Vogel, Mira Roth and Leon Berger.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 5 — BLOODSTAINED PASSENGERS
  // ==========================================================

  {
    id: "mystery-task-021",
    number: 21,
    levelNumber: 5,
    position: 1,
    title: "Read the Second Statement",
    skill: "OFFSET",
    difficulty: "Intermediate",
    story:
      "Four witness statements were taken after arrival. Lena wants you to inspect them chronologically rather than reading the entire file at once.",
    evidenceQuestion:
      "What is the second observation in chronological order?",
    prompt:
      "Return observed_person, observed_at and statement_text ordered by observed_at, using LIMIT 1 OFFSET 1.",
    starterSql: "",
    solutionSql:
      "SELECT observed_person, observed_at, statement_text FROM witness_reports ORDER BY observed_at LIMIT 1 OFFSET 1;",
    hints: [
      "OFFSET skips rows.",
      "LIMIT 1 OFFSET 1 skips the first row and returns the second.",
    ],
    successStory:
      "The second observation concerns Mira Roth near the luggage compartment.",
    resultOrderMatters: true,
    executionMode: "query",
  },
  {
    id: "mystery-task-022",
    number: 22,
    levelNumber: 5,
    position: 2,
    title: "Missing Seat Information",
    skill: "IS NULL",
    difficulty: "Intermediate",
    story:
      "Some witness observations could not be connected to a seat number because the people were standing in the corridor.",
    evidenceQuestion:
      "Which of the three suspects were observed without a recorded seat number?",
    prompt:
      "Return observed_person and seat_number for Elias, Mira and Leon where seat_number IS NULL.",
    starterSql: "",
    solutionSql:
      "SELECT observed_person, seat_number FROM witness_reports WHERE observed_person IN ('Elias Vogel', 'Mira Roth', 'Leon Berger') AND seat_number IS NULL;",
    hints: [
      "NULL is checked with IS NULL, not = NULL.",
    ],
    successStory:
      "Elias and Mira were both observed away from their normal seating locations.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-023",
    number: 23,
    levelNumber: 5,
    position: 3,
    title: "Usable Clothing Descriptions",
    skill: "IS NOT NULL",
    difficulty: "Intermediate",
    story:
      "The forensic team can only compare witness accounts that include an actual clothing description.",
    evidenceQuestion:
      "Which suspect observations contain usable clothing descriptions?",
    prompt:
      "Return observed_person and clothing_description for Elias, Mira and Leon where clothing_description IS NOT NULL.",
    starterSql: "",
    solutionSql:
      "SELECT observed_person, clothing_description FROM witness_reports WHERE observed_person IN ('Elias Vogel', 'Mira Roth', 'Leon Berger') AND clothing_description IS NOT NULL;",
    hints: [
      "Use IS NOT NULL when a value must exist.",
    ],
    successStory:
      "All three suspects have usable descriptions. Leon's clothing was explicitly described as clean.",
    resultOrderMatters: false,
    executionMode: "query",
  },
  {
    id: "mystery-task-024",
    number: 24,
    levelNumber: 5,
    position: 4,
    title: "Repair the Missing Labels",
    skill: "COALESCE",
    difficulty: "Intermediate",
    story:
      "Missing seat values make the report difficult to read. Before sending it to the detective, replace those NULL values with a clear label.",
    evidenceQuestion:
      "Can you make every seat reference readable?",
    prompt:
      "Return observed_person and COALESCE(seat_number, 'Unknown') as seat_reference for Elias, Mira and Leon, ordered by observed_person.",
    starterSql: "",
    solutionSql:
      "SELECT observed_person, COALESCE(seat_number, 'Unknown') AS seat_reference FROM witness_reports WHERE observed_person IN ('Elias Vogel', 'Mira Roth', 'Leon Berger') ORDER BY observed_person;",
    hints: [
      "COALESCE returns the first non-NULL value.",
      "Use 'Unknown' as the replacement.",
    ],
    successStory:
      "The cleaned report makes the corridor observations much easier to compare.",
    resultOrderMatters: true,
    executionMode: "query",
  },
  {
    id: "mystery-task-025",
    number: 25,
    levelNumber: 5,
    position: 5,
    title: "The Bloodstained Two",
    skill: "CASE WHEN",
    difficulty: "Intermediate",
    story:
      "The decisive witness detail is blood. One passenger described a man's sleeve covered in red stains. Another saw a woman with blood on her cuff. Leon was seen in clean clothing.",
    evidenceQuestion:
      "Which suspects were actually described as bloodstained?",
    prompt:
      "Return observed_person and a CASE result called forensic_status. Label blood_visible = 1 as 'Bloodstained'. Return only bloodstained observations for Elias, Mira and Leon, ordered by observed_person.",
    starterSql: "",
    solutionSql:
      "SELECT observed_person, CASE WHEN blood_visible = 1 THEN 'Bloodstained' ELSE 'No blood visible' END AS forensic_status FROM witness_reports WHERE observed_person IN ('Elias Vogel', 'Mira Roth', 'Leon Berger') AND blood_visible = 1 ORDER BY observed_person;",
    hints: [
      "CASE WHEN condition THEN value ELSE value END.",
      "Alias the result as forensic_status.",
      "Use blood_visible = 1 to keep the relevant observations.",
    ],
    successStory:
      "Only Elias Vogel and Mira Roth match the bloodstained description. Leon Berger is removed from the active suspect list. Two suspects remain.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 6 — THE MISSING TIME WINDOW
  // ==========================================================

  {
    id: "mystery-task-026",
    number: 26,
    levelNumber: 6,
    position: 1,
    title: "Count Elias's Movements",
    skill: "COUNT(*)",
    difficulty: "Intermediate",
    story:
      "Only Elias Vogel and Mira Roth remain. Train 714 contains pressure sensors beneath several seats. Investigators recover the sensor log for the murder window.",
    evidenceQuestion:
      "How many seat events were recorded for Elias Vogel?",
    prompt:
      "Use COUNT(*) on seat_event_history for Elias Vogel. Name the result event_count.",
    starterSql: "",
    solutionSql:
      "SELECT COUNT(*) AS event_count FROM seat_event_history WHERE full_name = 'Elias Vogel';",
    hints: [
      "COUNT(*) counts rows.",
      "Filter full_name for Elias Vogel.",
    ],
    successStory:
      "Two events define Elias's absence: he left his seat and later returned.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-027",
    number: 27,
    levelNumber: 6,
    position: 2,
    title: "Find Recorded Absences",
    skill: "COUNT(column)",
    difficulty: "Intermediate",
    story:
      "The system records absence_minutes only once the passenger returns. A NULL means the absence was still in progress.",
    evidenceQuestion:
      "How many completed absence durations exist for Elias?",
    prompt:
      "Count the non-NULL absence_minutes values for Elias Vogel and call the result completed_absences.",
    starterSql: "",
    solutionSql:
      "SELECT COUNT(absence_minutes) AS completed_absences FROM seat_event_history WHERE full_name = 'Elias Vogel';",
    hints: [
      "COUNT(column) ignores NULL values.",
      "Use absence_minutes inside COUNT().",
    ],
    successStory:
      "One complete absence period can be reconstructed for Elias.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-028",
    number: 28,
    levelNumber: 6,
    position: 3,
    title: "When Did Elias Leave?",
    skill: "MIN",
    difficulty: "Intermediate",
    story:
      "The murder window begins at 22:18. Lena needs the earliest sensor timestamp associated with Elias.",
    evidenceQuestion:
      "When did Elias's suspicious absence begin?",
    prompt:
      "Return MIN(event_at) as first_event for Elias Vogel.",
    starterSql: "",
    solutionSql:
      "SELECT MIN(event_at) AS first_event FROM seat_event_history WHERE full_name = 'Elias Vogel';",
    hints: [
      "MIN() finds the smallest value.",
      "ISO timestamps can be compared chronologically.",
    ],
    successStory:
      "Elias left his seat at 22:09 — nine minutes before the murder window opened.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-029",
    number: 29,
    levelNumber: 6,
    position: 4,
    title: "Measure Mira's Absence",
    skill: "MAX",
    difficulty: "Intermediate",
    story:
      "Mira was also away from her seat, but her sensor data looks very different.",
    evidenceQuestion:
      "What is the longest recorded absence for Mira Roth?",
    prompt:
      "Return MAX(absence_minutes) as longest_absence for Mira Roth.",
    starterSql: "",
    solutionSql:
      "SELECT MAX(absence_minutes) AS longest_absence FROM seat_event_history WHERE full_name = 'Mira Roth';",
    hints: [
      "MAX() returns the largest non-NULL value.",
    ],
    successStory:
      "Mira was absent for only 8 minutes.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-030",
    number: 30,
    levelNumber: 6,
    position: 5,
    title: "The Twenty-Five Minutes",
    skill: "AVG",
    difficulty: "Intermediate",
    story:
      "Elias left at 22:09 and did not return until 22:34. The entire murder window lies inside his absence.",
    evidenceQuestion:
      "How long was Elias absent on average?",
    prompt:
      "Return AVG(absence_minutes) as average_absence for Elias Vogel.",
    starterSql: "",
    solutionSql:
      "SELECT AVG(absence_minutes) AS average_absence FROM seat_event_history WHERE full_name = 'Elias Vogel';",
    hints: [
      "AVG() ignores NULL values.",
      "Only the completed absence contains a duration.",
    ],
    successStory:
      "Elias was gone for 25 minutes. Mira was gone for only 8. Elias becomes the dominant suspect.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 7 — THE HEAVY SUITCASE
  // ==========================================================

  {
    id: "mystery-task-031",
    number: 31,
    levelNumber: 7,
    position: 1,
    title: "Total Elias's Baggage Scans",
    skill: "SUM",
    difficulty: "Intermediate",
    story:
      "Bern station automatically weighs luggage entering and leaving the train. Elias's suitcase triggers an unusual discrepancy.",
    evidenceQuestion:
      "What is the combined weight of all baggage scans belonging to Elias?",
    prompt:
      "Return SUM(weight_kg) as total_scanned_weight for Elias Vogel.",
    starterSql: "",
    solutionSql:
      "SELECT SUM(weight_kg) AS total_scanned_weight FROM baggage_history WHERE full_name = 'Elias Vogel';",
    hints: [
      "SUM() adds all matching numeric values.",
    ],
    successStory:
      "The two scans total 31.2 kg. More important is the difference between them.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-032",
    number: 32,
    levelNumber: 7,
    position: 2,
    title: "Calculate the Weight Change",
    skill: "ROUND",
    difficulty: "Intermediate",
    story:
      "Elias boarded with 12.4 kg and arrived with a much heavier suitcase.",
    evidenceQuestion:
      "How much weight did Elias's luggage gain?",
    prompt:
      "Calculate MAX(weight_kg) - MIN(weight_kg), round it to one decimal place and name it weight_change_kg.",
    starterSql: "",
    solutionSql:
      "SELECT ROUND(MAX(weight_kg) - MIN(weight_kg), 1) AS weight_change_kg FROM baggage_history WHERE full_name = 'Elias Vogel';",
    hints: [
      "Subtract MIN() from MAX().",
      "ROUND(value, 1) keeps one decimal place.",
    ],
    successStory:
      "Elias's suitcase became 6.4 kg heavier during the journey.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-033",
    number: 33,
    levelNumber: 7,
    position: 3,
    title: "Expose the Difference",
    skill: "Calculated columns",
    difficulty: "Intermediate",
    story:
      "Lena wants the raw scans shown beside a calculated change from the 12.4 kg departure weight.",
    evidenceQuestion:
      "What does each Elias scan look like relative to his departure weight?",
    prompt:
      "Return scan_location, weight_kg and weight_kg - 12.4 as change_from_departure for Elias Vogel, ordered by scanned_at.",
    starterSql: "",
    solutionSql:
      "SELECT scan_location, weight_kg, weight_kg - 12.4 AS change_from_departure FROM baggage_history WHERE full_name = 'Elias Vogel' ORDER BY scanned_at;",
    hints: [
      "Arithmetic can be written directly in SELECT.",
      "Use AS for the calculated column.",
    ],
    successStory:
      "At Bern, the suitcase contains 6.4 kg that was not present in Munich.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-034",
    number: 34,
    levelNumber: 7,
    position: 4,
    title: "Compare All Three",
    skill: "GROUP BY",
    difficulty: "Intermediate",
    story:
      "Investigators compare the luggage changes of Elias, Mira and Leon to determine whether the increase is unusual.",
    evidenceQuestion:
      "How did each suspect's baggage weight change?",
    prompt:
      "Group Elias Vogel, Mira Roth and Leon Berger by full_name and return each name with ROUND(MAX(weight_kg) - MIN(weight_kg), 1) as weight_change_kg. Order by full_name.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, ROUND(MAX(weight_kg) - MIN(weight_kg), 1) AS weight_change_kg FROM baggage_history WHERE full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger') GROUP BY full_name ORDER BY full_name;",
    hints: [
      "GROUP BY full_name creates one group per person.",
    ],
    successStory:
      "Mira gained only 0.7 kg. Leon's luggage barely changed. Elias gained 6.4 kg.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-035",
    number: 35,
    levelNumber: 7,
    position: 5,
    title: "The Suitcase That Changed",
    skill: "HAVING",
    difficulty: "Intermediate",
    story:
      "A baggage increase above 2 kg is considered suspicious. Only one of the remaining travellers crosses that threshold.",
    evidenceQuestion:
      "Whose luggage gained more than 2 kg?",
    prompt:
      "Group the three suspects by full_name and use HAVING to return only weight changes greater than 2 kg.",
    starterSql: "",
    solutionSql:
      "SELECT full_name, ROUND(MAX(weight_kg) - MIN(weight_kg), 1) AS weight_change_kg FROM baggage_history WHERE full_name IN ('Elias Vogel', 'Mira Roth', 'Leon Berger') GROUP BY full_name HAVING MAX(weight_kg) - MIN(weight_kg) > 2 ORDER BY full_name;",
    hints: [
      "HAVING filters groups after GROUP BY.",
      "Use the same MAX() - MIN() calculation.",
    ],
    successStory:
      "Only Elias Vogel remains. The Bern scan notes a laptop-shaped object and paper files — exactly what disappeared from Nora's luggage.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 8 — THE FALSE HOTEL ALIBI
  // ==========================================================

  {
    id: "mystery-task-036",
    number: 36,
    levelNumber: 8,
    position: 1,
    title: "Find the Hotel Guest",
    skill: "INNER JOIN",
    difficulty: "Intermediate",
    story:
      "When questioned, Elias produces what appears to be a perfect alibi: a hotel reservation in Munich for the night of the murder.",
    evidenceQuestion:
      "Which people are attached to the hotel bookings?",
    prompt:
      "INNER JOIN hotel_bookings with people using person_id. Return full_name, room_number and booking_status ordered by full_name.",
    starterSql: "",
    solutionSql:
      "SELECT people.full_name, hotel_bookings.room_number, hotel_bookings.booking_status FROM hotel_bookings INNER JOIN people ON people.person_id = hotel_bookings.person_id ORDER BY people.full_name;",
    hints: [
      "Join people.person_id to hotel_bookings.person_id.",
    ],
    successStory:
      "Elias Vogel really does have a booking for room 417.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-037",
    number: 37,
    levelNumber: 8,
    position: 2,
    title: "Shorten the Evidence Query",
    skill: "Table aliases",
    difficulty: "Intermediate",
    story:
      "The hotel query will soon involve several tables. Aliases make the growing evidence chain easier to read.",
    evidenceQuestion:
      "Can you reproduce Elias's booking using aliases?",
    prompt:
      "Use hb as the alias for hotel_bookings and p for people. Return p.full_name, hb.room_number and hb.booking_status for Elias Vogel.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name, hb.room_number, hb.booking_status FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id WHERE p.full_name = 'Elias Vogel';",
    hints: [
      "Write table_name AS alias.",
    ],
    successStory:
      "The reservation is genuine. That still does not prove Elias was physically in the hotel.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-038",
    number: 38,
    levelNumber: 8,
    position: 3,
    title: "Follow the Foreign Key",
    skill: "PK/FK JOIN",
    difficulty: "Intermediate",
    story:
      "The booking stores only a hotel_id. You need to follow that foreign key to identify the actual hotel.",
    evidenceQuestion:
      "Which hotel was supposedly hosting Elias?",
    prompt:
      "Join hotel_bookings hb to hotels h using hotel_id. Return hb.room_number, h.hotel_name and h.city for booking_id 8001.",
    starterSql: "",
    solutionSql:
      "SELECT hb.room_number, h.hotel_name, h.city FROM hotel_bookings AS hb INNER JOIN hotels AS h ON h.hotel_id = hb.hotel_id WHERE hb.booking_id = 8001;",
    hints: [
      "hotel_bookings.hotel_id references hotels.hotel_id.",
    ],
    successStory:
      "The booking points to Hotel Isartor in Munich.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-039",
    number: 39,
    levelNumber: 8,
    position: 4,
    title: "Reconstruct the Reservation",
    skill: "Three-table JOIN",
    difficulty: "Intermediate",
    story:
      "Now combine the guest, booking and hotel information into one official record.",
    evidenceQuestion:
      "What exactly does Elias's reservation claim?",
    prompt:
      "Join people p, hotel_bookings hb and hotels h. Return p.full_name, h.hotel_name and hb.room_number for Elias Vogel.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name, h.hotel_name, hb.room_number FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id INNER JOIN hotels AS h ON h.hotel_id = hb.hotel_id WHERE p.full_name = 'Elias Vogel';",
    hints: [
      "Start with hotel_bookings and join people and hotels.",
    ],
    successStory:
      "The official record says Elias Vogel was booked into Hotel Isartor, room 417.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-040",
    number: 40,
    levelNumber: 8,
    position: 5,
    title: "The Official Check-in",
    skill: "Four-table JOIN",
    difficulty: "Intermediate",
    story:
      "The hotel insists Elias checked in. The check-in table even contains a timestamp. Lena asks you to reconstruct the full record.",
    evidenceQuestion:
      "How was Elias supposedly checked in?",
    prompt:
      "Join hotel_bookings hb, people p, hotels h and hotel_checkins hc. Return p.full_name, h.hotel_name, hb.room_number, hc.checked_in_at and hc.method for Elias Vogel.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name, h.hotel_name, hb.room_number, hc.checked_in_at, hc.method FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id INNER JOIN hotels AS h ON h.hotel_id = hb.hotel_id INNER JOIN hotel_checkins AS hc ON hc.booking_id = hb.booking_id WHERE p.full_name = 'Elias Vogel';",
    hints: [
      "hotel_checkins connects through booking_id.",
    ],
    successStory:
      "The record says Elias checked in at 20:11 — but the method is MANUAL. The alibi has developed a crack.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 9 — THE MISSING CHECK-IN
  // ==========================================================

  {
    id: "mystery-task-041",
    number: 41,
    levelNumber: 9,
    position: 1,
    title: "Search the Keycard System",
    skill: "LEFT JOIN",
    difficulty: "Intermediate",
    story:
      "Hotel Isartor uses electronic keycards. Every successful room entry should leave an event. You compare bookings with physical access.",
    evidenceQuestion:
      "Do all booked guests have keycard activity?",
    prompt:
      "Join hotel_bookings hb to people p and LEFT JOIN keycard_events ke. Return p.full_name, hb.room_number and ke.event_type ordered by p.full_name and ke.event_at.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name, hb.room_number, ke.event_type FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id LEFT JOIN keycard_events AS ke ON ke.booking_id = hb.booking_id ORDER BY p.full_name, ke.event_at;",
    hints: [
      "LEFT JOIN keeps bookings even when no matching keycard row exists.",
    ],
    successStory:
      "David Kern has room-access events. Elias Vogel has NULL.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-042",
    number: 42,
    levelNumber: 9,
    position: 2,
    title: "Find the Missing Access",
    skill: "Unmatched rows",
    difficulty: "Intermediate",
    story:
      "A NULL after a LEFT JOIN can reveal what did not happen — sometimes the most important evidence of all.",
    evidenceQuestion:
      "Which booked guest never generated a keycard event?",
    prompt:
      "Use a LEFT JOIN and return p.full_name and hb.room_number where ke.keycard_event_id IS NULL.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name, hb.room_number FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id LEFT JOIN keycard_events AS ke ON ke.booking_id = hb.booking_id WHERE ke.keycard_event_id IS NULL;",
    hints: [
      "Unmatched LEFT JOIN rows have NULL values on the right side.",
    ],
    successStory:
      "Elias never entered room 417. His hotel alibi is false.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-043",
    number: 43,
    levelNumber: 9,
    position: 3,
    title: "Did a Check-in Record Exist?",
    skill: "EXISTS",
    difficulty: "Intermediate",
    story:
      "The hotel database still contains an official check-in. You verify which bookings have a corresponding check-in row.",
    evidenceQuestion:
      "Which guests have an official check-in record?",
    prompt:
      "Return p.full_name for bookings where an entry EXISTS in hotel_checkins with the same booking_id. Order by p.full_name.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id WHERE EXISTS (SELECT 1 FROM hotel_checkins AS hc WHERE hc.booking_id = hb.booking_id) ORDER BY p.full_name;",
    hints: [
      "EXISTS checks whether the subquery returns at least one row.",
    ],
    successStory:
      "Elias has an official check-in record despite never using the room.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-044",
    number: 44,
    levelNumber: 9,
    position: 4,
    title: "Prove the Alibi Is Hollow",
    skill: "NOT EXISTS",
    difficulty: "Intermediate",
    story:
      "The contradiction can now be expressed directly: a booking exists, but no physical keycard activity exists.",
    evidenceQuestion:
      "Which guest has a booking but no keycard event?",
    prompt:
      "Return p.full_name where NOT EXISTS a keycard_event for the same booking_id.",
    starterSql: "",
    solutionSql:
      "SELECT p.full_name FROM hotel_bookings AS hb INNER JOIN people AS p ON p.person_id = hb.person_id WHERE NOT EXISTS (SELECT 1 FROM keycard_events AS ke WHERE ke.booking_id = hb.booking_id);",
    hints: [
      "Use NOT EXISTS around a correlated subquery.",
    ],
    successStory:
      "The database proves Elias's hotel stay was only paperwork.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-045",
    number: 45,
    levelNumber: 9,
    position: 5,
    title: "Who Created the Fake Check-in?",
    skill: "Subquery with IN",
    difficulty: "Intermediate",
    story:
      "The manual check-in contains an employee ID. According to the note, the employee acted after receiving an anonymous telephone instruction.",
    evidenceQuestion:
      "Which hotel employee created a manual check-in?",
    prompt:
      "Return full_name from people where person_id is IN the employee_person_id values from manual hotel_checkins.",
    starterSql: "",
    solutionSql:
      "SELECT full_name FROM people WHERE person_id IN (SELECT employee_person_id FROM hotel_checkins WHERE method = 'Manual');",
    hints: [
      "The inner query should return employee_person_id.",
      "The outer query resolves that ID to a name.",
    ],
    successStory:
      "Paula Stein created the false check-in. She says an anonymous caller told her Elias would arrive late and asked her to mark him present.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 10 — THE BURNER PHONE
  // ==========================================================

  {
    id: "mystery-task-046",
    number: 46,
    levelNumber: 10,
    position: 1,
    title: "The Longest Call",
    skill: "Scalar subquery",
    difficulty: "Advanced",
    story:
      "Police search Elias's luggage and find a cheap burner phone. The contact list is empty, but the carrier provides the call records.",
    evidenceQuestion:
      "Which number received Elias's longest outgoing call?",
    prompt:
      "Use a scalar subquery to resolve Elias Vogel's person_id. Return receiver_number and started_at for his longest outgoing call.",
    starterSql: "",
    solutionSql:
      "SELECT receiver_number, started_at FROM phone_calls WHERE caller_person_id = (SELECT person_id FROM people WHERE full_name = 'Elias Vogel') ORDER BY duration_seconds DESC LIMIT 1;",
    hints: [
      "The inner query returns one person_id.",
      "Use that value in the outer WHERE clause.",
    ],
    successStory:
      "The longest call went to +49-151-7140417.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-047",
    number: 47,
    levelNumber: 10,
    position: 2,
    title: "Calls Above Elias's Average",
    skill: "Correlated subquery",
    difficulty: "Advanced",
    story:
      "One unknown number appears repeatedly. You compare each call against Elias's own average call duration.",
    evidenceQuestion:
      "Which Elias calls lasted longer than his personal average?",
    prompt:
      "Return call_id, receiver_number and duration_seconds for Elias calls whose duration is above the average duration for the same caller. Order by duration_seconds descending.",
    starterSql: "",
    solutionSql:
      "SELECT pc.call_id, pc.receiver_number, pc.duration_seconds FROM phone_calls AS pc WHERE pc.caller_person_id = (SELECT person_id FROM people WHERE full_name = 'Elias Vogel') AND pc.duration_seconds > (SELECT AVG(pc2.duration_seconds) FROM phone_calls AS pc2 WHERE pc2.caller_person_id = pc.caller_person_id) ORDER BY pc.duration_seconds DESC;",
    hints: [
      "The inner query can refer to pc.caller_person_id from the outer query.",
    ],
    successStory:
      "The same number dominates Elias's meaningful calls.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-048",
    number: 48,
    levelNumber: 10,
    position: 3,
    title: "The Most-Called Number",
    skill: "Subquery in FROM",
    difficulty: "Advanced",
    story:
      "Lena asks you to collapse the call history into a summary table and identify the most frequent destination.",
    evidenceQuestion:
      "Which number did Elias call most often?",
    prompt:
      "Build a subquery in FROM that counts Elias's calls per receiver_number. Return receiver_number and call_count for the most-called number.",
    starterSql: "",
    solutionSql:
      "SELECT receiver_number, call_count FROM (SELECT receiver_number, COUNT(*) AS call_count FROM phone_calls WHERE caller_person_id = (SELECT person_id FROM people WHERE full_name = 'Elias Vogel') GROUP BY receiver_number) AS call_summary ORDER BY call_count DESC, receiver_number LIMIT 1;",
    hints: [
      "The inner query should GROUP BY receiver_number.",
      "The outer query sorts the summary.",
    ],
    successStory:
      "Three calls lead to the same burner-phone contact.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-049",
    number: 49,
    levelNumber: 10,
    position: 4,
    title: "Name the Repeated Contact",
    skill: "CTE",
    difficulty: "Advanced",
    story:
      "The number itself means little. You need to connect the repeated contact back to a real person.",
    evidenceQuestion:
      "Who owns Elias's most frequently called number?",
    prompt:
      "Create a CTE named call_counts that counts Elias's calls per receiver_number. Join it to people by phone_number and return full_name and call_count, highest first, LIMIT 1.",
    starterSql: "",
    solutionSql:
      "WITH call_counts AS (SELECT receiver_number, COUNT(*) AS call_count FROM phone_calls WHERE caller_person_id = (SELECT person_id FROM people WHERE full_name = 'Elias Vogel') GROUP BY receiver_number) SELECT p.full_name, cc.call_count FROM call_counts AS cc INNER JOIN people AS p ON p.phone_number = cc.receiver_number ORDER BY cc.call_count DESC LIMIT 1;",
    hints: [
      "A CTE begins with WITH name AS (...).",
      "Join receiver_number to people.phone_number.",
    ],
    successStory:
      "The number belongs to Klara Meier — conductor aboard Alpenstern 714.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-050",
    number: 50,
    levelNumber: 10,
    position: 5,
    title: "The Shared Route",
    skill: "Multiple CTEs",
    difficulty: "Advanced",
    story:
      "The phone calls are suspicious, but location data is worse. Elias and Klara's phones repeatedly appear in the same places: Munich Central Station, train 714 and Bern Central Station.",
    evidenceQuestion:
      "Which known contact shares the strongest call and location pattern with Elias?",
    prompt:
      "Use multiple CTEs: one for Elias, one for call_counts and one for shared_locations. Return full_name, call_count and shared_locations for the strongest matching known contact.",
    starterSql: "",
    solutionSql:
      "WITH elias AS (SELECT person_id FROM people WHERE full_name = 'Elias Vogel'), call_counts AS (SELECT receiver_number, COUNT(*) AS call_count FROM phone_calls WHERE caller_person_id = (SELECT person_id FROM elias) GROUP BY receiver_number), shared_locations AS (SELECT pl.person_id, COUNT(DISTINCT pl.location) AS shared_locations FROM phone_locations AS pl WHERE pl.location IN (SELECT location FROM phone_locations WHERE person_id = (SELECT person_id FROM elias)) AND pl.person_id <> (SELECT person_id FROM elias) GROUP BY pl.person_id) SELECT p.full_name, cc.call_count, sl.shared_locations FROM call_counts AS cc INNER JOIN people AS p ON p.phone_number = cc.receiver_number INNER JOIN shared_locations AS sl ON sl.person_id = p.person_id ORDER BY cc.call_count DESC, sl.shared_locations DESC LIMIT 1;",
    hints: [
      "The first CTE resolves Elias's ID.",
      "The second counts calls by receiver.",
      "The third counts locations shared with Elias.",
      "Join the CTE results through people.",
    ],
    successStory:
      "Klara Meier appears beside Elias in Munich, aboard train 714 and again in Bern. She is no longer just a conductor. She is now a major lead.",
    resultOrderMatters: true,
    executionMode: "query",
  },


  ...MYSTERY_TASKS_11_15,
  ...MYSTERY_TASKS_16_20,
];

export function getMysteryTask(
  taskId: string,
): MysteryTask | null {
  return (
    MYSTERY_TASKS.find(
      (task) => task.id === taskId,
    ) ?? null
  );
}
