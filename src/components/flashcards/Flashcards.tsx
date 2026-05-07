import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Repeat, RotateCw, Shuffle } from "lucide-react";
import type { Deck } from "../../data/flashcards/types";

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
      parsed.statuses === null ||
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
  const [poolIndex, setPoolIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const { statuses, setStatus, resetStatuses } = useSessionStatuses(deck.slug);

  // Active pool = cards that are either unseen or explicitly flagged as
  // not-memorized. Memorized cards retire from navigation entirely.
  const activePool = cards.filter(
    (c) => statuses[c.id] !== "memorized"
  );
  const poolSize = activePool.length;
  const safePoolIndex =
    poolSize === 0 ? 0 : Math.max(0, Math.min(poolIndex, poolSize - 1));
  const currentCard = poolSize === 0 ? null : activePool[safePoolIndex];

  // Per-status counts for the progress caption.
  let memorizedCount = 0;
  let notMemorizedCount = 0;
  for (const c of cards) {
    const s = statuses[c.id];
    if (s === "memorized") memorizedCount++;
    else if (s === "not_memorized") notMemorizedCount++;
  }
  const unseenCount = cards.length - memorizedCount - notMemorizedCount;

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-ink-muted">
        <p>Chưa có thẻ nào trong bộ này.</p>
      </div>
    );
  }

  if (!currentCard) {
    const handleRestart = () => {
      resetStatuses();
      setPoolIndex(0);
      setIsFlipped(false);
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

        <p className="mb-4 text-xs font-medium text-[color:var(--color-ink-muted)]">
          {memorizedCount} đã thuộc · {notMemorizedCount} chưa thuộc · {unseenCount} chưa xem
        </p>

        <div
          role="status"
          aria-live="polite"
          className="w-full max-w-sm bg-[color:var(--color-surface)] rounded-3xl shadow-lg border border-[color:var(--color-border)] flex flex-col items-center justify-center p-10 text-center"
        >
          <p className="text-5xl mb-4" aria-hidden="true">🎉</p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[color:var(--color-ink)] mb-2">
            Bạn đã thuộc hết {cards.length} từ!
          </h2>
          <p className="text-sm text-[color:var(--color-ink-muted)] mb-6">
            Làm tốt lắm. Reset để học lại từ đầu?
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] text-base font-semibold shadow-sm hover:shadow-md transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
            aria-label="Bắt đầu lại từ đầu"
          >
            Bắt đầu lại
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (poolSize <= 1) return;
    setIsFlipped(false);
    setTimeout(() => {
      setPoolIndex((prev) => (prev + 1) % poolSize);
    }, 150);
  };

  const handlePrev = () => {
    if (poolSize <= 1) return;
    setIsFlipped(false);
    setTimeout(() => {
      setPoolIndex((prev) => (prev - 1 + poolSize) % poolSize);
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
      setPoolIndex(0);
    }, 150);
  };

  const handleMark = (status: CardStatus) => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    setStatus(cardId, status);

    setIsFlipped(false);
    setTimeout(() => {
      // Recompute pool as it would be AFTER this mark, then pick the next
      // logical position. Marking memorized shrinks the pool, so the cleanest
      // "next" is to stay at the same pool index (the card at that slot is
      // now the one that used to come after), wrapping if we were at the end.
      const nextStatuses = { ...statuses, [cardId]: status };
      const nextPool = cards.filter((c) => nextStatuses[c.id] !== "memorized");
      if (nextPool.length === 0) {
        setPoolIndex(0);
        return;
      }
      if (status === "memorized") {
        // Current card leaves the pool → same index now points at the card
        // that was formerly at poolIndex + 1 (or wraps to 0 at the end).
        setPoolIndex(safePoolIndex % nextPool.length);
      } else {
        // Card stays in the pool → advance like Next.
        setPoolIndex((prev) => (prev + 1) % nextPool.length);
      }
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
        aria-label={
          statuses[currentCard.id] === "not_memorized" && !isFlipped
            ? "Chưa thuộc — chạm để lật thẻ"
            : "Chạm để lật thẻ"
        }
      >
        {statuses[currentCard.id] === "not_memorized" && !isFlipped && (
          <span
            aria-hidden="true"
            className="absolute top-4 left-4 inline-block w-2 h-2 rounded-full bg-[color:var(--color-accent)]"
          />
        )}
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
          <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
            {currentCard.kanji !== currentCard.hiragana && (
              <p className="text-2xl font-medium text-[color:var(--color-accent)] mb-2">
                {currentCard.hiragana}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold text-[color:var(--color-ink)] mb-2 px-4">
              {currentCard.vietnamese}
            </h2>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMark("not_memorized");
                }}
                className="px-4 h-11 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] text-sm font-medium shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
                aria-label="Chưa thuộc từ này"
              >
                <Repeat size={16} />
                Chưa thuộc
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMark("memorized");
                }}
                className="px-4 h-11 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] text-sm font-semibold shadow-sm hover:shadow-md transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
                aria-label="Đã thuộc từ này"
              >
                Đã thuộc
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Card counter */}
      <p className="mt-4 md:mt-3 text-center text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {safePoolIndex + 1} / {poolSize}
      </p>

      {/* Progress + reset */}
      <div className="mt-2 flex items-center justify-center gap-3 text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-1">
        <span>
          {memorizedCount} đã thuộc · {notMemorizedCount} chưa thuộc · {unseenCount} chưa xem
        </span>
        <button
          type="button"
          onClick={() => {
            resetStatuses();
            setPoolIndex(0);
            setIsFlipped(false);
          }}
          className="-my-1 px-2 py-1 underline decoration-dotted underline-offset-2 hover:text-[color:var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)] rounded"
          aria-label="Reset trạng thái học phiên này"
        >
          Reset
        </button>
      </div>

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
