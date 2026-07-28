import { CountryFlag } from './ui/CountryFlag';
import { useTranslation } from '../i18n';

export function Intro() {
  const { language, t } = useTranslation();
  const tags = language === 'en'
    ? ['No advance payment', 'China and Europe', 'Delivery coordination', 'Delivery to warehouse']
    : ['Без передоплати', 'Китай і Європа', 'Координація доставки', 'Доставка до складу'];
  return (
    <section className="bg-soft py-20 md:py-24">
      <div className="page-wrap grid items-start gap-10 lg:items-stretch lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
        <div data-reveal>
          <span className="section-tag">
            <span className="section-index">04 /</span>&nbsp; {t('Підхід', 'Approach')}
          </span>
          <h2 className="section-title mt-4 max-w-xl">
            {t('Митне оформлення виконуємо самі. Логістику — організовуємо під ключ.', 'We handle customs clearance ourselves. We arrange logistics end to end.')}
          </h2>
          <p className="text-ink-2 mt-7 max-w-xl text-base leading-6 sm:text-lg sm:leading-7">
            {t('ClearGateCustoms — митний брокер, який безпосередньо здійснює декларування та митне оформлення вантажів з Китаю та Європи. Паралельно, як логістичний партнер, ми організовуємо доставку: координуємо роботу експедиторів і лінійних агентів у портах Гданська та Констанци та супроводжуємо вантаж до складу клієнта в Україні. Працюємо без передоплати за послуги — розрахунок після митного випуску вантажу.', 'ClearGateCustoms is a customs broker that directly declares and clears cargo from China and Europe. As a logistics partner, we also organize delivery: coordinating freight forwarders and line agents at Gdańsk and Constanța ports, then supporting cargo through to the client’s warehouse in Ukraine. No advance payment is required; payment follows customs release.')}
          </p>
          <p className="text-ink-2 mt-4 max-w-xl text-base leading-6 sm:text-lg sm:leading-7">
            {t('Наші цінності — законність, надійність, прозорість, технологічність, відповідальність і швидкість, з повагою до кожного клієнта.', 'Our values are compliance, reliability, transparency, technology, responsibility and speed—with respect for every client.')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={tag} className="glass-tag">
                {index === 1 ? (
                  <>
                    {t('Китай', 'China')} <CountryFlag code="cn" /> {t('і Європа', 'and Europe')} <CountryFlag code="eu" />
                  </>
                ) : (
                  tag
                )}
              </span>
            ))}
          </div>
        </div>

        <div
          className="h-[420px] overflow-hidden rounded-[18px] sm:h-[560px] lg:h-auto"
          data-reveal
        >
          <img
            src="/images/logistics-cgc-ship.png"
            alt={t('Контейнеровоз ClearGateCustoms у морі', 'A ClearGateCustoms container ship at sea')}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
