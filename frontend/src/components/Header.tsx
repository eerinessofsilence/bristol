import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';

const links = [
  ['Послуги', '#services'],
  ['Калькулятор', '#calc'],
  ['Як працюємо', '#how'],
  ['Маршрути', '#operate'],
  ['Відгуки', '#testimonials'],
  ['Партнери', '#partners'],
  ['Питання', '#faq'],
];

type Props = {
  onRequestConsultation: () => void;
};

export function Header({ onRequestConsultation }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="liquid-header fixed top-4 right-4 left-4 z-50 mx-auto flex h-15 max-w-[1160px] items-center justify-between gap-3 rounded-full px-4 sm:top-5 sm:right-6 sm:left-6 sm:h-16 md:top-6 md:right-9 md:left-9 md:gap-6 md:px-8">
      <a href="#top" className="min-w-0 shrink-0 transition-opacity duration-300 hover:opacity-75">
        <img src="/images/brand/logo.svg" alt="ClearGateCustoms" className="h-7 w-auto sm:h-8" />
      </a>
      <nav
        aria-label="Головна навігація"
        className={`absolute top-[4.5rem] right-0 left-0 flex origin-top flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-xl transition-[opacity,transform,visibility] duration-300 ease-out sm:top-20 sm:p-5 xl:visible xl:static xl:flex xl:translate-y-0 xl:scale-100 xl:flex-row xl:gap-4 xl:bg-transparent xl:p-0 xl:opacity-100 xl:shadow-none ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0 xl:pointer-events-auto'}`}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="text-primary hover:text-primary-hover after:bg-mint-muted relative w-fit translate-y-0 transform-gpu self-start py-1 text-lg font-bold tracking-[0.06em] uppercase transition-[color,transform] duration-400 ease-in-out will-change-transform after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-400 after:ease-in-out hover:-translate-y-[1.5px] hover:after:scale-x-125 xl:self-auto xl:text-xs xl:font-semibold xl:tracking-normal xl:normal-case xl:after:left-1/2 xl:after:w-0 xl:after:-translate-x-1/2 xl:after:scale-x-100 xl:after:transition-[width] xl:hover:after:w-[72%] xl:hover:after:scale-x-100"
          >
            {label}
          </a>
        ))}
        <Button
          type="button"
          icon={Phone}
          variant="primary"
          className="mt-1 w-full xl:hidden"
          onClick={() => {
            setOpen(false);
            onRequestConsultation();
          }}
        >
          Зв'язатися з нами
        </Button>
      </nav>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          icon={Phone}
          variant="outline"
          size="compact"
          className="header-contact-button hover:translate-y-0 max-xl:hidden xl:inline-flex"
          style={{ borderRadius: '9999px', boxShadow: 'none' }}
          onClick={onRequestConsultation}
        >
          Зв'язатися з нами
        </Button>
        <button
          type="button"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-full bg-white/60 xl:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} strokeWidth={2.4} /> : <Menu size={22} strokeWidth={2.4} />}
        </button>
      </div>
    </header>
  );
}
