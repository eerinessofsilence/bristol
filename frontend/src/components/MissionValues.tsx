import { getContent } from '../data/content';
import { useTranslation } from '../i18n';

export function MissionValues() {
  const { language, t } = useTranslation();
  const { mission, values } = getContent(language);
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap">
        <div className="customs-checkpoint-card bg-primary relative overflow-hidden rounded-3xl p-7 text-white sm:p-10 md:p-14">
          <span className="customs-checkpoint-corners" aria-hidden="true" />
          <div
            className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
            data-reveal
          >
            <div>
              <span className="section-tag section-tag-dark">
                <span className="section-index">01 /</span>&nbsp; {t('Місія', 'Mission')}
              </span>
              <p className="mt-6 text-2xl leading-[1.3] font-bold tracking-tight text-balance sm:text-3xl">
                {mission}
              </p>
            </div>

            <div>
              <p className="technical-label text-[#9fe1cb]/65">{t('Наші цінності', 'Our values')}</p>
              <ul className="mt-5 grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
                {values.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.07] text-[#9fe1cb]"
                      aria-hidden="true"
                    >
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <span className="text-sm leading-5 font-semibold text-white/85">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
