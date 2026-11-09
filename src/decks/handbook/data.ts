import { asset } from "@/lib/base-path";
import { TEAM_PHOTO } from "@/decks/dtrax/data";
import type { SketchName } from "@/components/deck/vectors";

/*
  Copy follows "D'trax Handbook copy: Updated 2026" (client brief) as written.
  It carries HR and legal weight: do not add policies, numbers or entitlements here
  that are not in the client's copy. Text wrapped in **double asterisks** is the
  client's own emphasis.
*/

const project = (path: string) => asset(`/assets/projects/${path}`);

export const PHOTO = {
  reception: asset("/assets/office/office-2.jpg"),
  shelf: asset("/assets/office/office-1.jpg"),
  meeting: asset("/assets/office/office-3.jpg"),
  ronaldPortrait: asset("/assets/team/ronald-portrait.jpg"),
  foundersStudio: TEAM_PHOTO.foundersPortrait,
  foundersMeeting: TEAM_PHOTO.foundersMeeting,
  foundersBar: TEAM_PHOTO.foundersBar,
  waves: project("fiji-water/e-1.jpg"),
  boardroom: project("singapore-pools/s-10.jpg"),
  breakout: project("sumitomo-chemical/s-4.jpg"),
  quietRoom: project("digital-edge/d-6.jpg"),
  workstations: project("digital-edge/d-3.jpg"),
  conference: project("traveloka/3.jpg"),
  pantry: project("mitsui-chemicals/2.jpg"),
};

export type Tone = "pink" | "blue" | "lime";

export interface Chapter {
  id: string;
  n: string;
  label: string;
  tone: Tone;
  /** One line for the divider page, taken from the chapter's own copy. */
  line: string;
  sketch: SketchName;
}

export const CHAPTERS = [
  { id: "welcome", n: "01", label: "Welcome", tone: "lime", line: "We're glad to have you here.", sketch: "door" },
  { id: "about", n: "02", label: "About this handbook", tone: "blue", line: "A practical guide to how D'trax works.", sketch: "book" },
  { id: "mission", n: "03", label: "Mission, vision and values", tone: "pink", line: "Think clearly, speak plainly, and finish what you start.", sketch: "compass" },
  { id: "conduct", n: "04", label: "Code of conduct", tone: "lime", line: "The standards expected of everyone at D'trax.", sketch: "scales" },
  { id: "policies", n: "05", label: "Workplace policies", tone: "blue", line: "Leave and claims, at a high level.", sketch: "calendar" },
  { id: "safety", n: "06", label: "Workplace safety and health", tone: "pink", line: "Safety is everyone's responsibility.", sketch: "helmet" },
  { id: "pdpa", n: "07", label: "Personal data and PDPA", tone: "lime", line: "Personal data is used only for legitimate business purposes.", sketch: "shield" },
  { id: "it", n: "08", label: "IT, email, device and acceptable use", tone: "blue", line: "Use company systems responsibly, and protect company and client information.", sketch: "laptop" },
  { id: "team", n: "09", label: "Team and organisation", tone: "pink", line: "No job depends on one person.", sketch: "people" },
  { id: "emergency", n: "10", label: "Emergency contacts and incident escalation", tone: "lime", line: "Prioritise safety, and report promptly.", sketch: "exit" },
  { id: "close", n: "11", label: "Close", tone: "blue", line: "Read it properly, keep it handy, and come back to it when you're unsure.", sketch: "key" },
] as const satisfies readonly Chapter[];

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/* 01 · Welcome — the Managing Director's letter */

export const WELCOME: {
  headline: string;
  paragraphs: string[];
  signOff: string;
  name: string;
  role: string;
  /**
   * Ronald's handwritten signature, as a transparent PNG
   * (from Vectors/Ronald's Signature.PNG, white knocked out).
   */
  signature?: string;
} = {
  headline: "We're glad to have you here.",
  paragraphs: [
    "Most welcome letters open with the rules. We'd rather start with the work.",
    "The spaces we build are real. People use them every day. They work in them, meet in them, pass through them without a second thought. Long after handover, the work is still there, still being used. Not many jobs let you point at something and say you built that. **This one does.**",
    "We do fit-out work that has to hold up after handover, not just look good in the render. It rewards people who think clearly, stay steady, and finish what they start. When we commit, we deliver. When something goes sideways, and it will, we stay calm, sort it out, and work through it together. **No one here gets left to figure it out alone.**",
    "You are not expected to know everything on day one. Effort, curiosity, and a willingness to learn are what matter. Take the time to understand how the work flows before you speed up. Ask when you're unsure, no one here minds a good question. **Pay attention to the details, because the details are the work.**",
    "Somewhere down the line you'll walk past a space we built and know your hands were on it. That's the job, and we're glad you're here to do it with us.",
  ],
  signOff: "Welcome to D'trax.",
  name: "Ronald Goh",
  role: "Managing Director",
  signature: asset("/assets/handbook/ronald-signature.png"),
};

