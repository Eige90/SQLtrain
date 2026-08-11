PRAGMA foreign_keys = ON;

-- ============================================================
-- SQLTRAIN MURDER MYSTERY
-- THE NIGHT TRAIN TO BERN
--
-- Victim:      Nora Keller
-- Murderer:    Elias Vogel
-- Accomplice:  Klara Meier
-- Mastermind:  Adrian Voss
--
-- Murder window:
-- 2026-02-14 22:18 - 22:31
-- ============================================================


-- ============================================================
-- PEOPLE
-- ============================================================

CREATE TABLE people (
  person_id INTEGER PRIMARY KEY,
  full_name TEXT NOT NULL UNIQUE,
  city TEXT,
  phone_number TEXT UNIQUE,
  occupation TEXT,
  notes TEXT
);

INSERT INTO people (
  person_id,
  full_name,
  city,
  phone_number,
  occupation,
  notes
) VALUES
  (1, 'Nora Keller', 'Munich', '+49-151-7140000', 'Investigative journalist', 'Victim'),
  (2, 'Elias Vogel', 'Munich', '+49-151-7140001', 'Security consultant', NULL),
  (3, 'Mira Roth', 'Augsburg', '+49-151-7140002', 'Doctor', NULL),
  (4, 'Leon Berger', 'Munich', '+49-151-7140003', 'Photographer', NULL),
  (5, 'Sofia Hartmann', 'Hamburg', '+49-151-7140004', 'Architect', NULL),
  (6, 'Jonas Frei', 'Zurich', '+41-79-7140005', 'Chef', NULL),
  (7, 'Klara Meier', 'Bern', '+49-151-7140417', 'Train conductor', 'Employee on Alpenstern 714'),
  (8, 'Adrian Voss', 'Zurich', '+41-79-7140900', 'CEO', 'CEO of Voss Group'),
  (9, 'Paula Stein', 'Munich', '+49-151-7140010', 'Hotel receptionist', NULL),
  (10, 'David Kern', 'Munich', '+49-151-7140011', 'Accountant', NULL),
  (11, 'Anna Weiss', 'Bern', '+41-79-7140012', 'Passenger', NULL),
  (12, 'Marc Hofer', 'Bern', '+41-79-7140013', 'Passenger', NULL),
  (13, 'Felix Brandt', 'Munich', '+49-151-7140014', 'Lawyer', 'Met Nora two weeks before the murder'),
  (14, 'Lena Hoffmann', 'Munich', '+49-151-7140015', 'Sales manager', 'Appears in Nora contact records'),
  (15, 'Marco Stein', 'Augsburg', '+49-151-7140016', 'Engineer', 'Seen at Munich Central Station'),
  (16, 'Eva Köhler', 'Munich', '+49-151-7140017', 'Research assistant', 'Worked with medical trial data'),
  (17, 'Thomas Reiter', 'Bern', '+41-79-7140018', 'Rail technician', 'Had access to railway service areas'),
  (18, 'Nina Graf', 'Zurich', '+41-79-7140019', 'Translator', 'Exchanged messages with Nora');


-- ============================================================
-- PRODUCTS / ONLINE ORDERS
-- ============================================================

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT
);

INSERT INTO products VALUES
  (1, 'Tactical Knife', 'Knife', 'KX-17'),
  (2, 'Kitchen Knife', 'Knife', 'CHEF-8'),
  (3, 'Flashlight', 'Equipment', 'FL-20'),
  (4, 'Travel Backpack', 'Travel', 'TR-45'),
  (5, 'Notebook', 'Office', 'NB-1');


CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

CREATE TABLE order_items (
  order_item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id)
    REFERENCES orders(order_id),
  FOREIGN KEY (product_id)
    REFERENCES products(product_id)
);

CREATE TABLE deliveries (
  delivery_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  shipped_at TEXT,
  delivered_at TEXT,
  delivery_status TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
);


INSERT INTO orders VALUES
  (1001, 2, '2026-01-25', 'Munich Central Station Locker 417'),
  (1002, 3, '2026-01-26', 'Augsburg, Bahnhofstrasse 18'),
  (1003, 4, '2026-01-30', 'Munich, Rosenweg 4'),
  (1004, 5, '2026-02-02', 'Hamburg, Elbstrasse 71'),
  (1005, 6, '2026-02-04', 'Zurich, Marktgasse 12'),

  -- decoys
  (1006, 10, '2025-11-15', 'Munich, Lindenweg 4'),
  (1007, 11, '2026-02-05', 'Bern, Aareweg 8'),
  (1008, 12, '2026-02-06', 'Bern, Bundesgasse 19');


INSERT INTO order_items VALUES
  (1, 1001, 1, 1, 129.90),
  (2, 1002, 1, 1, 129.90),
  (3, 1003, 1, 1, 129.90),
  (4, 1004, 1, 1, 129.90),
  (5, 1005, 1, 1, 129.90),

  (6, 1006, 2, 1, 64.90),
  (7, 1007, 2, 1, 64.90),
  (8, 1008, 3, 2, 29.50);


