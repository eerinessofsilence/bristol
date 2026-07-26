import { Check, ImageOff, ImagePlus, Info, Sparkles, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThinkingOrb, type OrbState } from 'thinking-orbs';
import { ApiError, suggestProductCodes } from '../api/client';
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

const acceptedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);
const maxImageSize = 10 * 1024 * 1024;
const orbStates: OrbState[] = ['searching', 'solving', 'composing'];

const confidenceLabels = {
  high: 'Висока відповідність',
  medium: 'Ймовірний варіант',
  low: 'Потребує уточнення',
};

const fallbackMissingDetails = [
  'Надайте фото самого товару крупним планом, поза упаковкою чи контейнером.',
  'Вкажіть назву, призначення та матеріал або склад товару.',
];

const orbLabels: Record<OrbState, string> = {
  working: 'Готуємо аналіз…',
  searching: 'Розпізнаємо товар на фото…',
  solving: 'Зіставляємо характеристики…',
  listening: 'Читаємо опис…',
  composing: 'Формуємо варіанти коду…',
  shaping: 'Уточнюємо результат…',
};

function getAnalysisErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return 'Не вдалося проаналізувати фото. Перевірте з’єднання і спробуйте ще раз.';
  }

  if (error.status === 503) {
    return 'Сервіс AI-підбору тимчасово недоступний. Спробуйте ще раз трохи пізніше.';
  }

  return error.message;
}

