// Generate flashcard images via a free AI provider.
//
// Providers (pick via PROVIDER env var; default: pollinations):
//   - pollinations : https://pollinations.ai  (no key, truly free, unlimited-ish)
//   - hf           : Hugging Face Inference Providers (needs HF_TOKEN, free monthly credits)
//
// Decks (pick via DECK env var; default: n5-lesson12-c):
//   - n5-lesson12-c (39 cards)
//   - n5-lesson15-1 (21 cards)
//   - n5-lesson15-6 (25 cards)
//
// Setup (Pollinations – zero config):
//   npm run gen:images                       # default deck
//   DECK=n5-lesson15-1 npm run gen:images    # specific deck
//
// Setup (Hugging Face – better quality when credits available):
//   1. Get a free token: https://huggingface.co/settings/tokens
//   2. In .env: HF_TOKEN=hf_...
//   3. PROVIDER=hf DECK=n5-lesson15-1 npm run gen:images
//
// The script:
//   - Generates one zen-style illustration per card in the chosen deck
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
const DECK = process.env.DECK || "n5-lesson12-c";
const OUT_DIR = join(__dirname, "..", "public", "images", "flashcards", DECK);
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

// id -> concept description, keyed by deck slug. Re-run only regenerates missing ids.
const ALL_PROMPTS = {
  "n5-lesson12-c": {
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
  },
  "n5-lesson15-1": {
    1: "a genuine antique pottery item next to a small certificate of authenticity, museum-style display",
    2: "a portrait of a young man with a friendly expression, casual outfit",
    3: "swirling typhoon clouds over a coastal town, palm trees bending in the wind",
    4: "fresh laundry hanging on a clothesline drying in the sun, pegs clipped neatly",
    5: "a colorful amusement park scene with a ferris wheel and roller coaster in the distance",
    6: "a hiker walking a mountain trail with a backpack, surrounded by tall trees",
    7: "a stern teacher with a pointer at a chalkboard, strict posture",
    8: "a crowded street with many people walking shoulder-to-shoulder during rush hour",
    9: "an arrow rising upward alongside ascending stairs, motion suggesting growth",
    10: "an arrow falling downward alongside descending stairs, motion suggesting decline",
    11: "clothes drying on a clothesline under bright midday sun, fabric fully dry",
    12: "clouds breaking apart with sun shining through, rain stopping over a quiet park",
    13: "a shooting star in a night sky with hands reaching toward it, dream-coming-true mood",
    14: "people enjoying a picnic in a park, laughing and relaxed, basket and blankets",
    15: "two hands handing a book back to another person across a counter",
    16: "a desk calendar with a single event crossed out in red, cancelled meeting",
    17: "a person at the summit of a mountain with arms raised in triumph",
    18: "a person looking dejected next to a fallen project on the floor, shoulders slumped",
    19: "a hand pointing forward with confidence, determined expression in profile",
    20: "a person opening the front door of a home, stepping inside with a warm welcome",
    21: "a family welcoming someone at the front entrance with smiles and open arms",
  },
  "n5-lesson15-6": {
    1: "a person wrapped in a blanket holding a tissue, looking sick with a cup of tea nearby",
    2: "an ambulance with flashing lights speeding down a city street",
    3: "two cars after a fender-bender on a road with safety cones around them, no people",
    4: "a bright lightning bolt striking from dark storm clouds in a stormy sky",
    5: "an empty house with a closed front door, no lights on, no one home",
    6: "a traditional Japanese ryokan inn with tatami floors and shoji sliding doors, lantern outside",
    7: "tourists with cameras and luggage exploring an old city street",
    8: "a clearly marked entrance to a building with a welcoming gate and arrow sign",
    9: "a celebrity walking the red carpet with cameras flashing, paparazzi silhouettes",
    10: "various seasoning bottles arranged neatly on a kitchen shelf, salt pepper soy sauce",
    11: "a typical weekday office scene with people working at desks, calm productive atmosphere",
    12: "a gas station pump filling a parked car, fuel nozzle in tank",
    13: "a completely dark room with only a faint silhouette of furniture visible",
    14: "two identical objects side by side on a shelf, perfectly matching pair",
    15: "a person sneezing into a tissue, looking unwell, catching a cold",
    16: "a group of people gathered in a circle for a meeting, friendly assembly",
    17: "a person holding up an open umbrella in the rain, walking calmly",
    18: "a delivery person handing a cardboard package to a recipient at a doorway",
    19: "an empty container or shelf where something used to be, clear absence",
    20: "two people accidentally bumping into each other on a busy street",
    21: "a craftsperson admiring a finished handmade piece of pottery on a workbench",
    22: "a person with a bandage on their arm sitting calmly, treating an injury",
    23: "a wall clock with a quick-motion arrow, suggesting instant action",
    24: "a thermometer or progress bar showing significant progress, three-quarters full",
    25: "a thoughtful person with a large question mark above their head, considering possibilities",
  },
};

const PROMPTS = ALL_PROMPTS[DECK];

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

  if (!PROMPTS) {
    console.error(`✗ Unknown DECK="${DECK}". Valid: ${Object.keys(ALL_PROMPTS).join(", ")}`);
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
    console.log(`✓ All ${ids.length} images for "${DECK}" already exist. Nothing to do.`);
    return;
  }

  const label = PROVIDER === "hf" ? `Hugging Face / ${HF_MODEL}` : `Pollinations / ${POLLINATIONS_MODEL}`;
  console.log(`Deck: ${DECK} (${ids.length} cards)`);
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
