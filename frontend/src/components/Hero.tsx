import { ArrowUpRight } from 'lucide-react';
import { Header } from './Header';
import { Button } from './ui/Button';

type Props = {
  onContact: () => void;
};

export function Hero({ onContact }: Props) {
  return (
    <section
      id="top"
      className="relative h-screen min-h-[620px] overflow-hidden bg-[linear-gradient(120deg,#e9f4ee_0%,#cde6da_42%,#7e9a8e_68%,#384841_100%)]"
    >
      <div className="page-wrap relative z-10">
        <Header onContact={onContact} />
        <div className="max-w-[670px] py-20 md:py-24">
          <h1 className="text-[42px] leading-[0.98] font-extrabold tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
            Вантаж у русі,
            <br />
            доставка вчасно
          </h1>
          <p className="text-portway-ink-2 mt-7 max-w-[540px] text-base leading-7 sm:text-lg">
            Від вивантаження контейнера до доставки за адресою — беремо на себе митні документи,
            сплату платежів і транспорт, щоб ваша команда займалася продажами.
          </p>
          <Button onClick={onContact} className="mt-9">
            Зв'язатися з агентом <ArrowUpRight size={17} strokeWidth={2.4} />
          </Button>
        </div>
      </div>
    </section>
  );
}