/* 02 · About this handbook */

export const ABOUT = {
  paragraphs: [
    { label: "Purpose", text: "This handbook sets out how D'trax works, including our standards of conduct, workplace practices, and the day-to-day expectations that apply across the company. As we grow, we want these expectations to remain clear, consistent, and applied fairly to everyone." },
    { label: "Who it applies to", text: "This handbook applies to all employees of D'trax unless otherwise stated. Employees may be engaged under different employment arrangements, and certain terms, benefits, entitlements, or work arrangements may vary depending on role, employment status, length of service, applicable laws, or individual contractual terms." },
    { label: "Your contract", text: "This handbook is a practical guide and does not form part of any contract of employment unless expressly stated otherwise. Where any provision in this handbook differs from an employee's employment contract, the employment contract will prevail." },
    { label: "Roles across teams", text: "Some roles support multiple teams or functions. Where this occurs, reporting lines, authority levels, responsibilities, and approval requirements remain subject to the employee's job scope and employment contract." },
    { label: "Updates", text: "The company may amend, update, or withdraw policies in this handbook from time to time to reflect changes in business needs, operational requirements, or legal and regulatory obligations. Employees are responsible for referring to the latest approved version and should seek clarification whenever needed." },
  ],
  issuedBy: "Issued by Management",
  company: "D’trax Design Pte Ltd",
};

/* 03 · Mission, vision and values */

export const FOUNDERS_QUOTE = {
  quote: "Good work is simple. Think clearly, speak plainly, and finish what you start.",
  by: "Ronald & Jayne, Founders",
};

export const MISSION = "We do work our clients can rely on. We design and build with care, think clearly, and make practical decisions that hold up on site.";
export const VISION = "To be known for honest work, consistent delivery, and teams that take ownership and follow through, even under pressure.";

export const VALUES = [
  { title: "Think clearly.", body: "We plan the work and make decisions deliberately. There is no room for guesswork where clarity is possible." },
  { title: "Speak plainly.", body: "We are direct with clients, vendors, and each other. We raise issues early, before they become bigger problems." },
  { title: "Finish what we start.", body: "We take ownership of the outcome, not just the task. When we commit, we follow through." },
];
export const VALUES_INTRO = "Three principles guide how we work.";
export const VALUES_STANDARD = { lead: "Underneath all three is one simple standard:", strong: "we build spaces that work in the real world. That is what everything is measured against." };

/* 04 · Code of conduct */

export const CONDUCT_INTRO = "This Code sets out the standards expected of everyone at D'trax. Employees are expected to comply with applicable laws and company policies. Breaches may result in disciplinary action in accordance with company procedures.";

export const CONDUCT: { title: string; body: string[] }[] = [
  { title: "Professional conduct", body: ["Act with honesty, integrity, and professionalism at all times. How we conduct ourselves reflects on the company and contributes to the trust placed in us by colleagues, clients, and business partners. Employees are expected to maintain appropriate standards of behaviour and professionalism in all work-related activities."] },
  { title: "Compliance with law and policy", body: ["Employees are expected to comply with Singapore law and all applicable company policies. These requirements help promote safe, fair, and responsible conduct across the company."] },
  { title: "Confidentiality", body: ["Protect all non-public information relating to the company, clients, and partners. Confidentiality obligations continue during and after employment."] },
  { title: "Conflict of interest", body: ["Employees must promptly disclose any actual or potential conflict of interest to their Reporting Officer or the company, and avoid situations where personal interests may improperly influence their work or decisions."] },
  { title: "Gifts and benefits", body: ["Employees must not accept gifts, favours, or benefits that could influence, or appear to influence, their professional judgement or decisions. Token or customary gifts of nominal value may be accepted where appropriate but must be disclosed to management. Cash or cash equivalents must not be accepted."] },
  { title: "Outside employment", body: ["Employees must obtain prior written approval from management before undertaking any outside employment, consultancy, or business activity. Such activities must not create a conflict of interest, interfere with the employee's duties, or adversely affect the interests of the company.", "Passive investments or shareholdings are generally permitted provided they do not give rise to an actual or potential conflict of interest."] },
  { title: "Use of company property and information", body: ["Company resources, data, and equipment are for authorised business purposes and must be used responsibly."] },
  { title: "Workplace conduct and respect", body: ["D'trax is committed to a workplace where everyone is treated with dignity and respect. Harassment, discrimination, bullying, intimidation, and other inappropriate behaviour are not tolerated. Employees should raise concerns through their Reporting Officer, HR, or Management. Reports will be handled appropriately, and retaliation against anyone who raises a genuine concern in good faith will not be tolerated."] },
  { title: "Attendance and punctuality", body: ["Our work requires reliability and consistent attendance. Employees are expected to observe their working hours and inform their Reporting Officer as early as possible if they expect to be late or unable to report for work. Repeated or unexplained lateness or absence may be addressed in accordance with the employment contract and applicable company policies."] },
  { title: "Performance and development", body: ["Employees are expected to perform their duties to the required standards and contribute positively to the team. Performance may be reviewed periodically, and employees are encouraged to seek feedback and develop their skills and capabilities."] },
  { title: "Disciplinary action", body: ["Employees are expected to comply with this handbook, their employment contract, and applicable laws. Where standards are not met, or where misconduct occurs, the company may investigate the matter and take appropriate disciplinary action, including warnings, suspension, or termination where justified. The level of action taken will depend on the circumstances and seriousness of the matter."] },
  { title: "Raising concerns", body: ["Employees who have concerns relating to workplace conduct, safety, discrimination, harassment, or other inappropriate behaviour should raise them with their Reporting Officer, HR, or Management. Reports will be handled appropriately and as confidentially as practicable."] },
];

