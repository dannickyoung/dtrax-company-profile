import { asset } from "@/lib/base-path";
import { CERT, CLIENT_LOGO, LOGO, OFFICE, TEAM_PHOTO } from "@/decks/dtrax/data";

/* Copy follows "D'trax BD Deck Copy 2026" (client brief), as written.
   Photos, logos and certificates are reused from the company profile. */

export { CERT, LOGO, OFFICE, TEAM_PHOTO };

const project = (folder: string, file: string) => asset(`/assets/projects/${folder}/${file}`);

export const QR = asset("/assets/bd/ronald-goh-qr.png");

export const PHOTO = {
  poolsBreakout: project("singapore-pools", "s-5.jpg"),
  poolsLobby: project("singapore-pools", "s-6.jpg"),
  poolsPantry: project("singapore-pools", "s-2.jpg"),
  poolsMeeting: project("singapore-pools", "s-7.jpg"),
  poolsWork: project("singapore-pools", "s-12.jpg"),
  poolsCore: project("singapore-pools", "s-1.jpg"),
  groupIbLounge: project("group-ib", "g-1.jpg"),
  groupIbBar: project("group-ib", "g-9.jpg"),
  groupIbMeeting: project("group-ib", "g-6.jpg"),
  groupIbWork: project("group-ib", "g-5.jpg"),
  groupIbSocial: project("group-ib", "g-14.jpg"),
  sumitomoReception: project("sumitomo-chemical", "s-1.jpg"),
  sumitomoBreakout: project("sumitomo-chemical", "s-3.jpg"),
  sumitomoDining: project("sumitomo-chemical", "s-6.jpg"),
  sumitomoWork: project("sumitomo-chemical", "s-8.jpg"),
  sonyReception: project("sony-pictures", "1.jpg"),
  sonyViewing: project("sony-pictures", "2.jpg"),
  sonyMeeting: project("sony-pictures", "3.jpg"),
  sonyPantry: project("sony-pictures", "4.jpg"),
  edelmanMeeting: project("edelman", "3.jpg"),
  edelmanReception: project("edelman", "2.jpg"),
};

export const COVER = {
  title: "D’trax Design",
  question: "Moving into a new office, refreshing your current space or preparing to move out?",
  answer: "We bring design, costing and project delivery together, from the first brief to support after move-in.",
  tagline: "Imagine. Design. Inspire.",
};

export const EXPERIENCE = {
  intro: "D’trax Design designs and builds commercial offices in Singapore.",
  stats: [
    { value: 2003, prefix: "Since ", suffix: "", label: "Designing and building offices since 2003" },
    { value: 100, suffix: "+", label: "Offices delivered" },
    { value: 37, suffix: "%", label: "of our projects in the last five years came from returning clients" },
  ],
  leaders: [
    { name: "Ronald Goh", role: "Co-founder and Managing Director", body: "More than 25 years in corporate interior fit-out.", photo: TEAM_PHOTO.ronald, position: "50% 22%" },
    { name: "Jayne Ong", role: "Co-founder, Head of Costing and Operation", body: "More than 20 years in costing and operations, overseeing project costing, cost control and day-to-day operations.", photo: TEAM_PHOTO.jayne, position: "50% 14%" },
  ],
  buddy: "Every designer and project manager has a designated colleague who can step in when needed, keeping your project moving.",
};

export const WORKPLACE = {
  lead: "The best starting point for an office is understanding how people use it.",
  body: "Before design begins, we can arrange a workplace workshop with your staff and a specialist consultancy. Together, we explore how your teams work, collaborate and use their space, then use those insights to inform the layout.",
  note: "Workshops are available on request, with scope and fees agreed before engagement.",
};

export interface CaseStudy {
  name: string;
  area: string;
  location: string;
  summary: string[];
  award?: string;
  outcomes?: { value: number; suffix: string; label: string }[];
  quote?: { text: string; name: string; role: string };
  photos: string[];
  logo: string;
}

