export type MysteryDatabaseTable = {
  name: string;
  description: string;
  columns: string[];
  unlockLevel: number;
};

export const MYSTERY_DATABASE_TABLES: MysteryDatabaseTable[] = [
  {
    name: "purchase_history",
    description:
      "Nora's recovered purchase export.",
    columns: [
      "order_id",
      "person_id",
      "full_name",
      "order_date",
      "product_name",
      "category",
      "model",
      "quantity",
      "unit_price",
      "delivery_address",
    ],
    unlockLevel: 1,
  },
  {
    name: "people",
    description:
      "People known to the investigation.",
    columns: [
      "person_id",
      "full_name",
      "city",
      "phone_number",
      "occupation",
      "notes",
    ],
    unlockLevel: 1,
  },
  {
    name: "products",
    description:
      "Products and product models.",
    columns: [
      "product_id",
      "product_name",
      "category",
      "model",
    ],
    unlockLevel: 1,
  },
  {
    name: "knife_delivery_history",
    description:
      "Delivery records for the KX-17 orders.",
    columns: [
      "delivery_id",
      "order_id",
      "person_id",
      "full_name",
      "order_date",
      "shipped_at",
      "delivered_at",
      "delivery_status",
      "delivery_address",
    ],
    unlockLevel: 2,
  },
  {
    name: "store_purchase_history",
    description:
      "Physical store purchases connected to the suspects.",
    columns: [
      "purchase_id",
      "person_id",
      "full_name",
      "item_name",
      "category",
      "purchased_at",
      "store_name",
      "amount",
    ],
    unlockLevel: 3,
  },
  {
    name: "train_passengers",
    description:
      "Passenger manifests and ticket data.",
    columns: [
      "ticket_id",
      "person_id",
      "full_name",
      "train_number",
      "train_name",
      "departure_city",
      "arrival_city",
      "departure_at",
      "arrival_at",
      "coach",
      "seat_number",
      "destination",
      "ticket_status",
    ],
    unlockLevel: 4,
  },
  {
    name: "witness_reports",
    description:
      "Witness observations from train 714.",
    columns: [
      "statement_id",
      "witness_name",
      "observed_person",
      "observed_at",
      "location",
      "clothing_description",
      "blood_visible",
      "coach",
      "seat_number",
      "statement_text",
    ],
    unlockLevel: 5,
  },
  {
    name: "seat_event_history",
    description:
      "Seat sensor events used to reconstruct passenger absences.",
    columns: [
      "seat_event_id",
      "person_id",
      "full_name",
      "train_number",
      "train_name",
      "event_type",
      "event_at",
      "absence_minutes",
    ],
    unlockLevel: 6,
  },
  {
    name: "baggage_history",
    description:
      "Departure and arrival baggage weights.",
    columns: [
      "baggage_scan_id",
      "person_id",
      "full_name",
      "train_number",
      "scan_location",
      "scanned_at",
      "weight_kg",
      "contents_note",
    ],
    unlockLevel: 7,
  },
  {
    name: "hotel_bookings",
    description:
      "Hotel reservations and claimed stays.",
    columns: [
      "booking_id",
      "hotel_id",
      "person_id",
      "room_number",
      "check_in_date",
      "check_out_date",
      "booking_status",
    ],
    unlockLevel: 8,
  },
  {
    name: "hotels",
    description:
      "Hotel directory.",
    columns: [
      "hotel_id",
      "hotel_name",
      "city",
    ],
    unlockLevel: 8,
  },
  {
    name: "hotel_checkins",
    description:
      "Hotel check-in records, including manual entries.",
    columns: [
      "checkin_id",
      "booking_id",
      "checked_in_at",
      "method",
      "employee_person_id",
      "note",
    ],
    unlockLevel: 8,
  },
  {
    name: "keycard_events",
    description:
      "Physical hotel room access events.",
    columns: [
      "keycard_event_id",
      "booking_id",
      "event_at",
      "event_type",
      "door",
      "success",
    ],
    unlockLevel: 9,
  },
  {
    name: "phone_calls",
    description:
      "Recovered cellular call records.",
    columns: [
      "call_id",
      "caller_person_id",
      "caller_number",
      "receiver_person_id",
      "receiver_number",
      "started_at",
      "duration_seconds",
      "tower_location",
    ],
    unlockLevel: 10,
  },
  {
    name: "phone_locations",
    description:
      "Phone-location records from cell towers.",
    columns: [
      "location_id",
      "person_id",
      "recorded_at",
      "location",
    ],
    unlockLevel: 10,
  },

  {
    name: "locker_evidence_history",
    description:
      "Access events for station lockers, including the identity and access method used.",
    columns: [
      "locker_event_id",
      "locker_number",
      "person_id",
      "full_name",
      "event_type",
      "event_at",
      "access_method",
    ],
    unlockLevel: 11,
  },
  {
    name: "evidence_items",
    description:
      "Physical and digital evidence recovered from station lockers.",
    columns: [
      "evidence_id",
      "locker_number",
      "item_name",
      "evidence_type",
      "recovered_at",
      "forensic_note",
    ],
    unlockLevel: 11,
  },
  {
    name: "message_history",
    description:
      "Damaged message fragments recovered from the burner phone.",
    columns: [
      "fragment_id",
      "sender_name",
      "receiver_name",
      "sent_at",
      "fragment_order",
      "raw_text",
    ],
    unlockLevel: 12,
  },
  {
    name: "camera_history",
    description:
      "Camera records containing both recorded and independently verified timestamps.",
    columns: [
      "camera_event_id",
      "camera_name",
      "person_id",
      "full_name",
      "recorded_at",
      "actual_at",
      "location",
      "event_description",
    ],
    unlockLevel: 14,
  },
  {
    name: "train_access_history",
    description:
      "Employee-card access events aboard Alpenstern 714.",
    columns: [
      "access_id",
      "person_id",
      "full_name",
      "card_id",
      "resource",
      "action",
      "event_at",
      "success",
    ],
    unlockLevel: 15,
  },
  {
    name: "shift_history",
    description:
      "Train employee shift times used to test whether access events overlap with working hours.",
    columns: [
      "shift_id",
      "person_id",
      "full_name",
      "train_number",
      "train_name",
      "shift_start",
      "shift_end",
      "role",
    ],
    unlockLevel: 15,
  },


  {
    name: "financial_lead_sources",
    description:
      "Company leads collected independently by banking, registry and audit teams.",
    columns: [
      "lead_id",
      "source",
      "company_name",
      "note",
    ],
    unlockLevel: 16,
  },
  {
    name: "companies",
    description:
      "Corporate registry including ownership, parent-company relationships and official employee counts.",
    columns: [
      "company_id",
      "company_name",
      "parent_company_id",
      "beneficial_owner_person_id",
      "registered_address",
      "employee_count",
    ],
    unlockLevel: 16,
  },
  {
    name: "northstar_outgoing_payments",
    description:
      "Payments sent by Northstar Consulting to individual recipients.",
    columns: [
      "transaction_id",
      "transaction_at",
      "amount",
      "reference",
      "recipient_person_id",
      "recipient_name",
    ],
    unlockLevel: 17,
  },
  {
    name: "northstar_incoming_funds",
    description:
      "Funding transferred into Northstar Consulting before the murder.",
    columns: [
      "transaction_id",
      "transaction_at",
      "amount",
      "reference",
      "source_company_id",
      "source_company",
    ],
    unlockLevel: 17,
  },
  {
    name: "bank_accounts",
    description:
      "Accounts belonging to people and companies in the investigation.",
    columns: [
      "account_id",
      "account_number",
      "person_id",
      "company_id",
      "opened_at",
    ],
    unlockLevel: 18,
  },
  {
    name: "bank_transactions",
    description:
      "Full financial transaction ledger used to trace the original funding source.",
    columns: [
      "transaction_id",
      "from_account_id",
      "to_account_id",
      "transaction_at",
      "amount",
      "reference",
    ],
    unlockLevel: 18,
  },
  {
    name: "investigation_files",
    description:
      "Files recovered from Nora Keller's encrypted USB drive. These establish the motive for the murder.",
    columns: [
      "file_id",
      "owner_person_id",
      "subject_company_id",
      "created_at",
      "file_name",
      "finding",
      "publication_planned_at",
      "confidence_level",
    ],
    unlockLevel: 19,
  },

];
