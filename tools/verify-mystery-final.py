from pathlib import Path
import sqlite3

ROOT = Path(__file__).resolve().parents[1]

SEED = (
    ROOT
    / "public"
    / "databases"
    / "mystery.sql"
).read_text(
    encoding="utf-8"
)


def fresh_db():
    db = sqlite3.connect(":memory:")
    db.executescript(SEED)
    return db


db = fresh_db()

# ------------------------------------------------------------
# Level 16
# ------------------------------------------------------------

shared = [
    row[0]
    for row in db.execute("""
        SELECT company_name
        FROM financial_lead_sources
        WHERE source = 'Bank Monitor'

        INTERSECT

        SELECT company_name
        FROM financial_lead_sources
        WHERE source = 'Corporate Registry'

        ORDER BY company_name;
    """)
]

assert shared == [
    "Alpine Research GmbH",
    "Northstar Consulting",
    "Voss Beteiligungen AG",
]

northstar_employees = db.execute("""
    SELECT employee_count
    FROM companies
    WHERE company_name =
          'Northstar Consulting';
""").fetchone()[0]

assert northstar_employees == 0

# ------------------------------------------------------------
# Level 17
# ------------------------------------------------------------

outgoing = db.execute("""
    SELECT
      recipient_name,
      amount
    FROM northstar_outgoing_payments
    ORDER BY transaction_at;
""").fetchall()

assert outgoing == [
    ("Elias Vogel", 10000.0),
    ("Elias Vogel", 40000.0),
    ("Klara Meier", 15000.0),
]

parent = db.execute("""
    SELECT parent.company_name
    FROM companies AS shell
    JOIN companies AS parent
      ON parent.company_id =
         shell.parent_company_id
    WHERE shell.company_name =
          'Northstar Consulting';
""").fetchone()[0]

assert parent == "Voss Group"

# ------------------------------------------------------------
# Level 18
# ------------------------------------------------------------

first_source = db.execute("""
    SELECT source_company
    FROM northstar_incoming_funds
    ORDER BY transaction_at
    LIMIT 1;
""").fetchone()[0]

assert first_source == "Voss Group"

owner = db.execute("""
    SELECT p.full_name
    FROM companies AS c
    JOIN people AS p
      ON p.person_id =
         c.beneficial_owner_person_id
    WHERE c.company_name =
          'Voss Group';
""").fetchone()[0]

assert owner == "Adrian Voss"

# ------------------------------------------------------------
# Level 19 motive
# ------------------------------------------------------------

files = db.execute("""
    SELECT
      file_name,
      publication_planned_at
    FROM investigation_files
    ORDER BY file_id;
""").fetchall()

assert len(files) == 3

assert all(
    publication ==
    "2026-02-15 08:00"
    for _, publication in files
)

db.close()

# ------------------------------------------------------------
# Level 19 sandbox schema checks
# ------------------------------------------------------------

db = fresh_db()

db.executescript("""
CREATE TABLE case_evidence (
  evidence_id INTEGER PRIMARY KEY,
  evidence_type TEXT NOT NULL,
  person_id INTEGER,
  occurred_at TEXT NOT NULL,
  description TEXT NOT NULL UNIQUE,
  confidence_level INTEGER NOT NULL
    DEFAULT 3
    CHECK (
      confidence_level BETWEEN 1 AND 5
    ),
  source TEXT NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);
""")

columns = db.execute("""
    SELECT name, type
    FROM pragma_table_info(
      'case_evidence'
    )
    ORDER BY cid;
""").fetchall()

assert len(columns) == 7

foreign_keys = db.execute("""
    SELECT COUNT(*)
    FROM pragma_foreign_key_list(
      'case_evidence'
    );
""").fetchone()[0]

assert foreign_keys == 1

db.close()

# ------------------------------------------------------------
# Level 20 transaction check
# ------------------------------------------------------------

db = fresh_db()

db.executescript("""
CREATE TABLE case_status (
  id INTEGER PRIMARY KEY,
  status TEXT NOT NULL
);

INSERT INTO case_status
VALUES (1, 'Draft');

BEGIN;
UPDATE case_status
SET status = 'Temporary'
WHERE id = 1;
ROLLBACK;

BEGIN;
UPDATE case_status
SET status = 'Verified'
WHERE id = 1;
COMMIT;
""")

status = db.execute("""
    SELECT status
    FROM case_status
    WHERE id = 1;
""").fetchone()[0]

assert status == "Verified"

db.close()

# ------------------------------------------------------------
# Final view
# ------------------------------------------------------------

db = fresh_db()

db.executescript("""
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

CREATE VIEW final_case_file AS
SELECT
  (
    SELECT person_name
    FROM case_roles
    WHERE role = 'murderer'
  ) AS murderer,
  (
    SELECT person_name
    FROM case_roles
    WHERE role = 'accomplice'
  ) AS accomplice,
  (
    SELECT person_name
    FROM case_roles
    WHERE role = 'mastermind'
  ) AS mastermind,
  (
    SELECT person_name
    FROM case_roles
    WHERE role = 'victim'
  ) AS victim,
  (
    SELECT motive
    FROM case_motive
    LIMIT 1
  ) AS motive;
""")

final_row = db.execute("""
    SELECT
      murderer,
      accomplice,
      mastermind,
      victim,
      motive
    FROM final_case_file;
""").fetchone()

assert final_row == (
    "Elias Vogel",
    "Klara Meier",
    "Adrian Voss",
    "Nora Keller",
    "Preventing the publication of manipulated medical research results",
)

db.close()

print()
print("✅ SQLTrain Murder Mystery final verification passed.")
print()
print("20 visible Mystery Levels")
print("100 SQL investigation tasks")
print()
print("Final case:")
print("  Murderer:   Elias Vogel")
print("  Accomplice: Klara Meier")
print("  Mastermind: Adrian Voss")
print("  Victim:     Nora Keller")
print()
print("CASE CLOSED")
