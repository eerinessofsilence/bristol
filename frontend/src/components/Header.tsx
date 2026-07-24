import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from './ui/Button';

const links = [
  ['Послуги', '#services'],
  ['Як працюємо', '#how'],
  ['Підготовка', '#operate'],
  ['Питання', '#faq'],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="liquid-header fixed top-5 right-6 left-6 z-50 mx-auto flex h-16 max-w-[1160px] items-center justify-between gap-6 rounded-full px-4 md:top-6 md:right-9 md:left-9 md:px-8">
      <a
        href="#top"
        className="text-[23px] font-extrabold tracking-[-0.04em] transition-[letter-spacing,opacity] duration-300 hover:tracking-[-0.02em] hover:opacity-75"
      >
        Митні системи
      </a>
      <nav
        aria-label="Головна навігація"
        className={`absolute top-20 right-0 left-0 flex origin-top flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl transition-[opacity,transform,visibility] duration-300 ease-out md:visible md:static md:flex md:translate-y-0 md:scale-100 md:flex-row md:gap-8 md:bg-transparent md:p-0 md:opacity-100 md:shadow-none ${open ? 'visible translate-y-0 scale-100 opacity-100' : 'pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0 md:pointer-events-auto'}`}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="text-portway-primary hover:text-portway-primary-hover after:bg-portway-mint-muted relative w-fit translate-y-0 transform-gpu self-start py-1 text-lg font-bold tracking-[0.06em] uppercase transition-[color,transform] duration-400 ease-in-out will-change-transform after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-[width] after:duration-400 after:ease-in-out hover:-translate-y-[1.5px] hover:after:w-[72%] md:self-auto md:text-sm md:font-semibold md:tracking-normal md:normal-case"
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <ButtonLink
          href="#calc"
          size="compact"
          className="header-contact-button hover:translate-y-0 max-md:hidden md:inline-flex"
          style={{ borderRadius: '9999px', boxShadow: 'none' }}
        >
          Розрахувати
        </ButtonLink>
        <button
          type="button"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-full bg-white/60 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} strokeWidth={2.4} /> : <Menu size={22} strokeWidth={2.4} />}
        </button>
      </div>
    </header>
  );
}
