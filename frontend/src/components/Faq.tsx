import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { faqs } from '../data/content';

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-portway-soft scroll-mt-10 py-20 md:py-24">
      <div className="page-wrap grid items-start gap-10 lg:grid-cols-[1.28fr_0.72fr] lg:gap-16">
        <div className="lg:sticky lg:top-36 lg:order-2" data-reveal>
          <span className="section-tag">Питання</span>
          <h2 className="section-title mt-4">Часті запитання</h2>
          <p className="text-portway-ink-2 mt-5 max-w-sm leading-7">
            Коротко про строки, документи, платежі та доставку. Якщо потрібна деталь — наш брокер
            допоможе.
          </p>
        </div>
        <div className="lg:order-1" data-reveal>
          {faqs.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <article
                key={item.question}
                className={`border-portway-line mb-3 overflow-hidden rounded-[14px] border ${isOpen ? 'bg-white/75' : 'bg-white'}`}
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
                      className={`text-portway-ink-3 shrink-0 transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-portway-ink-2 px-6 pb-5 text-sm leading-6">{item.answer}</p>
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