export function ProductCodeFinderModal({ isOpen, onClose, onSelect }: Props) {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<ProductCodeSuggestion | null>(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>('searching');
  const [activePreview, setActivePreview] = useState<SelectedImage | null>(null);
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
      if (event.key !== 'Escape') return;

      if (activePreview) {
        setActivePreview(null);
      } else if (!isAnalyzing) {
        onClose();
      }
    };
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [activePreview, isAnalyzing, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setActivePreview(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isAnalyzing) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % orbStates.length;
      setOrbState(orbStates[index]);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [isAnalyzing]);

  if (!isOpen) return null;

  const isUploadStep = !isAnalyzing && !result;

  const addImages = (files: File[]) => {
    const validFiles = files.filter(
      (file) => acceptedImageTypes.has(file.type) && file.size <= maxImageSize,
    );

    if (validFiles.length !== files.length) {
      setError('Додайте JPG, PNG, WEBP, GIF, HEIC або HEIF до 10 МБ.');
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
    setActivePreview((current) => (current?.preview === preview ? null : current));
    setResult(null);
  };

  const resetAnalysis = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
    setDescription('');
    setResult(null);
    setError('');
    setActivePreview(null);
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
      setError(getAnalysisErrorMessage(analysisError));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="bg-primary/60 fixed inset-0 z-[1100] flex items-start justify-center overflow-y-auto p-3 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isAnalyzing) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={isUploadStep ? 'product-code-finder-title' : undefined}
        aria-label={isUploadStep ? undefined : 'Підбір коду УКТ ЗЕД за фото'}
        className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="technical-label text-[#1d9e75]">AI / попередній підбір</span>
          <button
            type="button"
            onClick={onClose}
            disabled={isAnalyzing}
            aria-label="Закрити"
            className="bg-soft hover:bg-line grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>
        {isUploadStep && (
          <div>
            <h2
              id="product-code-finder-title"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              Визначити код УКТ ЗЕД за фото
            </h2>
            <p className="text-ink-3 mt-2 max-w-[580px] text-sm leading-6">
              Додайте до трьох фото товару. Фото етикетки, складу або технічних характеристик
              допоможе отримати точніший результат.
            </p>
          </div>
        )}
        {isUploadStep && (
          <>
            <label
              htmlFor="product-code-images"
              className={`mt-6 grid min-h-44 cursor-pointer place-items-center rounded-2xl border border-dashed p-5 text-center transition ${
                isDragging
                  ? 'border-mint bg-[#e8f6f1]'
                  : 'border-mint-muted/45 bg-soft hover:border-mint'
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
                accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
                multiple
                onChange={(event) => {
                  addImages(Array.from(event.target.files ?? []));
                  event.target.value = '';
                }}
              />
              <span>
                <span className="bg-primary mx-auto grid size-12 place-items-center rounded-full text-white">
                  <ImagePlus size={21} />
                </span>
                <span className="mt-4 block text-sm font-semibold">
                  Перетягніть фото сюди або виберіть з пристрою
                </span>
                <span className="text-ink-3 mt-1 block text-xs">
                  JPG, PNG, WEBP, GIF, HEIC або HEIF · до 10 МБ · максимум 3 фото
                </span>
              </span>
            </label>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={image.preview}
                    className="bg-soft relative aspect-[4/3] overflow-hidden rounded-xl border border-[#085041]/10"
                  >
                    <button
                      type="button"
                      className="absolute inset-0 cursor-zoom-in"
                      aria-label={`Відкрити фото товару ${index + 1} на весь екран`}
                      onClick={() => setActivePreview(image)}
                    >
                      <img
                        src={image.preview}
                        alt={`Фото товару ${index + 1}`}
                        className="size-full object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image.preview)}
                      aria-label={`Видалити фото ${index + 1}`}
                      className="absolute top-2 right-2 z-10 grid size-8 cursor-pointer place-items-center rounded-full bg-white/90 text-[#712b13] shadow-sm backdrop-blur"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5">
              <label className="field-label" htmlFor="product-description">
                Короткий опис <span className="text-ink-3 font-normal">(необов’язково)</span>
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
              <p className="text-ink-3 flex items-center gap-2 text-xs leading-4">
                <Info className="text-ink-2 shrink-0" size={16} />
                Фото надсилаються в OpenAI лише для аналізу.
              </p>
              <Button
                type="button"
                icon={Sparkles}
                variant="primary"
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
            className="bg-primary mt-7 grid min-h-[300px] place-items-center rounded-2xl px-6 py-10 text-center text-white"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="w-full">
              <ThinkingOrb
                state={orbState}
                size={64}
                theme="dark"
                aria-label={orbLabels[orbState]}
                className="mx-auto scale-150"
              />
              <p className="sr-only" aria-live="polite">
                {orbLabels[orbState]}
              </p>
              <div className="relative mt-6 min-h-7 w-full text-center" aria-hidden="true">
                {orbStates.map((state) => (
                  <p
                    key={state}
                    className={`absolute inset-x-0 text-center text-lg leading-7 font-semibold whitespace-nowrap transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                      state === orbState ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                    }`}
                  >
                    {orbLabels[state]}
                  </p>
                ))}
              </div>
              <p className="mt-2 text-center text-sm text-white/55">
                Зазвичай це займає до хвилини.
              </p>
            </div>
          </div>
        )}

        {!isAnalyzing && result && (
          <div className="mt-7">
            {result.productIdentified ? (
              <div className="rounded-2xl border border-[#1d9e75]/20 bg-[#e8f6f1] p-4">
                <span className="technical-label text-[#085041]/55">Розпізнаний товар</span>
                <p className="mt-1 font-semibold text-[#085041]">{result.identifiedProduct}</p>
              </div>
            ) : (
              <div className="border-line bg-soft rounded-2xl border p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="ring-line grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-[#b47916] ring-1">
                    <ImageOff size={21} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-ink text-lg leading-7 font-semibold">Товар не визначено</h3>
                    <p className="text-ink-3 mt-1 text-sm leading-6">{result.identifiedProduct}</p>
                  </div>
                </div>
                <div className="border-line mt-5 border-t pt-5">
                  <h3 className="text-ink font-semibold">Що додати для точного підбору</h3>
                  <ul className="mt-3 space-y-2">
                    {(result.missingDetails.length > 0
                      ? result.missingDetails
                      : fallbackMissingDetails
                    ).map((detail) => (
                      <li
                        key={detail}
                        className="text-ink-2 flex items-center gap-2 text-xs leading-5"
                      >
                        <span
                          className="bg-mint-muted size-1.5 shrink-0 rounded-full"
                          aria-hidden="true"
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.productIdentified ? (
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
                          <strong className="font-accent text-lg tracking-[0.08em]">
                            {candidate.code}
                          </strong>
                          <span className="badge badge-xs border-[#1d9e75]/15 bg-[#e8f6f1] text-[#085041]">
                            {confidenceLabels[candidate.confidence]}
                          </span>
                        </div>
                        <h3 className="mt-3 text-sm font-semibold">{candidate.titleUk}</h3>
                        <p className="text-ink-3 mt-1 text-xs leading-5">{candidate.reasonUk}</p>
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
                        variant={index === 0 ? 'primary' : 'outline'}
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
            ) : null}

            {result.productIdentified &&
              result.needsMoreInfo &&
              result.missingDetails.length > 0 && (
                <div className="mt-4 rounded-2xl border border-[#d89a30]/25 bg-[#fff8e8] p-4">
                  <p className="text-sm font-semibold text-[#734d0b]">Що варто уточнити</p>
                  <ul className="mt-2 space-y-1 text-xs leading-5 text-[#734d0b]/80">
                    {result.missingDetails.map((detail) => (
                      <li key={detail}>• {detail}</li>
                    ))}
                  </ul>
                </div>
              )}

            <p className="text-ink-3 mt-4 text-xs leading-5">{result.disclaimer}</p>
            <div
              className={`mt-6 flex ${result.productIdentified ? 'justify-end' : 'justify-start'}`}
            >
              {result.productIdentified ? (
                <Button type="button" variant="outline" size="compact" onClick={resetAnalysis}>
                  Перевірити інший товар
                </Button>
              ) : (
                <Button type="button" icon={ImagePlus} variant="primary" onClick={resetAnalysis}>
                  Додати інші фото
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {activePreview && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Перегляд фото товару"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActivePreview(null);
          }}
        >
          <img
            src={activePreview.preview}
            alt="Збільшене фото товару"
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
          <button
            type="button"
            onClick={() => setActivePreview(null)}
            aria-label="Закрити перегляд фото"
            className="absolute top-5 right-5 grid size-11 cursor-pointer place-items-center rounded-full bg-white/90 text-[#141c1a] shadow-lg transition hover:bg-white"
          >
            <X size={22} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </div>
  );
}
