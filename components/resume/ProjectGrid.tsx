import type { ResumeProject } from "@/lib/resume";

interface Props {
  projects: ResumeProject[];
}

export default function ProjectGrid({ projects }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div
          key={project.name}
          className="border border-zinc-200 rounded-lg p-5 hover:border-zinc-400 transition-colors"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-zinc-900">{project.name}</h3>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-700 underline underline-offset-2 whitespace-nowrap"
              >
                Visit ↗
              </a>
            )}
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
