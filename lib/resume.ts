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
  level: number; // 0–100
  category: "technical" | "business" | "creative";
}

export interface ResumeProject {
  name: string;
  description: string;
  tags: string[];
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
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills?: ResumeSkill[];
  projects?: ResumeProject[];
  hobbies?: ResumeHobby[];
  army?: ResumeArmy;
}

export const resume: ResumeData = {
  name: "Parth Goda",
  title: "MBA Candidate at Kellogg · Strategy & AI",
  tagline: "Strategy, operations, and go-to-market for agentic AI products.",
  email: "",
  linkedin: "",

  experience: [
    {
      company: "Pareto Agent",
      role: "Strategy and Operations – Agentic AI Design and Sales Management",
      period: "2024 – 2025",
      location: "Palo Alto, CA",
      bullets: [
        "Led 20+ product demos to renewals and sales executives sourced through customer discovery calls; secured 3 design partnerships to co-develop the platform against live account data",
        "Architected email outreach module with champion-matching and company-voice email generation engines; secured green light from 2 customers to manage $1.5M of their renewal accounts through the engine",
        "Built enterprise facing product, and sales deck used in primary investor discussions; contributed to a $3.5M seed round raise for the organization",
      ],
    },
    {
      company: "Deloitte Consulting",
      role: "Senior Solutions Consultant – Digital Transformation (Agentic AI)",
      period: "2024 – 2025",
      location: "Singapore",
      bullets: [
        "Built $8M AI Automation practice from zero by identifying niche market trends and developing agentic AI capabilities to automate fragmented workflows across government and financial institutions",
        "Led end-to-end enterprise AI deployment for global insurer, directing 12 developers across 6 finance/HR processes; decreased client churn 16% and resolution time 54%",
        "Architected agentic underwriting workflow for global bank, improving risk assessment speed 45% through human-in-the-loop review, policy guardrails, exception handling, and KPI dashboards for compliance",
        "Managed entire portfolio with 350 global projects governance for Japanese bank, designing operating models and executive dashboards that cut project delays 37% and accelerated decision-making",
      ],
    },
    {
      company: "Resource Global Professionals",
      role: "Senior Solutions Consultant – Digital Transformation & Process Engineering",
      period: "2022 – 2024",
      location: "Singapore",
      bullets: [
        "Drove $9.3M in annual revenue leading a 3-member global team, owning the full deal lifecycle: discovery, competitive positioning, pricing strategy, and C-suite negotiations for bespoke enterprise solutions",
        "Closed a $745K risk management platform deal with a national union, aligning product, design, sales, and delivery stakeholders on shared solution, restructuring audits to cut timelines 40% and save $1M in labor costs",
        "Built $500K in new pipeline by influencing 500+ senior executives through keynotes and C-suite workshops/hackathons, translating interest into scoped pilots that drove multiple client expansions",
      ],
    },
    {
      company: "TagTeam Technologies (AI & Data Annotation Startup)",
      role: "Operations and Solutions Lead – Computer Vision & Multi Model Expert",
      period: "2020 – 2022",
      location: "Singapore",
      bullets: [
        "Generated $3M revenue in 2 years at seed-stage startup; won first enterprise client within 3 months by owning outreach, proposals, and solution design; built 9-person AI delivery team and operating model from scratch",
        "Commercialized 7 AI solutions including crisis detection system for Ministry of Defence, increasing client AI adoption 13% by shaping value propositions and deal structures around emerging AI capabilities",
        "Defined a $185K/year international market entry strategy through customer segmentation, competitor analysis, and partnership prioritization; launched operations in Korea and Indonesia",
      ],
    },
  ],

  education: [
    {
      institution: "Kellogg School of Management, Northwestern University",
      degree: "Candidate for Master of Business Administration, Class of 2027 · Majors in Strategy and AI",
      period: "2025 – Present",
      location: "Chicago, IL",
      notes: "Kellogg Merit Scholar · Band (Bass Guitar) · Kellogg Founders · KFIT Club (VP) · SEA Club (VP)",
    },
    {
      institution: "Singapore Management University",
      degree: "Bachelor of Science in Information Systems, Major in Business Analytics · GPA 3.44/4.0 · Cum Laude",
      period: "2017 – 2021",
      location: "Singapore",
      notes: "Global Industry Preparation Scholarship (top 5% of class) · SAS Institute Scholarship (1 of 8 nationally)",
    },
  ],

};
