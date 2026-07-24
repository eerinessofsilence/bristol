import { mission, values } from '../data/content';

export function MissionValues() {
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <h2 className="section-title">{mission}</h2>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2" data-reveal>
          {values.map(({ icon: Icon, label }) => (
            <span key={label} className="glass-tag">
              <Icon size={14} strokeWidth={2.4} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
