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

// --- Persistence: per-deck card-status map in sessionStorage -------------------

type CardStatus = "unseen" | "memorized" | "not_memorized";

type SessionState = {
  deckSlug: string;
  version: 1;
  statuses: Record<number, CardStatus>;
};

const SESSION_KEY_PREFIX = "flashcards:session:";
const SESSION_VERSION = 1;

function readSession(deckSlug: string): Record<number, CardStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY_PREFIX + deckSlug);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SessionState;
    if (
      !parsed ||
      parsed.version !== SESSION_VERSION ||
      parsed.deckSlug !== deckSlug ||
      typeof parsed.statuses !== "object"
    ) {
      return {};
    }
    return parsed.statuses;
  } catch {
    // Private-mode Safari or corrupted JSON — fall back to in-memory.
    return {};
  }
}

function writeSession(deckSlug: string, statuses: Record<number, CardStatus>) {
  if (typeof window === "undefined") return;
  try {
    const payload: SessionState = {
      deckSlug,
      version: SESSION_VERSION,
      statuses,
    };
    window.sessionStorage.setItem(
      SESSION_KEY_PREFIX + deckSlug,
      JSON.stringify(payload)
    );
  } catch {
    // Storage unavailable or quota exceeded — keep in-memory only.
  }
}

function useSessionStatuses(deckSlug: string) {
  // First render (including SSR) has an empty map; real state hydrates in the effect below.
  const [statuses, setStatuses] = useState<Record<number, CardStatus>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStatuses(readSession(deckSlug));
    setHydrated(true);
  }, [deckSlug]);

  useEffect(() => {
    if (!hydrated) return;
    writeSession(deckSlug, statuses);
  }, [deckSlug, statuses, hydrated]);

  const setStatus = (cardId: number, status: CardStatus) => {
    setStatuses((prev) => ({ ...prev, [cardId]: status }));
  };

  const resetStatuses = () => {
    setStatuses({});
  };

  return { statuses, setStatus, resetStatuses, hydrated };
}

// ----------------------------------------------------------------------------

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-4 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] font-sans text-[color:var(--color-ink)]">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="font-serif text-2xl md:text-4xl font-semibold text-[color:var(--color-ink)] mb-1 md:mb-2 tracking-tight">
          {deck.title}
        </h1>
        <p className="text-sm md:text-base text-[color:var(--color-ink-muted)] font-medium">
          {deck.subtitle}
        </p>
      </div>

      {/* Main flashcard */}
      <div
        className="w-full max-w-sm aspect-[3/4] bg-[color:var(--color-surface)] rounded-3xl shadow-lg border border-[color:var(--color-border)] flex flex-col items-center justify-center p-8 cursor-pointer relative transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)] touch-manipulation"
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
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
          aria-label="Thẻ trước"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={handleShuffle}
          className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
          title="Xáo trộn thẻ"
          aria-label="Xáo trộn thẻ"
        >
          <Shuffle size={20} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
          aria-label="Thẻ tiếp theo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
