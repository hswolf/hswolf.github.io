import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Shuffle, RotateCw } from "lucide-react";
import type { Deck, FlashCard } from "../../data/flashcards/n5-lesson12-c";

type Props = {
  deck: Deck;
};

type SafeImageProps = {
  src: string;
  onFail: () => void;
};

function SafeImage({ src, onFail }: SafeImageProps) {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    // If the image already finished loading before React attached the handler
    // and came back empty, report failure now.
    if (img.complete && img.naturalWidth === 0) {
      onFail();
    }
  }, [src, onFail]);

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      loading="lazy"
      onError={onFail}
      className="w-40 h-40 object-contain rounded-2xl"
    />
  );
}

export default function Flashcards({ deck }: Props) {
  const [cards, setCards] = useState(deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-ink-muted">
        <p>Chưa có thẻ nào trong bộ này.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    }, 150);
  };

  const handleFlip = () => {
    setIsFlipped((v) => !v);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 font-sans text-[color:var(--color-ink)]">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-semibold text-[color:var(--color-ink)] mb-2 tracking-tight">
          {deck.title}
        </h1>
        <p className="text-[color:var(--color-ink-muted)] font-medium">
          {deck.subtitle}
        </p>
      </div>

      {/* Main flashcard */}
      <div
        className="w-full max-w-sm aspect-[3/4] bg-[color:var(--color-surface)] rounded-3xl shadow-lg border border-[color:var(--color-border)] flex flex-col items-center justify-center p-8 cursor-pointer relative transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label="Chạm để lật thẻ"
      >
        <div
          className={`absolute top-4 right-4 transition-colors ${
            isFlipped
              ? "text-[color:var(--color-accent)]"
              : "text-[color:var(--color-border)]"
          }`}
        >
          <RotateCw size={20} />
        </div>

        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 w-full">
            {currentCard.image && !failedImages.has(currentCard.id) && (
              <SafeImage
                key={currentCard.id}
                src={`/images/flashcards/${deck.slug}/${currentCard.image}`}
                onFail={() =>
                  setFailedImages((prev) => {
                    if (prev.has(currentCard.id)) return prev;
                    const next = new Set(prev);
                    next.add(currentCard.id);
                    return next;
                  })
                }
              />
            )}
            {currentCard.kanji !== currentCard.hiragana && (
              <p className="text-xl font-medium text-[color:var(--color-accent)]">
                {currentCard.hiragana}
              </p>
            )}
            <h2 className="font-serif text-5xl font-semibold text-[color:var(--color-ink)] tracking-wider leading-tight">
              {currentCard.kanji}
            </h2>
            <p className="text-sm font-medium text-[color:var(--color-ink-muted)]">
              Chạm để lật
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {currentCard.kanji !== currentCard.hiragana && (
              <p className="text-2xl font-medium text-[color:var(--color-accent)] mb-2">
                {currentCard.hiragana}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold text-[color:var(--color-ink)] mb-4 px-4">
              {currentCard.vietnamese}
            </h2>
          </div>
        )}

      </div>

      {/* Card counter */}
      <p className="mt-4 md:mt-3 text-center text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {currentIndex + 1} / {cards.length}
      </p>

      {/* Controls */}
      <div className="mt-4 md:mt-3 flex items-center gap-5 md:gap-6 [@media(max-height:640px)]:mt-0">
        <button
          type="button"
          onClick={handlePrev}
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
          aria-label="Thẻ trước"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={handleShuffle}
          className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md transition-all active:scale-95"
          title="Xáo trộn thẻ"
          aria-label="Xáo trộn thẻ"
        >
          <Shuffle size={20} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
          aria-label="Thẻ tiếp theo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
