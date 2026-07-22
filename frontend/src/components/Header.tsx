import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';

type Props = {
  onContact: () => void;
};

const links = [
  ['Послуги', '#services'],
  ['Як працюємо', '#how'],
  ['Географія', '#operate'],
  ['Питання', '#faq'],
];

export function Header({ onContact }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="liquid-header fixed top-5 right-6 left-6 z-50 mx-auto flex h-16 max-w-[1160px] items-center justify-between gap-6 rounded-full px-6 md:top-6 md:px-8">
      <a
        href="#top"
        className="text-[23px] font-extrabold tracking-[-0.04em] transition-[letter-spacing,opacity] duration-300 hover:tracking-[-0.02em] hover:opacity-75"
      >
        Portway
      </a>
      <nav
        aria-label="Головна навігація"
        className={`${open ? 'absolute top-20 right-0 left-0 flex' : 'hidden'} flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl md:static md:flex md:flex-row md:gap-8 md:bg-transparent md:p-0 md:shadow-none`}
      >
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className="text-portway-primary hover:text-portway-primary-hover after:bg-portway-ink-2/70 relative translate-y-0 transform-gpu py-1 text-sm font-semibold transition-[color,transform] duration-400 ease-in-out will-change-transform after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-[width] after:duration-400 after:ease-in-out hover:-translate-y-[1.5px] hover:after:w-[82%]"
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Button
          onClick={onContact}
          size="compact"
          className="header-contact-button hidden hover:translate-y-0 md:inline-flex"
          style={{ borderRadius: '9999px', boxShadow: 'none' }}
        >
          Зв'язатися
        </Button>
        <button
          type="button"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-xl bg-white/60 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} strokeWidth={2.4} /> : <Menu size={22} strokeWidth={2.4} />}
        </button>
      </div>
    </header>
  );
}
