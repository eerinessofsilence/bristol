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
      className="action-pill text-portway-primary fixed right-1.5 bottom-5 z-50 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/80 bg-white px-3 py-2.5 text-base font-semibold md:right-2 md:bottom-8 md:px-3.5"
    >
      <MessageCircle
        size={18}
        strokeWidth={2.4}
        fill="currentColor"
        className="action-pill-icon text-portway-primary"
      />
      <span>Зв'язатися</span>
    </button>
  );
}
