export type FlashCard = {
  id: number;
  kanji: string;
  hiragana: string;
  vietnamese: string;
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
    { id: 1, kanji: "兄弟", hiragana: "きょうだい", vietnamese: "anh em" },
    { id: 2, kanji: "独身", hiragana: "どくしん", vietnamese: "độc thân" },
    { id: 3, kanji: "会長", hiragana: "かいちょう", vietnamese: "chủ tịch" },
    { id: 4, kanji: "花瓶", hiragana: "かびん", vietnamese: "bình hoa" },
    { id: 5, kanji: "桜", hiragana: "さくら", vietnamese: "hoa anh đào" },
    { id: 6, kanji: "虫", hiragana: "むし", vietnamese: "sâu bọ" },
    { id: 7, kanji: "ごみ", hiragana: "ごみ", vietnamese: "rác" },
    { id: 8, kanji: "落とし物", hiragana: "おとしもの", vietnamese: "đồ đánh rơi" },
    { id: 9, kanji: "周り", hiragana: "まわり", vietnamese: "xung quanh" },
    { id: 10, kanji: "太陽", hiragana: "たいよう", vietnamese: "mặt trời" },
    { id: 11, kanji: "月", hiragana: "つき", vietnamese: "mặt trăng" },
    { id: 12, kanji: "地球", hiragana: "ちきゅう", vietnamese: "trái đất" },
    { id: 13, kanji: "床", hiragana: "ゆか", vietnamese: "sàn nhà" },
    { id: 14, kanji: "パート", hiragana: "ぱーと", vietnamese: "làm thêm" },
    { id: 15, kanji: "ドア", hiragana: "どあ", vietnamese: "cửa" },
    { id: 16, kanji: "シャツ", hiragana: "しゃつ", vietnamese: "áo sơ mi" },
    { id: 17, kanji: "ハンカチ", hiragana: "はんかち", vietnamese: "khăn tay, khăn mùi soa" },
    { id: 18, kanji: "(~を)習う", hiragana: "ならう", vietnamese: "học" },
    { id: 19, kanji: "(~に)付く", hiragana: "つく", vietnamese: "có dính, có gắn ~" },
    { id: 20, kanji: "開く", hiragana: "あく", vietnamese: "~ mở" },
    { id: 21, kanji: "閉まる", hiragana: "しまる", vietnamese: "~ đóng" },
    { id: 22, kanji: "(~に)住む", hiragana: "すむ", vietnamese: "sống" },
    { id: 23, kanji: "(~を)知る", hiragana: "しる", vietnamese: "biết" },
    { id: 24, kanji: "咲く", hiragana: "さく", vietnamese: "(hoa) nở" },
    { id: 25, kanji: "立つ", hiragana: "たつ", vietnamese: "đứng" },
    { id: 26, kanji: "回る", hiragana: "まわる", vietnamese: "xoay vòng, quay vòng" },
    { id: 27, kanji: "出る", hiragana: "でる", vietnamese: "ra, lòi ra" },
    { id: 28, kanji: "濡れる", hiragana: "ぬれる", vietnamese: "ướt" },
    { id: 29, kanji: "(~を)入れる", hiragana: "いれる", vietnamese: "cho ~ vào" },
    { id: 30, kanji: "落ちる", hiragana: "おちる", vietnamese: "rơi" },
    { id: 31, kanji: "汚れる", hiragana: "よごれる", vietnamese: "bị bẩn" },
    { id: 32, kanji: "割れる", hiragana: "われる", vietnamese: "vỡ" },
    { id: 33, kanji: "破れる", hiragana: "やぶれる", vietnamese: "rách" },
    { id: 34, kanji: "倒れる", hiragana: "たおれる", vietnamese: "ngã, đổ, ngất" },
    { id: 35, kanji: "(~と)結婚(する)", hiragana: "けっこん(する)", vietnamese: "kết hôn" },
    { id: 36, kanji: "(~を)生産(する)", hiragana: "せいさん(する)", vietnamese: "sản xuất" },
    { id: 37, kanji: "きちんと", hiragana: "きちんと", vietnamese: "đầy đủ, cẩn thận" },
    { id: 38, kanji: "仲がいい", hiragana: "なかがいい", vietnamese: "có mối quan hệ thân thiết" },
    { id: 39, kanji: "ご苦労様です", hiragana: "ごくろうさまです", vietnamese: "Bạn đã làm việc vất vả rồi" },
  ],
};
