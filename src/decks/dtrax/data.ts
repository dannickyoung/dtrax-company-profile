import { asset } from "@/lib/base-path";

/* Copy follows "D'trax Master Deck Copy 2026" (client brief), in plain English. */

const photos = (folder: string, files: string[]) => files.map((file) => asset(`/assets/projects/${folder}/${file}`));
const numbered = (folder: string, count: number) => photos(folder, Array.from({ length: count }, (_, i) => `${i + 1}.jpg`));

export const LOGO = {
  dark: asset("/logo/dtrax-logo.png"),
};

export const OFFICE = {
  shelf: asset("/assets/office/office-1.jpg"),
  reception: asset("/assets/office/office-2.jpg"),
  meeting: asset("/assets/office/office-3.jpg"),
};

/** The founders' digital business cards. */
export const CARD_QR = {
  ronald: asset("/assets/team/qr/ronald-goh.png"),
  jayne: asset("/assets/team/qr/jayne-ong.png"),
};

export const TEAM_PHOTO = {
  foundersMeeting: asset("/assets/team/founders-2.jpg"),
  foundersBar: asset("/assets/team/founders-3.jpg"),
  foundersPortrait: asset("/assets/team/founders-1.jpg"),
  /** Ronald and Jayne at the materials table, mirrored so they face into the slide. */
  cover: asset("/assets/team/cover-studio.jpg"),
  ronald: asset("/assets/team/ronald-head.jpg"),
  /** A centred portrait crop of ronald.jpg for his profile slide. */
  ronaldProfile: asset("/assets/team/ronald-profile.jpg"),
  jayne: asset("/assets/team/jayne.jpg"),
};

export const HEADSHOT: Record<string, string> = {
  "Adrian Yen": asset("/assets/headshots/adrian-yen.jpg"),
  "Danny Chua": asset("/assets/headshots/danny-chua.jpg"),
  "Esther Choo": asset("/assets/headshots/esther-choo.jpg"),
  "Gilbert Penaflor": asset("/assets/headshots/gilbert-penaflor.jpg"),
  "Johnathan Ng": asset("/assets/headshots/johnathan-ng.jpg"),
  "Mi Mi Nay Win": asset("/assets/headshots/mi-mi-nay-win.jpg"),
  "Sandrey Lim": asset("/assets/headshots/sandrey-lim.jpg"),
  "Sapp Cheng": asset("/assets/headshots/sapp-cheng.jpg"),
  "Steven Leng": asset("/assets/headshots/steven-leng.jpg"),
  "Tan Swee Lan": asset("/assets/headshots/tan-swee-lan.jpg"),
  "Victoria Tan": asset("/assets/headshots/victoria-tan.jpg"),
  "Yong Yee Yee": asset("/assets/headshots/yong-yee-yee.jpg"),
};

/** Certificate scans with their scan frames cropped off (originals in media/originals/assets/certs). */
export const CERT = {
  iso: asset("/assets/certs/cert-iso-borderless.png"),
  bizsafe: asset("/assets/certs/cert-bizsafe-borderless.png"),
  sida: asset("/assets/certs/cert-sida-borderless.png"),
};

/** BCA's mark, for the BCA-registered contractor tile (there is no certificate image). */
export const BCA_LOGO = asset("/assets/logos/trim/bca.png");

/** 360° reality-capture frames from the Wabtec site, flattened to normal views and brightened. */
export const WABTEC = {
  early: asset("/assets/projects/wabtec/early.jpg"),
  finishing: asset("/assets/projects/wabtec/finishing.jpg"),
  progress: asset("/assets/projects/wabtec/progress.jpg"),
};

export const RENDER = {
  /** Grey model view, made from the design render (b.jpg). */
  sumitomo: asset("/assets/projects/sumitomo-chemical/model.jpg"),
};

