import { Award, Calculator, Handshake, Phone, Zap } from 'lucide-react';
import { getContent } from '../data/content';
import { useTranslation } from '../i18n';
import { Button, ButtonLink } from './ui/Button';
import { CountryFlag } from './ui/CountryFlag';

type Props = {
  onRequestConsultation: () => void;
};

export function Services({ onRequestConsultation }: Props) {
  const { language, t } = useTranslation();
  const { services } = getContent(language);
  const serviceMarkers = language === 'en'
    ? ['UKT ZED · DECLARATION', 'COORDINATION', 'EU PORTS', 'DELIVERY']
    : ['УКТ ЗЕД · ДЕКЛАРАЦІЯ', 'КООРДИНАЦІЯ', 'ПОРТИ ЄС', 'ДОСТАВКА'];
  return (
    <>
      <section id="services" className="customs-surface bg-soft scroll-mt-10 py-20 md:py-24">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="section-tag">
              <span className="section-index">02 /</span>&nbsp; {t('Послуги', 'Services')}
            </span>
            <h2 className="section-title mt-4">{t('Що ми робимо', 'What we do')}</h2>
            <p className="text-ink-2 mt-4 text-base leading-6 text-balance sm:text-lg sm:leading-7">
              {t('Спеціалізуємося на митному оформленні вантажів з ', 'We specialize in customs clearance for cargo from ')}
              <span className="whitespace-nowrap">
                {t('Китаю', 'China')} <CountryFlag code="cn" />
              </span>{' '}
              {t(' та ', ' and ')}
              <span className="whitespace-nowrap">
                {t('Європи', 'Europe')} <CountryFlag code="eu" />
              </span>{' '}
              {t(' й супроводжуємо їх до складу клієнта.', ', and support it through to the client’s warehouse.')}
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {services.map(({ icon: Icon, title, description, primary }, index) => (
              <article
                key={title}
                className={`customs-service-card rounded-xl bg-white p-5 ${
                  primary
                    ? 'border-2 border-[#1d9e75] sm:col-span-2 sm:p-7 lg:col-span-3'
                    : 'border border-[#d3d1c7]/70'
                }`}
              >
                {primary && (
                  <span className="badge badge-xs absolute -top-3.5 right-4 border-[#1d9e75]/20 bg-[#9fe1cb] text-[#085041] shadow-[0_6px_16px_rgba(29,158,117,0.16)]">
                    {t('Основна послуга', 'Core service')}
                  </span>
                )}
                <p className="technical-label mb-4 text-[#085041]/55">
                  {String(index + 1).padStart(2, '0')} / {serviceMarkers[index]}
                </p>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-2 lg:block">
                  <div
                    className={`grid size-10 place-items-center rounded-[10px] lg:size-14 ${primary ? 'bg-[#e1f5ee] text-[#085041]' : 'bg-[#faece7] text-[#712b13]'}`}
                  >
                    <Icon size={20} strokeWidth={2.2} className="lg:size-7" />
                  </div>
                  <div className="contents lg:block">
                    <h3
                      className={`col-start-2 self-center text-base font-bold tracking-tight lg:mt-5 ${primary ? 'sm:text-xl' : ''}`}
                    >
                      {index === 2 ? (
                        <>
                          {t('Гданськ', 'Gdańsk')} <CountryFlag code="pl" /> {t('і Констанца', 'and Constanța')} <CountryFlag code="ro" />
                        </>
                      ) : (
                        title
                      )}
                    </h3>
                    <p
                      className={`col-start-2 text-ink-3 text-base leading-6 sm:text-lg sm:leading-7 lg:mt-2 ${primary ? 'max-w-3xl' : ''}`}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="page-wrap">
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <span className="section-tag">
              <span className="section-index">03 /</span>&nbsp; {t('Переваги', 'Benefits')}
            </span>
            <h2 className="section-title mt-4">{t('Контроль на кожному етапі', 'Control at every stage')}</h2>
            <p className="text-ink-2 mt-4 text-base leading-6 text-balance sm:text-lg sm:leading-7">
              {t('Координуємо перевезення, оформлюємо вантажі та допомагаємо заздалегідь оцінити митні платежі.', 'We coordinate transportation, clear cargo and help estimate customs charges in advance.')}
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-reveal>
            <article className="bg-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
              <div className="grid size-16 place-items-center rounded-2xl bg-white/10">
                <Handshake size={30} strokeWidth={2.4} />
              </div>
              <div className="mt-auto pt-7">
                <h3 className="text-xl font-bold">{t('Відповідальний супровід', 'Reliable support')}</h3>
                <p className="mt-3 text-base leading-6 text-white/65 sm:text-lg sm:leading-7">
                  {t('Один менеджер координує експедиторів, лінійних агентів, портові служби та перевізника.', 'One manager coordinates freight forwarders, line agents, port services and the carrier.')}
                </p>
                <Button
                  type="button"
                  icon={Phone}
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={onRequestConsultation}
                >
                  {t("Зв'язатися з нами", 'Contact us')}
                </Button>
              </div>
            </article>
            <article className="bg-mint-soft flex min-h-64 flex-col rounded-[18px] p-6 md:order-first md:col-span-2 lg:order-none lg:col-span-1">
              <div className="flex flex-1 flex-col justify-center pb-5">
                <strong className="text-3xl leading-none font-extrabold tracking-tight">
                  {t('Без передоплати', 'No advance payment')}
                </strong>
                <p className="mt-2 font-semibold">{t('за послуги ClearGateCustoms', 'for ClearGateCustoms services')}</p>
                <p className="text-ink-3 mt-2 text-base leading-6 sm:text-lg sm:leading-7">
                  {t('Розрахунок проводиться після митного випуску вантажу. Після оформлення передаємо митну декларацію.', 'Payment is made after customs release. Once cleared, we provide the customs declaration.')}
                </p>
              </div>
              <span className="bg-ink-3/25 h-0.5 w-full shrink-0 rounded-full" aria-hidden="true" />
              <div className="flex flex-1 flex-col items-end justify-center pt-5 text-right">
                <strong className="text-3xl leading-none font-extrabold tracking-tight">
                  {t('Вся Україна', 'All of Ukraine')}
                </strong>
                <p className="mt-2 font-semibold">{t('доставка до адреси', 'delivery to your address')}</p>
                <p className="text-ink-3 mt-2 text-base leading-6 sm:text-lg sm:leading-7">
                  {t('Організовуємо перевезення до вашого складу або безпосередньо до клієнта.', 'We arrange transportation to your warehouse or directly to your client.')}
                </p>
              </div>
            </article>
            <article className="bg-primary flex min-h-64 flex-col rounded-[18px] p-7 text-white">
              <div className="grid size-16 place-items-center rounded-2xl bg-white/10">
                <Calculator size={30} strokeWidth={2.4} />
              </div>
              <div className="mt-auto pt-7">
                <h3 className="text-xl font-bold">{t('Оцініть митні платежі', 'Estimate customs charges')}</h3>
                <p className="mt-3 text-base leading-6 text-white/65 sm:text-lg sm:leading-7">
                  {t('Вкажіть код УКТ ЗЕД і вагу вантажу — калькулятор орієнтовно розрахує мито, ПДВ та загальну суму платежів.', 'Enter the UKT ZED code and cargo weight—the calculator will estimate duty, VAT and the total charges.')}
                </p>
                <ButtonLink
                  href="#calc"
                  icon={Calculator}
                  variant="outline"
                  className="mt-6 w-full"
                >
                  {t('Розрахувати платежі', 'Calculate charges')}
                </ButtonLink>
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2" data-reveal>
            <article className="bg-soft flex flex-col gap-4 rounded-3xl p-7 md:p-9">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#e1f5ee] text-[#085041]">
                <Award size={26} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('Високий професіоналізм', 'High professionalism')}</h3>
                <p className="text-ink-3 mt-3 text-base leading-6 sm:text-lg sm:leading-7">
                  {t('Наші фахівці мають багатий досвід роботи в митній сфері, що дозволяє впевнено та оперативно вирішувати будь-які проблеми і перешкоди, які виникають у процесі оформлення.', 'Our specialists have extensive customs expertise, enabling them to resolve issues and obstacles during clearance swiftly and confidently.')}
                </p>
              </div>
            </article>
            <article className="bg-soft flex flex-col gap-4 rounded-3xl p-7 md:p-9">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#faece7] text-[#712b13]">
                <Zap size={26} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{t('Швидке реагування', 'Fast response')}</h3>
                <p className="text-ink-3 mt-3 text-base leading-6 sm:text-lg sm:leading-7">
                  {t('Гарантуємо оперативність — розуміємо, наскільки важлива швидкість для вашого бізнесу. Налагоджена комунікація з митними органами дозволяє мінімізувати затримки.', 'We act promptly because we understand how important speed is for your business. Established communication with customs authorities helps minimize delays.')}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
