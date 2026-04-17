// Generate flashcard images via a free AI provider.
//
// Providers (pick via PROVIDER env var; default: pollinations):
//   - pollinations : https://pollinations.ai  (no key, truly free, unlimited-ish)
//   - hf           : Hugging Face Inference Providers (needs HF_TOKEN, free monthly credits)
//
// Setup (Pollinations – zero config):
//   npm run gen:images
//
// Setup (Hugging Face – better quality when credits available):
//   1. Get a free token: https://huggingface.co/settings/tokens
//   2. In .env: HF_TOKEN=hf_...
//   3. PROVIDER=hf npm run gen:images
//
// The script:
//   - Generates one zen-style illustration per N5 Bài 12 Phần C card
//   - Converts to WebP with sharp
//   - Skips cards whose image already exists (safe to re-run / resume)
//   - Retries transient errors with backoff
//   - Prints a summary at the end

import { InferenceClient } from "@huggingface/inference";
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "images", "flashcards", "n5-lesson12-c");
const PROVIDER = (process.env.PROVIDER || "pollinations").toLowerCase();
const HF_MODEL = process.env.HF_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || "flux";
const DELAY_MS = Number(
  process.env.GEN_DELAY_MS || (PROVIDER === "pollinations" ? 4000 : 1500)
);
const MAX_RETRIES = 3;

const STYLE = [
  "Soft minimalist flat illustration.",
  "Warm cream beige background color #F5F0EB.",
  "Muted earth-tone palette: warm browns, soft gold #C4A35A, sage green.",
  "Gentle shadows, zen aesthetic, hand-drawn feel.",
  "No text, no letters, no kanji, no numbers visible in the image.",
  "Square composition, centered subject, generous whitespace.",
  "Clean vector-style artwork, suitable as a flashcard thumbnail.",
].join(" ");

