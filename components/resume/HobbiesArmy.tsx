import type { ResumeHobby, ResumeArmy } from "@/lib/resume";

interface Props {
  hobbies: ResumeHobby[];
  army: ResumeArmy;
}

export default function HobbiesArmy({ hobbies, army }: Props) {
  return (
    <div className="space-y-10">
      {/* Hobbies */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Interests
        </h3>
        <div className="flex flex-wrap gap-3">
          {hobbies.map((h) => (
            <span
              key={h.label}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-sm text-zinc-700"
            >
              <span>{h.icon}</span>
              {h.label}
            </span>
          ))}
        </div>
      </div>

      {/* Military / National Service */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Military / National Service
        </h3>
        <div className="grid md:grid-cols-[1fr_auto] gap-1 md:gap-4">
          <div>
            <p className="font-semibold text-zinc-900">{army.role}</p>
            <p className="text-zinc-600">{army.unit}</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-zinc-600 text-sm leading-relaxed">
              {army.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="text-right text-sm text-zinc-400 whitespace-nowrap">
            <p>{army.period}</p>
            <p>{army.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
