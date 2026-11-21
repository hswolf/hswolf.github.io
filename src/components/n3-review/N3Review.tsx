import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { AREA_LABELS, SOURCE_LABELS, cards, type Area, type ReviewCard, type SourceId } from "../../data/n3-review/index.ts";
import { DAY_MS, dueQueue, emptyState, isDue, isMastered, review, type Progress, type ProgressState } from "../../lib/n3-review/progress.ts";
import { GistSync, type SyncStatus } from "../../lib/n3-review/gist.ts";

const EXAM_DAY = new Date(2026, 11, 6); // JLPT N3, Sunday 6/12/2026
// GitHub token template: the name, a 30-day expiry and the Gists permission are filled in.
const TOKEN_URL =
  "https://github.com/settings/personal-access-tokens/new?name=vinh.to+N3+review&description=Sync+progress+of+vinh.to%2Fjapanese%2Fn3+in+one+secret+gist&expires_in=30&gists=write";
// Inter for Latin and Vietnamese, then Japanese fonts, so kanji get Japanese glyph shapes.
const FONT = 'Inter, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", Meiryo, sans-serif';

const RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
const BTN = `inline-flex items-center justify-center rounded-full font-medium touch-manipulation transition-colors disabled:opacity-40 ${RING}`;
const PRIMARY = `${BTN} h-11 px-6 bg-ink text-surface`;
const SECONDARY = `${BTN} h-11 px-5 border border-border bg-surface text-ink`;
const GOOD = "border-[#6B8E4E] bg-[#EEF3E6]";
const BAD = "border-[#B5523B] bg-[#F7E6E0]";
const SUMMARY = "flex cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden";

const AREAS: Area[] = ["kanji", "vocab", "grammar"];
const SOURCES: SourceId[] = ["dm-2111", "jlpt-1225", "dm-1411"];
const byId = new Map(cards.map((c) => [c.id, c]));

const STATUS: Record<SyncStatus, { label: string; dot: string }> = {
  local: { label: "Chưa đồng bộ", dot: "bg-border" },
  connecting: { label: "Đang kết nối…", dot: "bg-accent animate-pulse" },
  syncing: { label: "Đang đồng bộ…", dot: "bg-accent animate-pulse" },
  synced: { label: "Đã đồng bộ", dot: "bg-[#6B8E4E]" },
  offline: { label: "Ngoại tuyến", dot: "bg-[#C9822B]" },
  auth: { label: "Cần token mới", dot: "bg-[#B5523B]" },
};

type Filter = Area | "all";
/** queue[0] is the card on screen. A wrong card goes back to the end of the queue once per session. */
type Session = { queue: string[]; retried: string[]; order: number[]; picked: number | null; answered: number; right: number };

function shuffled<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Options appear in a new order each time, so the position of the answer does not help. */
const optionOrder = (id: string | undefined) => (id ? shuffled(byId.get(id)!.quiz.options.map((_, i) => i)) : []);
const fmtTime = (ms: number) => new Date(ms).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