INSERT INTO deliveries VALUES
  (2001, 1001, '2026-01-26 08:12', '2026-01-28 14:18', 'Delivered', 'Munich Central Station Locker 417'),
  (2002, 1002, '2026-01-27 09:03', '2026-01-29 16:42', 'Delivered', 'Augsburg, Bahnhofstrasse 18'),
  (2003, 1003, '2026-01-31 07:57', '2026-02-02 11:21', 'Delivered', 'Munich, Rosenweg 4'),
  (2004, 1004, '2026-02-03 10:14', '2026-02-05 13:55', 'Delivered', 'Hamburg, Elbstrasse 71'),
  (2005, 1005, '2026-02-05 08:34', '2026-02-07 12:16', 'Delivered', 'Zurich, Marktgasse 12'),
  (2006, 1006, '2025-11-16 10:00', '2025-11-18 13:00', 'Delivered', 'Munich, Lindenweg 4'),
  (2007, 1007, '2026-02-06 09:00', '2026-02-08 17:00', 'Delivered', 'Bern, Aareweg 8'),
  (2008, 1008, '2026-02-07 09:00', '2026-02-09 16:00', 'Delivered', 'Bern, Bundesgasse 19');


-- ============================================================
-- STORE PURCHASES
-- Exactly four of the five knife suspects bought suspicious
-- preparation material.
-- ============================================================

