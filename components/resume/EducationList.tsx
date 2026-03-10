import type { ResumeEducation } from "@/lib/resume";

interface Props {
  items: ResumeEducation[];
}

export default function EducationList({ items }: Props) {
  return (
    <div className="space-y-8">
      {items.map((edu) => (
        <div key={`${edu.institution}-${edu.period}`} className="grid md:grid-cols-[1fr_auto] gap-1 md:gap-4">
          <div>
            <h3 className="font-semibold text-lg text-zinc-900">{edu.institution}</h3>
            <p className="text-zinc-600">{edu.degree}</p>
            {edu.notes && (
              <p className="mt-1 text-sm text-zinc-400">{edu.notes}</p>
            )}
          </div>
          <div className="text-right text-sm text-zinc-400 whitespace-nowrap">
            <p>{edu.period}</p>
            <p>{edu.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
