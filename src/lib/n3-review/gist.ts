// Sync review progress through one secret gist on the user's GitHub account.
// The token lives only in this browser's localStorage and is sent only to api.github.com.
// Local writes are instant; the gist gets them a few seconds later, and on page hide.
import { emptyState, merge, parseState, sameItems, type ProgressState } from "./progress.ts";

export const GIST_FILE = "n3-review-progress.json";
const GIST_DESCRIPTION = "vinh.to N3 review progress (written by vinh.to/japanese/n3/)";
const API = "https://api.github.com";

export const STORAGE_KEYS = {
  state: "n3review:state",
  token: "n3review:gh-token",
  gist: "n3review:gh-gist",
} as const;

export type SyncStatus = "local" | "connecting" | "syncing" | "synced" | "offline" | "auth";

type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type SyncDeps = {
  fetch: typeof fetch;
  storage: KeyValueStore | null;
  onState: (state: ProgressState) => void;
  onStatus: (status: SyncStatus, lastSync: number | null) => void;
  debounceMs?: number;
  now?: () => number;
};

class HttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`GitHub API ${status}`);
    this.status = status;
  }
}

type GistFile = { content?: string; truncated?: boolean; raw_url?: string };

export class GistSync {
  state: ProgressState = emptyState();
  status: SyncStatus = "local";
  lastSync: number | null = null;
  private deps: SyncDeps;
  private timer: ReturnType<typeof setTimeout> | null = null;
  /** rev bumps on every local change; pushedRev is the rev the gist has. */
  private rev = 0;
  private pushedRev = 0;
  private chain: Promise<void> = Promise.resolve();
  private mem = new Map<string, string>();

  constructor(deps: SyncDeps) {
    this.deps = deps;
  }

  get connected(): boolean {
    return !!(this.get(STORAGE_KEYS.token) && this.get(STORAGE_KEYS.gist));
  }

  /** Read the copy on this device. Call once on page load, before sync(). */
  load(): void {
    let parsed: ProgressState | null = null;
    try {
      const raw = this.get(STORAGE_KEYS.state);
      parsed = raw ? parseState(JSON.parse(raw)) : null;
    } catch {
      parsed = null;
    }
    this.state = parsed ?? emptyState();
    this.deps.onState(this.state);
    this.setStatus(this.connected ? "syncing" : "local");
  }