CREATE TABLE store_purchases (
  purchase_id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  purchased_at TEXT NOT NULL,
  store_name TEXT NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO store_purchases VALUES
  (3001, 2, 'Heavy Plastic Sheeting', 'Plastic', '2026-02-09 17:10', 'BauMarkt Munich', 48.90),
  (3002, 2, 'Industrial Tape', 'Tape', '2026-02-09 17:12', 'BauMarkt Munich', 12.50),
  (3003, 2, 'Black Nitrile Gloves', 'Gloves', '2026-02-09 17:13', 'BauMarkt Munich', 19.90),

  (3004, 3, 'Protective Plastic Sheet', 'Plastic', '2026-02-10 10:04', 'Medical Supply Augsburg', 29.90),
  (3005, 3, 'Nitrile Medical Gloves', 'Gloves', '2026-02-10 10:05', 'Medical Supply Augsburg', 15.90),

  (3006, 4, 'Painter Plastic Sheeting', 'Plastic', '2026-02-11 14:21', 'HomeWorks Munich', 24.90),
  (3007, 4, 'Packing Tape', 'Tape', '2026-02-11 14:22', 'HomeWorks Munich', 8.90),

  (3008, 5, 'Furniture Plastic Film', 'Plastic', '2026-02-12 09:31', 'NordBau Hamburg', 38.90),
  (3009, 5, 'Work Gloves', 'Gloves', '2026-02-12 09:32', 'NordBau Hamburg', 9.90),

  -- Jonas bought nothing suspicious.
  (3010, 6, 'Olive Oil', 'Food', '2026-02-11 11:15', 'Zurich Market', 18.50),

  -- decoys
  (3011, 10, 'Plastic Folder', 'Office', '2026-02-10 15:30', 'Office Point', 4.90),
  (3012, 11, 'Winter Gloves', 'Clothing', '2026-02-12 12:10', 'Bern Outdoor', 39.90);


-- ============================================================
-- TRAIN
-- Exactly Elias, Mira and Leon from the five suspects travelled
-- to Bern on Alpenstern 714.
-- ============================================================

CREATE TABLE train_trips (
  trip_id INTEGER PRIMARY KEY,
  train_number TEXT NOT NULL,
  train_name TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  arrival_city TEXT NOT NULL,
  departure_at TEXT NOT NULL,
  arrival_at TEXT NOT NULL
);

INSERT INTO train_trips VALUES
  (
    714,
    '714',
    'Alpenstern 714',
    'Munich',
    'Bern',
    '2026-02-14 20:45',
    '2026-02-14 23:35'
  ),
  (
    715,
    '715',
    'Alpenstern 715',
    'Munich',
    'Vienna',
    '2026-02-14 20:50',
    '2026-02-15 01:20'
  );


CREATE TABLE tickets (
  ticket_id INTEGER PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  person_id INTEGER NOT NULL,
  coach INTEGER,
  seat_number TEXT,
  destination TEXT NOT NULL,
  ticket_status TEXT NOT NULL DEFAULT 'Valid',
  FOREIGN KEY (trip_id)
    REFERENCES train_trips(trip_id),
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO tickets VALUES
  (4001, 714, 1, 6, '18A', 'Bern', 'Valid'),
  (4002, 714, 2, 5, '12C', 'Bern', 'Valid'),
  (4003, 714, 3, 5, '14A', 'Bern', 'Valid'),
  (4004, 714, 4, 7, '03B', 'Bern', 'Valid'),
  (4005, 714, 7, NULL, NULL, 'Bern', 'Staff'),
  (4006, 714, 11, 5, '11A', 'Bern', 'Valid'),
  (4007, 714, 12, 7, '02A', 'Bern', 'Valid'),

  -- Sofia is in Hamburg.
  (4008, 715, 5, 3, '08A', 'Vienna', 'Valid'),

  -- Jonas never boarded train 714.
  (4009, 715, 6, 4, '10B', 'Vienna', 'Cancelled');


-- ============================================================
-- WITNESS STATEMENTS
-- Two people match the bloodstained description.
-- ============================================================

CREATE TABLE witness_statements (
  statement_id INTEGER PRIMARY KEY,
  witness_person_id INTEGER,
  observed_person_id INTEGER,
  observed_at TEXT NOT NULL,
  location TEXT NOT NULL,
  clothing_description TEXT,
  blood_visible INTEGER,
  coach INTEGER,
  seat_number TEXT,
  statement_text TEXT NOT NULL,
  FOREIGN KEY (witness_person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (observed_person_id)
    REFERENCES people(person_id)
);

INSERT INTO witness_statements VALUES
  (
    5001, 11, 2,
    '2026-02-14 22:29',
    'Corridor near luggage compartment',
    'Dark jacket, red stains on right sleeve',
    1,
    NULL,
    NULL,
    'A man hurried away from the luggage compartment. His sleeve appeared bloodstained.'
  ),
  (
    5002, 12, 3,
    '2026-02-14 22:27',
    'Corridor near luggage compartment',
    'Light medical jacket, blood on cuff',
    1,
    5,
    NULL,
    'A woman was kneeling near the corridor and had blood on one cuff.'
  ),
  (
    5003, 11, 4,
    '2026-02-14 22:25',
    'Dining car',
    'Grey shirt, clean clothing',
    0,
    7,
    '03B',
    'Leon Berger remained in the dining car during the relevant period.'
  ),
  (
    5004, 12, 7,
    '2026-02-14 22:33',
    'Staff corridor',
    'Blue conductor uniform',
    0,
    NULL,
    NULL,
    'The conductor walked toward the rear service area.'
  );


-- ============================================================
-- SEAT EVENTS
-- Elias was away much longer than Mira.
-- ============================================================

CREATE TABLE seat_events (
  seat_event_id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  trip_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_at TEXT NOT NULL,
  absence_minutes REAL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (trip_id)
    REFERENCES train_trips(trip_id)
);

INSERT INTO seat_events VALUES
  (6001, 2, 714, 'SEAT_LEFT',     '2026-02-14 22:09', NULL),
  (6002, 2, 714, 'SEAT_RETURNED', '2026-02-14 22:34', 25),

  (6003, 3, 714, 'SEAT_LEFT',     '2026-02-14 22:19', NULL),
  (6004, 3, 714, 'SEAT_RETURNED', '2026-02-14 22:27', 8),

  (6005, 4, 714, 'SEAT_OCCUPIED', '2026-02-14 22:10', 0),
  (6006, 4, 714, 'SEAT_OCCUPIED', '2026-02-14 22:20', 0),
  (6007, 4, 714, 'SEAT_OCCUPIED', '2026-02-14 22:30', 0);


-- ============================================================
-- BAGGAGE
-- Elias gained substantial baggage weight.
-- ============================================================

CREATE TABLE baggage_scans (
  baggage_scan_id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  trip_id INTEGER NOT NULL,
  scan_location TEXT NOT NULL,
  scanned_at TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  contents_note TEXT,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (trip_id)
    REFERENCES train_trips(trip_id)
);

INSERT INTO baggage_scans VALUES
  (7001, 2, 714, 'Munich departure', '2026-02-14 20:12', 12.4, NULL),
  (7002, 2, 714, 'Bern arrival',     '2026-02-14 23:39', 18.8, 'Laptop-shaped object and paper files detected'),

  (7003, 3, 714, 'Munich departure', '2026-02-14 20:14', 9.8, NULL),
  (7004, 3, 714, 'Bern arrival',     '2026-02-14 23:40', 10.5, 'Medical supplies'),

  (7005, 4, 714, 'Munich departure', '2026-02-14 20:16', 11.2, NULL),
  (7006, 4, 714, 'Bern arrival',     '2026-02-14 23:41', 11.1, NULL),

  (7007, 1, 714, 'Munich departure', '2026-02-14 20:09', 6.3, 'Laptop and document folder'),
  (7008, 1, 714, 'Bern arrival',     '2026-02-14 23:43', 2.1, 'Personal clothing only');


-- ============================================================
-- HOTEL ALIBI
-- Elias has a reservation and a manual check-in but no actual
-- keycard usage.
-- ============================================================

CREATE TABLE hotels (
  hotel_id INTEGER PRIMARY KEY,
  hotel_name TEXT NOT NULL,
  city TEXT NOT NULL
);

INSERT INTO hotels VALUES
  (1, 'Hotel Isartor', 'Munich');


CREATE TABLE hotel_bookings (
  booking_id INTEGER PRIMARY KEY,
  hotel_id INTEGER NOT NULL,
  person_id INTEGER NOT NULL,
  room_number TEXT NOT NULL,
  check_in_date TEXT NOT NULL,
  check_out_date TEXT NOT NULL,
  booking_status TEXT NOT NULL,
  FOREIGN KEY (hotel_id)
    REFERENCES hotels(hotel_id),
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO hotel_bookings VALUES
  (8001, 1, 2, '417', '2026-02-14', '2026-02-15', 'Checked In'),
  (8002, 1, 10, '212', '2026-02-14', '2026-02-15', 'Checked In');


CREATE TABLE hotel_checkins (
  checkin_id INTEGER PRIMARY KEY,
  booking_id INTEGER NOT NULL,
  checked_in_at TEXT NOT NULL,
  method TEXT NOT NULL,
  employee_person_id INTEGER,
  note TEXT,
  FOREIGN KEY (booking_id)
    REFERENCES hotel_bookings(booking_id),
  FOREIGN KEY (employee_person_id)
    REFERENCES people(person_id)
);

INSERT INTO hotel_checkins VALUES
  (
    8101,
    8001,
    '2026-02-14 20:11',
    'Manual',
    9,
    'Guest marked present after anonymous telephone instruction'
  ),
  (
    8102,
    8002,
    '2026-02-14 18:42',
    'Front Desk',
    9,
    'Guest present with identification'
  );


CREATE TABLE keycard_events (
  keycard_event_id INTEGER PRIMARY KEY,
  booking_id INTEGER NOT NULL,
  event_at TEXT NOT NULL,
  event_type TEXT NOT NULL,
  door TEXT NOT NULL,
  success INTEGER NOT NULL,
  FOREIGN KEY (booking_id)
    REFERENCES hotel_bookings(booking_id)
);

-- Deliberately no keycard event for Elias / booking 8001.
INSERT INTO keycard_events VALUES
  (8201, 8002, '2026-02-14 19:02', 'DOOR_OPEN', 'Room 212', 1),
  (8202, 8002, '2026-02-14 22:46', 'DOOR_OPEN', 'Room 212', 1);


-- ============================================================
-- PHONE CALLS / LOCATIONS
-- Elias's burner phone repeatedly contacted Klara.
-- ============================================================

CREATE TABLE phone_calls (
  call_id INTEGER PRIMARY KEY,
  caller_person_id INTEGER,
  caller_number TEXT NOT NULL,
  receiver_person_id INTEGER,
  receiver_number TEXT NOT NULL,
  started_at TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  tower_location TEXT,
  FOREIGN KEY (caller_person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (receiver_person_id)
    REFERENCES people(person_id)
);

INSERT INTO phone_calls VALUES
  (9001, 2, '+49-151-7140001', 7, '+49-151-7140417', '2026-02-13 19:14', 82, 'Munich Central Station'),
  (9002, 2, '+49-151-7140001', 7, '+49-151-7140417', '2026-02-14 20:22', 44, 'Munich Central Station'),
  (9003, 2, '+49-151-7140001', 7, '+49-151-7140417', '2026-02-14 22:07', 36, 'Alpenstern 714'),
  (9004, 7, '+49-151-7140417', 2, '+49-151-7140001', '2026-02-14 22:14', 21, 'Alpenstern 714'),
  (9005, 2, '+49-151-7140001', NULL, '+49-151-5550100', '2026-02-12 15:40', 14, 'Munich'),
  (9006, 4, '+49-151-7140003', 10, '+49-151-7140011', '2026-02-14 21:13', 101, 'Alpenstern 714');


CREATE TABLE phone_locations (
  location_id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  recorded_at TEXT NOT NULL,
  location TEXT NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO phone_locations VALUES
  (9101, 2, '2026-02-14 20:20', 'Munich Central Station'),
  (9102, 7, '2026-02-14 20:20', 'Munich Central Station'),
  (9103, 2, '2026-02-14 22:10', 'Alpenstern 714'),
  (9104, 7, '2026-02-14 22:10', 'Alpenstern 714'),
  (9105, 2, '2026-02-14 23:41', 'Bern Central Station'),
  (9106, 7, '2026-02-14 23:41', 'Bern Central Station');


-- ============================================================
-- LOCKER 417 / PHYSICAL EVIDENCE
-- ============================================================

CREATE TABLE locker_events (
  locker_event_id INTEGER PRIMARY KEY,
  locker_number INTEGER NOT NULL,
  person_id INTEGER,
  event_type TEXT NOT NULL,
  event_at TEXT NOT NULL,
  access_method TEXT,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO locker_events VALUES
  (10001, 417, 2, 'PACKAGE_COLLECTED', '2026-01-28 18:04', 'Pickup Code'),
  (10002, 417, 7, 'LOCKER_OPENED', '2026-02-14 23:44', 'Staff Override Card'),
  (10003, 417, 7, 'LOCKER_CLOSED', '2026-02-14 23:46', 'Staff Override Card');


CREATE TABLE evidence_items (
  evidence_id INTEGER PRIMARY KEY,
  locker_number INTEGER,
  item_name TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  recovered_at TEXT NOT NULL,
  forensic_note TEXT
);

INSERT INTO evidence_items VALUES
  (10101, 417, 'KX-17 Knife', 'Weapon', '2026-02-15 00:11', 'Nora Keller blood; Elias Vogel fingerprints'),
  (10102, 417, 'Bloody Nitrile Gloves', 'Forensic', '2026-02-15 00:12', 'Elias Vogel DNA inside gloves'),
  (10103, 417, 'Nora Keller Press ID', 'Personal Item', '2026-02-15 00:13', 'Property of victim'),
  (10104, 417, 'Encrypted USB Drive', 'Digital', '2026-02-15 00:14', 'Contains Nora Keller investigation files');


-- ============================================================
-- DAMAGED MESSAGES
-- ============================================================

CREATE TABLE message_fragments (
  fragment_id INTEGER PRIMARY KEY,
  sender_person_id INTEGER,
  receiver_person_id INTEGER,
  sent_at TEXT,
  fragment_order INTEGER NOT NULL,
  raw_text TEXT NOT NULL,
  FOREIGN KEY (sender_person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (receiver_person_id)
    REFERENCES people(person_id)
);

INSERT INTO message_fragments VALUES
  (11001, 7, 2, '2026-02-14 18:02', 1, '   WiNtEr###confirmed   '),
  (11002, 2, 7, '2026-02-14 18:04', 2, '  50_000%%%after###BERN  '),
  (11003, 7, 2, '2026-02-14 18:06', 3, ' REPORT%%%must###not###reach '),
  (11004, 7, 2, '2026-02-14 18:06', 4, ' destination...23:10  '),
  (11005, 10, 12, '2026-02-13 12:00', 5, 'Lunch meeting confirmed');


-- ============================================================
-- CAMERA EVENTS
-- Recorded camera clock is seven minutes fast.
-- ============================================================

CREATE TABLE camera_events (
  camera_event_id INTEGER PRIMARY KEY,
  camera_name TEXT NOT NULL,
  person_id INTEGER,
  recorded_at TEXT NOT NULL,
  actual_at TEXT,
  location TEXT NOT NULL,
  event_description TEXT,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO camera_events VALUES
  (
    12001,
    'Bern Locker Camera 2',
    7,
    '2026-02-14 23:49',
    '2026-02-14 23:42',
    'Bern Central Station Locker Hall',
    'Klara enters locker hall'
  ),
  (
    12002,
    'Bern Locker Camera 2',
    7,
    '2026-02-14 23:51',
    '2026-02-14 23:44',
    'Bern Central Station Locker Hall',
    'Klara stands in front of locker 417'
  ),
  (
    12003,
    'Train Corridor Camera',
    2,
    '2026-02-14 22:28',
    '2026-02-14 22:28',
    'Coach 6 corridor',
    'Elias moves toward luggage compartment'
  );


-- ============================================================
-- TRAIN ACCESS LOGS
-- Klara opened the luggage compartment and disabled the camera.
-- ============================================================

CREATE TABLE access_logs (
  access_id INTEGER PRIMARY KEY,
  person_id INTEGER,
  card_id TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  event_at TEXT NOT NULL,
  success INTEGER NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id)
);

INSERT INTO access_logs VALUES
  (13001, 7, 'KM-714-03', 'Luggage Compartment', 'DOOR_OPEN', '2026-02-14 22:16', 1),
  (13002, 7, 'KM-714-03', 'Luggage Camera', 'CAMERA_DISABLED', '2026-02-14 22:17', 1),
  (13003, 7, 'KM-714-03', 'Luggage Compartment', 'DOOR_CLOSE', '2026-02-14 22:32', 1),
  (13004, 7, 'KM-714-03', 'Staff Cabinet', 'DOOR_OPEN', '2026-02-14 21:01', 1),
  (13005, 10, 'DK-OFFICE-04', 'Office 4', 'DOOR_OPEN', '2026-02-14 20:30', 1);


CREATE TABLE staff_shifts (
  shift_id INTEGER PRIMARY KEY,
  person_id INTEGER NOT NULL,
  trip_id INTEGER,
  shift_start TEXT NOT NULL,
  shift_end TEXT NOT NULL,
  role TEXT NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (trip_id)
    REFERENCES train_trips(trip_id)
);

INSERT INTO staff_shifts VALUES
  (
    13101,
    7,
    714,
    '2026-02-14 20:15',
    '2026-02-14 23:50',
    'Conductor'
  );


-- ============================================================
-- COMPANIES / BANKING
-- ============================================================

CREATE TABLE companies (
  company_id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  parent_company_id INTEGER,
  beneficial_owner_person_id INTEGER,
  registered_address TEXT,
  employee_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (parent_company_id)
    REFERENCES companies(company_id),
  FOREIGN KEY (beneficial_owner_person_id)
    REFERENCES people(person_id)
);

INSERT INTO companies VALUES
  (1, 'Voss Group', NULL, 8, 'Zurich, Bahnhofplatz 1', 430),
  (2, 'Northstar Consulting', 1, 8, 'Zurich, Postfach 714', 0),
  (3, 'Alpine Research GmbH', 1, 8, 'Munich, Forschungsallee 9', 38),
  (4, 'Voss Beteiligungen AG', 1, 8, 'Zurich, Bahnhofplatz 1', 12),
  (5, 'Bern Mobility Services', NULL, NULL, 'Bern, Aarestrasse 11', 80);


CREATE TABLE bank_accounts (
  account_id INTEGER PRIMARY KEY,
  account_number TEXT NOT NULL UNIQUE,
  person_id INTEGER,
  company_id INTEGER,
  opened_at TEXT NOT NULL,
  FOREIGN KEY (person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (company_id)
    REFERENCES companies(company_id),
  CHECK (
    person_id IS NOT NULL
    OR company_id IS NOT NULL
  )
);

INSERT INTO bank_accounts VALUES
  (14001, 'CH-VOSS-001', NULL, 1, '2014-01-01'),
  (14002, 'CH-NORTHSTAR-417', NULL, 2, '2025-12-20'),
  (14003, 'DE-ALPINE-714', NULL, 3, '2019-05-17'),
  (14004, 'CH-VB-900', NULL, 4, '2010-03-08'),
  (14005, 'DE-ELIAS-002', 2, NULL, '2018-04-12'),
  (14006, 'CH-KLARA-007', 7, NULL, '2020-06-23'),
  (14007, 'DE-MIRA-003', 3, NULL, '2017-08-04');


CREATE TABLE bank_transactions (
  transaction_id INTEGER PRIMARY KEY,
  from_account_id INTEGER NOT NULL,
  to_account_id INTEGER NOT NULL,
  transaction_at TEXT NOT NULL,
  amount REAL NOT NULL,
  reference TEXT,
  FOREIGN KEY (from_account_id)
    REFERENCES bank_accounts(account_id),
  FOREIGN KEY (to_account_id)
    REFERENCES bank_accounts(account_id)
);

INSERT INTO bank_transactions VALUES
  (
    15001,
    14001,
    14002,
    '2026-02-10 09:00',
    75000.00,
    'Project Winter'
  ),
  (
    15002,
    14003,
    14002,
    '2026-02-11 12:20',
    10000.00,
    'Research services'
  ),
  (
    15003,
    14004,
    14002,
    '2026-02-12 14:15',
    15000.00,
    'Consulting'
  ),
  (
    15004,
    14002,
    14005,
    '2026-02-14 18:30',
    10000.00,
    'Winter advance'
  ),
  (
    15005,
    14002,
    14005,
    '2026-02-15 08:15',
    40000.00,
    'Winter completion'
  ),
  (
    15006,
    14002,
    14006,
    '2026-02-15 08:17',
    15000.00,
    'Operational support'
  ),
  (
    15007,
    14003,
    14007,
    '2026-01-20 11:00',
    800.00,
    'Medical consulting'
  );


-- ============================================================
-- NORA'S RESEARCH
-- ============================================================

CREATE TABLE investigation_files (
  file_id INTEGER PRIMARY KEY,
  owner_person_id INTEGER NOT NULL,
  subject_company_id INTEGER,
  created_at TEXT NOT NULL,
  file_name TEXT NOT NULL,
  finding TEXT NOT NULL,
  publication_planned_at TEXT,
  confidence_level INTEGER NOT NULL CHECK (
    confidence_level BETWEEN 1 AND 5
  ),
  FOREIGN KEY (owner_person_id)
    REFERENCES people(person_id),
  FOREIGN KEY (subject_company_id)
    REFERENCES companies(company_id)
);

INSERT INTO investigation_files VALUES
  (
    16001,
    1,
    1,
    '2026-02-03 18:12',
    'winter_trial_results.csv',
    'Original medical trial results differ from the published Voss Group figures.',
    '2026-02-15 08:00',
    5
  ),
  (
    16002,
    1,
    3,
    '2026-02-07 21:40',
    'alpine_internal_mails.txt',
    'Executives instructed researchers to remove adverse results before publication.',
    '2026-02-15 08:00',
    5
  ),
  (
    16003,
    1,
    2,
    '2026-02-10 16:30',
    'northstar_payments.xlsx',
    'Northstar Consulting is used to hide payments authorized by Voss Group leadership.',
    '2026-02-15 08:00',
    5
  );


-- ============================================================
-- SIMPLIFIED EARLY-LEVEL VIEWS
-- ============================================================

CREATE VIEW purchase_history AS
SELECT
  o.order_id,
  p.person_id,
  p.full_name,
  o.order_date,
  pr.product_name,
  pr.category,
  pr.model,
  oi.quantity,
  oi.unit_price,
  o.delivery_address
FROM orders AS o
JOIN people AS p
  ON p.person_id = o.person_id
JOIN order_items AS oi
  ON oi.order_id = o.order_id
JOIN products AS pr
  ON pr.product_id = oi.product_id;


CREATE VIEW delivery_history AS
SELECT
  d.delivery_id,
  o.order_id,
  p.person_id,
  p.full_name,
  o.order_date,
  d.shipped_at,
  d.delivered_at,
  d.delivery_status,
  d.delivery_address
FROM deliveries AS d
JOIN orders AS o
  ON o.order_id = d.order_id
JOIN people AS p
  ON p.person_id = o.person_id;


CREATE VIEW train_passengers AS
SELECT
  t.ticket_id,
  p.person_id,
  p.full_name,
  tr.train_number,
  tr.train_name,
  tr.departure_city,
  tr.arrival_city,
  tr.departure_at,
  tr.arrival_at,
  t.coach,
  t.seat_number,
  t.destination,
  t.ticket_status
FROM tickets AS t
JOIN people AS p
  ON p.person_id = t.person_id
JOIN train_trips AS tr
  ON tr.trip_id = t.trip_id;


CREATE VIEW witness_reports AS
SELECT
  ws.statement_id,
  witness.full_name AS witness_name,
  observed.full_name AS observed_person,
  ws.observed_at,
  ws.location,
  ws.clothing_description,
  ws.blood_visible,
  ws.coach,
  ws.seat_number,
  ws.statement_text
FROM witness_statements AS ws
LEFT JOIN people AS witness
  ON witness.person_id = ws.witness_person_id
LEFT JOIN people AS observed
  ON observed.person_id = ws.observed_person_id;


-- ============================================================
-- BEGINNER INVESTIGATION VIEWS
-- ============================================================

CREATE VIEW knife_delivery_history AS
SELECT
  d.delivery_id,
  o.order_id,
  p.person_id,
  p.full_name,
  o.order_date,
  d.shipped_at,
  d.delivered_at,
  d.delivery_status,
  d.delivery_address
FROM deliveries AS d
JOIN orders AS o
  ON o.order_id = d.order_id
JOIN people AS p
  ON p.person_id = o.person_id
JOIN order_items AS oi
  ON oi.order_id = o.order_id
JOIN products AS pr
  ON pr.product_id = oi.product_id
WHERE pr.model = 'KX-17';


CREATE VIEW store_purchase_history AS
SELECT
  s.purchase_id,
  p.person_id,
  p.full_name,
  s.item_name,
  s.category,
  s.purchased_at,
  s.store_name,
  s.amount
FROM store_purchases AS s
JOIN people AS p
  ON p.person_id = s.person_id;


-- ============================================================
-- LEVEL 6-7 INVESTIGATION VIEWS
-- ============================================================

CREATE VIEW seat_event_history AS
SELECT
  se.seat_event_id,
  p.person_id,
  p.full_name,
  tr.train_number,
  tr.train_name,
  se.event_type,
  se.event_at,
  se.absence_minutes
FROM seat_events AS se
JOIN people AS p
  ON p.person_id = se.person_id
JOIN train_trips AS tr
  ON tr.trip_id = se.trip_id;


CREATE VIEW baggage_history AS
SELECT
  bs.baggage_scan_id,
  p.person_id,
  p.full_name,
  tr.train_number,
  bs.scan_location,
  bs.scanned_at,
  bs.weight_kg,
  bs.contents_note
FROM baggage_scans AS bs
JOIN people AS p
  ON p.person_id = bs.person_id
JOIN train_trips AS tr
  ON tr.trip_id = bs.trip_id;


-- ============================================================
-- LEVEL 11-15 INVESTIGATION VIEWS
-- ============================================================

CREATE VIEW locker_evidence_history AS
SELECT
  le.locker_event_id,
  le.locker_number,
  p.person_id,
  p.full_name,
  le.event_type,
  le.event_at,
  le.access_method
FROM locker_events AS le
LEFT JOIN people AS p
  ON p.person_id = le.person_id;


CREATE VIEW message_history AS
SELECT
  mf.fragment_id,
  sender.full_name AS sender_name,
  receiver.full_name AS receiver_name,
  mf.sent_at,
  mf.fragment_order,
  mf.raw_text
FROM message_fragments AS mf
LEFT JOIN people AS sender
  ON sender.person_id =
     mf.sender_person_id
LEFT JOIN people AS receiver
  ON receiver.person_id =
     mf.receiver_person_id;


CREATE VIEW camera_history AS
SELECT
  ce.camera_event_id,
  ce.camera_name,
  p.person_id,
  p.full_name,
  ce.recorded_at,
  ce.actual_at,
  ce.location,
  ce.event_description
FROM camera_events AS ce
LEFT JOIN people AS p
  ON p.person_id = ce.person_id;


CREATE VIEW train_access_history AS
SELECT
  al.access_id,
  p.person_id,
  p.full_name,
  al.card_id,
  al.resource,
  al.action,
  al.event_at,
  al.success
FROM access_logs AS al
LEFT JOIN people AS p
  ON p.person_id = al.person_id;


CREATE VIEW shift_history AS
SELECT
  ss.shift_id,
  p.person_id,
  p.full_name,
  tr.train_number,
  tr.train_name,
  ss.shift_start,
  ss.shift_end,
  ss.role
FROM staff_shifts AS ss
JOIN people AS p
  ON p.person_id = ss.person_id
LEFT JOIN train_trips AS tr
  ON tr.trip_id = ss.trip_id;


-- ============================================================
-- INDEXES
-- ============================================================


-- SQLTRAIN LEVEL 16-18 FINANCIAL EXTENSION START

-- One extra incoming payment creates a meaningful tie for
-- RANK() / DENSE_RANK().
INSERT OR IGNORE INTO bank_transactions (
  transaction_id,
  from_account_id,
  to_account_id,
  transaction_at,
  amount,
  reference
)
VALUES (
  15008,
  14003,
  14002,
  '2026-02-13 09:45',
  15000.00,
  'Data review'
);

CREATE TABLE financial_lead_sources (
  lead_id INTEGER PRIMARY KEY,
  source TEXT NOT NULL,
  company_name TEXT NOT NULL,
  note TEXT
);

INSERT INTO financial_lead_sources (
  lead_id,
  source,
  company_name,
  note
)
VALUES
  (
    17001,
    'Bank Monitor',
    'Northstar Consulting',
    'Money moved shortly after the murder'
  ),
  (
    17002,
    'Bank Monitor',
    'Alpine Research GmbH',
    'Transfers connected to the same payment chain'
  ),
  (
    17003,
    'Bank Monitor',
    'Voss Beteiligungen AG',
    'Transfers connected to the same payment chain'
  ),
  (
    17004,
    'Bank Monitor',
    'Bern Mobility Services',
    'Routine transport payments also appeared'
  ),
  (
    17005,
    'Corporate Registry',
    'Northstar Consulting',
    'Recently created consulting company'
  ),
  (
    17006,
    'Corporate Registry',
    'Alpine Research GmbH',
    'Corporate relationship requires review'
  ),
  (
    17007,
    'Corporate Registry',
    'Voss Beteiligungen AG',
    'Corporate relationship requires review'
  ),
  (
    17008,
    'Cleared Audit',
    'Bern Mobility Services',
    'Payments verified as legitimate transport expenses'
  );

CREATE VIEW northstar_outgoing_payments AS
SELECT
  bt.transaction_id,
  bt.transaction_at,
  bt.amount,
  bt.reference,
  recipient.person_id AS recipient_person_id,
  recipient.full_name AS recipient_name
FROM bank_transactions AS bt
JOIN bank_accounts AS from_account
  ON from_account.account_id = bt.from_account_id
JOIN bank_accounts AS to_account
  ON to_account.account_id = bt.to_account_id
JOIN people AS recipient
  ON recipient.person_id = to_account.person_id
WHERE from_account.company_id = (
  SELECT company_id
  FROM companies
  WHERE company_name = 'Northstar Consulting'
);

CREATE VIEW northstar_incoming_funds AS
SELECT
  bt.transaction_id,
  bt.transaction_at,
  bt.amount,
  bt.reference,
  source_company.company_id AS source_company_id,
  source_company.company_name AS source_company
FROM bank_transactions AS bt
JOIN bank_accounts AS from_account
  ON from_account.account_id = bt.from_account_id
JOIN companies AS source_company
  ON source_company.company_id = from_account.company_id
JOIN bank_accounts AS to_account
  ON to_account.account_id = bt.to_account_id
WHERE to_account.company_id = (
  SELECT company_id
  FROM companies
  WHERE company_name = 'Northstar Consulting'
);

-- SQLTRAIN LEVEL 16-18 FINANCIAL EXTENSION END

CREATE INDEX idx_orders_person
  ON orders(person_id);

CREATE INDEX idx_store_purchases_person
  ON store_purchases(person_id);

CREATE INDEX idx_tickets_person
  ON tickets(person_id);

CREATE INDEX idx_phone_calls_caller
  ON phone_calls(caller_person_id);

CREATE INDEX idx_phone_calls_receiver
  ON phone_calls(receiver_person_id);

CREATE INDEX idx_bank_transactions_from
  ON bank_transactions(from_account_id);

CREATE INDEX idx_bank_transactions_to
  ON bank_transactions(to_account_id);