/** Logos trimmed of surrounding whitespace (public/assets/logos/trim), so equal boxes give equal-looking marks. */
const logo = (file: string) => asset(`/assets/logos/trim/${file.replace(/\.(webp|jpg|png)$/, ".png")}`);
export const CLIENT_LOGO: Record<string, string> = {
  "Alibaba": logo("alibaba.png"),
  "Digital Edge": logo("digital-edge.webp"),
  "Embecta": logo("embecta.png"),
  "Hanwha": logo("hanwha.png"),
  "OMS Group": logo("oms-group.png"),
  "Wabtec": logo("wabtec.png"),
  "Aramco Trading Singapore": logo("aramco.png"),
  "Edelman": logo("edelman.png"),
  "Extreme Networks": logo("extreme-networks.png"),
  "FIJI Water": logo("fiji-water.webp"),
  "Grohe": logo("grohe.png"),
  "Group-IB (Innovis)": logo("group-ib.png"),
  "HDFC Bank": logo("hdfc-bank.png"),
  "Mitsui Chemicals": logo("mitsui-chemicals.webp"),
  "OCP": logo("ocp.png"),
  "Olam Food Ingredients": logo("olam.png"),
  "Procter & Gamble": logo("procter-gamble.webp"),
  "Shiseido": logo("shiseido.png"),
  "Singapore Kindness Movement": logo("singapore-kindness-movement.png"),
  "Singapore Pools": logo("singapore-pools.png"),
  "Singtel": logo("singtel.webp"),
  "SOTA": logo("sota.webp"),
  "Sony Pictures": logo("sony-pictures.png"),
  "Spotify": logo("spotify.png"),
  "Standard Chartered": logo("standard-chartered.webp"),
  "Sumitomo Chemical Asia": logo("sumitomo-chemical.webp"),
  "Tech-Component Resources": logo("tech-component-resources.png"),
  "The World Bank": logo("the-world-bank.webp"),
  "Traveloka": logo("traveloka.webp"),
  "Union Bancaire Privée": logo("union-bancaire-priv-e.webp"),
};

/** Focal points for photos whose key detail sits off-centre, so every crop keeps it in view. */
export const FOCUS: Record<string, string> = {
  /* Heroes: keep each office's signage inside the narrow track-record tiles and the wide banners. */
  [asset("/assets/projects/mitsui-chemicals/1.jpg")]: "15% 50%",
  [asset("/assets/projects/ocp/1.jpg")]: "75% 50%",
  /* Pantry: the OCP lettering runs right to the photo's left edge. */
  [asset("/assets/projects/ocp/2.jpg")]: "0% 50%",
  [asset("/assets/projects/embecta/1.jpg")]: "30% 50%",
  [asset("/assets/projects/fiji-water/f-1.jpg")]: "55% 35%",
  [asset("/assets/projects/digital-edge/d-1.jpg")]: "24% 32%",
  [asset("/assets/projects/singapore-pools/s-2.jpg")]: "74% 50%",
  [asset("/assets/projects/singapore-pools/s-3.jpg")]: "50% 40%",
  [asset("/assets/projects/traveloka/1.jpg")]: "78% 50%",
};

export interface Project {
  name: string;
  sector: string;
  location: string;
  area: string;
  type: string;
  award?: string;
  tagline: string;
  points: string[];
  photos: string[];
}

