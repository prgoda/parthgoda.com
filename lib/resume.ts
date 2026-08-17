export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  period: string;
  location: string;
  notes?: string;
}

export interface ResumeSkill {
  name: string;
  level: number; // 0 to 100
  category: "technical" | "business" | "creative";
}

export interface ResumeProject {
  name: string;
  description: string;
  tags?: string[];
  url?: string;
}

export interface ResumeHobby {
  label: string;
  icon: string; // emoji
}

export interface ResumeArmy {
  role: string;
  unit: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  tagline: string;
  email: string;
  linkedin: string;
  github?: string;
  location?: string;
  citizenship?: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills?: ResumeSkill[];
  projects?: ResumeProject[];
  certifications?: string[];
  hobbies?: ResumeHobby[];
  army?: ResumeArmy;
}

export const resume: ResumeData = {
  name: "Parth Goda",
  title: "MBA Candidate at Kellogg · Strategy, Analytics & AI",
  tagline:
    "Strategy, operations, and go-to-market for agentic AI products.",
  email: "parth.godarajesh@kellogg.northwestern.edu",
  linkedin: "https://www.linkedin.com/in/parth-goda-44531a161/",
  location: "Chicago, IL",
  citizenship: "Singapore Citizen",

  experience: [
    {
      company: "Pareto Agent (AI Agents for B2B SaaS Contract Renewals)",
      role: "Strategy and Operations — Summer Intern",
      period: "Summer 2026",
      location: "Palo Alto, CA",
      bullets: [
        "Drove pivot from chatbots to autonomous agents that run SaaS contract renewals end to end, winning CEO and board approval by diagnosing 5 root causes of revenue leakage across 50 SaaS firms via interviews",
        "Built the market case for expanded scope by prototyping the agent and running 18 client feedback calls that produced 3 MVP agreements and 1 anchor client releasing 300 account renewals for live testing",
        "Repositioned the investor narrative around customer traction, competitive position and production readiness, then presented to VCs at incubator demo day, helping secure $3.5M seed round",
      ],
    },
    {
      company: "Deloitte Consulting",
      role: "Senior Consultant — Digital Transformation (Agentic AI)",
      period: "2024 to 2025",
      location: "Singapore",
      bullets: [
        "Grew new AI practice to $8M by qualifying 15 opportunities within government and financial services clients, translating capabilities into business cases and owning discovery through delivery on the 4 that converted",
        "Led end to end enterprise AI deployment for global insurer by coordinating 12 developers across 6 finance and HR processes, cutting client onboarding time by 36% and resolution time by 54%",
        "Designed agentic underwriting workflows for global bank, improving risk assessment speed by 45% through human-in-the-loop review, policy guardrails, exception handling and KPI dashboards for compliance",
        "Overhauled governance for Japanese bank's digital project portfolio by establishing the operating data models and designing executive dashboards that cut project delays by 23%",
      ],
    },
    {
      company: "Resource Global Professionals",
      role: "Senior Solutions Consultant — Digital Transformation & Process Engineering",
      period: "2022 to 2024",
      location: "Singapore",
      bullets: [
        "Ran solution consulting behind $9.3M in annual IT automation revenue for legacy organisations, mapping client requirements to target architecture and defending pricing through C-suite negotiations",
        "Architected lifecycle governance for 300K+ IT assets at local university, replacing untracked warranty and end-of-life data with ServiceNow workflows that cut annual licensing and maintenance spend by 30%",
        "Cut audit timelines by 40% and saved $1M in labour costs for national trade union by aligning product, design, sales and delivery stakeholders behind $745K risk management platform",
      ],
    },
    {
      company: "TagTeam Technologies (AI and Data Annotation)",
      role: "Operations and Solutions Lead — Computer Vision & Multimodal AI",
      period: "2020 to 2022",
      location: "Singapore",
      bullets: [
        "Scaled seed stage startup to $3M in revenue by architecting the delivery model and standing up the AI consulting team, winning the first client within 3 months through solution design",
        "Commercialised 7 AI solutions including crisis detection system for Singapore's Ministry of Defence, shaping value propositions and deal structures that lifted AI adoption by 13% among emergency operations teams",
        "Defined international market entry strategy through customer segmentation, competitor analysis and partnership prioritisation, launching operations in Korea and Indonesia",
      ],
    },
    {
      company: "Vency Tech (concurrent with studies)",
      role: "Founder",
      period: "2017 to 2019",
      location: "Singapore",
      bullets: [
        "Bootstrapped partner relationship management SaaS that gave enterprises workflows to close deals through channel partners, scaling to 10 customers and $50K ARR before exiting at 6x revenue multiple",
      ],
    },
  ],

  education: [
    {
      institution: "Kellogg School of Management, Northwestern University",
      degree:
        "MBA Candidate, Class of 2027 · Major in Strategy, Specialisation in Analytics and AI",
      period: "2025 to Present",
      location: "Chicago, IL",
      notes:
        "Kellogg Merit Scholar · Band (Bass Guitar) · Founders Club · KFIT Club (VP) · SEA Club (VP)",
    },
    {
      institution: "Singapore Management University",
      degree:
        "B.S. in Information Systems, Major in Business Analytics · Cum Laude",
      period: "2017 to 2021",
      location: "Singapore",
      notes:
        "Global Industry Preparation Scholarship (top 5% of class) · SAS Institute Scholarship (1 of 8 nationally)",
    },
  ],

  // Self-assessed proficiency, tuned by hand. These are judgement calls, not
  // measurements, so edit the numbers freely.
  skills: [
    { name: "Agentic AI architecture", level: 90, category: "technical" },
    { name: "Claude Code & design", level: 85, category: "technical" },
    { name: "ServiceNow workflows", level: 85, category: "technical" },
    { name: "Data & business analytics", level: 80, category: "technical" },
    { name: "Computer vision & multimodal AI", level: 70, category: "technical" },
    { name: "Python", level: 70, category: "technical" },

    { name: "Solution consulting", level: 90, category: "business" },
    { name: "Enterprise sales & C-suite negotiation", level: 90, category: "business" },
    { name: "Go-to-market strategy", level: 85, category: "business" },
    { name: "Program & portfolio governance", level: 85, category: "business" },
    { name: "Market entry & segmentation", level: 75, category: "business" },
  ],

  projects: [
    {
      name: "Ritual",
      description: "Fitness app that builds workout plans.",
      url: "https://ritualapp.ai",
    },
    {
      name: "Exhibition vendor management",
      description: "Vendor management tool for local exhibitions.",
    },
  ],

  certifications: [
    "ServiceNow certified",
    "Salesforce certified",
    "Google product certifications",
  ],

  hobbies: [
    { label: "Boxing", icon: "🥊" },
    { label: "Improv Comedy", icon: "🎭" },
    { label: "Percussion", icon: "🥁" },
    { label: "Street Photography", icon: "📷" },
  ],

  army: {
    role: "Corporal First Class",
    unit: "Singapore Army",
    period: "",
    location: "Singapore",
    bullets: [
      "Promoted to Corporal First Class for top-decile performance in nationwide cybersecurity protocol redesign",
    ],
  },
};
