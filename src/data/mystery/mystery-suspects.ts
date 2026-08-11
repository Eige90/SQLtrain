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

const LEVEL_SUSPECTS: Record<
  number,
  MysterySuspect[]
> = {
  1: [
    {
      name: "Elias Vogel",
      status: "Person of Interest",
      reason: "Appears in Nora's purchase records.",
    },
    {
      name: "Mira Roth",
      status: "Person of Interest",
      reason: "Known contact of Nora Keller.",
    },
    {
      name: "Leon Berger",
      status: "Person of Interest",
      reason: "Connected to Nora's recent investigation.",
    },
    {
      name: "Sofia Hartmann",
      status: "Person of Interest",
      reason: "Appears in recovered records.",
    },
    {
      name: "Jonas Frei",
      status: "Person of Interest",
      reason: "Appears in recovered records.",
    },
    {
      name: "David Kern",
      status: "Person of Interest",
      reason: "Financial contact connected to the case.",
    },
    {
      name: "Anna Weiss",
      status: "Person of Interest",
      reason: "Passenger connected to train 714.",
    },
    {
      name: "Marc Hofer",
      status: "Person of Interest",
      reason: "Passenger connected to train 714.",
    },
    {
      name: "Felix Brandt",
      status: "Person of Interest",
      reason: "Met Nora shortly before her death.",
    },
    {
      name: "Lena Hoffmann",
      status: "Person of Interest",
      reason: "Found in Nora's contact records.",
    },
    {
      name: "Marco Stein",
      status: "Person of Interest",
      reason: "Seen at Munich Central Station.",
    },
    {
      name: "Eva Köhler",
      status: "Person of Interest",
      reason: "Worked with medical research data.",
    },
  ],

  2: [
    {
      name: "Elias Vogel",
      status: "Suspect",
      reason: "Bought a KX-17 knife.",
    },
    {
      name: "Mira Roth",
      status: "Suspect",
      reason: "Bought a KX-17 knife.",
    },
    {
      name: "Leon Berger",
      status: "Suspect",
      reason: "Bought a KX-17 knife.",
    },
    {
      name: "Sofia Hartmann",
      status: "Suspect",
      reason: "Bought a KX-17 knife.",
    },
    {
      name: "Jonas Frei",
      status: "Suspect",
      reason: "Bought a KX-17 knife.",
    },
  ],

  3: [
    {
      name: "Elias Vogel",
      status: "Suspect",
      reason: "KX-17 buyer.",
    },
    {
      name: "Mira Roth",
      status: "Suspect",
      reason: "KX-17 buyer.",
    },
    {
      name: "Leon Berger",
      status: "Suspect",
      reason: "KX-17 buyer.",
    },
    {
      name: "Sofia Hartmann",
      status: "Suspect",
      reason: "KX-17 buyer.",
    },
    {
      name: "Jonas Frei",
      status: "Suspect",
      reason: "KX-17 buyer.",
    },
  ],

  4: [
    {
      name: "Elias Vogel",
      status: "Suspect",
      reason: "Knife + preparation materials.",
    },
    {
      name: "Mira Roth",
      status: "Suspect",
      reason: "Knife + preparation materials.",
    },
    {
      name: "Leon Berger",
      status: "Suspect",
      reason: "Knife + preparation materials.",
    },
    {
      name: "Sofia Hartmann",
      status: "Suspect",
      reason: "Knife + preparation materials.",
    },
  ],

  5: [
    {
      name: "Elias Vogel",
      status: "Suspect",
      reason: "Was aboard Alpenstern 714.",
    },
    {
      name: "Mira Roth",
      status: "Suspect",
      reason: "Was aboard Alpenstern 714.",
    },
    {
      name: "Leon Berger",
      status: "Suspect",
      reason: "Was aboard Alpenstern 714.",
    },
  ],

  6: [
    {
      name: "Elias Vogel",
      status: "Suspect",
      reason: "Seen bloodstained near the luggage compartment.",
    },
    {
      name: "Mira Roth",
      status: "Suspect",
      reason: "Seen with blood on her cuff.",
    },
  ],

  7: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason: "Absent 25 minutes during the murder window.",
    },
    {
      name: "Mira Roth",
      status: "Suspect",
      reason: "Absent only 8 minutes.",
    },
  ],

  8: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason: "His luggage gained 6.4 kg.",
    },
    {
      name: "Mira Roth",
      status: "Cleared",
      reason: "Baggage increase matches medical supplies.",
    },
  ],

  9: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason: "Hotel alibi is inconsistent.",
    },
    {
      name: "Paula Stein",
      status: "New Lead",
      reason: "Hotel employee who recorded the check-in.",
    },
  ],

  10: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason: "Hotel alibi was manually fabricated.",
    },
    {
      name: "Klara Meier",
      status: "New Lead",
      reason: "Repeated burner-phone contact.",
    },
  ],

  11: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Direct killer; knife, gloves and Nora's property recovered from Locker 417.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Used a staff override card to open Locker 417 after train 714 arrived.",
    },
  ],

  12: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Direct killer linked to the hidden weapon and burner phone.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Burner-phone contact and Locker 417 access now connect her to the cover-up.",
    },
  ],

  13: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Received coded instructions involving Bern, Nora's report and a 50,000 payment.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Exchanged Project Winter messages with Elias before the murder.",
    },
  ],

  14: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Direct killer already established by physical and timeline evidence.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Corrected camera timestamps place her at Locker 417 after arrival in Bern.",
    },
  ],

  15: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Killed Nora Keller and removed her laptop and documents.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Her staff card opened the luggage compartment, disabled the camera and closed the compartment after the murder.",
    },
  ],


  16: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Confirmed direct murderer. Investigators are now tracing who financed him.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Confirmed accomplice. Financial compensation after the murder is under investigation.",
    },
    {
      name: "Unknown Financier",
      status: "New Lead",
      reason:
        "A hidden financial network appears to have funded Project Winter.",
    },
  ],

  17: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Received two payments from Northstar Consulting.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Received a payment from Northstar Consulting for operational support.",
    },
    {
      name: "Unknown Financier",
      status: "New Lead",
      reason:
        "Northstar Consulting is a shell company controlled by a larger corporate structure.",
    },
  ],

  18: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Paid by Northstar Consulting before and after Nora's murder.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Paid by Northstar Consulting after helping conceal the murder.",
    },
    {
      name: "Unknown Financier",
      status: "New Lead",
      reason:
        "The earliest source of Northstar's money is now the central question.",
    },
  ],

  19: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Direct murderer hired to stop Nora Keller.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Accomplice who enabled the murder and concealed evidence.",
    },
    {
      name: "Adrian Voss",
      status: "New Lead",
      reason:
        "Beneficial owner behind the first and largest funding source for Project Winter.",
    },
  ],

  20: [
    {
      name: "Elias Vogel",
      status: "Prime Suspect",
      reason:
        "Murderer established by forensic evidence, the timeline and Nora's stolen property.",
    },
    {
      name: "Klara Meier",
      status: "Suspect",
      reason:
        "Accomplice established by access logs, camera records and Locker 417.",
    },
    {
      name: "Adrian Voss",
      status: "New Lead",
      reason:
        "Mastermind linked through Voss Group funding and Nora's secret investigation files.",
    },
  ],

};

export function getMysterySuspects(
  levelNumber: number,
): MysterySuspect[] {
  return (
    LEVEL_SUSPECTS[levelNumber] ??
    LEVEL_SUSPECTS[1]
  );
}