function localStore(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function statusOf(p: Progress | undefined) {
  if (!p) return { label: "Chưa ôn", cls: "bg-bg text-ink-muted" };
  if (isMastered(p)) return { label: "Đã thuộc", cls: "bg-[#EEF3E6] text-[#4F6B38]" };
  if (p.box === 0) return { label: `Sai ${p.wrong} lần`, cls: "bg-[#F7E6E0] text-[#8A3B2A]" };
  return { label: "Đang nhớ", cls: "bg-accent-soft text-ink" };
}

export default function N3Review() {
  const [progress, setProgress] = useState<ProgressState>(emptyState);
  const [status, setStatus] = useState<SyncStatus>("local");
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [sync] = useState(
    () =>
      new GistSync({
        fetch: (input, init) => fetch(input, init),
        storage: localStore(),
        onState: setProgress,
        onStatus: (s, at) => {
          setStatus(s);
          setLastSync(at);
        },
      }),
  );
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"study" | "list">("study");
  const [filter, setFilter] = useState<Filter>("all");
  const [session, setSession] = useState<Session | null>(null);
  const [panel, setPanel] = useState(false);
  const quizRef = useRef<HTMLElement>(null);

  useEffect(() => {
    sync.load();
    setReady(true);
    void sync.sync();
    // Hidden: send pending answers now. Visible again: pull answers made on other devices.
    const onVisibility = () => (document.visibilityState === "hidden" ? sync.flush() : void sync.sync());
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [sync]);

  const card = session?.queue.length ? byId.get(session.queue[0]) : undefined;

  const begin = (ids: string[]) => {
    if (ids.length) setSession({ queue: ids, retried: [], order: optionOrder(ids[0]), picked: null, answered: 0, right: 0 });
  };

  const pick = (i: number) => {
    if (!session || !card || session.picked !== null) return;
    const correct = i === card.quiz.answer;
    const st = sync.state;
    sync.update({ v: 1, items: { ...st.items, [card.id]: review(st.items[card.id], correct, Date.now()) } });
    setSession({ ...session, picked: i, answered: session.answered + 1, right: session.right + (correct ? 1 : 0) });
  };

  const next = () => {
    if (!session || !card || session.picked === null) return;
    const [cur, ...rest] = session.queue;
    const again = session.picked !== card.quiz.answer && !session.retried.includes(cur);
    const queue = again ? [...rest, cur] : rest;
    setSession({ ...session, queue, retried: again ? [...session.retried, cur] : session.retried, order: optionOrder(queue[0]), picked: null });
    if ((quizRef.current?.getBoundingClientRect().top ?? 0) < 0) quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Keys 1-4 pick an answer. Enter goes to the next card.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (tab !== "study" || !session || e.metaKey || e.ctrlKey || e.altKey || target?.closest("input, textarea")) return;
      const n = Number(e.key);
      if (session.picked === null && n >= 1 && n <= session.order.length) pick(session.order[n - 1]);
      // Enter on a focused button, link or summary keeps its own action.
      else if (session.picked !== null && e.key === "Enter" && !target?.closest("button, a, summary")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!ready) return null;

  const now = Date.now();
  const at = (c: ReviewCard) => progress.items[c.id];
  const visible = cards.filter((c) => filter === "all" || c.area === filter);
  const dueIds = visible.filter((c) => isDue(at(c), now)).map((c) => c.id);
  const extraIds = visible.filter((c) => !isDue(at(c), now) && !isMastered(at(c))).map((c) => c.id);
  const masteredN = visible.filter((c) => isMastered(at(c))).length;
  const newN = visible.filter((c) => !at(c)).length;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((EXAM_DAY.getTime() - today.getTime()) / DAY_MS);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 pb-[max(env(safe-area-inset-bottom),1rem)] text-ink" style={{ fontFamily: FONT }}>
      <header className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div>
            <h1 className="text-[2.25rem]">Ôn lỗi sai N3</h1>
            <p className="text-sm text-ink-muted">
              {daysLeft > 0 ? `Còn ${daysLeft} ngày đến JLPT 6/12` : daysLeft === 0 ? "Hôm nay thi JLPT. Cố lên!" : "Kanji, từ vựng, ngữ pháp"} ·{" "}
              {cards.length} câu đã sai
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPanel((v) => !v)}
            aria-expanded={panel}
            className={`${BTN} h-9 gap-2 border border-border bg-surface px-3 text-xs`}
          >
            <span className={`size-2 rounded-full ${STATUS[status].dot}`} aria-hidden="true" />
            {STATUS[status].label}
            {status === "synced" && lastSync ? ` ${fmtTime(lastSync)}` : ""}
          </button>
        </div>
        {panel && <SyncPanel sync={sync} status={status} lastSync={lastSync} onConnected={() => setPanel(false)} />}
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-border bg-surface p-1" role="group" aria-label="Chế độ">
          {(["study", "list"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className={`${BTN} h-9 px-4 text-sm ${tab === t ? "bg-ink text-surface" : "text-ink"}`}
            >
              {t === "study" ? "Ôn hôm nay" : "Danh sách"}
            </button>
          ))}
        </div>
        {!(tab === "study" && session) && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Phần">
            {(["all", ...AREAS] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`${BTN} h-8 border px-3 text-sm ${filter === f ? "border-ink bg-ink text-surface" : "border-border bg-surface text-ink"}`}
              >
                {f === "all" ? "Tất cả" : AREA_LABELS[f]}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "study" && !session && (
        <section className="space-y-4 rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          <p className="font-serif text-6xl font-semibold leading-none">{dueIds.length}</p>
          <p className="text-sm text-ink-muted">câu cần ôn hôm nay</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg" aria-hidden="true">
            <div className="h-full bg-accent" style={{ width: `${(100 * masteredN) / visible.length}%` }} />
          </div>
          <p className="text-xs text-ink-muted">
            Đã thuộc {masteredN}/{visible.length} · Chưa ôn {newN}
          </p>
          {dueIds.length > 0 ? (
            <button type="button" className={PRIMARY} onClick={() => begin(dueQueue(shuffled(dueIds), progress, Date.now()))}>
              Bắt đầu ôn
            </button>
          ) : extraIds.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm">Hôm nay đã ôn hết câu đến hạn.</p>
              <button type="button" className={SECONDARY} onClick={() => begin(shuffled(extraIds))}>
                Ôn thêm {extraIds.length} câu chưa thuộc
              </button>
            </div>
          ) : (
            <p className="text-sm">Đã thuộc hết phần này. Câu sẽ quay lại sau 7 ngày.</p>
          )}
        </section>
      )}

      {tab === "study" && session && card && (
        <section ref={quizRef} className="scroll-mt-4 space-y-5 rounded-3xl border border-border bg-surface p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-ink">{AREA_LABELS[card.area]}</span>
            <span>
              {session.answered + (session.picked === null ? 1 : 0)} / {session.answered + session.queue.length - (session.picked === null ? 0 : 1)}
            </span>
            <button type="button" onClick={() => setSession(null)} className={`ml-auto rounded underline underline-offset-2 ${RING}`}>
              Dừng
            </button>
          </div>
          <p className="text-base leading-relaxed">{card.quiz.q}</p>
          <ol className="grid gap-2">
            {session.order.map((i, n) => {
              const look =
                session.picked === null
                  ? "border-border bg-bg hover:border-accent"
                  : i === card.quiz.answer
                    ? GOOD
                    : i === session.picked
                      ? BAD
                      : "border-border bg-bg opacity-50";
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={session.picked !== null}
                    onClick={() => pick(i)}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 py-2 text-left touch-manipulation ${RING} ${look}`}
                  >
                    <span className="w-4 text-xs text-ink-muted">{n + 1}</span>
                    <span lang="ja" className="text-lg">
                      {card.quiz.options[i]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {session.picked !== null && <Feedback card={card} right={session.picked === card.quiz.answer} onNext={next} />}
        </section>
      )}

      {tab === "study" && session && !card && (
        <section className="space-y-4 rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          <p className="font-serif text-[2rem] font-semibold">Xong phiên ôn</p>
          <p className="text-sm text-ink-muted">
            Đúng {session.right}/{session.answered} lượt trả lời.
          </p>
          <button type="button" className={PRIMARY} onClick={() => setSession(null)}>
            Về trang đầu
          </button>
        </section>
      )}

      {tab === "list" &&
        SOURCES.map((src) => {
          const list = visible.filter((c) => c.source === src);
          return (
            list.length > 0 && (
              <section key={src} className="space-y-2">
                <h2 className="text-xl">{SOURCE_LABELS[src]}</h2>
                {list.map((c) => {
                  const s = statusOf(at(c));
                  return (
                    <details key={c.id} className="group rounded-2xl border border-border bg-surface px-4 py-3">
                      <summary className={SUMMARY}>
                        <span className="min-w-0 flex-1">
                          <span className="font-medium">{c.title}</span>
                          <span className="ml-2 text-xs text-ink-muted">{AREA_LABELS[c.area]}</span>
                        </span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${s.cls}`}>{s.label}</span>
                        <ChevronDown className="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <CardDetails card={c} />
                    </details>
                  );
                })}
              </section>
            )
          );
        })}
    </div>
  );
}

