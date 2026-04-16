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

export const n5Lesson12C: Deck = {
  slug: "n5-lesson12-c",
  title: "Flashcard Sơ Cấp N5",
  subtitle: "Từ vựng Bài 12 - Phần C",
  cards: [
    { id: 1, kanji: "兄弟", hiragana: "きょうだい", vietnamese: "anh em", image: "1.webp" },
    { id: 2, kanji: "独身", hiragana: "どくしん", vietnamese: "độc thân", image: "2.webp" },
    { id: 3, kanji: "会長", hiragana: "かいちょう", vietnamese: "chủ tịch", image: "3.webp" },
    { id: 4, kanji: "花瓶", hiragana: "かびん", vietnamese: "bình hoa", image: "4.webp" },
    { id: 5, kanji: "桜", hiragana: "さくら", vietnamese: "hoa anh đào", image: "5.webp" },
    { id: 6, kanji: "虫", hiragana: "むし", vietnamese: "sâu bọ", image: "6.webp" },
    { id: 7, kanji: "ごみ", hiragana: "ごみ", vietnamese: "rác", image: "7.webp" },
    { id: 8, kanji: "落とし物", hiragana: "おとしもの", vietnamese: "đồ đánh rơi", image: "8.webp" },
    { id: 9, kanji: "周り", hiragana: "まわり", vietnamese: "xung quanh", image: "9.webp" },
    { id: 10, kanji: "太陽", hiragana: "たいよう", vietnamese: "mặt trời", image: "10.webp" },
    { id: 11, kanji: "月", hiragana: "つき", vietnamese: "mặt trăng", image: "11.webp" },
    { id: 12, kanji: "地球", hiragana: "ちきゅう", vietnamese: "trái đất", image: "12.webp" },
    { id: 13, kanji: "床", hiragana: "ゆか", vietnamese: "sàn nhà", image: "13.webp" },
    { id: 14, kanji: "パート", hiragana: "ぱーと", vietnamese: "làm thêm", image: "14.webp" },
    { id: 15, kanji: "ドア", hiragana: "どあ", vietnamese: "cửa", image: "15.webp" },
    { id: 16, kanji: "シャツ", hiragana: "しゃつ", vietnamese: "áo sơ mi", image: "16.webp" },
    { id: 17, kanji: "ハンカチ", hiragana: "はんかち", vietnamese: "khăn tay, khăn mùi soa", image: "17.webp" },
    { id: 18, kanji: "(~を)習う", hiragana: "ならう", vietnamese: "học", image: "18.webp" },
    { id: 19, kanji: "(~に)付く", hiragana: "つく", vietnamese: "có dính, có gắn ~", image: "19.webp" },
    { id: 20, kanji: "開く", hiragana: "あく", vietnamese: "~ mở", image: "20.webp" },
    { id: 21, kanji: "閉まる", hiragana: "しまる", vietnamese: "~ đóng", image: "21.webp" },
    { id: 22, kanji: "(~に)住む", hiragana: "すむ", vietnamese: "sống", image: "22.webp" },
    { id: 23, kanji: "(~を)知る", hiragana: "しる", vietnamese: "biết", image: "23.webp" },
    { id: 24, kanji: "咲く", hiragana: "さく", vietnamese: "(hoa) nở", image: "24.webp" },
    { id: 25, kanji: "立つ", hiragana: "たつ", vietnamese: "đứng", image: "25.webp" },
    { id: 26, kanji: "回る", hiragana: "まわる", vietnamese: "xoay vòng, quay vòng", image: "26.webp" },
    { id: 27, kanji: "出る", hiragana: "でる", vietnamese: "ra, lòi ra", image: "27.webp" },
    { id: 28, kanji: "濡れる", hiragana: "ぬれる", vietnamese: "ướt", image: "28.webp" },
    { id: 29, kanji: "(~を)入れる", hiragana: "いれる", vietnamese: "cho ~ vào", image: "29.webp" },
    { id: 30, kanji: "落ちる", hiragana: "おちる", vietnamese: "rơi", image: "30.webp" },
    { id: 31, kanji: "汚れる", hiragana: "よごれる", vietnamese: "bị bẩn", image: "31.webp" },
    { id: 32, kanji: "割れる", hiragana: "われる", vietnamese: "vỡ", image: "32.webp" },
    { id: 33, kanji: "破れる", hiragana: "やぶれる", vietnamese: "rách", image: "33.webp" },
    { id: 34, kanji: "倒れる", hiragana: "たおれる", vietnamese: "ngã, đổ, ngất", image: "34.webp" },
    { id: 35, kanji: "(~と)結婚(する)", hiragana: "けっこん(する)", vietnamese: "kết hôn", image: "35.webp" },
    { id: 36, kanji: "(~を)生産(する)", hiragana: "せいさん(する)", vietnamese: "sản xuất", image: "36.webp" },
    { id: 37, kanji: "きちんと", hiragana: "きちんと", vietnamese: "đầy đủ, cẩn thận", image: "37.webp" },
    { id: 38, kanji: "仲がいい", hiragana: "なかがいい", vietnamese: "có mối quan hệ thân thiết", image: "38.webp" },
    { id: 39, kanji: "ご苦労様です", hiragana: "ごくろうさまです", vietnamese: "Bạn đã làm việc vất vả rồi", image: "39.webp" },
  ],
};
