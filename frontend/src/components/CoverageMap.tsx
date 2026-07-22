import { FileCheck2, PackageSearch, Repeat2 } from "lucide-react";

const preparationPoints = [
  {
    icon: FileCheck2,
    number: "01",
    title: "Перевіряємо документи",
    description:
      "Інвойс, пакувальний лист, контракт і транспортні документи перевіряємо до початку оформлення.",
  },
  {
    icon: PackageSearch,
    number: "02",
    title: "Готуємо дані для брокера",
    description:
      "Збираємо опис, склад, походження й призначення товару, щоб брокер визначив код УКТЗЕД та перелік дозволів.",
  },
  {
    icon: Repeat2,
    number: "03",
    title: "Разові та регулярні поставки",
    description:
      "Супроводжуємо окремі партії та вибудовуємо повторюваний процес для регулярного імпорту.",
  },
];

export function CoverageMap() {
  return (
    <section
      id="operate"
      className="scroll-mt-10 bg-white py-20 md:py-24"
    >
      <div className="page-wrap" data-reveal>
        <div>
          <span className="section-tag">Підготовка до оформлення</span>
          <h2 className="section-title mt-5 max-w-2xl">
            Що потрібно для початку роботи
          </h2>
          <p className="text-portway-ink-2 mt-5 max-w-2xl leading-7">
            Ще до оформлення збираємо вихідні дані про товар і поставку,
            перевіряємо комплектність документів та передаємо брокеру все
            необхідне для точного розрахунку й визначення порядку оформлення.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {preparationPoints.map(({ icon: Icon, number, title, description }) => (
            <article
              key={title}
              className="border-portway-line bg-portway-soft group relative flex min-h-64 flex-col justify-center overflow-hidden rounded-[20px] border p-6 transition duration-300 hover:-translate-y-1 hover:border-portway-mint/30 hover:shadow-[0_18px_40px_rgba(22,34,30,0.08)] md:p-7"
            >
              <div className="flex items-center justify-between gap-5">
                <span className="bg-portway-mint-soft text-portway-mint-deep grid size-12 place-items-center rounded-2xl">
                  <Icon size={23} strokeWidth={2.2} />
                </span>
                <span className="text-portway-primary/[0.06] text-5xl leading-none font-extrabold tracking-[-0.06em]">
                  {number}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-portway-ink text-lg font-semibold">{title}</h3>
                <p className="text-portway-ink-3 mt-2 max-w-sm text-sm leading-6">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