function Feedback({ card, right, onNext }: { card: ReviewCard; right: boolean; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <p role="status" className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${right ? GOOD : BAD}`}>
        <b>{right ? "Đúng rồi." : "Chưa đúng."}</b> {card.quiz.explain}
      </p>
      {/* Open when wrong: the mistake from the test is what needs reading. */}
      <details open={!right} className="group rounded-2xl border border-border px-4 py-3">
        <summary className={`${SUMMARY} text-sm`}>
          <span className="text-ink-muted">Lỗi trong đề:</span>
          <span className="font-medium">{card.title}</span>
          <ChevronDown className="ml-auto size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <CardDetails card={card} />
      </details>
      <button type="button" onClick={onNext} className={`${PRIMARY} w-full`}>
        Tiếp
      </button>
    </div>
  );
}

function CardDetails({ card }: { card: ReviewCard }) {
  return (
    <div className="mt-3 space-y-3 text-sm leading-relaxed">
      <p className="text-xs text-ink-muted">
        {card.tag} · {SOURCE_LABELS[card.source]} · {card.where}
      </p>
      <p>{card.gist}</p>
      <p>
        Đã chọn <span className="text-[#8A3B2A] line-through">{card.pick}</span>, đáp án <span className="font-medium">{card.ans}</span>
      </p>
      <p>{card.why}</p>
      <p className="text-ink-muted">{card.note}</p>
      <ul className="space-y-2">
        {card.examples.map(([ja, vi]) => (
          <li key={ja} className="rounded-xl bg-bg px-3 py-2">
            <p lang="ja">{ja}</p>
            <p className="text-ink-muted">{vi}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SyncPanel({ sync, status, lastSync, onConnected }: { sync: GistSync; status: SyncStatus; lastSync: number | null; onConnected: () => void }) {
  const [token, setToken] = useState("");
  const busy = status === "connecting" || status === "syncing";
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (await sync.connect(token)) {
      setToken("");
      onConnected();
    }
  };

  if (sync.connected && status !== "auth") {
    return (
      <section className="space-y-3 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
        <p>Đã kết nối với gist trên GitHub{lastSync ? `. Đồng bộ lần cuối lúc ${fmtTime(lastSync)}` : ""}.</p>
        {status === "offline" && <p className="text-[#8A3B2A]">Không gọi được GitHub. Câu trả lời vẫn lưu trên máy này và sẽ gửi khi có mạng.</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => void sync.sync()} className={SECONDARY}>
            Đồng bộ ngay
          </button>
          <button type="button" onClick={() => sync.disconnect()} className={SECONDARY}>
            Ngắt kết nối máy này
          </button>
        </div>
        <p className="text-xs text-ink-muted">Ngắt kết nối chỉ xóa token trên máy này. Tiến độ vẫn giữ nguyên.</p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
      <p>
        Tiến độ lưu trong một <b>secret gist</b> trên GitHub của bạn. Token chỉ nằm trong trình duyệt này và chỉ gửi tới api.github.com.
      </p>
      <ol className="list-decimal space-y-1 pl-5">
        <li>
          Mở{" "}
          <a href={TOKEN_URL} target="_blank" rel="noopener noreferrer">
            trang tạo token
          </a>
          . Tên, hạn 30 ngày và quyền <b>Gists: Read and write</b> đã điền sẵn. Bấm <b>Generate token</b>.
        </li>
        <li>Lưu token vào trình quản lý mật khẩu để dùng trên máy khác.</li>
        <li>Dán token vào ô dưới. Mỗi máy chỉ làm một lần.</li>
      </ol>
      {status === "auth" && <p className="text-[#8A3B2A]">Token sai, hết hạn hoặc thiếu quyền Gists. Dán token mới.</p>}
      {status === "offline" && <p className="text-[#8A3B2A]">Không gọi được GitHub. Kiểm tra mạng rồi thử lại.</p>}
      <div className="flex gap-2">
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_…"
          autoComplete="off"
          spellCheck={false}
          aria-label="GitHub token"
          className={`h-11 min-w-0 flex-1 rounded-full border border-border bg-bg px-4 font-mono text-sm ${RING}`}
        />
        <button type="submit" disabled={!token.trim() || busy} className={PRIMARY}>
          Kết nối
        </button>
      </div>
    </form>
  );
}
