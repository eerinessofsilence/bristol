import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'dark' | 'mint' | 'outline';
    size?: 'default' | 'compact';
  }
>;

const variants = {
  dark: 'border-portway-primary bg-portway-primary text-white hover:bg-portway-primary-hover hover:shadow-[0_4px_0_rgba(112,145,134,0.55)]',
  mint: 'border-portway-mint bg-portway-mint text-[#08221a] hover:bg-portway-mint-deep hover:shadow-[0_4px_0_rgba(22,34,30,0.35)]',
  outline:
    'border-portway-line bg-white text-portway-ink hover:border-portway-mint-muted hover:shadow-[0_4px_0_rgba(127,159,148,0.35)]',
};

const sizes = {
  default: 'px-6 py-3.5',
  compact: 'px-5 py-2.5',
};

export function Button({
  children,
  className = '',
  variant = 'dark',
  size = 'default',
  ...props
}: Props) {
  return (
    <button
      className={`relative inline-flex cursor-pointer items-center justify-center rounded-xl border-[1.5px] text-sm font-semibold whitespace-nowrap transition-[transform,box-shadow,border-radius,letter-spacing,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:rounded-[15px] hover:tracking-[0.01em] active:translate-y-0 active:scale-[0.98] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2.5">
        {children}
      </span>
    </button>
  );
}