/** In the client's order. */
export const FEATURED: Project[] = [
  {
    name: "Singapore Pools", sector: "Government / Community", location: "210 Middle Road", area: "12,800 sq ft", type: "Design-and-build",
    tagline: "A revitalised workplace shaped by employee feedback.",
    points: ["Vibrant, engaging environment designed around staff needs and preferences", "Warm neutral tones in client-facing zones, softer pastels in the open office", "A collaborative process that gave staff a sense of ownership in the space"],
    photos: photos("singapore-pools", ["s-1.jpg", "s-2.jpg", "s-3.jpg", "s-4.jpg", "s-5.jpg", "s-6.jpg"]),
  },
  {
    name: "Traveloka", sector: "Travel / Technology", location: "Capital Tower, 168 Robinson Road", area: "7,200 sq ft", type: "Design-and-build",
    tagline: "An office with clear boundaries between spaces.",
    points: ["External, internal and service areas separated, so each works on its own", "Front-of-house that receives clients without them entering the work area", "Breakout and pantry by the windows for natural light, with direct access for deliveries"],
    photos: numbered("traveloka", 5),
  },
  {
    name: "Sumitomo Chemical Asia", sector: "Chemicals / Industrial", location: "Duo Tower, 3 Fraser Street", area: "12,188 sq ft", type: "A&A and reinstatement",
    tagline: "Design driven by how the company works.",
    points: ["Began with a study of how teams interact and move between tasks through the day", "Space planned around operational workflow", "A warm material palette, across one of our largest recent fit-outs"],
    photos: photos("sumitomo-chemical", ["s-1.jpg", "s-2.jpg", "s-3.jpg", "s-4.jpg", "s-5.jpg", "s-6.jpg"]),
  },
  {
    name: "Embecta", sector: "Healthcare / Medical Devices", location: "The Concourse, 300 Beach Road", area: "7,000 sq ft", type: "Design-and-build",
    tagline: "A smooth, flowing space softened with biophilic design.",
    points: ["Curved detailing for a smooth, flowing look throughout", "Artificial moss wall bringing natural elements into the workspace", "Biophilic features that soften the hard surfaces of a typical office"],
    photos: numbered("embecta", 5),
  },
  {
    name: "Mitsui Chemicals", sector: "Chemicals / Industrial", location: "Harbourfront Tower One, 3 Harbourfront Place", area: "10,000 sq ft", type: "Design-and-build",
    tagline: "A nature-inspired workplace built for activity-based working.",
    points: ["Concrete vinyl, wood-grain panelling and a curated moss wall inspired by nature", "Self-check-in system and activity-based zones in response to the client brief", "A neutral palette with vibrant accents bringing energy into meeting spaces"],
    photos: numbered("mitsui-chemicals", 5),
  },
  {
    name: "OMS ROC", sector: "Marine / Subsea Infrastructure", location: "Excalibur Centre, 71 Ubi Crescent", area: "2,000 sq ft", type: "Design-and-build",
    tagline: "A bold, futuristic space inspired by fibre-optic networks.",
    points: ["Metallic finishes and reflective surfaces echoing the technical nature of the business", "Optical-fibre and programmable RGB lighting symbolising data transmission", "An immersive environment mirroring the invisible networks OMS builds beneath land and sea"],
    photos: photos("oms-group", ["-dsf0008.jpg", "-dsf0397.jpg", "-dsf0144.jpg", "-dsf0174.jpg", "-dsf0183.jpg", "-dsf0208.jpg"]),
  },
  {
    name: "Group-IB (Innovis)", sector: "Technology / Cybersecurity", location: "Innovis, 2 Fusionopolis Way", area: "7,500 sq ft", type: "Design-and-build",
    award: "SIDA 2023 Bronze, Best in Workplace Design",
    tagline: "A dynamic, versatile HQ built for collaboration.",
    points: ["Multi-use zones that switch between focused work, meetings and social time", "A social bar that doubles as a working and lunch space during the day", "Frosted glass-brick signage wall that glows into a sculptural feature when backlit"],
    photos: photos("group-ib-innovis", ["gi-1.jpg", "gi-2.jpg", "gi-3.jpg", "gi-4.jpg", "gi-7.jpg", "gi-6.jpg"]),
  },
  {
    name: "Sony Pictures", sector: "Media / Entertainment", location: "77 Robinson Road", area: "7,800 sq ft", type: "Design-and-build",
    tagline: "A cohesive, high-impact space for a global media brand.",
    points: ["Backlit feature wall with customised Sony branding for a striking first impression", "Monochromatic client area accented by film posters and a signature red chair", "Viewing room with high-performance AV and acoustic panelling drawn from the Sony logo"],
    photos: numbered("sony-pictures", 5),
  },
  {
    name: "Digital Edge", sector: "Technology / Data Centres", location: "Suntec City Tower 3", area: "5,000 sq ft", type: "Design-and-build",
    tagline: "Branding you can walk through.",
    points: ["Corporate colours and branding carried through the whole office", "A bold orange feature wall that brings the brand into the reception", "A clean, modern layout for a tech company"],
    photos: photos("digital-edge", ["d-1.jpg", "d-2.jpg", "d-3.jpg", "d-4.jpg", "d-5.jpg", "d-6.jpg"]),
  },
  {
    name: "OCP Nutricrops", sector: "Agriculture / Fertilisers", location: "Springleaf Tower, 3 Anson Road", area: "2,486 sq ft", type: "Design-and-build",
    tagline: "Where agritech meets a greener way to work.",
    points: ["A workspace built to be modern, agile and sustainable", "Design that reflects the company’s focus on innovation and sustainability", "Spaces that support collaboration and productivity"],
    photos: numbered("ocp", 6),
  },
  {
    name: "Edelman", sector: "Public Relations / Communications", location: "Beach Centre, 15 Beach Road", area: "5,000 sq ft", type: "Additions & Alterations",
    tagline: "A dull space turned bright and better used.",
    points: ["Brightened throughout to lift staff mood and productivity", "Underused areas reworked, so each space is better used", "Boardroom rebuilt to reflect the brand, with acoustic and double-glazed glass for sound insulation"],
    photos: numbered("edelman", 5),
  },
  {
    name: "FIJI Water", sector: "FMCG / Consumer", location: "78 Shenton Way", area: "6,800 sq ft", type: "Design-and-build",
    tagline: "An office that feels like the water it’s named for.",
    points: ["Soft blue tones drawn from ocean water, balanced with warm earthy finishes", "Curved architectural elements and layered textures that soften the corporate feel", "A calm, refreshing atmosphere that reinforces the FIJI Water brand"],
    photos: photos("fiji-water", ["f-1.jpg", "f-2.jpg", "f-3.jpg", "f-4.jpg", "f-5.jpg", "f-6.jpg"]),
  },
];

