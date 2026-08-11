import type {
  MysteryResolution,
} from "@/types/mystery";

export const MYSTERY_RESOLUTIONS: Record<
  number,
  MysteryResolution
> = {
  1: {
    levelNumber: 1,
    title: "The KX-17 Five",
    summary:
      "The forensic report and Nora's recovered purchase file produce the first real breakthrough. Twelve people were initially relevant to the investigation, but only five purchased the exact KX-17 model that matches Nora's wound.",
    clearedSuspects: [
      "David Kern",
      "Anna Weiss",
      "Marc Hofer",
      "Felix Brandt",
      "Lena Hoffmann",
      "Marco Stein",
      "Eva Köhler",
    ],
    remainingSuspects: [
      "Elias Vogel",
      "Mira Roth",
      "Leon Berger",
      "Sofia Hartmann",
      "Jonas Frei",
    ],
    unlockedEvidence: [
      "Five KX-17 buyers identified",
      "Knife model linked to Nora's wound",
      "Courier records released to investigators",
    ],
  },

  2: {
    levelNumber: 2,
    title: "Locker 417",
    summary:
      "Every KX-17 reached its buyer before the murder. One delivery is different from all the others: Elias Vogel did not use a home address. His knife was delivered to Munich Central Station Locker 417.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Mira Roth",
      "Leon Berger",
      "Sofia Hartmann",
      "Jonas Frei",
    ],
    unlockedEvidence: [
      "All five knives delivered before February 14",
      "Elias Vogel used Locker 417",
      "Hardware-store receipts added to the case",
    ],
  },

  3: {
    levelNumber: 3,
    title: "Preparation, Not Coincidence",
    summary:
      "Plastic sheeting, tape and protective gloves were purchased only days before Nora's murder. Four of the five knife buyers appear in those records. Jonas Frei does not.",
    clearedSuspects: [
      "Jonas Frei",
    ],
    remainingSuspects: [
      "Elias Vogel",
      "Mira Roth",
      "Leon Berger",
      "Sofia Hartmann",
    ],
    unlockedEvidence: [
      "Preparation-material pattern established",
      "Jonas Frei removed from active suspicion",
      "Railway manifests unlocked",
    ],
  },

  4: {
    levelNumber: 4,
    title: "Only Three Were on Train 714",
    summary:
      "The railway manifest cuts the suspect pool again. Sofia Hartmann travelled on Alpenstern 715 toward Vienna. Elias Vogel, Mira Roth and Leon Berger were aboard Alpenstern 714 to Bern.",
    clearedSuspects: [
      "Sofia Hartmann",
    ],
    remainingSuspects: [
      "Elias Vogel",
      "Mira Roth",
      "Leon Berger",
    ],
    unlockedEvidence: [
      "Train 714 passenger list confirmed",
      "Sofia Hartmann excluded from the murder train",
      "Witness statements unlocked",
    ],
  },

  5: {
    levelNumber: 5,
    title: "The Bloodstained Two",
    summary:
      "Witness testimony separates Leon Berger from the other two. Leon was seen in the dining car wearing clean clothes. Elias Vogel and Mira Roth were both observed near the luggage compartment with visible blood.",
    clearedSuspects: [
      "Leon Berger",
    ],
    remainingSuspects: [
      "Elias Vogel",
      "Mira Roth",
    ],
    unlockedEvidence: [
      "Blood evidence narrows the case to two people",
      "Leon Berger cleared",
      "Seat-sensor timeline unlocked",
    ],
  },

  6: {
    levelNumber: 6,
    title: "The Missing Twenty-Five Minutes",
    summary:
      "Both remaining suspects left their seats, but the timelines are radically different. Mira Roth was absent for only eight minutes. Elias Vogel disappeared at 22:09 and did not return until 22:34, covering the entire murder window.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Mira Roth",
    ],
    unlockedEvidence: [
      "Elias absent for 25 minutes",
      "Entire murder window falls inside Elias's absence",
      "Baggage scans unlocked",
    ],
  },

  7: {
    levelNumber: 7,
    title: "The Killer's Suitcase",
    summary:
      "Elias's suitcase gained 6.4 kilograms between Munich and Bern. The arrival scan detected a laptop-shaped object and paper files. Mira's small increase is consistent with medical supplies. The evidence now identifies Elias as Nora's direct killer.",
    clearedSuspects: [
      "Mira Roth",
    ],
    remainingSuspects: [
      "Elias Vogel",
    ],
    unlockedEvidence: [
      "Elias Vogel identified as the direct killer",
      "Nora's missing laptop and documents linked to Elias",
      "The investigation now turns to whoever helped him",
    ],
  },

  8: {
    levelNumber: 8,
    title: "The Alibi Begins to Collapse",
    summary:
      "Elias really had a reservation at Hotel Isartor, but the supposedly reassuring check-in was created manually. A reservation proves that a room existed. It does not prove that Elias was inside it.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
    ],
    unlockedEvidence: [
      "Hotel Isartor room 417 confirmed",
      "Check-in method identified as Manual",
      "Electronic keycard records unlocked",
    ],
  },

  9: {
    levelNumber: 9,
    title: "The Room Was Never Used",
    summary:
      "The hotel's access system contains no room-entry event for Elias. Receptionist Paula Stein admits that she marked him present after an anonymous caller said Elias would arrive late. The hotel alibi was manufactured.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
    ],
    unlockedEvidence: [
      "No keycard activity for Elias",
      "Paula Stein reveals an anonymous telephone instruction",
      "Burner-phone records unlocked",
    ],
  },

  10: {
    levelNumber: 10,
    title: "A New Name Enters the Case",
    summary:
      "The burner phone repeatedly contacted one known person. Location records place that person beside Elias in Munich, aboard Alpenstern 714 and again in Bern: train conductor Klara Meier.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Klara Meier linked to Elias's burner phone",
      "Three shared locations confirmed",
      "Klara becomes the investigation's first accomplice lead",
    ],
  },

  11: {
    levelNumber: 11,
    title: "Locker 417 Opened",
    summary:
      "Police recover the KX-17 murder weapon, bloody gloves, Nora Keller's press ID and an encrypted USB drive from Locker 417. The locker log reveals that Klara Meier opened it with a staff override card after train 714 arrived in Bern.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Murder weapon recovered",
      "Elias Vogel fingerprints found on the knife",
      "Elias Vogel DNA found inside the gloves",
      "Klara Meier opened Locker 417",
      "Encrypted USB drive recovered",
    ],
  },

  12: {
    levelNumber: 12,
    title: "The Messages Were Deliberately Damaged",
    summary:
      "The burner-phone fragments were padded and corrupted intentionally. After normalizing the text, investigators identify recurring terms: Winter, Bern, Report, 50_000 and 23:10.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Project code: WINTER",
      "Destination: BERN",
      "A payment amount appears in the messages",
      "Nora's report was explicitly mentioned",
    ],
  },

  13: {
    levelNumber: 13,
    title: "Project Winter",
    summary:
      "The reconstructed instructions reveal the conspiracy in plain language: Winter confirmed. 50,000 after Bern. Report must not reach destination. Elias was not acting on impulse — the murder was ordered and paid for.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "50,000 payment promised",
      "Nora's report was the target",
      "The murder was premeditated",
      "A third party must have financed Project Winter",
    ],
  },

  14: {
    levelNumber: 14,
    title: "Seven Minutes Fast",
    summary:
      "The station camera was not falsified after the murder. Its internal clock was exactly seven minutes fast. Correcting the timestamps places Klara at Locker 417 at 23:42 and 23:44, perfectly matching the locker access records.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Camera clock error confirmed: +7 minutes",
      "Corrected footage matches Locker 417 access",
      "Klara's physical presence at the locker is confirmed",
    ],
  },

  15: {
    levelNumber: 15,
    title: "Klara Meier Was the Accomplice",
    summary:
      "Klara's employee card opened the luggage compartment at 22:16, disabled its camera at 22:17 and closed the compartment at 22:32. Every event occurred during her registered shift. The murder window lies inside that sequence. Klara Meier deliberately gave Elias access and helped conceal the crime.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Klara opened the luggage compartment",
      "Klara disabled the compartment camera",
      "Access events occurred during her official shift",
      "Klara Meier confirmed as accomplice",
      "Financial records unlocked: who paid them?",
    ],
  },


  16: {
    levelNumber: 16,
    title: "Three Companies Remain",
    summary:
      "Independent banking and registry investigations converge on the same three companies: Northstar Consulting, Alpine Research GmbH and Voss Beteiligungen AG. Northstar stands out because it officially employs nobody.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Three financial source companies remain",
      "Northstar Consulting has zero employees",
      "Detailed Northstar transactions unlocked",
    ],
  },

  17: {
    levelNumber: 17,
    title: "Northstar Is a Shell Company",
    summary:
      "Northstar Consulting paid Elias Vogel twice and Klara Meier once. Despite moving large sums, it has no employees. Corporate records show Northstar is controlled by the Voss Group.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
    ],
    unlockedEvidence: [
      "Northstar paid both murderer and accomplice",
      "Northstar has no genuine workforce",
      "Northstar parent company: Voss Group",
      "Original funding sequence unlocked",
    ],
  },

  18: {
    levelNumber: 18,
    title: "The Money Leads to Adrian Voss",
    summary:
      "Window analysis reconstructs the transfer chain. The earliest and largest funding transfer came from the Voss Group. Corporate ownership records identify its beneficial owner: Adrian Voss.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
      "Adrian Voss",
    ],
    unlockedEvidence: [
      "First Northstar funding source: Voss Group",
      "Beneficial owner: Adrian Voss",
      "Adrian Voss becomes the mastermind lead",
      "Nora's encrypted investigation files unlocked",
    ],
  },

  19: {
    levelNumber: 19,
    title: "The Motive",
    summary:
      "Nora's encrypted files prove that the Voss Group manipulated medical research results and ordered adverse findings removed before publication. Nora planned to publish the evidence the morning after the train journey. Adrian Voss had a direct reason to stop her.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
      "Adrian Voss",
    ],
    unlockedEvidence: [
      "Manipulated medical research proven",
      "Nora's publication scheduled for the following morning",
      "Adrian Voss had the motive and financial control",
      "Final prosecution sandbox unlocked",
    ],
  },

  20: {
    levelNumber: 20,
    title: "CASE CLOSED",
    summary:
      "The entire evidence chain is complete. Elias Vogel murdered Nora Keller. Klara Meier opened the luggage compartment, disabled the camera and concealed evidence. Adrian Voss financed and ordered the operation to prevent Nora from publishing proof of manipulated medical research.",
    clearedSuspects: [],
    remainingSuspects: [
      "Elias Vogel",
      "Klara Meier",
      "Adrian Voss",
    ],
    unlockedEvidence: [
      "Murderer: Elias Vogel",
      "Accomplice: Klara Meier",
      "Mastermind: Adrian Voss",
      "Victim: Nora Keller",
      "Motive: prevent publication of manipulated research results",
      "All 100 SQL investigation tasks completed",
    ],
  },

};

export function getMysteryResolution(
  levelNumber: number,
): MysteryResolution | null {
  return (
    MYSTERY_RESOLUTIONS[
      levelNumber
    ] ?? null
  );
}
