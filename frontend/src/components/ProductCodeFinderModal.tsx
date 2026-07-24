import { AlertTriangle, Check, ImagePlus, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';
import { suggestProductCodes } from '../api/client';
import type { ProductCodeSuggestion } from '../types';
import { Button } from './ui/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
};

type SelectedImage = {
  file: File;
  preview: string;
};

const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const maxImageSize = 10 * 1024 * 1024;
const orbStates: OrbState[] = ['searching', 'solving', 'composing'];

const confidenceLabels = {
  high: 'Висока відповідність',
  medium: 'Ймовірний варіант',
  low: 'Потребує уточнення',
};

const orbLabels: Record<OrbState, string> = {
  working: 'Готуємо аналіз…',
  searching: 'Розпізнаємо товар на фото…',
  solving: 'Зіставляємо характеристики…',
  listening: 'Читаємо опис…',
  composing: 'Формуємо варіанти коду…',
  shaping: 'Уточнюємо результат…',
};

export function ProductCodeFinderModal({ isOpen, onClose, onSelect }: Props) {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<ProductCodeSuggestion | null>(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('searching');
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isAnalyzing) onClose();
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isAnalyzing, isOpen, onClose]);

  useEffect(() => {
    if (!isAnalyzing) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % orbStates.length;
      setOrbState(orbStates[index]);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [isAnalyzing]);

  if (!isOpen) return null;

  const addImages = (files: File[]) => {
    const validFiles = files.filter(
      (file) => acceptedImageTypes.has(file.type) && file.size <= maxImageSize,
    );

    if (validFiles.length !== files.length) {
      setError('Додайте JPG, PNG, WEBP або GIF до 10 МБ.');
    } else {
      setError('');
    }

    setImages((current) => {
      const slotsLeft = 3 - current.length;
      const nextImages = validFiles.slice(0, slotsLeft).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...current, ...nextImages];
    });
    setResult(null);
  };

  const removeImage = (preview: string) => {
    setImages((current) => {
      const target = current.find((image) => image.preview === preview);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((image) => image.preview !== preview);
    });
    setResult(null);
  };

  const resetAnalysis = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setDescription('');
    setResult(null);
    setError('');
  };

  const analyze = async () => {
    if (images.length === 0) return;

    setOrbState('searching');
    setIsAnalyzing(true);
    setError('');
    setResult(null);
    try {
      const suggestion = await suggestProductCodes(
        images.map((image) => image.file),
        description,
      );
      setResult(suggestion);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : 'Не вдалося проаналізувати фото. Спробуйте ще раз.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="bg-cleargatecustoms-primary/60 fixed inset-0 z-[1100] flex items-start justify-center overflow-y-auto p-3 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isAnalyzing) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-code-finder-title"
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <span className="technical-label text-[#1d9e75]">AI / попередній підбір</span>
            <h2
              id="product-code-finder-title"
              className="mt-2 text-xl font-bold tracking-tight sm:text-2xl"
            >
              Визначити код УКТ ЗЕД за фото
            </h2>
            <p className="text-cleargatecustoms-ink-3 mt-2 max-w-[580px] text-sm leading-6">
              Додайте до трьох фото товару. Фото етикетки, складу або технічних характеристик
              допоможе отримати точніший результат.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            aria-label="Закрити"
            className="bg-cleargatecustoms-soft hover:bg-cleargatecustoms-line grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {!isAnalyzing && !result && (
          <>
            <label
              htmlFor="product-code-images"
              className={`mt-6 grid min-h-44 cursor-pointer place-items-center rounded-2xl border border-dashed p-5 text-center transition ${
                isDragging
                  ? 'border-cleargatecustoms-mint bg-[#e8f6f1]'
                  : 'border-cleargatecustoms-mint-muted/45 bg-cleargatecustoms-soft hover:border-cleargatecustoms-mint'
              }`}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                addImages(Array.from(event.dataTransfer.files));
              }}
            >
              <input
                id="product-code-images"
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(event) => {
                  addImages(Array.from(event.target.files ?? []));
                  event.target.value = '';
                }}
              />
              <span>
                <span className="bg-cleargatecustoms-primary mx-auto grid size-12 place-items-center rounded-full text-white">
                  <ImagePlus size={21} />
                </span>
                <span className="mt-4 block text-sm font-semibold">
                  Перетягніть фото сюди або виберіть з пристрою
                </span>
                <span className="text-cleargatecustoms-ink-3 mt-1 block text-xs">
                  JPG, PNG, WEBP або GIF · до 10 МБ · максимум 3 фото
                </span>
              </span>
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={image.preview}
                    className="bg-cleargatecustoms-soft relative aspect-[4/3] overflow-hidden rounded-xl border border-[#085041]/10"
                  >
                    <img
                      src={image.preview}
                      alt={`Фото товару ${index + 1}`}
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.preview)}
                      aria-label={`Видалити фото ${index + 1}`}
                      className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-white/90 text-[#712b13] shadow-sm backdrop-blur"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5">
              <label className="field-label" htmlFor="product-description">
                Короткий опис{' '}
                <span className="text-cleargatecustoms-ink-3 font-normal">(необов’язково)</span>
              </label>
              <textarea
                id="product-description"
                className="field-control min-h-24 resize-y py-3 leading-6"
                value={description}
                maxLength={1000}
                placeholder="Наприклад: жіноча куртка, 100% поліестер, для повсякденного носіння"
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            {error && (
              <p
                className="mt-4 rounded-lg border border-[#d85a30]/30 bg-[#faece7] px-3 py-2 text-sm text-[#712b13]"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-cleargatecustoms-ink-3 flex items-start gap-2 text-xs leading-5 sm:max-w-[340px]">
                <AlertTriangle className="mt-0.5 shrink-0" size={14} />
                Фото передаються до OpenAI лише для аналізу цього запиту.
              </p>
              <Button
                type="button"
                icon={Sparkles}
                variant="mint"
                disabled={images.length === 0}
                onClick={analyze}
              >
                Проаналізувати фото
              </Button>
            </div>
          </>
        )}

        {isAnalyzing && (
          <div
            className="bg-cleargatecustoms-primary mt-7 grid min-h-[300px] place-items-center rounded-2xl px-6 py-10 text-center text-white"
            aria-live="polite"
            aria-busy="true"
          >
            <div>
              <ThinkingOrb
                state={orbState}
                size={64}
                theme="dark"
                aria-label={orbLabels[orbState]}
                className="mx-auto"
              />
              <p className="mt-6 text-lg font-semibold">{orbLabels[orbState]}</p>
              <p className="mt-2 text-sm text-white/55">Зазвичай це займає до хвилини.</p>
            </div>
          </div>
        )}

        {!isAnalyzing && result && (
          <div className="mt-7">
            <div className="rounded-2xl border border-[#1d9e75]/20 bg-[#e8f6f1] p-4">
              <span className="technical-label text-[#085041]/55">Розпізнаний товар</span>
              <p className="mt-1 font-semibold text-[#085041]">{result.identifiedProduct}</p>
            </div>

            <div className="mt-4 space-y-3">
              {result.candidates.map((candidate, index) => (
                <article
                  key={candidate.code}
                  className="rounded-2xl border border-[#085041]/12 bg-white p-4 shadow-[0_8px_30px_rgba(22,34,30,0.06)] sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="field-index" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <strong className="font-mono text-lg tracking-[0.08em]">
                          {candidate.code}
                        </strong>
                        <span className="rounded-full bg-[#e8f6f1] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#085041] uppercase">
                          {confidenceLabels[candidate.confidence]}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold">{candidate.titleUk}</h3>
                      <p className="text-cleargatecustoms-ink-3 mt-1 text-xs leading-5">
                        {candidate.reasonUk}
                      </p>
                      <p
                        className={`mt-2 text-xs font-semibold ${
                          candidate.calculatorSupported ? 'text-[#1d7f62]' : 'text-[#9a6412]'
                        }`}
                      >
                        {candidate.calculatorSupported
                          ? 'Код доступний у довіднику калькулятора'
                          : 'Для цього коду може знадобитися ручний розрахунок'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      icon={Check}
                      size="compact"
                      variant={index === 0 ? 'mint' : 'outline'}
                      className="shrink-0"
                      onClick={() => {
                        onSelect(candidate.code);
                        onClose();
                      }}
                    >
                      Використати код
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            {result.needsMoreInfo && result.missingDetails.length > 0 && (
              <div className="mt-4 rounded-2xl border border-[#d89a30]/25 bg-[#fff8e8] p-4">
                <p className="text-sm font-semibold text-[#734d0b]">Що варто уточнити</p>
                <ul className="mt-2 space-y-1 text-xs leading-5 text-[#734d0b]/80">
                  {result.missingDetails.map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-cleargatecustoms-ink-3 mt-4 text-xs leading-5">
              {result.disclaimer}
            </p>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="outline" size="compact" onClick={resetAnalysis}>
                Перевірити інший товар
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
