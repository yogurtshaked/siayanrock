export interface Stop {
  t?: string; // optional time chip, e.g. "5:30 AM"
  n: string;
}

export interface Day {
  title: string;
  stops: Stop[];
  sample?: boolean; // shows an "edit me" note
}

export type PackageId = "3d2n" | "4d3n" | "5d4n";

export interface TourPackage {
  id: PackageId;
  label: string;
  days: number;
  nights: number;
  price: string;
  plan: Day[];
}

export const CONTACT = "mailto:hello@siayanrock.com";

const NORTH_TOUR: Day = {
  title: "Arrival + North Batan Tour",
  stops: [
    "Arrival and check-in assistance", "Welcome Arc of Basco", "Mt. Carmel Chapel",
    "Tukon Radar Station", "Viewing at Fundacion Pacita", "Dipnaysupuan Japanese Tunnel",
    "Valugan Boulder Beach", "Sto. Domingo Church", "Vayang Rolling Hills", "Basco Lighthouse",
  ].map((n) => ({ n })),
};

const SABTANG_SOUTH: Day = {
  title: "Sabtang Island + South Batan Tour",
  stops: [
    { t: "5:30 AM", n: "Early breakfast" }, { t: "6:00 AM", n: "Pick-up to Sabtang Island" },
    { t: "7:00 AM", n: "Depart for Sabtang Island" }, { n: "Chavayan Village" }, { n: "Sta. Rosa de Lima Chapel" },
    { n: "Vernacular stone houses" }, { n: "Weavers' handicrafts" }, { n: "Chamantad Tinyan Viewpoint" },
    { n: "Lime Kiln" }, { n: "Savidug Idjang" }, { n: "Walking tour at Brgy. Savidug" },
    { n: "Sto. Thomas Aquinas Church" }, { n: "San Vicente Ferrer Church" }, { n: "Nakabuang Natural Arch Formation" },
    { n: "Morong Beach" }, { t: "12:00 PM", n: "Lunch at Sabtang Island" }, { t: "12:30 PM", n: "Depart back to Batan" },
    { t: "1:00 PM", n: "Arrive at Batan Island, pick-up for South Batan tour" }, { n: "Chawa View Deck" },
    { n: "San Carlos Borromeo Church" }, { n: "Blank Book Archives" }, { n: "White Beach & Blue Lagoon" },
    { n: "Old Spanish Bridge" }, { n: "House of Dakay" }, { n: "Honesty Coffee Shop" },
    { n: "San Jose de Ivana Church & Ruins" }, { n: "Pass-by at Municipality of Uyugan" },
    { n: "San Antonio de Florencia Church" }, { n: "Our Lady of Miraculous Medal Church" },
    { n: "Muchong" }, { n: "Sung-sung Ruins" },
  ],
};

// Sample days: replace with your real stops
const extraDay = (title: string): Day => ({
  title,
  sample: true,
  stops: [{ n: "Add your stops here" }, { n: "Add your stops here" }],
});

const DEPARTURE: Day = {
  title: "Departure",
  stops: [{ n: "Breakfast" }, { n: "Airport transfer" }, { n: "Departure" }],
};

export const PACKAGES: TourPackage[] = [
  { id: "3d2n", label: "3D2N", days: 3, nights: 2, price: "Price on request",
    plan: [NORTH_TOUR, SABTANG_SOUTH, DEPARTURE] },
  { id: "4d3n", label: "4D3N", days: 4, nights: 3, price: "Price on request",
    plan: [NORTH_TOUR, SABTANG_SOUTH, extraDay("Day 3 tour title"), DEPARTURE] },
  { id: "5d4n", label: "5D4N", days: 5, nights: 4, price: "Price on request",
    plan: [NORTH_TOUR, SABTANG_SOUTH, extraDay("Day 3 tour title"), extraDay("Day 4 tour title"), DEPARTURE] },
];

export const INCLUSIONS: string[] = [
  "AC room accommodation", "Airport transfer, round trip", "Breakfast and lunch meals",
  "Complete tours and entrance fees", "Tour guide and driver fees", "San Vicente port service",
  "Boat fare, round trip", "Registration at Tourism Sabtang", "All government fees",
  "AC van service / Cogon-roofed tricycle",
];

export const EXCLUSIONS: string[] = ["Airfare", "Dinner", "Personal expenses"];