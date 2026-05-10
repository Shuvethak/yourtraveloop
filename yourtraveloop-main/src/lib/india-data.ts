export type Destination = {
  id: string;
  name: string;
  region: string;
  emoji: string;
  tagline: string;
  vibes: string[];
  fromInr: number;
};

export const INDIA_DESTINATIONS: Destination[] = [
  { id: "goa",        name: "Goa",        region: "West",      emoji: "🏖️", tagline: "Sun, sand & susegad",        vibes: ["Beach", "Party"],     fromInr: 18000 },
  { id: "manali",     name: "Manali",     region: "Himachal",  emoji: "🏔️", tagline: "Snow peaks & cafés",         vibes: ["Mountains", "Adventure"], fromInr: 22000 },
  { id: "jaipur",     name: "Jaipur",     region: "Rajasthan", emoji: "🕌", tagline: "Pink palaces & bazaars",       vibes: ["Heritage", "Culture"], fromInr: 16000 },
  { id: "kerala",     name: "Kerala",     region: "South",     emoji: "🛶", tagline: "Backwaters & Ayurveda",         vibes: ["Nature", "Wellness"], fromInr: 28000 },
  { id: "leh",        name: "Leh-Ladakh", region: "North",     emoji: "🏍️", tagline: "Moonscapes at 11,000 ft",      vibes: ["Adventure", "Roadtrip"], fromInr: 42000 },
  { id: "varanasi",   name: "Varanasi",   region: "UP",        emoji: "🪔", tagline: "Ghats, aartis & old city",     vibes: ["Spiritual", "Culture"], fromInr: 14000 },
  { id: "andaman",    name: "Andaman",    region: "Islands",   emoji: "🐠", tagline: "Reefs & white sand",            vibes: ["Beach", "Diving"], fromInr: 38000 },
  { id: "rishikesh",  name: "Rishikesh",  region: "Uttarakhand", emoji: "🧘", tagline: "Yoga capital of the world",  vibes: ["Wellness", "Adventure"], fromInr: 12000 },
  { id: "darjeeling", name: "Darjeeling", region: "Bengal",    emoji: "🍵", tagline: "Tea gardens & toy train",       vibes: ["Mountains", "Romantic"], fromInr: 19000 },
  { id: "hampi",      name: "Hampi",      region: "Karnataka", emoji: "🪨", tagline: "Boulders & lost empire",        vibes: ["Heritage", "Backpacker"], fromInr: 13000 },
  { id: "udaipur",    name: "Udaipur",    region: "Rajasthan", emoji: "🏰", tagline: "City of lakes",                 vibes: ["Romantic", "Heritage"], fromInr: 21000 },
  { id: "shillong",   name: "Shillong",   region: "Meghalaya", emoji: "🌧️", tagline: "Scotland of the East",         vibes: ["Nature", "Music"], fromInr: 24000 },
];

export const TRIP_VIBES = [
  { id: "adventure", label: "Adventure",   emoji: "🧗" },
  { id: "relax",     label: "Relax",       emoji: "🌿" },
  { id: "culture",   label: "Culture",     emoji: "🛕" },
  { id: "foodie",    label: "Foodie",      emoji: "🍛" },
  { id: "romantic",  label: "Romantic",    emoji: "💞" },
  { id: "family",    label: "Family",      emoji: "👨‍👩‍👧" },
  { id: "solo",      label: "Solo",        emoji: "🎒" },
  { id: "luxury",    label: "Luxury",      emoji: "🥂" },
];

export const STARTER_STOPS: Record<string, Array<{ day: number; title: string; location: string; time: string; category: string; cost: number }>> = {
  goa: [
    { day: 1, title: "Land at Dabolim, check-in at Anjuna",  location: "Anjuna",     time: "14:00", category: "transit",    cost: 4500 },
    { day: 1, title: "Sunset at Vagator Beach",               location: "Vagator",    time: "18:00", category: "sightseeing",cost: 0 },
    { day: 1, title: "Dinner at Thalassa",                    location: "Vagator",    time: "20:30", category: "food",       cost: 2200 },
    { day: 2, title: "Dudhsagar Falls trek",                  location: "Mollem",     time: "08:00", category: "adventure",  cost: 3500 },
    { day: 2, title: "Saturday Night Market",                 location: "Arpora",     time: "20:00", category: "shopping",   cost: 1200 },
    { day: 3, title: "Old Goa churches & spice plantation",   location: "Old Goa",    time: "10:00", category: "culture",    cost: 1800 },
  ],
  jaipur: [
    { day: 1, title: "Amber Fort sunrise visit",     location: "Amer",       time: "07:00", category: "sightseeing", cost: 600 },
    { day: 1, title: "Lunch at LMB",                  location: "Johari Bzr", time: "13:00", category: "food",        cost: 900 },
    { day: 1, title: "Hawa Mahal & City Palace",      location: "Old City",   time: "15:30", category: "culture",     cost: 700 },
    { day: 2, title: "Nahargarh sunrise",             location: "Nahargarh",  time: "06:00", category: "sightseeing", cost: 500 },
    { day: 2, title: "Block-print workshop",          location: "Sanganer",   time: "11:00", category: "culture",     cost: 1500 },
  ],
};