/** A featured project by name, for slides that borrow one of its photographs. */
export const featured = (name: string) => FEATURED.find((project) => project.name === name)!;

export const IN_PROGRESS = [
  { name: "Hanwha Engine, Hanwha Ocean", sector: "Marine / Shipbuilding", type: "Design-and-build" },
  { name: "Wabtec", sector: "Engineering / Manufacturing", type: "Design-and-build" },
];

/** Recent projects, 2024 to 2026. Shown as logos only. Traveloka (L10 and L11) appears once. */
export const RECENT = [
  "Traveloka", "Singapore Kindness Movement", "OCP", "Tech-Component Resources", "Procter & Gamble", "Union Bancaire Privée", "Wabtec", "OMS Group",
  "Olam Food Ingredients", "Aramco Trading Singapore", "HDFC Bank", "Digital Edge", "Extreme Networks", "Edelman", "Hanwha",
];

export const STAGES = [
  { title: "Brief & feasibility", body: "Project and site evaluation, space planning, and workplace strategy. We study how your teams work before we design where they work." },
  { title: "Design development", body: "Concept through detailed design, developed around your brand and the way your people work." },
  { title: "Costing & documentation", body: "In-house quantity surveying, budgeting, and full design and contract documentation. Budgets are set by our own team, not outsourced." },
  { title: "Construction & build", body: "Full fit-out, run on site by a dedicated project team, under our ISO 45001 and bizSAFE Star safety systems.", note: "See progress without being on site." },
  { title: "Handover & move", body: "Move management and handover to a completed, move-in-ready space." },
  { title: "Aftercare", body: "Defects and snagging follow-through during the defects liability period, plus warranty support with supplier coordination." },
];

export const SERVICES = [
  { title: "Design & consultancy", items: ["Project and site evaluation", "Space planning", "Consultancy services"] },
  { title: "Strategy", items: ["Full interior design turnkey solutions", "Preliminary and detailed budgeting", "Design and contract documentation"] },
  { title: "Construction", items: ["Project management", "Move management", "Post-occupancy maintenance"] },
];

export interface Leader {
  name: string;
  role: string;
  photo: string;
  photoPosition?: string;
  experience: string;
  qualifications?: string;
  specialism: string;
  projects: string[];
}

export const RONALD: Leader = {
  name: "Ronald Goh", role: "Managing Director", photo: TEAM_PHOTO.ronaldProfile, photoPosition: "50% 40%",
  experience: "30+ years in corporate interior fit-out",
  specialism: "Translating clients' commercial objectives into fit-out decisions, and building long-term client relationships",
  projects: ["Group-IB (Innovis)", "Sony Pictures", "Mitsui Chemicals", "FIJI Water", "Edelman", "Singapore Pools", "Olam Food Ingredients", "Sumitomo Chemical Asia", "Procter & Gamble", "Singapore Kindness Movement"],
};

/** Brief has no profile copy for Jayne yet; these lines need the client's confirmation. */
export const JAYNE: Leader = {
  name: "Jayne Ong", role: "Head of Operation", photo: TEAM_PHOTO.jayne, photoPosition: "50% 14%",
  experience: "Co-founded D’trax in 2003",
  specialism: "Costing and operations: budgets set in-house, from the first estimate to the final account",
  projects: ["Traveloka", "Embecta", "Group-IB (Innovis)", "Sony Pictures", "Mitsui Chemicals"],
};

