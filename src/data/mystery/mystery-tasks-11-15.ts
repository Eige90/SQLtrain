import type {
  MysteryTask,
} from "@/types/mystery";

export const MYSTERY_TASKS_11_15: MysteryTask[] = [
  // ==========================================================
  // LEVEL 11 — LOCKER 417
  // ==========================================================

  {
    id: "mystery-task-051",
    number: 51,
    levelNumber: 11,
    position: 1,
    title: "Reconstruct Locker 417",
    skill: "CTE aggregation",
    difficulty: "Advanced",
    story:
      "Klara Meier appears in Elias's phone records, but that alone does not prove she helped him. Bern station security now releases the access log for Locker 417 — the same locker used for Elias's knife delivery weeks earlier.",
    evidenceQuestion:
      "How much activity occurred at Locker 417, and when was its final recorded event?",
    prompt:
      "Create a CTE named locker_summary that groups locker_evidence_history by locker_number. Return locker_number, COUNT(*) as event_count and MAX(event_at) as last_event for Locker 417.",
    starterSql: "",
    solutionSql:
      "WITH locker_summary AS (SELECT locker_number, COUNT(*) AS event_count, MAX(event_at) AS last_event FROM locker_evidence_history GROUP BY locker_number) SELECT locker_number, event_count, last_event FROM locker_summary WHERE locker_number = 417;",
    hints: [
      "Create the grouped result inside a WITH clause.",
      "GROUP BY locker_number.",
      "Then query locker_summary for locker 417.",
    ],
    successStory:
      "Locker 417 was used three times. The final two events happened minutes after train 714 reached Bern — and Klara Meier used a staff override card.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-052",
    number: 52,
    levelNumber: 11,
    position: 2,
    title: "Classify the Evidence",
    skill: "Complex CASE",
    difficulty: "Advanced",
    story:
      "Police force Locker 417 open. Inside are four objects. The evidence unit needs each item classified before it enters the official case file.",
    evidenceQuestion:
      "Which items directly connect to the murder, the victim, or a new digital lead?",
    prompt:
      "Return item_name and a CASE result named evidence_class from evidence_items for Locker 417. Weapon or Forensic should become 'Direct forensic link', Personal Item should become 'Victim property', Digital should become 'Digital lead', and everything else 'Other'. Order by evidence_id.",
    starterSql: "",
    solutionSql:
      "SELECT item_name, CASE WHEN evidence_type IN ('Weapon', 'Forensic') THEN 'Direct forensic link' WHEN evidence_type = 'Personal Item' THEN 'Victim property' WHEN evidence_type = 'Digital' THEN 'Digital lead' ELSE 'Other' END AS evidence_class FROM evidence_items WHERE locker_number = 417 ORDER BY evidence_id;",
    hints: [
      "CASE can contain several WHEN branches.",
      "Weapon and Forensic share one result.",
      "Finish with ELSE and END.",
    ],
    successStory:
      "The knife and gloves are direct forensic evidence. Nora's press ID proves her property was hidden here. The encrypted USB drive becomes a new investigative lead.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-053",
    number: 53,
    levelNumber: 11,
    position: 3,
    title: "Prepare the Locker Code",
    skill: "CAST",
    difficulty: "Advanced",
    story:
      "The evidence export stores locker numbers as integers, but the forensic archive expects them as text identifiers.",
    evidenceQuestion:
      "Can you convert Locker 417 into the format required by the archive?",
    prompt:
      "Return item_name and CAST(locker_number AS TEXT) as locker_code from evidence_items for Locker 417. Order by evidence_id.",
    starterSql: "",
    solutionSql:
      "SELECT item_name, CAST(locker_number AS TEXT) AS locker_code FROM evidence_items WHERE locker_number = 417 ORDER BY evidence_id;",
    hints: [
      "CAST(value AS TEXT) changes the SQLite representation.",
      "Alias the result as locker_code.",
    ],
    successStory:
      "The recovered objects are now consistently linked to evidence location 417.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-054",
    number: 54,
    levelNumber: 11,
    position: 4,
    title: "Separate Normal Access from Overrides",
    skill: "NULLIF",
    difficulty: "Advanced",
    story:
      "Most station lockers use ordinary pickup codes. Staff overrides are exceptional and should disappear from a field that is supposed to show only normal access methods.",
    evidenceQuestion:
      "Which Locker 417 event used a normal pickup method instead of the staff override?",
    prompt:
      "Return event_type and NULLIF(access_method, 'Staff Override Card') as normal_access_method from locker_evidence_history for Locker 417, ordered by event_at.",
    starterSql: "",
    solutionSql:
      "SELECT event_type, NULLIF(access_method, 'Staff Override Card') AS normal_access_method FROM locker_evidence_history WHERE locker_number = 417 ORDER BY event_at;",
    hints: [
      "NULLIF returns NULL when both arguments are equal.",
      "The ordinary Pickup Code should remain visible.",
    ],
    successStory:
      "Elias originally collected his parcel with a pickup code. Klara's later locker activity used the privileged staff override.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-055",
    number: 55,
    levelNumber: 11,
    position: 5,
    title: "Count the Direct Evidence",
    skill: "SUM(CASE)",
    difficulty: "Advanced",
    story:
      "The prosecutor asks for a quick numerical summary of what was hidden in Locker 417.",
    evidenceQuestion:
      "How many direct forensic items and digital leads were recovered?",
    prompt:
      "Return SUM(CASE...) as direct_forensic_items for Weapon or Forensic items and another SUM(CASE...) as digital_items for Digital evidence in Locker 417.",
    starterSql: "",
    solutionSql:
      "SELECT SUM(CASE WHEN evidence_type IN ('Weapon', 'Forensic') THEN 1 ELSE 0 END) AS direct_forensic_items, SUM(CASE WHEN evidence_type = 'Digital' THEN 1 ELSE 0 END) AS digital_items FROM evidence_items WHERE locker_number = 417;",
    hints: [
      "SUM(CASE WHEN condition THEN 1 ELSE 0 END) counts conditional rows.",
      "Weapon and Forensic should count together.",
    ],
    successStory:
      "Two pieces of direct forensic evidence are recovered: the KX-17 knife and bloody gloves. Both link back to Elias. The encrypted USB drive may explain why Nora had to die.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 12 — DAMAGED MESSAGES
  // ==========================================================

  {
    id: "mystery-task-056",
    number: 56,
    levelNumber: 12,
    position: 1,
    title: "Normalize the Message Case",
    skill: "LOWER",
    difficulty: "Advanced",
    story:
      "The burner phone contains four damaged message fragments. Their capitalization appears deliberately inconsistent, possibly to defeat simple keyword searches.",
    evidenceQuestion:
      "What do the damaged messages look like when capitalization is ignored?",
    prompt:
      "Return fragment_id and LOWER(raw_text) as normalized_text for fragments 11001 through 11004, ordered by fragment_order.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, LOWER(raw_text) AS normalized_text FROM message_history WHERE fragment_id BETWEEN 11001 AND 11004 ORDER BY fragment_order;",
    hints: [
      "LOWER() converts alphabetic characters to lowercase.",
      "Use BETWEEN to keep the four relevant fragments.",
    ],
    successStory:
      "One word survives the corruption clearly: winter.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-057",
    number: 57,
    levelNumber: 12,
    position: 2,
    title: "Search in Uppercase",
    skill: "UPPER",
    difficulty: "Advanced",
    story:
      "Investigators repeat the normalization in uppercase so names and locations stand out from the damaged symbols.",
    evidenceQuestion:
      "Which words become obvious when the fragments are converted to uppercase?",
    prompt:
      "Return fragment_id and UPPER(raw_text) as normalized_text for fragments 11001 through 11004, ordered by fragment_order.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, UPPER(raw_text) AS normalized_text FROM message_history WHERE fragment_id BETWEEN 11001 AND 11004 ORDER BY fragment_order;",
    hints: [
      "UPPER() converts letters to uppercase.",
    ],
    successStory:
      "BERN and REPORT now stand out immediately.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-058",
    number: 58,
    levelNumber: 12,
    position: 3,
    title: "Measure the Damage",
    skill: "LENGTH",
    difficulty: "Advanced",
    story:
      "Several fragments contain suspicious padding, spaces and replacement symbols. Their raw lengths help investigators see how badly they were corrupted.",
    evidenceQuestion:
      "How long is each damaged message fragment?",
    prompt:
      "Return fragment_id and LENGTH(raw_text) as raw_length for fragments 11001 through 11004, ordered by fragment_order.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, LENGTH(raw_text) AS raw_length FROM message_history WHERE fragment_id BETWEEN 11001 AND 11004 ORDER BY fragment_order;",
    hints: [
      "LENGTH(text) returns the number of characters.",
    ],
    successStory:
      "The fragments contain far more characters than their visible words require. The padding is deliberate.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-059",
    number: 59,
    levelNumber: 12,
    position: 4,
    title: "Remove the Padding",
    skill: "TRIM",
    difficulty: "Advanced",
    story:
      "The leading and trailing spaces are noise. Removing them reveals where the actual coded fragments begin and end.",
    evidenceQuestion:
      "What remains when the outer whitespace is removed?",
    prompt:
      "Return fragment_id and TRIM(raw_text) as trimmed_text for fragments 11001 through 11004, ordered by fragment_order.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, TRIM(raw_text) AS trimmed_text FROM message_history WHERE fragment_id BETWEEN 11001 AND 11004 ORDER BY fragment_order;",
    hints: [
      "TRIM() removes whitespace from the beginning and end.",
    ],
    successStory:
      "The fragments become cleaner. Their internal ### and %%% symbols are still hiding the original sentence.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-060",
    number: 60,
    levelNumber: 12,
    position: 5,
    title: "Extract the First Characters",
    skill: "SUBSTR",
    difficulty: "Advanced",
    story:
      "The forensic analyst asks you to inspect only the beginning of each cleaned fragment. The first few characters are enough to reveal the key terms.",
    evidenceQuestion:
      "Which keywords begin the four fragments?",
    prompt:
      "Return fragment_id and SUBSTR(TRIM(raw_text), 1, 12) as fragment_start for fragments 11001 through 11004, ordered by fragment_order.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, SUBSTR(TRIM(raw_text), 1, 12) AS fragment_start FROM message_history WHERE fragment_id BETWEEN 11001 AND 11004 ORDER BY fragment_order;",
    hints: [
      "SUBSTR(text, start, length) extracts part of a string.",
      "SQLite string positions start at 1.",
    ],
    successStory:
      "The recurring clues are now unmistakable: WINTER, 50_000, REPORT and destination. The message was about money, Bern and Nora's report.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 13 — THE CODE "WINTER"
  // ==========================================================

  {
    id: "mystery-task-061",
    number: 61,
    levelNumber: 13,
    position: 1,
    title: "Remove the Corruption Symbols",
    skill: "REPLACE",
    difficulty: "Advanced",
    story:
      "The symbols ### and %%% are not random corruption. They were inserted deliberately between words. Removing them begins to restore the original message.",
    evidenceQuestion:
      "What do the four fragments say after the replacement symbols are removed?",
    prompt:
      "Return fragment_id and replace both ### and %%% with spaces. Name the result cleaned_text. Order by fragment_order.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, REPLACE(REPLACE(raw_text, '###', ' '), '%%%', ' ') AS cleaned_text FROM message_history WHERE fragment_id BETWEEN 11001 AND 11004 ORDER BY fragment_order;",
    hints: [
      "REPLACE(text, old, new) replaces text.",
      "Nest one REPLACE inside another to remove both symbol sequences.",
    ],
    successStory:
      "The words separate cleanly. This was not damaged data — someone intentionally obscured the message.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-062",
    number: 62,
    levelNumber: 13,
    position: 2,
    title: "Join the First Two Fragments",
    skill: "|| concatenation",
    difficulty: "Advanced",
    story:
      "The messages were stored separately, but their fragment_order shows that they form one instruction.",
    evidenceQuestion:
      "What happens when the first two cleaned fragments are placed together?",
    prompt:
      "Concatenate the trimmed text from fragment 11001, the separator ' / ', and the trimmed text from fragment 11002. Name the result combined_clue.",
    starterSql: "",
    solutionSql:
      "SELECT TRIM((SELECT raw_text FROM message_history WHERE fragment_id = 11001)) || ' / ' || TRIM((SELECT raw_text FROM message_history WHERE fragment_id = 11002)) AS combined_clue;",
    hints: [
      "SQLite concatenates text with ||.",
      "Use scalar subqueries to fetch each fragment.",
    ],
    successStory:
      "WINTER confirmed. 50_000 after BERN. The word Winter is not about the weather — it is a project code.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-063",
    number: 63,
    levelNumber: 13,
    position: 3,
    title: "Locate Bern",
    skill: "INSTR",
    difficulty: "Advanced",
    story:
      "Investigators need to prove that Bern was explicitly named in the hidden instructions rather than inferred from the train journey.",
    evidenceQuestion:
      "Which message fragment contains the word BERN?",
    prompt:
      "Return fragment_id and INSTR(UPPER(raw_text), 'BERN') as bern_position for fragments where BERN occurs.",
    starterSql: "",
    solutionSql:
      "SELECT fragment_id, INSTR(UPPER(raw_text), 'BERN') AS bern_position FROM message_history WHERE INSTR(UPPER(raw_text), 'BERN') > 0;",
    hints: [
      "INSTR(text, search) returns the position of a match.",
      "A position greater than zero means the word was found.",
    ],
    successStory:
      "Fragment 11002 explicitly names BERN. The instructions were tied to Nora's destination.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-064",
    number: 64,
    levelNumber: 13,
    position: 4,
    title: "Decode the Payment",
    skill: "PRINTF",
    difficulty: "Advanced",
    story:
      "The fragment says 50_000. Financial investigators believe the underscore replaced normal number formatting.",
    evidenceQuestion:
      "How should the payment amount appear in the evidence report?",
    prompt:
      "Use PRINTF to format the integer 50000 with a thousands separator. Name the result payment_amount.",
    starterSql: "",
    solutionSql:
      "SELECT PRINTF('%,d', 50000) AS payment_amount;",
    hints: [
      "SQLite PRINTF supports the comma flag for integer grouping.",
      "Use the format string '%,d'.",
    ],
    successStory:
      "The coded payment was 50,000. Someone promised a substantial amount after the train reached Bern.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-065",
    number: 65,
    levelNumber: 13,
    position: 5,
    title: "Restore the Order",
    skill: "Nested text functions",
    difficulty: "Advanced",
    story:
      "One fragment contains the central instruction. By combining text functions, you can reconstruct it in a readable form.",
    evidenceQuestion:
      "What was Elias being told to stop?",
    prompt:
      "For fragment 11003, replace ### and %%% with spaces, trim the result and convert it to uppercase. Name the final column reconstructed_fragment.",
    starterSql: "",
    solutionSql:
      "SELECT UPPER(TRIM(REPLACE(REPLACE(raw_text, '%%%', ' '), '###', ' '))) AS reconstructed_fragment FROM message_history WHERE fragment_id = 11003;",
    hints: [
      "Start with the inner REPLACE calls.",
      "TRIM the cleaned result.",
      "Wrap everything in UPPER().",
    ],
    successStory:
      "REPORT MUST NOT REACH. Combined with the other fragments, the instruction reads: Winter confirmed. 50,000 after Bern. Report must not reach destination.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 14 — MANIPULATED TIMESTAMPS
  // ==========================================================

  {
    id: "mystery-task-066",
    number: 66,
    levelNumber: 14,
    position: 1,
    title: "Extract the Camera Date",
    skill: "DATE()",
    difficulty: "Advanced",
    story:
      "A Bern station camera appears to place Klara in the locker hall at a time that conflicts with other evidence. Before accusing anyone of manipulating evidence, investigators compare the camera's stored date fields.",
    evidenceQuestion:
      "On which calendar date did Klara appear in the station-camera evidence?",
    prompt:
      "Return camera_name and DATE(actual_at) as event_date for Klara Meier, ordered by actual_at.",
    starterSql: "",
    solutionSql:
      "SELECT camera_name, DATE(actual_at) AS event_date FROM camera_history WHERE full_name = 'Klara Meier' ORDER BY actual_at;",
    hints: [
      "DATE(timestamp) returns only YYYY-MM-DD.",
    ],
    successStory:
      "Both events belong to February 14. The contradiction is not caused by a date rollover.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-067",
    number: 67,
    levelNumber: 14,
    position: 2,
    title: "Extract the Camera Time",
    skill: "TIME()",
    difficulty: "Advanced",
    story:
      "The date is correct. The next comparison focuses only on the time of day recorded by the camera.",
    evidenceQuestion:
      "At what actual times was Klara in the locker hall?",
    prompt:
      "Return camera_name and TIME(actual_at) as actual_time for Klara Meier, ordered by actual_at.",
    starterSql: "",
    solutionSql:
      "SELECT camera_name, TIME(actual_at) AS actual_time FROM camera_history WHERE full_name = 'Klara Meier' ORDER BY actual_at;",
    hints: [
      "TIME(timestamp) extracts HH:MM:SS.",
    ],
    successStory:
      "The actual events occurred at 23:42 and 23:44.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-068",
    number: 68,
    levelNumber: 14,
    position: 3,
    title: "Normalize the Recorded Timestamp",
    skill: "DATETIME()",
    difficulty: "Advanced",
    story:
      "The station exports timestamps as text. Investigators normalize them through SQLite before comparing systems.",
    evidenceQuestion:
      "What timestamps did the camera itself record?",
    prompt:
      "Return camera_name and DATETIME(recorded_at) as recorded_timestamp for Bern Locker Camera 2, ordered by recorded_at.",
    starterSql: "",
    solutionSql:
      "SELECT camera_name, DATETIME(recorded_at) AS recorded_timestamp FROM camera_history WHERE camera_name = 'Bern Locker Camera 2' ORDER BY recorded_at;",
    hints: [
      "DATETIME() returns a normalized date and time.",
    ],
    successStory:
      "The camera claims 23:49 and 23:51 — seven minutes later than the verified events.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-069",
    number: 69,
    levelNumber: 14,
    position: 4,
    title: "Compare the Minutes",
    skill: "STRFTIME()",
    difficulty: "Advanced",
    story:
      "To make the discrepancy obvious in the case report, display only hours and minutes from both timestamp sources.",
    evidenceQuestion:
      "How far apart are the camera time and verified time?",
    prompt:
      "Return camera_name, STRFTIME('%H:%M', recorded_at) as recorded_minute and STRFTIME('%H:%M', actual_at) as actual_minute for Bern Locker Camera 2, ordered by recorded_at.",
    starterSql: "",
    solutionSql:
      "SELECT camera_name, STRFTIME('%H:%M', recorded_at) AS recorded_minute, STRFTIME('%H:%M', actual_at) AS actual_minute FROM camera_history WHERE camera_name = 'Bern Locker Camera 2' ORDER BY recorded_at;",
    hints: [
      "%H is the hour.",
      "%M is the minute.",
    ],
    successStory:
      "23:49 versus 23:42. 23:51 versus 23:44. The error is identical both times.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-070",
    number: 70,
    levelNumber: 14,
    position: 5,
    title: "Correct the Seven-Minute Error",
    skill: "Date modifiers",
    difficulty: "Advanced",
    story:
      "The station technician confirms the camera clock was running seven minutes fast. Correcting the timestamp should make the two systems agree exactly.",
    evidenceQuestion:
      "Does subtracting seven minutes reproduce the verified event time?",
    prompt:
      "Return camera_name, recorded_at, DATETIME(recorded_at, '-7 minutes') as corrected_at and actual_at for Bern Locker Camera 2, ordered by recorded_at.",
    starterSql: "",
    solutionSql:
      "SELECT camera_name, recorded_at, DATETIME(recorded_at, '-7 minutes') AS corrected_at, actual_at FROM camera_history WHERE camera_name = 'Bern Locker Camera 2' ORDER BY recorded_at;",
    hints: [
      "SQLite DATETIME accepts modifiers such as '-7 minutes'.",
    ],
    successStory:
      "The corrected camera timestamps match the verified times exactly. Klara was at Locker 417 after the train reached Bern. The apparent contradiction was caused by a clock seven minutes fast.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  // ==========================================================
  // LEVEL 15 — WHO OPENED THE LUGGAGE COMPARTMENT?
  // ==========================================================

  {
    id: "mystery-task-071",
    number: 71,
    levelNumber: 15,
    position: 1,
    title: "One Minute Before Darkness",
    skill: "JULIANDAY()",
    difficulty: "Advanced",
    story:
      "Train access logs reveal something worse. Klara's employee card opened the luggage compartment at 22:16. One minute later the compartment camera went offline.",
    evidenceQuestion:
      "How many minutes passed between the door opening and the camera being disabled?",
    prompt:
      "Use JULIANDAY() to calculate the number of minutes between Klara's Luggage Compartment DOOR_OPEN event and her Luggage Camera CAMERA_DISABLED event. Round it to one decimal place and name it minutes_between_open_and_disable.",
    starterSql: "",
    solutionSql:
      "SELECT ROUND((JULIANDAY((SELECT event_at FROM train_access_history WHERE full_name = 'Klara Meier' AND resource = 'Luggage Camera' AND action = 'CAMERA_DISABLED')) - JULIANDAY((SELECT event_at FROM train_access_history WHERE full_name = 'Klara Meier' AND resource = 'Luggage Compartment' AND action = 'DOOR_OPEN'))) * 24 * 60, 1) AS minutes_between_open_and_disable;",
    hints: [
      "JULIANDAY() returns time as a number of days.",
      "Multiply the difference by 24 * 60 to obtain minutes.",
    ],
    successStory:
      "Exactly one minute passed. The camera failure happened immediately after Klara opened the compartment.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-072",
    number: 72,
    levelNumber: 15,
    position: 2,
    title: "How Long Was the Compartment Open?",
    skill: "Timestamp differences",
    difficulty: "Advanced",
    story:
      "Klara's card opened the compartment at 22:16 and closed it at 22:32. The murder window sits almost perfectly inside that interval.",
    evidenceQuestion:
      "For how many minutes was the compartment accessible under Klara's card?",
    prompt:
      "Use STRFTIME('%s', ...) to calculate the difference in minutes between Klara's DOOR_OPEN and DOOR_CLOSE events. Name it compartment_open_minutes.",
    starterSql: "",
    solutionSql:
      "SELECT CAST((STRFTIME('%s', (SELECT event_at FROM train_access_history WHERE full_name = 'Klara Meier' AND resource = 'Luggage Compartment' AND action = 'DOOR_CLOSE')) - STRFTIME('%s', (SELECT event_at FROM train_access_history WHERE full_name = 'Klara Meier' AND resource = 'Luggage Compartment' AND action = 'DOOR_OPEN'))) / 60 AS INTEGER) AS compartment_open_minutes;",
    hints: [
      "STRFTIME('%s', timestamp) returns Unix seconds.",
      "Subtract the values and divide by 60.",
    ],
    successStory:
      "The compartment remained open for 16 minutes — from 22:16 until 22:32.",
    resultOrderMatters: false,
    executionMode: "query",
  },

  {
    id: "mystery-task-073",
    number: 73,
    levelNumber: 15,
    position: 3,
    title: "Was Klara on Duty?",
    skill: "Overlap detection",
    difficulty: "Advanced",
    story:
      "Klara previously claimed her staff card had been lost. If the suspicious access events occurred while she was actively working aboard the train, that explanation becomes much harder to believe.",
    evidenceQuestion:
      "Which luggage-compartment access events occurred inside Klara's registered work shift?",
    prompt:
      "Join train_access_history ah with shift_history sh by full_name. Return ah.full_name, ah.resource, ah.action, ah.event_at, sh.shift_start and sh.shift_end where Klara's event_at falls BETWEEN her shift_start and shift_end and the resource is the Luggage Compartment or Luggage Camera. Order by event_at.",
    starterSql: "",
    solutionSql:
      "SELECT ah.full_name, ah.resource, ah.action, ah.event_at, sh.shift_start, sh.shift_end FROM train_access_history AS ah INNER JOIN shift_history AS sh ON sh.full_name = ah.full_name WHERE ah.full_name = 'Klara Meier' AND ah.event_at BETWEEN sh.shift_start AND sh.shift_end AND ah.resource IN ('Luggage Compartment', 'Luggage Camera') ORDER BY ah.event_at;",
    hints: [
      "The event is inside the shift when event_at is BETWEEN shift_start and shift_end.",
      "Join the two views using full_name.",
    ],
    successStory:
      "Every suspicious access event occurred during Klara's official conductor shift aboard train 714.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-074",
    number: 74,
    levelNumber: 15,
    position: 4,
    title: "Convert the Access Log to UTC",
    skill: "Timezone offsets",
    difficulty: "Advanced",
    story:
      "The train system stored times in Central European Time while an external forensic system uses UTC. Investigators normalize Klara's access events before comparing them internationally.",
    evidenceQuestion:
      "What are Klara's suspicious access times in UTC?",
    prompt:
      "Return resource, action, event_at and DATETIME(event_at, '-1 hour') as event_at_utc for Klara's Luggage Compartment and Luggage Camera events, ordered by event_at.",
    starterSql: "",
    solutionSql:
      "SELECT resource, action, event_at, DATETIME(event_at, '-1 hour') AS event_at_utc FROM train_access_history WHERE full_name = 'Klara Meier' AND resource IN ('Luggage Compartment', 'Luggage Camera') ORDER BY event_at;",
    hints: [
      "The case date uses CET, UTC+1.",
      "Convert CET to UTC by subtracting one hour.",
    ],
    successStory:
      "The normalized timestamps still align perfectly with the murder timeline. The result is not a timezone artefact.",
    resultOrderMatters: true,
    executionMode: "query",
  },

  {
    id: "mystery-task-075",
    number: 75,
    levelNumber: 15,
    position: 5,
    title: "The Access Cluster",
    skill: "Grouping by date/hour",
    difficulty: "Advanced",
    story:
      "The final access analysis groups Klara's suspicious actions by hour. If the door opening, camera shutdown and door closing all cluster together, the sequence is almost impossible to dismiss as accidental.",
    evidenceQuestion:
      "How many suspicious luggage-area access events did Klara generate during each hour?",
    prompt:
      "Return STRFTIME('%Y-%m-%d %H:00', event_at) as event_hour and COUNT(*) as access_events for Klara's Luggage Compartment and Luggage Camera events. Group and order by event_hour.",
    starterSql: "",
    solutionSql:
      "SELECT STRFTIME('%Y-%m-%d %H:00', event_at) AS event_hour, COUNT(*) AS access_events FROM train_access_history WHERE full_name = 'Klara Meier' AND resource IN ('Luggage Compartment', 'Luggage Camera') GROUP BY event_hour ORDER BY event_hour;",
    hints: [
      "STRFTIME can reduce timestamps to an hourly bucket.",
      "GROUP BY the same expression or its alias.",
    ],
    successStory:
      "Three linked access events cluster in the 22:00 hour: Klara opened the compartment, disabled the camera and closed the compartment after Nora was killed. Klara Meier is confirmed as Elias Vogel's accomplice.",
    resultOrderMatters: true,
    executionMode: "query",
  },
];