/* 05 · Workplace policies */

export const POLICIES_INTRO = "Leave and claims follow the Employment Act, your employment contract, and prevailing company policies. This section is a high-level overview. Eligibility depends on role, length of service, and statutory criteria, and not every leave type applies to every employee.";

export interface LeaveRow {
  type: string;
  basis: string;
  notes: string;
  /** Only where the client's copy states a figure. */
  figure?: { value: number; unit: string };
}

export const LEAVE: LeaveRow[] = [
  { type: "Annual leave", basis: "Contract", notes: "Pro-rated by start date, subject to approval." },
  { type: "Sick leave (outpatient)", basis: "Employment Act", notes: "14 days per year, paid. MC generally required. Up to 2 days per year may be taken without an MC as a company benefit, subject to timely notice to your RO and approval.", figure: { value: 14, unit: "days per year" } },
  { type: "Hospitalisation leave", basis: "Employment Act", notes: "Statutory entitlement, valid documentation required." },
  { type: "Family leave", basis: "Singapore law", notes: "Childcare, extended childcare, parental, and other statutory family leave, subject to eligibility." },
  { type: "Compassionate leave", basis: "Company benefit", notes: "2 days, available after passing probation, for an immediate family member. Supporting proof required.", figure: { value: 2, unit: "days" } },
  { type: "Marriage leave", basis: "Company benefit", notes: "Discretionary, subject to eligibility and operational needs." },
  { type: "Birthday leave", basis: "Company benefit", notes: "One day, discretionary, subject to eligibility and operational needs.", figure: { value: 1, unit: "day" } },
  { type: "Unpaid leave", basis: "Management approval", notes: "Case by case." },
];

export const LEAVE_BENEFITS_NOTE = "Marriage leave, birthday leave, compassionate leave, and sick leave taken without an MC are company benefits rather than statutory entitlements. The company may amend, suspend, or withdraw them at its discretion.";

/** The claims paragraph, laid out in the order a claim travels. Wording is the client's. */
export const CLAIM_STEPS = [
  { title: "Submit through HRMS", body: "All claims must be submitted through the HRMS platform. Claims submitted through other channels will not be processed." },
  { title: "Attach the receipt and purpose", body: "Each claim must be supported by the appropriate original or digital receipt and include a clear description of the purpose of the expense." },
  { title: "Approval", body: "Claims are subject to approval by the employee's Reporting Officer and, where applicable, review by the administration team." },
  { title: "Payment", body: "Approved reimbursements will generally be paid together with the monthly salary." },
];
export const CLAIMS_REJECTED = "Claims that are incomplete, unsupported, or do not meet the applicable requirements may be rejected.";
export const ALLOWANCES = "Allowances and other benefits, where applicable, will be provided in accordance with the employee's employment contract and/or prevailing company policies, and may be reviewed or revised from time to time.";

/* 06 · Workplace safety and health */

export const SAFETY_INTRO = "We work in both office and live-site environments, each of which presents different risks. D'trax is committed to providing a safe and healthy working environment and appropriate systems of work. Employees are expected to take reasonable care of their own safety and health and that of those around them, and to comply with applicable workplace safety and health requirements.";
/** The certificate scan with its black scan frame cropped off. */
export const BIZSAFE_CERT = asset("/assets/certs/cert-bizsafe-borderless.png");
export const BIZSAFE = "D'trax is bizSAFE Star certified. This reflects the standard we work to, and maintaining that standard is a collective responsibility.";
export const SAFETY_LEAD = "Safety is everyone's responsibility. Employees must work safely, follow applicable safe work procedures, use required personal protective equipment (PPE), and report hazards, near-misses, injuries, or unsafe conditions promptly.";
/** The four duties named in SAFETY_LEAD, one per tile. */
export const SAFETY_DUTIES = ["Work safely", "Follow applicable safe work procedures", "Use required personal protective equipment (PPE)", "Report hazards, near-misses, injuries, or unsafe conditions promptly"];
export const SAFETY_SITE = "Additional project-specific safety requirements, risk assessments, and site rules will be communicated before work begins and must be followed at all times.";
export const SAFETY_FIRST_AID = "First-aid facilities and emergency arrangements are maintained by the company and communicated to employees as required.";

