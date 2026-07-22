import { MessageCircle } from 'lucide-react';

type Props = {
  onClick: () => void;
};

export function FloatingContactButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Відкрити форму зворотного зв'язку"
      className="group text-portway-primary before:bg-portway-mint/12 fixed right-5 bottom-5 z-50 inline-flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-white/80 bg-white px-4 py-2.5 text-base font-semibold shadow-[0_12px_36px_rgba(22,34,30,0.24)] transition duration-300 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:content-[''] hover:-translate-y-1 hover:shadow-[0_16px_42px_rgba(22,34,30,0.3)] hover:before:scale-x-100 active:translate-y-0 active:scale-[0.985] md:right-8 md:bottom-8 md:px-5"
    >
      <MessageCircle
        size={21}
        strokeWidth={2.4}
        fill="currentColor"
        className="text-portway-primary relative z-10 transition duration-300 group-hover:scale-110 group-hover:-rotate-12"
      />
      <span className="relative z-10">Зв'язатися</span>
    </button>
  );
}
