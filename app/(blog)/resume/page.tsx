import type { Metadata } from "next";
import { resume } from "@/lib/resume";
import ResumeHero from "@/components/resume/ResumeHero";
import ResumeSection from "@/components/resume/ResumeSection";
import ExperienceList from "@/components/resume/ExperienceList";
import EducationList from "@/components/resume/EducationList";
import SkillsGrid from "@/components/resume/SkillsGrid";
import ProjectGrid from "@/components/resume/ProjectGrid";
import HobbiesArmy from "@/components/resume/HobbiesArmy";

export const metadata: Metadata = {
  title: `Resume ${resume.name}`,
  description: resume.tagline,
};

export default function ResumePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pb-24">
      <ResumeHero
        data={{
          name: resume.name,
          title: resume.title,
          tagline: resume.tagline,
          email: resume.email,
          linkedin: resume.linkedin,
          github: resume.github,
          location: resume.location,
          citizenship: resume.citizenship,
        }}
      />

      <ResumeSection title="Experience" animationDelay={0}>
        <ExperienceList items={resume.experience} />
      </ResumeSection>

      <ResumeSection title="Education" animationDelay={60}>
        <EducationList items={resume.education} />
      </ResumeSection>

      {resume.skills && resume.skills.length > 0 && (
        <ResumeSection title="Skills" animationDelay={120}>
          <SkillsGrid skills={resume.skills} />
        </ResumeSection>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <ResumeSection title="Projects" animationDelay={180}>
          <ProjectGrid projects={resume.projects} />
        </ResumeSection>
      )}

      {(resume.certifications?.length ||
        resume.hobbies?.length ||
        resume.army) && (
        <ResumeSection title="Additional" animationDelay={240}>
          <HobbiesArmy
            hobbies={resume.hobbies}
            certifications={resume.certifications}
            army={resume.army}
          />
        </ResumeSection>
      )}
    </main>
  );
}