export const POOLS: CaseStudy = {
  name: "Singapore Pools",
  area: "10,000 sq ft",
  location: "Main Branch, Middle Road",
  summary: [
    "Working with Singapore Pools staff and Ideactio, we carried out a workplace workshop before starting the design.",
    "The project covered the lift lobby, central core, meeting rooms, directors’ offices and work areas.",
  ],
  outcomes: [
    { value: 12, suffix: " weeks", label: "Completed in 12 weeks, ahead of schedule" },
    { value: 85, suffix: "%", label: "Average post-move staff satisfaction score" },
  ],
  quote: {
    text: "The D’trax team conducted comprehensive stakeholder engagement sessions, ensuring users’ needs and feedback were thoughtfully incorporated into the refined design.",
    name: "Mohd Norhelmy Bin Ja’afar",
    role: "Director, Workplace and Sustainability Engineering, Singapore Pools",
  },
  photos: [PHOTO.poolsBreakout, PHOTO.poolsLobby, PHOTO.poolsMeeting, PHOTO.poolsWork, project("singapore-pools", "s-4.jpg"), project("singapore-pools", "s-13.jpg")],
  logo: CLIENT_LOGO["Singapore Pools"],
};

export const FITOUT = {
  lead: "Bring design, costing and construction together through one contract and one coordinated team.",
  body: "Our in-house quantity surveyors prepare project costs and manage them through completion, giving you a clear point of coordination for your office fit-out.",
};

export const GROUP_IB: CaseStudy = {
  name: "Group-IB",
  area: "7,500 sq ft",
  location: "Innovis, Fusionopolis",
  summary: ["An office combining spaces for focused work, meetings and social time."],
  award: "SIDA 2023 Bronze — Best in Workplace Design",
  quote: {
    text: "The team was able to meet and deliver our needs in a timely manner despite the challenging Covid-19 situation as well as time constraints, and we are extremely satisfied with their efforts.",
    name: "Sergey Nikitin",
    role: "CEO, Group-IB",
  },
  photos: [PHOTO.groupIbBar, PHOTO.groupIbLounge, PHOTO.groupIbMeeting, PHOTO.groupIbWork, project("group-ib", "g-8.jpg"), project("group-ib", "g-4.jpg")],
  logo: CLIENT_LOGO["Group-IB"],
};

export const PATH = [
  { title: "Understand your brief", body: "We learn how your teams work and what you want your office to achieve." },
  { title: "Develop the design", body: "We work with you to refine the layout and design for your approval." },
  { title: "Confirm the budget", body: "We prepare the project budget for your approval before construction begins." },
  { title: "Bring the space to life", body: "Our project team coordinates the site works. Digital site records and virtual walkthroughs help you follow progress remotely." },
  { title: "Prepare for move-in", body: "We coordinate handover of the completed office and support your move." },
  { title: "Support you after handover", body: "We remain your point of contact for covered defects and supplier warranty claims." },
];

export const ALTERATIONS = {
  lead: "Adapt your existing workplace as your team and ways of working evolve.",
  services: ["Reworking office layouts", "Adding rooms and enclosed spaces", "Rebuilding areas to suit new requirements"],
  close: "Together, we define the scope and plan how the works fit around your office’s day-to-day needs.",
};

export const MOVE = {
  lead: "Your new office and the space you are leaving are two parts of the same transition.",
  body: "D’trax provides both office fit-out and reinstatement services, so one team can coordinate the work across both locations.",
  close: "We help you plan the requirements for your new space alongside the reinstatement works for your existing office.",
};

export const SUMITOMO: CaseStudy = {
  name: "Sumitomo Chemical Asia",
  area: "12,188 sq ft",
  location: "Duo Tower, Fraser Street",
  summary: ["Additions, alterations and reinstatement works."],
  photos: [PHOTO.sumitomoReception, PHOTO.sumitomoBreakout, PHOTO.sumitomoDining, PHOTO.sumitomoWork, project("sumitomo-chemical", "s-9.jpg"), project("sumitomo-chemical", "s-2.jpg")],
  logo: CLIENT_LOGO["Sumitomo Chemical Asia"],
};

