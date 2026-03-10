import type { ResumeExperience } from "@/lib/resume";

interface Props {
  items: ResumeExperience[];
}

export default function ExperienceList({ items }: Props) {
  return (
    <div className="space-y-10">
      {items.map((exp) => (
        <div key={`${exp.company}-${exp.period}`} className="grid md:grid-cols-[1fr_auto] gap-1 md:gap-4">
          <div>
            <h3 className="font-semibold text-lg text-zinc-900">{exp.role}</h3>
            <p className="text-zinc-600 font-medium">{exp.company}</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-zinc-600 text-sm leading-relaxed">
              {exp.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="text-right text-sm text-zinc-400 whitespace-nowrap">
            <p>{exp.period}</p>
            <p>{exp.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
