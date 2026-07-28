import { Calculator, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { getContent } from '../data/content';
import { useTranslation } from '../i18n';
import { ButtonLink } from './ui/Button';

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const { language, t } = useTranslation();
  const { faqs } = getContent(language);

  return (
    <section id="faq" className="bg-soft scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap grid items-start gap-10 lg:grid-cols-[1.28fr_0.72fr] lg:gap-20">
        <div className="lg:sticky lg:top-30 lg:order-2 lg:-mt-3" data-reveal>
          <span className="section-tag self-start">
            <span className="section-index">11 /</span>&nbsp; {t('Питання', 'FAQ')}
          </span>
          <h2 className="section-title mt-4">{t('Часті запитання', 'Frequently asked questions')}</h2>
          <p className="text-ink-2 mt-5 max-w-sm leading-7">
            {t('Коротко про роль ClearGateCustoms, роботу з портами, митне оформлення та доставку до складу клієнта.', 'A quick overview of ClearGateCustoms, port operations, customs clearance and delivery to the client’s warehouse.')}
          </p>
          <ButtonLink href="#calc" icon={Calculator} className="mt-7 lg:-translate-y-3">
            {t('Розрахувати митні платежі', 'Calculate customs charges')}
          </ButtonLink>
        </div>
        <div className="lg:order-1" data-reveal>
          {faqs.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <article
                key={item.question}
                className={`border-line mb-3 overflow-hidden rounded-[14px] border ${isOpen ? 'bg-white/75' : 'bg-white'}`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-semibold"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    {item.question}
                    <ChevronDown
                      size={20}
                      strokeWidth={2.4}
                      className={`text-ink-3 shrink-0 transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-ink-2 pr-6 pb-5 pl-8 text-sm leading-6 text-balance">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
