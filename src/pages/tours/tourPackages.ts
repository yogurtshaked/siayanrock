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

/* ---------- Tour blocks: write each tour once ---------- */
const names = (list: string[]): Stop[] => list.map((n) => ({ n }));

const NORTH_STOPS: Stop[] = [
    { t: "2:00 PM", n: "North Tour leaves Siayanrock" },
    { n: "Chawa View Deck" },
    { n: "Mt. Carmel Chapel" },
    { n: "Tukon Radar Station" },
    { n: "Fundacion Pacita Viewing" },
    { n: "Japanese Tunnel" },
    { n: "Valugan Boulder Beach" },
    { n: "Naidi Lighthouse" },
    { n: "Naidi or Vayang Rolling Hills" },
    { n: "Capitol/Sto. Domingo Church" },
];

const SABTANG_STOPS: Stop[] = [
    { t: "6:30 AM", n: "Arrive at Ivana Port" },
    { t: "7:15 AM", n: "Pick-up at Sabtang Port" },
    { n: "Morong Rock Arc" },
    { n: "San Vicente Ferrer Church" },
    { n: "Savidug Village" },
    { n: "Savidug Idjang (Viewing)" },
    { n: "Tinian/Chamantad" },
    { n: "Chamantad View Point" },
    { n: "Chavayan Village (Temporary Road Closure)" },

    { t: "11:00 AM", n: "Lunch at Wakaii Catering" },
    { t: "12:00 PM", n: "Depart back to Batan" },
];

const SOUTH_STOPS: Stop[] = [
    { t: "9:00 AM", n: "South Tour leaves Siayanrock" },
    { n: "Chatapuyan View (Tobleron Mountains)" },
    { n: "White Beach & Blue Lagoon" },
    { n: "Mahatao Church" },
    { n: "Blank Book Archives" },
    { n: "Mahatao Spanish Lighthouse" },
    { n: "Racuh a Payaman (Marlboro Hills)" },
    { n: "BAMSO" },
    { n: "Alapad Rock Formation / Blow Ur Horn" },
    { n: "Tangayen Sky Bridge" },
    { n: "Madangay Point" },
    { n: "Muchung View" },
    { n: "Honesty Coffee Shop" },
    { n: "San Jose Church" },
    { n: "Ivana Lighthouse" },
    { n: "Dakay House" },
    { n: "Spanish Bridge" },
];


/* ---------- Days built from the blocks ---------- */

// Day 1: Arrival + South Batan
const ARRIVAL_SOUTH_DAY: Day = {
    title: "Arrival + South Batan Tour",
    stops: [
        { n: "Arrival at Batanes" },
        ...SOUTH_STOPS,
    ],
};


// North Batan on its own day
const NORTH_DAY: Day = {
    title: "North Batan Tour",
    stops: NORTH_STOPS,
};

// Sabtang alone
const SABTANG_DAY: Day = {
    title: "Sabtang Island Tour",
    stops: [
        ...SABTANG_STOPS,
        { t: "12:30 PM", n: "Arrive at Batan Island" },
    ],
};

// Sabtang in the morning, then back to Batan Island for North Batan
const SABTANG_NORTH_DAY: Day = {
    title: "Sabtang Island + North Batan Tour",
    stops: [
        ...SABTANG_DAY.stops,   // Sabtang stops + "12:30 PM Arrive at Batan Island"
        ...NORTH_STOPS,
    ],
};

const FREE_DAY: Day = {
    title: "Free Day — Optional Tours",
    stops: names([
        "Itbayat Island Tour",
        "Diura Fishing Village",
        "Cycling around Ivana",
    ]),
};

const DEPARTURE: Day = {
    title: "Departure",
    stops: names([
        "Breakfast",
        "Airport transfer",
        "Departure",
    ]),
};



/* ---------- Packages: only the day order differs ---------- */
export const PACKAGES: TourPackage[] = [
    {
        id: "3d2n",
        label: "3D2N",
        days: 3,
        nights: 2,
        price: "Price on request",
        plan: [
            ARRIVAL_SOUTH_DAY,
            SABTANG_NORTH_DAY,
            DEPARTURE,
        ],
    },

    {
        id: "4d3n",
        label: "4D3N",
        days: 4,
        nights: 3,
        price: "Price on request",
        plan: [
            ARRIVAL_SOUTH_DAY,
            SABTANG_DAY,
            NORTH_DAY,
            DEPARTURE,
        ],
    },

    {
        id: "5d4n",
        label: "5D4N",
        days: 5,
        nights: 4,
        price: "Price on request",
        plan: [
            ARRIVAL_SOUTH_DAY,
            SABTANG_DAY,
            NORTH_DAY,
            FREE_DAY,
            DEPARTURE,
        ],
    },
];



export const INCLUSIONS: string[] = [
    "AC room accommodation", "Airport transfer, round trip", "Breakfast and lunch meals",
    "Complete tours and entrance fees", "Tour guide and driver fees", "San Vicente port service",
    "Boat fare, round trip", "Registration at Tourism Sabtang", "All government fees",
    "AC van service / Cogon-roofed tricycle",
];

export const EXCLUSIONS: string[] = ["Airfare", "Dinner", "Personal expenses"];