export const AFTERCARE = {
  lead: "As your team settles in, we remain available to help with covered defects, supplier warranty claims and requests for adjustments.",
  items: [
    "Rectification of defects covered by the agreed defects liability period",
    "Coordination with suppliers on applicable warranty claims",
    "Review of adjustment requests, with scope and any costs agreed before work begins",
  ],
};

export const SONY: CaseStudy = {
  name: "Sony Pictures",
  area: "7,800 sq ft",
  location: "Robinson Road",
  summary: [
    "The completed office included a branded feature wall, client areas and a viewing room with AV equipment and acoustic panels.",
    "D’trax continued to support the team with requested adjustments after completion.",
  ],
  quote: {
    text: "The team provided their full commitment and dedication throughout the process, overcame challenges along the way, completed the project on time, and continued with further support on any adjustments we requested.",
    name: "Brett D. Hogg",
    role: "Executive Vice President and Managing Director, Sony Pictures",
  },
  photos: [PHOTO.sonyReception, PHOTO.sonyViewing, PHOTO.sonyMeeting, PHOTO.sonyPantry, project("sony-pictures", "5.jpg")],
  logo: CLIENT_LOGO["Sony Pictures"],
};

/** Clients in the order the copy lists them. "Aramco Trading" uses the company profile's Aramco mark. */
export const CLIENTS: { name: string; logo: string }[] = [
  ["Sony Pictures", CLIENT_LOGO["Sony Pictures"]],
  ["Spotify", CLIENT_LOGO["Spotify"]],
  ["Procter & Gamble", CLIENT_LOGO["Procter & Gamble"]],
  ["Traveloka", CLIENT_LOGO["Traveloka"]],
  ["Mitsui Chemicals", CLIENT_LOGO["Mitsui Chemicals"]],
  ["Sumitomo Chemical Asia", CLIENT_LOGO["Sumitomo Chemical Asia"]],
  ["Aramco Trading", CLIENT_LOGO["Aramco Trading Singapore"]],
  ["Group-IB", CLIENT_LOGO["Group-IB"]],
  ["FIJI Water", CLIENT_LOGO["FIJI Water"]],
  ["Singapore Pools", CLIENT_LOGO["Singapore Pools"]],
  ["Union Bancaire Privée", CLIENT_LOGO["Union Bancaire Privée"]],
  ["HDFC Bank", CLIENT_LOGO["HDFC Bank"]],
  ["Edelman", CLIENT_LOGO["Edelman"]],
  ["Embecta", asset("/assets/logos/trim/embecta.png")],
  ["Digital Edge", asset("/assets/logos/trim/digital-edge.png")],
  ["SeaLead Shipping", CLIENT_LOGO["SeaLead Shipping"]],
  ["Singapore Kindness Movement", CLIENT_LOGO["Singapore Kindness Movement"]],
].map(([name, logo]) => ({ name, logo }));

export const CREDENTIALS = {
  safety: [
    { title: "ISO 45001:2018", body: "Occupational Health and Safety", image: CERT.iso },
    { title: "bizSAFE Star", body: "", image: CERT.bizsafe },
    { title: "BCA registration", body: "CR06 Interior Decoration and Finishing Works, Grade L3" },
  ],
  award: { title: "Singapore Interior Design Awards 2023", body: "Bronze — Best in Workplace Design", image: CERT.sida },
};

export const CONTACT = {
  lead: "Share your office location, approximate floor area, target date and what you would like to change.",
  next: "We’ll discuss your requirements and outline the next steps for your project.",
  name: "Ronald Goh",
  company: "D’trax Design",
  web: "www.dtrax.com.sg",
  address: ["10 Anson Road, #30-13 International Plaza", "Singapore 079903"],
};