  /** Save a new state on this device, then send it to the gist after a short pause. */
  update(next: ProgressState): void {
    this.state = next;
    this.rev++;
    this.saveLocal();
    this.deps.onState(next);
    if (!this.connected) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.push();
    }, this.deps.debounceMs ?? 3000);
  }

  /** Check the token, find or create the gist, then merge both sides. */
  async connect(rawToken: string): Promise<boolean> {
    const token = rawToken.trim();
    if (!token) return false;
    this.setStatus("connecting");
    try {
      await this.api(token, "/user");
      const gistId = await this.findOrCreateGist(token);
      this.set(STORAGE_KEYS.token, token);
      this.set(STORAGE_KEYS.gist, gistId);
    } catch (e) {
      // Here a 404 also means a missing permission, so any 4xx asks for a new token.
      this.setStatus(e instanceof HttpError && e.status < 500 ? "auth" : "offline");
      return false;
    }
    await this.sync();
    return this.status === "synced";
  }

  /** Forget the token on this device. Local progress stays. */
  disconnect(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.remove(STORAGE_KEYS.token);
    this.remove(STORAGE_KEYS.gist);
    this.setStatus("local");
  }

  /** Pull the gist, merge per card, and push when the gist is behind. */
  sync(): Promise<void> {
    return this.serial(async () => {
      const token = this.get(STORAGE_KEYS.token);
      let gistId = this.get(STORAGE_KEYS.gist);
      if (!token || !gistId) return;
      this.setStatus("syncing");
      try {
        let remote: ProgressState | null;
        try {
          remote = await this.pull(token, gistId);
        } catch (e) {
          if (!(e instanceof HttpError && e.status === 404)) throw e;
          gistId = await this.findOrCreateGist(token); // the gist was deleted on GitHub
          this.set(STORAGE_KEYS.gist, gistId);
          remote = await this.pull(token, gistId);
        }
        const merged = merge(this.state, remote);
        if (!sameItems(merged, this.state)) {
          this.state = merged;
          this.saveLocal();
          this.deps.onState(merged);
        }
        if (!sameItems(merged, remote) || this.rev !== this.pushedRev) {
          await this.pushNow(token, gistId);
        }
        this.lastSync = this.now();
        this.setStatus("synced");
      } catch (e) {
        this.fail(e);
      }
    });
  }

  /** Send pending changes now. Resolves when the request is done. */
  push(): Promise<void> {
    return this.serial(async () => {
      const token = this.get(STORAGE_KEYS.token);
      const gistId = this.get(STORAGE_KEYS.gist);
      if (!token || !gistId || this.rev === this.pushedRev) return;
      this.setStatus("syncing");
      try {
        await this.pushNow(token, gistId);
        this.lastSync = this.now();
        this.setStatus("synced");
      } catch (e) {
        this.fail(e);
      }
    });
  }

  /** On page hide: send one last PATCH that survives the page closing. */
  flush(): void {
    const token = this.get(STORAGE_KEYS.token);
    const gistId = this.get(STORAGE_KEYS.gist);
    if (!token || !gistId || this.rev === this.pushedRev) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    const rev = this.rev;
    this.deps
      .fetch(`${API}/gists/${gistId}`, { method: "PATCH", keepalive: true, headers: this.headers(token), body: this.body() })
      .then(
        (res) => {
          if (res.ok) this.pushedRev = rev;
        },
        // Some browsers refuse keepalive with CORS. The page is often only hidden, so try a normal push.
        () => void this.push(),
      );
  }

  // --- internals ---

  private async pull(token: string, gistId: string): Promise<ProgressState | null> {
    const gist = (await this.api(token, `/gists/${gistId}`)) as { files?: Record<string, GistFile> };
    const file = gist.files?.[GIST_FILE];
    if (!file) return null;
    let content = file.content ?? "";
    if (file.truncated && file.raw_url) {
      content = await (await this.deps.fetch(file.raw_url, { cache: "no-store" })).text();
    }
    try {
      return parseState(JSON.parse(content));
    } catch {
      return null;
    }
  }

  private async pushNow(token: string, gistId: string): Promise<void> {
    const rev = this.rev;
    await this.api(token, `/gists/${gistId}`, { method: "PATCH", body: this.body() });
    this.pushedRev = rev;
  }

  private async findOrCreateGist(token: string): Promise<string> {
    for (let page = 1; page <= 10; page++) {
      const list = (await this.api(token, `/gists?per_page=100&page=${page}`)) as { id: string; files?: Record<string, unknown> }[];
      const hit = list.find((g) => g.files && GIST_FILE in g.files);
      if (hit) return hit.id;
      if (list.length < 100) break;
    }
    const created = (await this.api(token, "/gists", {
      method: "POST",
      body: JSON.stringify({
        description: GIST_DESCRIPTION,
        public: false,
        files: { [GIST_FILE]: { content: JSON.stringify(this.state) } },
      }),
    })) as { id: string };
    return created.id;
  }

  private body(): string {
    return JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify(this.state) } } });
  }

  private headers(token: string): Record<string, string> {
    // ponytail: no X-GitHub-Api-Version header. The default version is fine and fewer headers keep CORS simple.
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  private async api(token: string, path: string, init: RequestInit = {}): Promise<unknown> {
    const res = await this.deps.fetch(`${API}${path}`, { ...init, cache: "no-store", headers: this.headers(token) });
    if (!res.ok) throw new HttpError(res.status);
    return res.status === 204 ? null : res.json();
  }

  /** 401 or 403: the token is wrong, expired, revoked or lacks the Gists permission. */
  private fail(e: unknown): void {
    const auth = e instanceof HttpError && (e.status === 401 || e.status === 403);
    this.setStatus(auth ? "auth" : "offline");
  }

  private setStatus(s: SyncStatus): void {
    this.status = s;
    this.deps.onStatus(s, this.lastSync);
  }

  private now(): number {
    return this.deps.now ? this.deps.now() : Date.now();
  }

  private saveLocal(): void {
    this.set(STORAGE_KEYS.state, JSON.stringify(this.state));
  }

  // A memory copy backs up localStorage, so the page still works for this visit when storage is blocked.
  private get(k: string): string | null {
    try {
      const v = this.deps.storage?.getItem(k);
      if (v != null) return v;
    } catch {
      // Storage blocked: use the memory copy.
    }
    return this.mem.get(k) ?? null;
  }

  private set(k: string, v: string): void {
    this.mem.set(k, v);
    try {
      this.deps.storage?.setItem(k, v);
    } catch {
      // Storage full or blocked: the memory copy keeps this visit working.
    }
  }

  private remove(k: string): void {
    this.mem.delete(k);
    try {
      this.deps.storage?.removeItem(k);
    } catch {
      // Storage blocked: nothing to remove.
    }
  }

  /** Run network steps one at a time, so a push never races a pull. */
  private serial(fn: () => Promise<void>): Promise<void> {
    const run = this.chain.then(fn, fn);
    this.chain = run.catch(() => {});
    return run;
  }
}