export const LEADERS: Leader[] = [
  {
    name: "Esther Choo", role: "Design Director", photo: HEADSHOT["Esther Choo"], photoPosition: "50% 15%",
    experience: "28+ years of professional practice",
    qualifications: "Diploma in Interior Design, Nanyang Academy of Fine Arts",
    specialism: "From early feasibility and space strategy through to detailed, buildable design, across corporate, hospitality and retail",
    projects: ["Standard Chartered", "Spotify", "Traveloka", "Singapore Pools", "Wabtec", "Embecta", "Mitsui Chemicals", "Union Bancaire Privée", "Digital Edge"],
  },
  {
    name: "Sandrey Lim", role: "Project Director", photo: HEADSHOT["Sandrey Lim"], photoPosition: "50% 15%",
    experience: "32+ years in design-and-build workplace delivery",
    qualifications: "Specialist Diploma in Construction Productivity (BCA); Diploma in Personnel Management; bizSAFE Level 2",
    specialism: "End-to-end delivery of complex workplace transformations, coordinating design, cost and construction through to handover",
    projects: ["Alibaba", "Grohe", "The World Bank", "SOTA", "Shiseido"],
  },
];

/** Organisation chart. Founders sit at the centre; teams ring them, and each team's people ring their team. */
export const ORG_TEAMS: { name: string; members: { name: string; role: string }[] }[] = [
  { name: "Project Team", members: [{ name: "Sandrey Lim", role: "Project Director" }, { name: "Steve Tan", role: "Senior Project Manager" }, { name: "Erick Chng", role: "Construction Manager" }, { name: "Adrian Yen", role: "Senior Project Executive" }] },
  { name: "BD Team", members: [{ name: "Johnathan Ng", role: "Business Development Manager" }] },
  { name: "Design Team", members: [{ name: "Esther Choo", role: "Design Director" }, { name: "Tan Swee Lan", role: "Senior CAD Designer" }, { name: "Sapp Cheng", role: "Interior Designer" }, { name: "Gilbert Penaflor", role: "3D Designer" }] },
  { name: "HR / Admin Operation", members: [{ name: "Victoria Tan", role: "Senior HR Executive" }, { name: "Mi Mi Nay Win", role: "Admin & Account Executive" }] },
  { name: "Costing Team", members: [{ name: "Danny Chua", role: "Senior Quantity Surveyor" }] },
];

export const TESTIMONIALS = [
  { client: "Group-IB (Innovis)", quote: "The team was able to meet and deliver our needs in a timely manner despite the challenging Covid-19 situation as well as time constraints, and we are extremely satisfied with their efforts.", name: "Sergey Nikitin", role: "CEO, Group-IB (Innovis)" },
  { client: "Singapore Pools", quote: "The team demonstrated professionalism, technical competence, and a strong understanding of our operational and user requirements. A post-occupancy survey with end-users reflected an average satisfaction score of 85%, and their professionalism and reliability make them a recommended partner for similar design-and-build projects.", name: "Mohd Norhelmy Bin Ja’afar", role: "Director, Workplace & Sustainability Engineering, Singapore Pools" },
  { client: "Sumitomo Chemical Asia", quote: "Thanks to the designer’s creativity and practical approach, our office has been transformed into a more vibrant and productive environment. Although there were a few challenges along the way, the dedication and professionalism of the D’trax team ensured the project was executed smoothly and delivered on schedule.", name: "Dennis Lim", role: "General Manager, GA, Regional HR and Sustainability, Sumitomo Chemical Asia" },
  { client: "Mitsui Chemicals", quote: "We would like to thank you for your assistance in completing our office renovation on time and within budget. Your team was well-organised, capable, and displayed flexibility catering to our requests. D'trax's expertise, commitment and follow-through throughout the entire project was exceptional.", name: "Thomas Lin", role: "Senior Manager, IT and Admin, Mitsui Chemicals" },
  { client: "Sony Pictures", quote: "The team provided their full commitment and dedication throughout the process, overcame challenges along the way, completed the project on time, and continued with further support on any adjustments we requested.", name: "Brett D. Hogg", role: "Executive Vice President and Managing Director, Sony Pictures" },
];

export const CERTIFICATIONS = [
  { title: "ISO 45001:2018", body: "Occupational Health and Safety Management System, for interior design, addition and alteration, and renovation works. Certified February 2024.", image: CERT.iso },
  { title: "bizSAFE Star", body: "The highest bizSAFE level, awarded by the Workplace Safety and Health Council. Valid to February 2027.", image: CERT.bizsafe },
  { title: "BCA-registered contractor", body: "CR06, Interior Decoration and Finishing Works, Grade L3. Valid to March 2027." },
  { title: "SIDA 2023 Bronze", body: "Best in Workplace Design. Singapore Interior Design Awards, Completed Category (floor area 500 sqm and above), for the Group-IB (Innovis) office.", image: CERT.sida },
];
