// Run: npm test  (node --experimental-strip-types --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { MASTERED_BOX, dueQueue, isDue, merge, review, type ProgressState } from "./progress.ts";
import { GIST_FILE, GistSync, type SyncStatus } from "./gist.ts";
import { cards } from "../../data/n3-review/cards.ts";

test("cards: unique ids, three areas, valid quiz answers", () => {
  assert.equal(new Set(cards.map((c) => c.id)).size, cards.length);
  assert.deepEqual([...new Set(cards.map((c) => c.area))].sort(), ["grammar", "kanji", "vocab"]);
  for (const c of cards) {
    assert.ok(c.quiz.answer >= 0 && c.quiz.answer < c.quiz.options.length, c.id);
    assert.equal(c.examples.length, 2, c.id);
    // A ★ question must print the sentence with its 4 blanks, or "ô thứ 3" points at nothing.
    if (c.quiz.q.includes("ô ★")) assert.match(c.quiz.q, /「[^」]*★[^」]*」/, c.id);
  }
});

test("review: right moves up one box, wrong goes back to box 0", () => {
  const now = new Date(2026, 10, 21, 10, 0).getTime();
  const r1 = review(undefined, true, now);
  assert.equal(r1.box, 1);
  assert.equal(r1.due, new Date(2026, 10, 22).getTime(), "due at the start of tomorrow");
  const r3 = review(review(r1, true, now), true, now);
  assert.equal(r3.box, MASTERED_BOX);
  assert.equal(review(r3, true, now).box, MASTERED_BOX, "stays mastered");
  const w = review(r3, false, now);
  assert.deepEqual([w.box, w.due, w.wrong, w.seen], [0, now, 1, 4]);
  assert.ok(isDue(undefined, now) && isDue(w, now) && !isDue(r1, now));
});

test("merge keeps the newer side per card; dueQueue puts low boxes first", () => {
  const p = (box: number, due: number, t: string) => ({ box, due, seen: 1, wrong: 0, t });
  const a: ProgressState = { v: 1, items: { x: p(1, 0, "2026-11-21T01:00:00Z") } };
  const b: ProgressState = { v: 1, items: { x: p(2, 0, "2026-11-21T02:00:00Z"), y: p(0, 0, "2026-11-21T00:00:00Z") } };
  const m = merge(a, b);
  assert.equal(m.items.x.box, 2);
  assert.ok(m.items.y);
  const withFuture: ProgressState = { v: 1, items: { ...m.items, w: p(1, Number.MAX_SAFE_INTEGER, "t") } };
  assert.deepEqual(dueQueue(["x", "y", "z", "w"], withFuture, 1000), ["y", "z", "x"]);
});

// --- a tiny fake of the GitHub gists API -------------------------------------

function fakeGitHub(validToken: string) {
  const gists = new Map<string, { files: Record<string, { content: string }> }>();
  let next = 1;
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  const fetchImpl = async (input: string | URL | Request, init: RequestInit = {}) => {
    const url = new URL(String(input));
    if (new Headers(init.headers).get("Authorization") !== `Bearer ${validToken}`) return json(401, {});
    const method = (init.method ?? "GET").toUpperCase();
    if (url.pathname === "/user") return json(200, { login: "me" });
    if (url.pathname === "/gists" && method === "GET") {
      return json(200, [...gists].map(([id, g]) => ({ id, files: Object.fromEntries(Object.keys(g.files).map((f) => [f, {}])) })));
    }
    if (url.pathname === "/gists" && method === "POST") {
      const id = `g${next++}`;
      gists.set(id, { files: JSON.parse(String(init.body)).files });
      return json(201, { id });
    }
    const m = url.pathname.match(/^\/gists\/(\w+)$/);
    const g = m && gists.get(m[1]);
    if (!m || !g) return json(404, {});
    if (method === "PATCH") Object.assign(g.files, JSON.parse(String(init.body)).files);
    return json(200, { id: m[1], files: g.files });
  };
  return { fetch: fetchImpl as typeof fetch, gists };
}

function device(fetchImpl: typeof fetch) {
  const store = new Map<string, string>();
  const statuses: SyncStatus[] = [];
  const sync = new GistSync({
    fetch: fetchImpl,
    storage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v), removeItem: (k) => void store.delete(k) },
    onState: () => {},
    onStatus: (s) => statuses.push(s),
    debounceMs: 1,
  });
  sync.load();
  return { sync, store, statuses };
}

test("two devices share progress through one secret gist", async () => {
  const gh = fakeGitHub("good");
  const now = Date.now();

  const a = device(gh.fetch);
  a.sync.update({ v: 1, items: { g1: review(undefined, true, now) } });
  assert.equal(await a.sync.connect("good"), true);
  assert.equal(gh.gists.size, 1, "first device creates the gist");
  assert.ok(JSON.parse([...gh.gists.values()][0].files[GIST_FILE].content).items.g1);

  const b = device(gh.fetch);
  assert.equal(await b.sync.connect("good"), true);
  assert.equal(gh.gists.size, 1, "second device finds the same gist");
  assert.equal(b.sync.state.items.g1.box, 1);

  b.sync.update({ v: 1, items: { ...b.sync.state.items, qv1: review(undefined, false, now + 1000) } });
  await b.sync.push();
  await a.sync.sync();
  assert.ok(a.sync.state.items.qv1, "device A sees device B's answer");
  assert.equal(a.sync.status, "synced");
});

test("a bad or expired token ends in the auth status and stores nothing", async () => {
  const gh = fakeGitHub("good");
  const c = device(gh.fetch);
  assert.equal(await c.sync.connect("bad"), false);
  assert.equal(c.sync.status, "auth");
  assert.equal(c.sync.connected, false);
  assert.equal(gh.gists.size, 0);
});
