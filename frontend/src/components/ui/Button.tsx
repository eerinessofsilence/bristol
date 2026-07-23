import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

type SharedProps = {
  icon?: LucideIcon;
  variant?: 'dark' | 'mint' | 'outline';
  size?: 'default' | 'compact';
};

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & SharedProps>;

type LinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & SharedProps>;

const variants = {
  dark: 'border-portway-primary bg-portway-primary text-white',
  mint: 'border-portway-mint bg-portway-mint text-[#08221a]',
  outline: 'border-portway-line bg-white text-portway-ink hover:border-portway-mint-muted',
};

const sizes = {
  default: 'min-h-14 gap-8 py-2.5 pr-2.5 pl-6',
  compact: 'min-h-11 gap-4 py-1.5 pr-1.5 pl-4',
};

const iconVariants = {
  dark: 'bg-white text-portway-primary',
  mint: 'bg-portway-primary text-white',
  outline: 'bg-portway-primary text-white',
};

const iconSizes = {
  default: 'size-9',
  compact: 'size-8',
};

function getClassName(
  className: string,
  variant: NonNullable<SharedProps['variant']>,
  size: NonNullable<SharedProps['size']>,
) {
  return `action-pill relative inline-flex cursor-pointer items-center justify-between rounded-full border-[1.5px] text-sm font-semibold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`;
}

function ActionIcon({
  icon: Icon,
  variant,
  size,
}: {
  icon: LucideIcon;
  variant: NonNullable<SharedProps['variant']>;
  size: NonNullable<SharedProps['size']>;
}) {
  return (
    <span
      className={`action-pill-icon action-pill-icon-surface grid shrink-0 place-items-center rounded-full ${iconSizes[size]} ${iconVariants[variant]}`}
      aria-hidden="true"
    >
      <Icon size={size === 'compact' ? 15 : 18} strokeWidth={2.6} />
    </span>
  );
}

export function Button({
  children,
  className = '',
  icon = ArrowRight,
  variant = 'dark',
  size = 'default',
  ...props
}: Props) {
  return (
    <button className={getClassName(className, variant, size)} {...props}>
      <span className="relative z-10">{children}</span>
      <ActionIcon icon={icon} variant={variant} size={size} />
    </button>
  );
}

export function ButtonLink({
  children,
  className = '',
  icon = ArrowRight,
  variant = 'dark',
  size = 'default',
  ...props
}: LinkProps) {
  return (
    <a className={getClassName(className, variant, size)} {...props}>
      <span className="relative z-10">{children}</span>
      <ActionIcon icon={icon} variant={variant} size={size} />
    </a>
  );
}
