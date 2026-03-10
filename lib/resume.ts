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
  skills: ResumeSkill[];
  projects: ResumeProject[];
  hobbies: ResumeHobby[];
  army: ResumeArmy;
}

export const resume: ResumeData = {
  name: "Parth Goda",
  title: "Product Manager & AI Enthusiast",
  tagline: "Building at the intersection of AI, product strategy, and human creativity.",
  email: "parth@parthgoda.com",
  linkedin: "https://linkedin.com/in/parthgoda",
  github: "https://github.com/parthgoda",

  experience: [
    {
      company: "Accenture",
      role: "Product Manager",
      period: "2022 – Present",
      location: "New York, NY",
      bullets: [
        "Led product strategy for enterprise AI tools serving 500K+ users",
        "Drove 35% reduction in onboarding time through data-driven UX improvements",
        "Collaborated with engineering and design to ship 12 major features per quarter",
      ],
    },
    {
      company: "Startup Incubator",
      role: "Product & Strategy Intern",
      period: "Summer 2021",
      location: "San Francisco, CA",
      bullets: [
        "Conducted market research across 3 verticals; surfaced $2M+ opportunity",
        "Built pitch deck that secured seed funding round",
        "Defined MVP feature set and roadmap for B2B SaaS product",
      ],
    },
  ],

  education: [
    {
      institution: "Top Business School",
      degree: "MBA, Strategy & Entrepreneurship",
      period: "2021 – 2023",
      location: "United States",
      notes: "Dean's List · Product Club President",
    },
    {
      institution: "University of Technology",
      degree: "B.S. Computer Science",
      period: "2015 – 2019",
      location: "United States",
      notes: "Honors · Distributed Systems focus",
    },
  ],

  skills: [
    { name: "Product Strategy", level: 90, category: "business" },
    { name: "Data Analysis", level: 80, category: "technical" },
    { name: "SQL / Python", level: 75, category: "technical" },
    { name: "AI / LLM Integration", level: 85, category: "technical" },
    { name: "Stakeholder Management", level: 88, category: "business" },
    { name: "User Research", level: 82, category: "business" },
    { name: "Music Production", level: 70, category: "creative" },
    { name: "Technical Writing", level: 78, category: "creative" },
  ],

  projects: [
    {
      name: "parthgoda.com",
      description: "AI-assisted newsletter built on Next.js, MDX, and Claude. Auto-generates post drafts from a topic prompt.",
      tags: ["Next.js", "TypeScript", "Claude AI", "MDX"],
      url: "https://parthgoda.com",
    },
    {
      name: "Gen AI Gym App",
      description: "Mobile-first fitness app that generates personalized workouts using generative AI based on user goals.",
      tags: ["React Native", "Gen AI", "Product Design"],
    },
    {
      name: "MBA Deal Tracker",
      description: "Spreadsheet-to-web tool that surfaces recruiting pipeline insights for MBA students during recruiting season.",
      tags: ["Python", "Airtable", "Automation"],
    },
  ],

  hobbies: [
    { label: "Music Production", icon: "🎹" },
    { label: "Long-distance Running", icon: "🏃" },
    { label: "Chess", icon: "♟️" },
    { label: "Reading Sci-Fi", icon: "📚" },
    { label: "Travel", icon: "✈️" },
    { label: "Cooking", icon: "🍳" },
  ],

  army: {
    role: "Officer / Platoon Commander",
    unit: "Infantry Battalion",
    period: "2019 – 2021",
    location: "National Service",
    bullets: [
      "Commanded 30-person platoon through operational deployments and high-stress training exercises",
      "Achieved top performance rating; selected for advanced leadership program out of 120 officers",
      "Designed and ran cross-functional training curriculum adopted battalion-wide",
    ],
  },
};
