export type FlashCard = {
  id: number;
  kanji: string;
  hiragana: string;
  vietnamese: string;
  /**
   * Optional image filename (relative to /public/images/flashcards/<deck.slug>/).
   * If the file is missing at runtime, the image is silently hidden.
   */
  image?: string;
};

export type Deck = {
  slug: string;
  title: string;
  subtitle: string;
  cards: FlashCard[];
};
