import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Option = {
  label: string;
  value: number;
};

type Props = {
  id: string;
  options: Option[];
  value: number;
  onChange: (value: number) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  opensUp: boolean;
};

export function CustomSelect({ id, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 320,
    opensUp: false,
  });
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = rootRef.current?.getBoundingClientRect();
      if (!trigger) return;

      const viewportGap = 12;
      const menuGap = 8;
      const estimatedHeight = Math.min(options.length * 48 + 12, 320);
      const spaceBelow = window.innerHeight - trigger.bottom - viewportGap;
      const spaceAbove = trigger.top - viewportGap;
      const opensUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
      const availableHeight = opensUp ? spaceAbove - menuGap : spaceBelow - menuGap;
      const maxHeight = Math.max(120, Math.min(320, availableHeight));
      const renderedHeight = Math.min(estimatedHeight, maxHeight);

      setMenuPosition({
        top: opensUp ? trigger.top - renderedHeight - menuGap : trigger.bottom + menuGap,
        left: trigger.left,
        width: trigger.width,
        maxHeight,
        opensUp,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, options.length]);

  const selectRelative = (direction: number) => {
    const currentIndex = Math.max(
      0,
      options.findIndex((option) => option.value === value),
    );
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    onChange(options[nextIndex].value);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`field-control flex min-h-12 cursor-pointer items-center justify-between gap-4 text-left transition duration-200 ${open ? 'border-portway-mint shadow-[0_0_0_3px_rgba(63,181,140,0.1)]' : ''}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            selectRelative(event.key === 'ArrowDown' ? 1 : -1);
            setOpen(true);
          }
          if (event.key === 'Escape') setOpen(false);
        }}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          size={18}
          strokeWidth={2.4}
          className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={selected.label}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
            }}
            className={`fixed z-[2000] overflow-y-auto rounded-2xl border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(234,243,238,0.94))] p-1.5 shadow-[0_18px_45px_rgba(22,34,30,0.16)] backdrop-blur-xl ${menuPosition.opensUp ? 'origin-bottom animate-[select-menu-up_180ms_ease-out]' : 'origin-top animate-[select-menu-down_180ms_ease-out]'}`}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={`${option.label}-${option.value}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition duration-150 ${isSelected ? 'bg-portway-mint/15 text-portway-primary font-semibold' : 'text-portway-ink-2 hover:bg-white/80 hover:pl-4'}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  <Check
                    size={17}
                    strokeWidth={2.6}
                    className={isSelected ? 'text-portway-mint-deep opacity-100' : 'opacity-0'}
                  />
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