/* 07 · Personal data and PDPA */

export const PDPA = [
  "D'trax collects and uses personal data relating to employees, clients, vendors, and business partners. Employees who handle personal data must protect it and comply with the Personal Data Protection Act (PDPA).",
  "Personal data may only be accessed, used, shared, and retained for legitimate business purposes. Employees must safeguard personal data, prevent unauthorised disclosure, and report any suspected data breach immediately to the Data Protection Officer (DPO).",
  "Company and client information must not be removed, copied, or disclosed without authorisation. Confidentiality and data protection obligations continue after employment ends.",
];
export interface Person { name: string; role: string; photo?: string }

/** photo: Victoria's headshot is still to come; set it here (e.g. asset("/assets/headshots/victoria-tan.jpg")) and the PDPA page shows it in place of her initials. */
export const DPO: Person = { name: "Victoria Tan", role: "Data Protection Officer" };

/* 08 · IT, email, device and acceptable use */

export const IT_INTRO = "D'trax provides email, devices, systems, and business applications to support work. Employees are expected to use them responsibly and protect company and client information.";
export const IT_RULES = [
  "Keep passwords secure and do not share accounts.",
  "Protect company and client information from unauthorised access or disclosure.",
  "Use company systems and devices primarily for work purposes.",
  "Do not install unauthorised software or use company resources for unlawful, offensive, or inappropriate activities.",
  "Do not transfer company data to personal accounts, personal storage devices, or unapproved platforms.",
  "Report lost devices, security incidents, or suspected data breaches immediately.",
];
export const AI_TOOLS = "Employees must not upload confidential company, client, or personal data to public AI tools, and should use only approved tools where authorised. AI-generated output must be reviewed before use.";
export const MONITORING = "Company systems, devices, and data remain the property of D'trax and may be monitored for legitimate business purposes. Upon leaving the company, employees must return all company property and must not retain company data.";

/* 09 · Team and organisation */

export const TEAM_INTRO = "D'trax is a team-based firm. Our work is organised across five teams under the two founders, with employees expected to collaborate across teams, support one another, and work together to deliver projects effectively.";
export const BUDDY = "We use a buddy-system approach across design and project work to support continuity and ensure that no job depends on one person. Employees should know who their buddy is, keep them updated on ongoing work, and provide sufficient information and context so they can step in when needed.";
/** The three things BUDDY asks of each employee. */
export const BUDDY_DUTIES = ["Know who your buddy is.", "Keep them updated on ongoing work.", "Give them enough information and context to step in when needed."];

/* 10 · Emergency contacts and incident escalation */

export const EMERGENCY = "Employees should prioritise safety and seek immediate assistance in the event of an emergency, workplace incident, or unsafe condition. Emergency contact information and evacuation procedures will be communicated separately and displayed at company premises and project sites.";
export const INCIDENT_STEPS = [
  { title: "Make it safe", body: "Prioritise safety and seek immediate assistance." },
  { title: "Report it promptly", body: "Report to the appropriate Reporting Officer or Management." },
  { title: "The company follows up", body: "The company will investigate incidents and take appropriate corrective actions, including regulatory reporting where required." },
];
export const INCIDENT_TYPES = ["Workplace injuries", "Accidents", "Near-misses", "Security incidents", "Safety concerns"];
export const INCIDENT_RULE = "All workplace injuries, accidents, near-misses, security incidents, and safety concerns must be reported promptly to the appropriate Reporting Officer or Management. The company will investigate incidents and take appropriate corrective actions, including regulatory reporting where required.";

/* 11 · Close */

export const BEFORE_YOU_START = [
  "This handbook sets out how we work and what we expect of each other. Read it properly, keep it handy, and come back to it when you're unsure.",
  "It won't answer everything. When something isn't clear, ask early rather than guess. That's how we work here, and it applies to the handbook as much as the job.",
  "We keep this document current. The latest approved version is always the one that applies, so check you're working from it.",
];
export const CLOSING_LINE = "Think clearly, speak plainly, and finish what you start.";
export const WELCOME_ABOARD = "Welcome aboard.";

/** Company details, as used on the company profile's closing page. */
export const COMPANY = {
  address: "10 Anson Road, #30-13 International Plaza, Singapore 079903",
  phone: "+65 6224 9242",
  web: "www.dtrax.com.sg",
};