// id -> concept description. Re-run only regenerates missing ids.
const PROMPTS = {
  1: "two young brothers standing side by side, casual, warm and friendly",
  2: "a single young adult sitting calmly alone at a small wooden table with a cup of tea",
  3: "a company chairperson in a dark suit sitting at the head of a long boardroom table",
  4: "a ceramic vase holding fresh cut flowers, on a wooden shelf",
  5: "a branch of cherry blossoms (sakura) in full bloom, petals drifting in the air",
  6: "a small ladybug insect on a green leaf, close-up view",
  7: "a crumpled piece of paper mid-arc being tossed into an open trash bin",
  8: "a brown leather wallet lying forgotten on a city sidewalk",
  9: "a single round object in the center with small items arranged in a circle around it, top-down view",
  10: "a bright golden sun rising above distant mountains at dawn",
  11: "a full moon in a clear indigo night sky, subtle stars",
  12: "planet Earth as seen from space, continents visible, soft glow",
  13: "an empty tatami-style wooden floor in a quiet Japanese room",
  14: "a young person in a uniform working part-time behind a convenience store counter",
  15: "a closed wooden front door with a simple brass handle, warm lighting",
  16: "a folded light-blue button-up dress shirt on a clean surface",
  17: "a neatly folded cotton handkerchief with a subtle floral pattern",
  18: "a student sitting at a desk taking notes from an open textbook",
  19: "a yellow sticky note attached to a notebook page",
  20: "a wooden door slowly swinging open, warm sunlight streaming through the gap",
  21: "a wooden door gently closing shut, motion indicated by soft lines",
  22: "a small cozy cottage-style house with soft smoke curling from the chimney, surrounded by trees",
  23: "a warm yellow light bulb turning on above a thoughtful person's head (idea moment)",
  24: "a single flower bud in the act of opening into a fresh bloom",
  25: "a single person standing upright, arms relaxed at their sides, calm posture",
  26: "a traditional spinning top mid-rotation, slight motion blur at the edges",
  27: "a silhouette figure stepping out through a doorway into warm daylight",
  28: "a person caught in gentle rain, water droplets visible, slightly wet clothes",
  29: "hands placing a letter into a red mailbox, action mid-motion",
  30: "a ripe red apple in mid-air falling from a tree branch",
  31: "a clean white shirt with a single dark coffee stain on the front",
  32: "a broken ceramic plate shattered into several pieces on the floor",
  33: "a torn sheet of paper with ragged jagged edges, split in two",
  34: "a vase tipping over on a table, captured mid-fall with water spilling",
  35: "a simple silhouette of a bride and groom holding hands at a wedding",
  36: "a factory conveyor belt with identical cardboard boxes moving along it",
  37: "perfectly aligned books neatly arranged on a tidy wooden shelf",
  38: "two close friends laughing together over cups of tea at a small table",
  39: "a tired office worker politely bowing at the end of the workday, soft lighting",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHuggingFace(prompt, ctx) {
  const blob = await ctx.client.textToImage({
    model: HF_MODEL,
    inputs: prompt,
    parameters: {
      width: 1024,
      height: 1024,
      num_inference_steps: 4, // FLUX.1-schnell is tuned for 4 steps
    },
  });
  return Buffer.from(await blob.arrayBuffer());
}

async function fetchPollinations(prompt, _ctx, id) {
  // Pollinations: GET https://image.pollinations.ai/prompt/<encoded>?...
  // Returns binary image directly. No API key. FLUX-family models.
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=1024&height=1024&model=${encodeURIComponent(POLLINATIONS_MODEL)}` +
    `&nologo=true&seed=${id * 17 + 101}`;
  const res = await fetch(url, {
    // Pollinations can take 20–60s on cold path; give it room.
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) {
    throw new Error(`Pollinations ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Pollinations returned ${contentType}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

const PROVIDERS = {
  hf: fetchHuggingFace,
  pollinations: fetchPollinations,
};

async function generateOne(id, concept, ctx) {
  const prompt = `${STYLE} Subject: ${concept}.`;
  const fetcher = PROVIDERS[ctx.provider];
  if (!fetcher) throw new Error(`Unknown PROVIDER=${ctx.provider}`);

  let lastErr;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const rawBuf = await fetcher(prompt, ctx, id);
      const webp = await sharp(rawBuf)
        .resize({ width: 1024, height: 1024, fit: "cover" })
        .webp({ quality: 82 })
        .toBuffer();
      const outPath = join(OUT_DIR, `${id}.webp`);
      writeFileSync(outPath, webp);
      return { bytes: webp.length, outPath };
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message || err);
      const transient =
        msg.includes("503") ||
        msg.includes("429") ||
        msg.includes("502") ||
        msg.includes("504") ||
        msg.includes("loading") ||
        msg.includes("timeout") ||
        msg.includes("timed out") ||
        msg.includes("fetch failed");

      if (transient && attempt < MAX_RETRIES) {
        const backoff = 3000 * attempt;
        process.stdout.write(` (retry ${attempt} in ${backoff / 1000}s)`);
        await sleep(backoff);
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error("exhausted retries");
}

async function main() {
  if (!PROVIDERS[PROVIDER]) {
    console.error(`✗ Unknown PROVIDER="${PROVIDER}". Valid: ${Object.keys(PROVIDERS).join(", ")}`);
    process.exit(1);
  }

  const ctx = { provider: PROVIDER };

  if (PROVIDER === "hf") {
    const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN;
    if (!token) {
      console.error("✗ HF_TOKEN is not set.");
      console.error("  1. Get a free token: https://huggingface.co/settings/tokens");
      console.error("  2. In .env: HF_TOKEN=hf_...");
      console.error("  3. PROVIDER=hf npm run gen:images");
      console.error("");
      console.error("  (or drop PROVIDER entirely to use Pollinations, which needs no key.)");
      process.exit(1);
    }
    ctx.client = new InferenceClient(token);
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const ids = Object.keys(PROMPTS).map(Number).sort((a, b) => a - b);
  const todo = ids.filter((id) => !existsSync(join(OUT_DIR, `${id}.webp`)));

  if (todo.length === 0) {
    console.log("✓ All 39 images already exist. Nothing to do.");
    return;
  }

  const label = PROVIDER === "hf" ? `Hugging Face / ${HF_MODEL}` : `Pollinations / ${POLLINATIONS_MODEL}`;
  console.log(`Generating ${todo.length} image(s) with ${label} …`);
  console.log(`(delay between requests: ${DELAY_MS}ms)\n`);

  const results = { ok: [], fail: [] };

  for (const id of todo) {
    process.stdout.write(`  [${String(id).padStart(2)}] ${PROMPTS[id].slice(0, 48).padEnd(48)}`);
    try {
      const res = await generateOne(id, PROMPTS[id], ctx);
      console.log(` ✓ ${(res.bytes / 1024).toFixed(0)}KB`);
      results.ok.push(id);
    } catch (err) {
      console.log(` ✗ ${err.message}`);
      results.fail.push({ id, error: err.message });
    }
    if (id !== todo[todo.length - 1]) await sleep(DELAY_MS);
  }

  console.log("");
  console.log(`✓ Success: ${results.ok.length}`);
  if (results.fail.length) {
    console.log(`✗ Failed:  ${results.fail.length}`);
    results.fail.forEach(({ id, error }) => console.log(`    ${id}: ${error}`));
    console.log("  Re-run the script to retry failed ids only.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
