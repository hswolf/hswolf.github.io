// Generate flashcard images with Google Gemini (Nano Banana).
//
// Setup:
//   1. Get a free API key: https://aistudio.google.com/app/apikey
//   2. cp .env.example .env   # then paste your key into .env
//   3. npm run gen:images     # loads .env via Node's --env-file
//
// The script:
//   - Uses gemini-2.5-flash-image-preview
//   - Generates 39 zen-style illustrations, one per N5 Bài 12 Phần C card
//   - Converts PNG -> WebP with sharp (smaller, same filename convention)
//   - Skips cards whose image already exists (safe to re-run / resume)
//   - Prints a summary at the end

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "images", "flashcards", "n5-lesson12-c");
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";
const DELAY_MS = Number(process.env.GEMINI_DELAY_MS || 1500);

const STYLE = [
  "Soft minimalist flat illustration.",
  "Warm cream/beige background (#F5F0EB).",
  "Muted earth-tone palette: warm browns, soft gold (#C4A35A), sage green.",
  "Gentle shadows, zen aesthetic, hand-drawn feel.",
  "Absolutely no text, no letters, no kanji, no numbers in the image.",
  "Square composition, centered subject, generous whitespace.",
  "Clean vector-style artwork, suitable as a flashcard thumbnail.",
].join(" ");

// id -> concept description (English, short, unambiguous).
// Tweak freely; re-run only regenerates missing ids.
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
  24: "a single flower bud in the act of opening into a fresh bloom, step-by-step suggestion",
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

async function generateOne(client, id, concept) {
  const prompt = `${STYLE}\n\nSubject: ${concept}`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p) => p.inlineData && p.inlineData.mimeType?.startsWith("image/")
  );

  if (!imagePart) {
    const textPart = parts.find((p) => p.text);
    throw new Error(
      `No image returned for id=${id}. Response text: ${textPart?.text ?? "(none)"}`
    );
  }

  const pngBuffer = Buffer.from(imagePart.inlineData.data, "base64");
  const webpBuffer = await sharp(pngBuffer)
    .resize({ width: 1024, height: 1024, fit: "cover" })
    .webp({ quality: 82 })
    .toBuffer();

  const outPath = join(OUT_DIR, `${id}.webp`);
  writeFileSync(outPath, webpBuffer);
  return { id, bytes: webpBuffer.length, outPath };
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("✗ GEMINI_API_KEY is not set.");
    console.error("  1. Get a free key: https://aistudio.google.com/app/apikey");
    console.error("  2. cp .env.example .env");
    console.error("  3. Paste the key into .env (GEMINI_API_KEY=...)");
    console.error("  4. npm run gen:images");
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const ids = Object.keys(PROMPTS).map(Number).sort((a, b) => a - b);
  const todo = ids.filter((id) => !existsSync(join(OUT_DIR, `${id}.webp`)));

  if (todo.length === 0) {
    console.log("✓ All 39 images already exist. Nothing to do.");
    return;
  }

  console.log(`Generating ${todo.length} image(s) with ${MODEL} …`);
  console.log(`(delay between requests: ${DELAY_MS}ms)\n`);

  const results = { ok: [], fail: [] };

  for (const id of todo) {
    process.stdout.write(`  [${String(id).padStart(2)}] ${PROMPTS[id].slice(0, 48)}… `);
    try {
      const res = await generateOne(client, id, PROMPTS[id]);
      console.log(`✓ ${(res.bytes / 1024).toFixed(0)}KB`);
      results.ok.push(id);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      results.fail.push({ id, error: err.message });
    }
    if (id !== todo[todo.length - 1]) await new Promise((r) => setTimeout(r, DELAY_MS));
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
