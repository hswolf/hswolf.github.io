// Kanji, vocabulary and grammar mistakes from N3 tests, ported from the "Sổ lỗi sai N3"
// notebook on 2026-11-21 (JLPT 7/2025 cards added 2026-11-22). Edit by hand from here on.
// Card ids are progress keys in localStorage and the sync gist: never rename them.
import type { ReviewCard } from "./types.ts";

export const cards: ReviewCard[] = [
  {
    "id": "sv3",
    "area": "kanji",
    "source": "jlpt-0725",
    "title": "地面 (じめん)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 3",
    "gist": "Đọc 地面 (mặt đất ướt vì mưa).",
    "pick": "ちめん",
    "ans": "じめん",
    "why": "地 có hai âm: ち và じ. Trong 地面 đọc じ, nên là じめん. ちめん không phải từ thường dùng. Từ dễ nhầm là 地名 (ちめい, tên địa danh).",
    "note": "地 đọc じ: 地面 (じめん), 地震 (じしん), 地元 (じもと). 地 đọc ち: 地図 (ちず), 地下 (ちか), 地球 (ちきゅう), 地方 (ちほう). Học theo từ, đừng đoán theo chữ.",
    "examples": [
      [
        "地震で地面が大きくゆれた。",
        "Mặt đất rung mạnh vì động đất."
      ],
      [
        "駅で町の地図をもらった。",
        "Tôi lấy bản đồ thị trấn ở nhà ga."
      ]
    ],
    "quiz": {
      "q": "Đọc 地面 trong câu: 落ちたりんごが地面を転がった。",
      "options": [
        "ちめん",
        "じめい",
        "じめん",
        "ちめい"
      ],
      "answer": 2,
      "explain": "地面 = じめん (地 đọc じ)."
    }
  },
  {
    "id": "sv4",
    "area": "kanji",
    "source": "jlpt-0725",
    "title": "移す (うつす)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 4",
    "gist": "Đọc 移した (chuyển tiền sang cái hộp kia).",
    "pick": "もどした",
    "ans": "うつした",
    "why": "移す đọc うつす, nghĩa là chuyển vật sang chỗ khác. もどす là 戻す, nghĩa là trả về chỗ cũ. Hai từ khác chữ và khác nghĩa.",
    "note": "移す (tha động từ) ↔ 移る (tự động từ): 席を移す, 新しい家に移る. Âm Hán い: 移動 (いどう), 移転 (いてん). 戻す: 本を棚に戻す. 隠す (かくす) = giấu.",
    "examples": [
      [
        "机を窓の近くに移した。",
        "Tôi chuyển cái bàn đến gần cửa sổ."
      ],
      [
        "読んだ本は、元の棚に戻してください。",
        "Sách đọc xong xin để lại kệ cũ."
      ]
    ],
    "quiz": {
      "q": "Đọc 移す trong câu: 会議の場所を三階の部屋に移すことになった。",
      "options": [
        "うつす",
        "もどす",
        "わたす",
        "かえす"
      ],
      "answer": 0,
      "explain": "移す = うつす (chuyển sang chỗ khác)."
    }
  },
  {
    "id": "sv19",
    "area": "vocab",
    "source": "jlpt-0725",
    "title": "距離 (きょり)",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 19",
    "gist": "Hỏi khoảng cách từ đây đến tòa thị chính là bao xa.",
    "pick": "途中",
    "ans": "距離",
    "why": "〜までの距離はどのくらい = khoảng cách đến một nơi là bao xa. 途中 là ‘giữa đường, đang đi thì…’ (途中で), không đo được ‘bao xa’. 徒歩 là đi bộ, 方向 là hướng.",
    "note": "距離: 〜までの距離, 長い距離を歩く. 途中: 帰る途中で, 途中まで. 徒歩: 駅から徒歩10分. 方向: 駅の方向.",
    "examples": [
      [
        "家から学校までの距離は3キロぐらいです。",
        "Từ nhà đến trường khoảng 3 km."
      ],
      [
        "会社へ行く途中で、コーヒーを買った。",
        "Tôi mua cà phê trên đường đến công ty."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 東京から大阪までの（　）は約500キロです。",
      "options": [
        "途中",
        "距離",
        "方向",
        "徒歩"
      ],
      "answer": 1,
      "explain": "Khoảng cách → 距離."
    }
  },
  {
    "id": "sv22",
    "area": "vocab",
    "source": "jlpt-0725",
    "title": "思いつく",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 22",
    "gist": "Hỏi có ai nghĩ ra cách hay để giải quyết vấn đề không.",
    "pick": "引き受けた",
    "ans": "思いついた",
    "why": "方法を思いつく = chợt nghĩ ra cách. 引き受ける = nhận làm một việc hoặc lời nhờ, không đi với 方法. Hai từ còn lại: 知り合う = quen biết nhau, 取り替える = đổi sang cái khác.",
    "note": "思いつく: いい考えを思いつく, アイデアを思いつく. 引き受ける: 仕事を引き受ける, 役を引き受ける. 取り替える: 古い電池を取り替える.",
    "examples": [
      [
        "シャワーを浴びているときに、いいアイデアを思いついた。",
        "Lúc đang tắm, tôi chợt nghĩ ra một ý hay."
      ],
      [
        "友だちに頼まれて、通訳の仕事を引き受けた。",
        "Bạn nhờ nên tôi nhận việc phiên dịch."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 夜、ベッドの中で新しい話のアイデアを（　）。",
      "options": [
        "引き受けた",
        "取り替えた",
        "思いついた",
        "知り合った"
      ],
      "answer": 2,
      "explain": "Chợt nghĩ ra ý tưởng → 思いついた."
    }
  },
  {
    "id": "sv27",
    "area": "vocab",
    "source": "jlpt-0725",
    "title": "そっと",
    "tag": "Từ gần nghĩa",
    "where": "Từ vựng · câu 27",
    "gist": "Chọn từ gần nghĩa nhất với そっと (hai người lặng lẽ ra khỏi phòng).",
    "pick": "急いで",
    "ans": "静かに",
    "why": "そっと = nhẹ nhàng, khẽ, để không gây tiếng động hoặc không ai để ý. Gần nghĩa nhất là 静かに. 急いで (vội vàng) gần như ngược ý.",
    "note": "そっと: そっとドアを閉める, そっと見る. そっとしておく = để yên, đừng làm phiền. Từ cùng nhóm: こっそり (lén lút), ゆっくり (chậm rãi).",
    "examples": [
      [
        "赤ちゃんが寝ているので、そっとドアを閉めた。",
        "Em bé đang ngủ nên tôi khẽ đóng cửa."
      ],
      [
        "彼は今悲しんでいるから、そっとしておこう。",
        "Anh ấy đang buồn, cứ để yên cho anh ấy."
      ]
    ],
    "quiz": {
      "q": "Chọn từ gần nghĩa nhất với 「そっと」: 彼女はそっと手紙を机に置いた。",
      "options": [
        "急いで",
        "静かに",
        "二回",
        "楽しそうに"
      ],
      "answer": 1,
      "explain": "そっと = nhẹ nhàng, không gây tiếng động = 静かに."
    }
  },
  {
    "id": "sv33",
    "area": "vocab",
    "source": "jlpt-0725",
    "title": "ばらばら (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 33",
    "gist": "Chọn câu dùng ばらばら đúng.",
    "pick": "câu ‘nước ép đổ ra, ばらばら’",
    "ans": "câu ‘tài liệu rơi xuống sàn, ばらばら’",
    "why": "ばらばら = những thứ vốn đi cùng nhau bị rời ra, tản mát (giấy tờ, đồ vật, ý kiến, nhóm người). Nước ép đổ thì dùng こぼれる. Kem chảy thì dùng 溶ける. Không khí ấm thoát ra thì dùng 逃げる.",
    "note": "ばらばら: 資料がばらばらになる, 意見がばらばらだ, 家族がばらばらに住む. Chất lỏng đổ: こぼれる. Tan chảy: 溶ける (とける). Vỡ vụn: 粉々 (こなごな).",
    "examples": [
      [
        "袋が破れて、豆が床にばらばらに落ちた。",
        "Túi rách, đậu rơi tung tóe xuống sàn."
      ],
      [
        "会議ではみんなの意見がばらばらで、何も決まらなかった。",
        "Trong cuộc họp, mỗi người một ý nên chẳng quyết được gì."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng ばらばら đúng.",
      "options": [
        "コップの水がばらばらになって、テーブルがぬれた。",
        "強い風で、集めた紙がばらばらになった。",
        "熱いお湯で、バターがばらばらになった。",
        "窓を開けたら、部屋の空気がばらばらになった。"
      ],
      "answer": 1,
      "explain": "Giấy đã gom bị gió thổi tản ra → ばらばら."
    }
  },
  {
    "id": "sg5",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "〜うちに (khi còn…)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 5",
    "gist": "Chương trình nấu ăn: luộc khoai xong thì bóc vỏ khi khoai còn nóng.",
    "pick": "ことで",
    "ans": "うちに",
    "why": "Aい + うちに = làm khi trạng thái còn tiếp diễn, trước khi nó thay đổi (còn nóng thì dễ bóc, nguội rồi thì khó). ことで = bằng cách, nhờ việc… (nêu phương tiện), không hợp.",
    "note": "Aい / Aな な / N の / V ている + うちに = trong lúc còn… (làm trước khi đổi): 熱いうちに食べて, 若いうちに, 明るいうちに帰る, 忘れないうちにメモする. Nghĩa thứ hai: V ている + うちに = đang làm… thì (tự nhiên) xảy ra.",
    "examples": [
      [
        "料理が冷めないうちに、どうぞ召し上がってください。",
        "Mời anh dùng khi món ăn còn chưa nguội."
      ],
      [
        "若いうちに、いろいろな国へ行ってみたい。",
        "Tôi muốn đi nhiều nước khi còn trẻ."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 雨が降らない（　）、洗濯物を取り込もう。",
      "options": [
        "うちに",
        "ところで",
        "までに",
        "ことで"
      ],
      "answer": 0,
      "explain": "Làm trước khi trời mưa → 降らないうちに."
    }
  },
  {
    "id": "sg8",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "何を〜たら、〜だろうか",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 8",
    "gist": "Đang nghĩ quà sinh nhật cho em trai: tặng gì thì em sẽ vui?",
    "pick": "あげるから",
    "ans": "あげたら",
    "why": "Câu hỏi giả định ‘nếu tặng cái gì thì…’ dùng 〜たら. 〜から là ‘vì’, nêu lý do có thật, không ghép với câu hỏi kiểu này. Thêm nữa: mình tặng em nên dùng あげる, không dùng くれる (người khác cho mình).",
    "note": "Từ để hỏi + 〜たら / 〜ば + 〜だろう(か) / 〜いい(か): 何を買ったら喜ぶだろう, どうしたらいいですか, どこに行けば会えるだろう. あげる = mình (hoặc người khác) cho người ngoài. くれる = người khác cho mình hoặc phía mình.",
    "examples": [
      [
        "どうしたら、日本語が上手になるだろうか。",
        "Làm sao để giỏi tiếng Nhật đây?"
      ],
      [
        "母の日に、何をあげたら喜んでもらえるかな。",
        "Ngày của Mẹ, tặng gì thì mẹ vui nhỉ?"
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 友だちの結婚祝いに、何を（　）喜ぶだろうか。",
      "options": [
        "くれたら",
        "あげたら",
        "くれるから",
        "あげるので"
      ],
      "answer": 1,
      "explain": "Mình tặng bạn + giả định → あげたら."
    }
  },
  {
    "id": "sg9",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "持ってく (= 持っていく)",
    "tag": "PDF 139 · văn nói",
    "where": "Ngữ pháp · câu 9",
    "gist": "Bạn hỏi mượn lại cuốn tiểu thuyết. Đáp: ‘Ừ, mai mình mang đến trường nhé.’",
    "pick": "持ってる",
    "ans": "持ってく",
    "why": "Mang vật đến một nơi khác (trường) là 持っていく, văn nói rút gọn thành 持ってく. 持ってる là 持っている (đang cầm, đang có), không đi với 学校に. 持っとく là 持っておく (cầm sẵn). 持っちゃう là 持ってしまう.",
    "note": "Dạng rút gọn trong văn nói: 〜ていく → 〜てく, 〜ている → 〜てる, 〜ておく → 〜とく, 〜てしまう → 〜ちゃう. Đổi về dạng gốc rồi mới chọn. V ていく = làm rồi đi tới chỗ khác (PDF 139).",
    "examples": [
      [
        "あした、お弁当を持ってくね。",
        "Mai mình mang cơm hộp đi nhé."
      ],
      [
        "このペン、ちょっと借りてくね。",
        "Mình mượn cây bút này mang đi một lát nhé."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: A「この傘、借りてもいい？」 B「いいよ。雨が降りそうだから（　）。」",
      "options": [
        "持ってって",
        "持ってた",
        "持っちゃった",
        "持ってない"
      ],
      "answer": 0,
      "explain": "持ってって = 持っていって (cứ mang đi)."
    }
  },
  {
    "id": "sg10",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "〜といいね (mong là…)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 10",
    "gist": "Hai tuần nữa đi leo núi, rất mong. Đáp: ‘Ừ, mong là trời nắng nhỉ.’",
    "pick": "晴れてよかった",
    "ans": "晴れるといい",
    "why": "Chuyến đi chưa diễn ra, nên câu đáp phải là mong ước: 晴れるといいね. 晴れてよかった (may mà trời nắng) dùng sau khi việc đã xảy ra. 晴れてきた (trời bắt đầu nắng) và 晴れるんだ (trời sẽ nắng à) không hợp.",
    "note": "V る + といい(ね / な / けど) = mong là…. V て + よかった = may là đã…. Nhìn thời điểm: việc sắp tới → といい. Việc đã xong → てよかった.",
    "examples": [
      [
        "明日の試験、うまくいくといいね。",
        "Mong bài thi ngày mai suôn sẻ nhé."
      ],
      [
        "昨日は晴れてよかったね。",
        "May mà hôm qua trời nắng nhỉ."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: A「来月、日本語の試験を受けるんだ。」 B「そうなんだ。合格（　）ね。」",
      "options": [
        "できてよかった",
        "できるといい",
        "できたんだ",
        "できてきた"
      ],
      "answer": 1,
      "explain": "Việc chưa xảy ra → mong ước: できるといいね."
    }
  },
  {
    "id": "sg11",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "ご〜になれます (tôn kính, khả năng)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 11",
    "gist": "Trang web thành phố: buổi nói chuyện, cư dân nào cũng có thể tham gia miễn phí.",
    "pick": "ご参加になっています",
    "ans": "ご参加になれます",
    "why": "Người tham gia là cư dân, tức là khách, nên dùng tôn kính ngữ. ‘Có thể’ thì dùng dạng khả năng: ご参加になる → ご参加になれる. ご参加になっています là ‘đang tham gia’, sai nghĩa. 参加いたします là khiêm nhường ngữ, dùng cho chính mình.",
    "note": "Tôn kính: お / ご + V + になる → khả năng: お / ご + V + になれる (ご利用になれます, お使いになれます). Cách khác hay gặp: ご参加いただけます. Khiêm nhường (mình làm): ご〜いたします, お〜します.",
    "examples": [
      [
        "このカードは、全国のお店でお使いになれます。",
        "Thẻ này dùng được ở cửa hàng trên toàn quốc."
      ],
      [
        "会員の方は、どなたでも無料でご利用になれます。",
        "Hội viên ai cũng có thể dùng miễn phí."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: （図書館のお知らせ）館内のパソコンは、どなたでも（　）。",
      "options": [
        "ご利用いたします",
        "ご利用になれます",
        "ご利用しております",
        "ご利用になっています"
      ],
      "answer": 1,
      "explain": "Khách có thể dùng → ご利用になれます."
    }
  },
  {
    "id": "sg14",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "〜に比べると + ô ★",
    "tag": "PDF 101",
    "where": "Ngữ pháp · câu 14 (xếp câu)",
    "gist": "Hè năm nay cũng nóng, nhưng so với hè năm ngoái nóng bất thường thì thấy mát hơn nhiều.",
    "pick": "異常な (mảnh đứng đầu)",
    "ans": "去年の夏に (mảnh ở ô thứ 3)",
    "why": "Câu đúng: 異常な → 暑さだった → 去年の夏に → 比べると. Ô ★ là ô thứ 3: 去年の夏に. Bạn chọn 異常な, là mảnh đứng đầu. Có thể bạn xếp đúng nhưng lấy nhầm ô.",
    "note": "N + に比べて / に比べると = so với N (PDF 101). Cụm bổ nghĩa đứng trước danh từ: 異常な暑さだった + 去年の夏. Cách làm: sắp đủ 4 mảnh, đánh số ① ② ③ ④, đọc lại cả câu rồi mới lấy mảnh ở ô ★.",
    "examples": [
      [
        "兄に比べると、弟はおとなしい。",
        "So với anh trai thì em trai trầm tính hơn."
      ],
      [
        "去年に比べて、今年は雪が少ない。",
        "So với năm ngoái, năm nay ít tuyết."
      ]
    ],
    "quiz": {
      "q": "Xếp 4 mảnh vào 4 ô của câu 「この町は、＿＿ ＿＿ ★ ＿＿ずっと静かだ。」(★ ở ô thứ 3). A 比べると / B 前に住んでいた / C 町に / D にぎやかな. Mảnh nào nằm ở ô ★?",
      "options": [
        "A 比べると",
        "B 前に住んでいた",
        "C 町に",
        "D にぎやかな"
      ],
      "answer": 2,
      "explain": "Câu đúng: B → D → C → A (前に住んでいたにぎやかな町に比べると). Ô thứ 3 là C."
    }
  },
  {
    "id": "sg16",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "いつのまにか〜ので驚いた + ô ★",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 16 (xếp câu)",
    "gist": "Sau bữa trưa đến thư viện đọc sách, không biết từ lúc nào trời đã tối nên giật mình.",
    "pick": "いつのまにか (mảnh đứng đầu)",
    "ans": "ので (mảnh ở ô thứ 3)",
    "why": "Câu đúng: いつのまにか → 外が暗くなっていた → ので → 驚いた. Ô ★ là ô thứ 3: ので. Bạn chọn いつのまにか, là mảnh đứng đầu. Giống câu 14: có thể bạn xếp đúng nhưng lấy nhầm ô.",
    "note": "いつのまにか = không biết từ lúc nào. Thứ tự hay gặp: trạng từ → sự việc → ので (lý do) → cảm xúc (驚いた). 〜ていたら = đang làm… thì (phát hiện điều gì). Đề in ô 2 và ô 3 dính liền nhau, nên càng phải đếm từng ô.",
    "examples": [
      [
        "テレビを見ていたら、いつのまにか寝てしまった。",
        "Đang xem TV thì ngủ lúc nào không hay."
      ],
      [
        "ドアを開けたら、部屋に誰もいなかったので驚いた。",
        "Mở cửa ra thì không có ai trong phòng nên tôi giật mình."
      ]
    ],
    "quiz": {
      "q": "Xếp 4 mảnh vào 4 ô của câu 「朝起きて窓を開けたら＿＿ ＿＿ ★ ＿＿。」(★ ở ô thứ 3). A ので / B うれしくなった / C 外が真っ白になっていた / D 夜の間に雪が降って. Mảnh nào nằm ở ô ★?",
      "options": [
        "A ので",
        "B うれしくなった",
        "C 外が真っ白になっていた",
        "D 夜の間に雪が降って"
      ],
      "answer": 0,
      "explain": "Câu đúng: D → C → A → B (夜の間に雪が降って外が真っ白になっていたのでうれしくなった). Ô thứ 3 là A."
    }
  },
  {
    "id": "sg19",
    "area": "grammar",
    "source": "jlpt-0725",
    "title": "それでも (dù vậy)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 19 (điền đoạn văn)",
    "gist": "Bài văn đi trượt tuyết: xuống xe buýt thấy rất lạnh, muốn vào chỗ ấm. Câu sau: đã cất công đến nên vẫn bắt đầu tập.",
    "pick": "実は",
    "ans": "それでも",
    "why": "Câu trước: lạnh, muốn vào chỗ ấm. Câu sau: vẫn bắt đầu tập. Hai câu ngược chiều, nên cần liên từ ‘dù vậy’: それでも. 実は (thật ra) dùng để tiết lộ điều người nghe chưa biết. 例えば (ví dụ) và また (ngoài ra) cũng không hợp.",
    "note": "Chọn liên từ: so ý câu trước với câu sau. Ngược chiều → でも, それでも, しかし. Thêm ý → また, そのうえ. Ví dụ → 例えば. Tiết lộ → 実は. せっかく〜のだから = đã cất công… thì.",
    "examples": [
      [
        "熱があった。それでも、彼は会社へ行った。",
        "Anh ấy bị sốt. Dù vậy, anh vẫn đi làm."
      ],
      [
        "何度も失敗した。それでも、あきらめなかった。",
        "Tôi thất bại nhiều lần. Dù vậy, tôi không bỏ cuộc."
      ]
    ],
    "quiz": {
      "q": "Chọn liên từ điền vào chỗ trống: 道はとても混んでいた。（　）、約束の時間には間に合った。",
      "options": [
        "例えば",
        "それでも",
        "実は",
        "また"
      ],
      "answer": 1,
      "explain": "Đường đông nhưng vẫn kịp → ngược chiều: それでも."
    }
  },
  {
    "id": "qv1",
    "area": "kanji",
    "source": "dm-2111",
    "title": "下品 (げひん)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 1",
    "gist": "Đọc 下品 (người đó toàn nói chuyện thô tục).",
    "pick": "かひん",
    "ans": "げひん",
    "why": "下 trong 下品 đọc げ (âm Hán), không đọc か. 下品 げひん = thô tục, thiếu tao nhã. Từ ngược nghĩa là 上品 じょうひん (tao nhã, lịch sự), và đó chính là đáp án số 4 của câu hỏi.",
    "note": "下 có nhiều cách đọc: か (下降 かこう, 地下 ちか), げ (下品 げひん, 下水 げすい, 下車 げしゃ), した, しも. 品 đọc ひん (上品, 下品, 品質 ひんしつ) hoặc しな (品物 しなもの).",
    "examples": [
      [
        "あの人の話し方は、少し下品だと思う。",
        "Tôi thấy cách nói của người đó hơi thô tục."
      ],
      [
        "彼女はいつも上品な服を着ている。",
        "Cô ấy lúc nào cũng mặc đồ thanh lịch."
      ]
    ],
    "quiz": {
      "q": "Đọc 下品 trong câu: 下品な冗談を言って、みんなに嫌がられた。",
      "options": [
        "かひん",
        "げひん",
        "しもひん",
        "じょうひん"
      ],
      "answer": 1,
      "explain": "下品 = げひん (thô tục), ngược với 上品 じょうひん."
    }
  },
  {
    "id": "qv7",
    "area": "kanji",
    "source": "dm-2111",
    "title": "主に (おもに)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 7",
    "gist": "Đọc 主に (độc giả tạp chí này chủ yếu là nữ).",
    "pick": "しゅに",
    "ans": "おもに",
    "why": "主に là trạng từ ‘chủ yếu’, đọc おもに (訓読み おも của 主). Từ しゅに không tồn tại. 主 có âm Hán しゅ trong 主人, 主食, nhưng 主に và 主な đọc おも.",
    "note": "主: おも (主に, 主な) / ぬし (持ち主) / しゅ (主人, 主食, 主婦). 主な + N = N chính: 主な原因 (おもなげんいん).",
    "examples": [
      [
        "私は主に夜、勉強します。",
        "Tôi chủ yếu học vào buổi tối."
      ],
      [
        "事故の主な原因は、スピードの出しすぎだった。",
        "Nguyên nhân chính của vụ tai nạn là chạy quá tốc độ."
      ]
    ],
    "quiz": {
      "q": "Đọc 主に trong câu: この店の客は主に学生です。",
      "options": [
        "しゅに",
        "ぬしに",
        "おもに",
        "ちゅに"
      ],
      "answer": 2,
      "explain": "主に = おもに (chủ yếu)."
    }
  },
  {
    "id": "qv11",
    "area": "kanji",
    "source": "dm-2111",
    "title": "幸せ (しあわせ)",
    "tag": "Chữ Hán · viết",
    "where": "Từ vựng · câu 11",
    "gist": "Viết bằng kanji từ しあわせ (xây dựng một gia đình hạnh phúc).",
    "pick": "辛せ",
    "ans": "幸せ",
    "why": "しあわせ = hạnh phúc, viết 幸せ (幸 = hạnh phúc, may mắn). 辛 là chữ khác, đọc つら.い hoặc から.い (khổ, cay). Hai chữ 幸 và 辛 rất giống nhau, chỉ khác phần trên.",
    "note": "幸: しあわ.せ (幸せ), さいわ.い (幸い), コウ (幸福 こうふく, 不幸 ふこう). 辛: つら.い, から.い, シン (辛抱 しんぼう). Mẹo: 幸せ cùng chữ với 幸福 (hạnh phúc).",
    "examples": [
      [
        "家族みんなが健康で、本当に幸せです。",
        "Cả nhà khỏe mạnh, tôi thật sự hạnh phúc."
      ],
      [
        "このカレーは辛すぎて食べられない。",
        "Món cà ri này cay quá, tôi không ăn nổi."
      ]
    ],
    "quiz": {
      "q": "Chọn kanji đúng cho しあわせ: 毎日が楽しくて、しあわせだ。",
      "options": [
        "辛せ",
        "新せ",
        "卒せ",
        "幸せ"
      ],
      "answer": 3,
      "explain": "しあわせ = 幸せ."
    }
  },
  {
    "id": "qv12",
    "area": "kanji",
    "source": "dm-2111",
    "title": "偉い (えらい)",
    "tag": "Chữ Hán · viết",
    "where": "Từ vựng · câu 12",
    "gist": "Viết bằng kanji từ えらい (Edison là nhà khoa học vĩ đại).",
    "pick": "賢い",
    "ans": "偉い",
    "why": "えらい = vĩ đại, đáng kính, có địa vị: 偉い人, 偉い科学者. 賢い (かしこい) = thông minh, khôn ngoan. Edison vừa thông minh vừa vĩ đại, nhưng chữ viết của えらい là 偉.",
    "note": "偉: えら.い / イ (偉大 いだい, 偉人 いじん). 賢い かしこい = thông minh. 鋭い するどい = sắc bén. 鈍い にぶい = chậm, cùn.",
    "examples": [
      [
        "彼は小さいころから、偉い人になりたいと思っていた。",
        "Từ nhỏ anh ấy đã muốn trở thành một người vĩ đại."
      ],
      [
        "このナイフはよく切れて、刃が鋭い。",
        "Con dao này cắt tốt, lưỡi sắc bén."
      ]
    ],
    "quiz": {
      "q": "Chọn kanji đúng cho えらい: 野口英世はとてもえらい医者だった。",
      "options": [
        "偉い",
        "賢い",
        "鋭い",
        "鈍い"
      ],
      "answer": 0,
      "explain": "えらい (vĩ đại) = 偉い."
    }
  },
  {
    "id": "qv13",
    "area": "kanji",
    "source": "dm-2111",
    "title": "構わない (かまわない)",
    "tag": "Chữ Hán · viết",
    "where": "Từ vựng · câu 13",
    "gist": "Viết bằng kanji từ かまわない (đến muộn cũng không sao, cứ tham gia nhé).",
    "pick": "酔わない",
    "ans": "構わない",
    "why": "かまわない = không sao, không bận tâm. Viết 構わない (構う = bận tâm, quan tâm). 酔わない (よわない) là ‘không say’, nghĩa khác hẳn.",
    "note": "構: かま.う / コウ (構造 こうぞう, 構成 こうせい). 〜てもかまわない = làm… cũng không sao. お構いなく = xin đừng bận tâm (khách nói với chủ nhà). 酔う よう = say.",
    "examples": [
      [
        "少し遅れてもかまいませんよ。",
        "Đến muộn một chút cũng không sao đâu."
      ],
      [
        "どうぞお構いなく。",
        "Xin đừng bận tâm cho tôi."
      ]
    ],
    "quiz": {
      "q": "Chọn kanji đúng cho かまわない: 私は先に食べてもかまわない。",
      "options": [
        "使わない",
        "構わない",
        "吸わない",
        "酔わない"
      ],
      "answer": 1,
      "explain": "かまわない = 構わない."
    }
  },
  {
    "id": "qv16",
    "area": "vocab",
    "source": "dm-2111",
    "title": "費用 (ひよう)",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 16",
    "gist": "Đám cưới tốn khá nhiều chi phí.",
    "pick": "消費",
    "ans": "費用",
    "why": "費用 = chi phí, số tiền cần để làm một việc (結婚式の費用, 旅行の費用). 消費 = tiêu dùng, tiêu hao (消費税, エネルギーを消費する), không đi với がかかる theo nghĩa này. 用事 là việc bận, 利用 là sử dụng.",
    "note": "〜費: 費用, 学費 (がくひ), 食費, 交通費. かかる đi với 費用 (費用がかかる), 時間, お金. 消費: 消費税, 消費者, 電力を消費する.",
    "examples": [
      [
        "引っ越しには、思ったより費用がかかった。",
        "Chuyển nhà tốn nhiều chi phí hơn tôi nghĩ."
      ],
      [
        "日本では、買い物のとき消費税がかかる。",
        "Ở Nhật, khi mua hàng có thuế tiêu dùng."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 海外旅行の（　）を調べて、貯金を始めた。",
      "options": [
        "費用",
        "消費",
        "用事",
        "利用"
      ],
      "answer": 0,
      "explain": "Tiền cần cho chuyến đi → 費用."
    }
  },
  {
    "id": "qv19",
    "area": "vocab",
    "source": "dm-2111",
    "title": "編む (あむ)",
    "tag": "Chọn từ · chữ Hán",
    "where": "Từ vựng · câu 19",
    "gist": "Mùa đông này muốn đan một cái áo len.",
    "pick": "噛もう (かもう)",
    "ans": "編もう (あもう)",
    "why": "編む = đan, bện (セーターを編む, 髪を編む). 噛む (かむ) là cắn, nhai. Áo len thì ‘đan’ chứ không ‘cắn’. Chữ 編 đọc あ.む.",
    "note": "編: あ.む / ヘン (編集 へんしゅう, 短編 たんぺん). セーター/マフラーを編む. 噛む かむ = cắn, nhai (ガムを噛む). 飲む のむ. 働く はたらく.",
    "examples": [
      [
        "祖母は毎年、孫にマフラーを編んでくれる。",
        "Năm nào bà cũng đan khăn quàng cho cháu."
      ],
      [
        "ゆっくり噛んで食べると、体にいい。",
        "Nhai chậm rồi ăn thì tốt cho cơ thể."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 母は私のために、手袋を（　）くれた。",
      "options": [
        "噛んで",
        "飲んで",
        "働いて",
        "編んで"
      ],
      "answer": 3,
      "explain": "Đan găng tay → 編んで."
    }
  },
  {
    "id": "qv20",
    "area": "vocab",
    "source": "dm-2111",
    "title": "行方 (ゆくえ)",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 20",
    "gist": "Đây là manh mối duy nhất để tìm tung tích của anh ấy.",
    "pick": "事故",
    "ans": "行方",
    "why": "行方 (ゆくえ) = nơi ai đó đã đi, tung tích. 行方を探す = tìm tung tích. 事故 là tai nạn, 事件 là vụ việc, 行事 là sự kiện: ba từ này không đi với ‘tìm tung tích người’.",
    "note": "行方不明 ゆくえふめい = mất tích. 行 đọc ゆ.く, おこな.う, ギョウ (行事 ぎょうじ), コウ. Cặp dễ lẫn: 行事 ぎょうじ (sự kiện) và 行方 ゆくえ (tung tích).",
    "examples": [
      [
        "行方不明の犬が、三日後に見つかった。",
        "Con chó mất tích đã được tìm thấy sau ba ngày."
      ],
      [
        "学校の行事で、運動会がある。",
        "Trường có sự kiện hội thao."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 山で（　）がわからなくなった友だちを、警察が探している。",
      "options": [
        "行事",
        "事故",
        "行方",
        "事件"
      ],
      "answer": 2,
      "explain": "Không biết người đi đâu → 行方."
    }
  },
  {
    "id": "qv23",
    "area": "vocab",
    "source": "dm-2111",
    "title": "マーク (dấu, biểu tượng)",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 23",
    "gist": "Cửa hàng có biểu tượng này thì được dắt chó vào.",
    "pick": "ルール",
    "ans": "マーク",
    "why": "Câu nói ‘cửa hàng có (thứ gì đó) thì dắt chó vào được’. Thứ giúp khách nhận ra điều đó là マーク (biểu tượng dán ở cửa). ルール là quy định, và chính ‘được dắt chó vào’ mới là nội dung của quy định.",
    "note": "マーク: ペットマーク, 禁煙マーク, リサイクルマーク. Katakana hay gặp: シート (tấm, ghế), ルール (quy tắc), ペット (thú cưng), マーク (dấu, biểu tượng).",
    "examples": [
      [
        "このマークがある商品は、リサイクルできる。",
        "Sản phẩm có biểu tượng này thì tái chế được."
      ],
      [
        "この店には、ペットマークがはってある。",
        "Ở quán này có dán biểu tượng thú cưng."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: この（　）がついた箱は、燃えるごみに出さないでください。",
      "options": [
        "マーク",
        "ルール",
        "シート",
        "ペット"
      ],
      "answer": 0,
      "explain": "Dấu in trên hộp (リサイクルマーク) → マーク."
    }
  },
  {
    "id": "qv31",
    "area": "vocab",
    "source": "dm-2111",
    "title": "未来 (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 31",
    "gist": "Chọn câu dùng 未来 đúng.",
    "pick": "câu ‘未来ではできなかったことが今では…’",
    "ans": "câu ‘地球の未来を考える’",
    "why": "未来 = tương lai xa, tương lai của xã hội, trái đất, con người (地球の未来, 子どもの未来). Không dùng cho kế hoạch gần (来月, 今度) hay ‘sắp xong’ (もうすぐ). Câu bạn chọn nói về quá khứ so với bây giờ, nên phải là 昔 hoặc 以前, không phải 未来.",
    "note": "未来 ↔ 過去. Thường gặp: 明るい未来, 未来の社会, 未来へ. Kế hoạch gần: 来週, 今度, 近いうちに. Tương lai gần đúng nghĩa ‘sắp’: もうすぐ.",
    "examples": [
      [
        "子どもたちの未来のために、環境を守りたい。",
        "Vì tương lai của trẻ em, tôi muốn bảo vệ môi trường."
      ],
      [
        "未来の車は、空を飛ぶかもしれない。",
        "Xe hơi tương lai biết đâu sẽ bay trên trời."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng 未来 đúng.",
      "options": [
        "未来に友だちの家へ遊びに行くつもりだ。",
        "未来の社会について、グループで話し合った。",
        "昨日の未来はとても楽しかった。",
        "この宿題は未来には終わるだろう。"
      ],
      "answer": 1,
      "explain": "未来の社会 = xã hội tương lai."
    }
  },
  {
    "id": "qv32",
    "area": "vocab",
    "source": "dm-2111",
    "title": "落ち着く (cách dùng, lần 2)",
    "tag": "Cách dùng từ · đã sai ở đề 14/11",
    "where": "Từ vựng · câu 32",
    "gist": "Chọn câu dùng 落ち着く đúng.",
    "pick": "câu ‘いやなことがあって落ち着いています’",
    "ans": "câu ‘彼女と話していると落ち着く’",
    "why": "落ち着く = bình tĩnh, thấy yên lòng, ổn định. Nói chuyện với cô ấy mà thấy yên lòng → 落ち着く. Câu bạn chọn có ‘việc khó chịu’ nên phải là 落ち込む (buồn nản). Câu ‘bánh mì rơi xuống sàn’ là 落ちる. Câu ‘căng thẳng mà vẫn bình tĩnh’ tự mâu thuẫn.",
    "note": "Từ này đã sai ở đề 14/11 (thẻ ‘落ち着く (cách dùng)’). 落ち着く: 気持ちが落ち着く, 落ち着いた人, 生活が落ち着く, 落ち着いて話す. 落ち込む = buồn nản. 落ちる = rơi.",
    "examples": [
      [
        "この部屋は静かで、とても落ち着く。",
        "Căn phòng này yên tĩnh, rất dễ chịu."
      ],
      [
        "落ち着いて、ゆっくり話してください。",
        "Hãy bình tĩnh, nói từ từ thôi."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng 落ち着く đúng.",
      "options": [
        "ホテルの部屋に荷物が落ち着いて置いてある。",
        "財布を道に落ち着いてしまった。",
        "雨が落ち着いて、傘が壊れた。",
        "深呼吸をしたら、気持ちが落ち着いた。"
      ],
      "answer": 3,
      "explain": "気持ちが落ち着く = tâm trạng bình tĩnh lại."
    }
  },
  {
    "id": "qv33",
    "area": "vocab",
    "source": "dm-2111",
    "title": "いつのまにか (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 33",
    "gist": "Chọn câu dùng いつのまにか đúng.",
    "pick": "câu ‘いつのまにか、北極に行ってオーロラを見たい’",
    "ans": "câu ‘いつのまにか彼を好きになっていた’",
    "why": "いつのまにか = không biết từ lúc nào đã (một việc đã xảy ra mà mình không để ý). Vế sau phải là sự việc đã xảy ra: 好きになっていた. Mong muốn tương lai (見たい) dùng いつか. Mong muốn kéo dài dùng ずっと. ‘Lúc nào cũng hỏi’ dùng いつでも.",
    "note": "いつのまにか + V ていた/V た: いつのまにか雨がやんでいた. いつか = một lúc nào đó (tương lai). いつでも = bất cứ lúc nào. ずっと = suốt.",
    "examples": [
      [
        "いつのまにか、外が暗くなっていた。",
        "Không biết từ lúc nào, bên ngoài đã tối."
      ],
      [
        "いつか日本で働いてみたい。",
        "Một ngày nào đó tôi muốn thử làm việc ở Nhật."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng いつのまにか đúng.",
      "options": [
        "いつのまにか、ヨーロッパを旅行したい。",
        "困ったら、いつのまにか電話してね。",
        "本を読んでいたら、いつのまにか眠っていた。",
        "この町にいつのまにか住んでいてほしい。"
      ],
      "answer": 2,
      "explain": "Việc đã xảy ra mà không để ý → いつのまにか."
    }
  },
  {
    "id": "qv35",
    "area": "vocab",
    "source": "dm-2111",
    "title": "ぬるい (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 35",
    "gist": "Chọn câu dùng ぬるい đúng.",
    "pick": "câu ‘暖房をつけたので、部屋がぬるくなった’",
    "ans": "câu ‘風呂がぬるくなってしまった’",
    "why": "ぬるい = âm ấm, nguội bớt (nước tắm, trà, bia để lâu): ‘không đủ nóng’ hoặc ‘không đủ lạnh’. Bồn tắm nguội đi thì ぬるくなる. Phòng bật máy sưởi thì 暖かくなる. Bia cho vào tủ lạnh thì 冷たくなる. Gió ngày tuyết thì 冷たい.",
    "note": "ぬるい: ぬるいお湯, ぬるいビール, ぬるいお茶. Cảm giác của người dùng: không đủ nóng hoặc không đủ lạnh. Ngược: 熱い (nóng), 冷たい (lạnh).",
    "examples": [
      [
        "お風呂のお湯がぬるいので、もう少し温めた。",
        "Nước tắm nguội quá nên tôi đun thêm một chút."
      ],
      [
        "ぬるいビールは、おいしくない。",
        "Bia ấm thì không ngon."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng ぬるい đúng.",
      "options": [
        "冬の朝、外の空気はぬるくて寒かった。",
        "コーヒーを置いておいたら、ぬるくなってしまった。",
        "氷を入れたので、ジュースがぬるくなった。",
        "ストーブをつけたら、部屋がとてもぬるい。"
      ],
      "answer": 1,
      "explain": "Cà phê để nguội → ぬるくなる."
    }
  },
  {
    "id": "qg1",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜ようにして (làm theo cách…)",
    "tag": "Ngoài PDF · gần 004 · 005",
    "where": "Ngữ pháp · câu 1",
    "gist": "Hướng dẫn mở cửa: vừa ấn mạnh, vừa xoay chìa khóa.",
    "pick": "からには",
    "ans": "ようにして",
    "why": "Chỗ trống mô tả cách làm: ‘xoay chìa khóa trong lúc ấn mạnh’. 〜ようにして = làm V theo một cách cố ý, đi kèm hành động chính. からには = ‘đã… thì phải…’ (nêu lý do mạnh), không hợp với lời hướng dẫn thao tác.",
    "note": "V る + ようにして + V: nêu cách làm (cố làm thế nào đó). Khác với V る + ようにする (cố gắng thường xuyên, PDF 004 · 005). からには = 〜以上は. たびに = mỗi lần.",
    "examples": [
      [
        "ふたを少し持ち上げるようにして、ゆっくり回してください。",
        "Hãy xoay từ từ, vừa nâng nắp lên một chút."
      ],
      [
        "子どもは、親の手をつかむようにして歩いていた。",
        "Đứa trẻ vừa đi vừa nắm lấy tay bố mẹ."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: このふたは、少し持ち上げる（　）開けてください。",
      "options": [
        "うちに",
        "ようにして",
        "たびに",
        "からには"
      ],
      "answer": 1,
      "explain": "Nêu cách làm → ようにして."
    }
  },
  {
    "id": "qg2",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜きれない (không … hết)",
    "tag": "PDF 071",
    "where": "Ngữ pháp · câu 2",
    "gist": "Nếu không ăn hết thì cứ để lại.",
    "pick": "かけたら (食べかけたら)",
    "ans": "きれなかったら (食べきれなかったら)",
    "why": "V ます + きれない = không thể làm hết, làm trọn. 食べきれなかったら、残してください = ‘nếu không ăn hết thì để lại’. 食べかけたら = ‘nếu bắt đầu ăn dở’ (V かける = làm dở), nghĩa khác, và vế sau ‘残してください’ không hợp.",
    "note": "V きる = làm hết, làm trọn: 読みきる, 使いきる (PDF 071). V きれない = không làm hết nổi: 食べきれない量. V かける = bắt đầu làm dở: 読みかけの本.",
    "examples": [
      [
        "この本は、一日では読みきれない。",
        "Quyển sách này một ngày không đọc hết nổi."
      ],
      [
        "読みかけの本が、机の上に置いてある。",
        "Quyển sách đang đọc dở để trên bàn."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: ごはんが多すぎて、一人では食べ（　）。",
      "options": [
        "きれない",
        "かけた",
        "込まない",
        "忘れない"
      ],
      "answer": 0,
      "explain": "Không ăn hết nổi → 食べきれない."
    }
  },
  {
    "id": "qg3",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜一方だ (ngày càng…)",
    "tag": "Ngoài PDF · gần 054",
    "where": "Ngữ pháp · câu 3",
    "gist": "Quan hệ hai nước ngày càng xấu đi.",
    "pick": "ほど",
    "ans": "一方",
    "why": "V る + 一方だ = tình trạng cứ đổi theo một hướng, ngày càng…: 悪くなる一方だ = ngày càng tệ. ほど cần dạng ‘〜ば〜ほど’ hoặc ‘〜ほど + adj’, nên không đứng trước だ ở câu này. 反面 là ‘mặt khác’, cần hai vế đối lập.",
    "note": "V る + 一方だ (ngày càng, chỉ một hướng): 増える一方だ, 悪くなる一方だ. Mẫu gần (PDF 054): 〜一方で = mặt khác, trong khi: 気楽な一方で、大変な面もある. Nhìn đuôi だ hay で để phân biệt.",
    "examples": [
      [
        "日本語を勉強する人は、世界中で増える一方だ。",
        "Số người học tiếng Nhật trên thế giới ngày càng tăng."
      ],
      [
        "最近、彼の体調は悪くなる一方だ。",
        "Dạo này sức khỏe anh ấy cứ ngày càng xấu đi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: この町の人口は、減る（　）だ。",
      "options": [
        "ほど",
        "かぎり",
        "一方",
        "反面"
      ],
      "answer": 2,
      "explain": "Ngày càng giảm theo một hướng → 減る一方だ."
    }
  },
  {
    "id": "qg5",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜ほど〜ものはない (không gì … bằng)",
    "tag": "Ngoài PDF · gần 094",
    "where": "Ngữ pháp · câu 5",
    "gist": "Không có món nào ngon bằng đồ vợ nấu.",
    "pick": "さえ",
    "ans": "ほど",
    "why": "N + ほど + A + ものはない = không gì A bằng N: 妻の料理ほどおいしいものはない. さえ = ‘ngay cả… cũng’ (nhấn mạnh một ví dụ cực đoan), nghĩa khác.",
    "note": "N ほど A ものはない/人はいない = N là nhất. Mẫu gần (PDF 094): A は B ほど〜ない = A không … bằng B. さえ (PDF 105): 子どもでさえ知っている (ngay cả trẻ con cũng biết).",
    "examples": [
      [
        "健康ほど大切なものはない。",
        "Không gì quan trọng bằng sức khỏe."
      ],
      [
        "子どもでさえ、その答えを知っている。",
        "Ngay cả trẻ con cũng biết đáp án đó."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 母の笑顔（　）安心するものはない。",
      "options": [
        "さえ",
        "ほど",
        "まで",
        "だけ"
      ],
      "answer": 1,
      "explain": "Không gì yên tâm bằng nụ cười của mẹ → ほど."
    }
  },
  {
    "id": "qg7",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜がち (hay, dễ…) và 〜だらけ",
    "tag": "PDF 109 · đã sai ở đề 14/11",
    "where": "Ngữ pháp · câu 7",
    "gist": "Hồi nhỏ chị hay ốm nên thường nghỉ học.",
    "pick": "だらけ",
    "ans": "がち",
    "why": "病気がち = hay bị ốm, dễ ốm (xu hướng lặp lại). だらけ = đầy toàn một thứ (thường khó chịu): 泥だらけ, 間違いだらけ. ‘病気だらけ’ nghĩa là toàn bệnh, không nói ‘hay ốm’. Ở đề 14/11 bạn chọn がち cho câu だらけ, lần này đảo ngược.",
    "note": "Cặp dễ nhầm: N/V ます + がち = hay, dễ (病気がち, 忘れがち, 遅れがち, PDF 109). N + だらけ = đầy, toàn (泥だらけ, ゴミだらけ, 間違いだらけ). Mẹo: だらけ là thứ nhìn thấy đầy khắp nơi. がち là xu hướng.",
    "examples": [
      [
        "最近、疲れがちで、よくミスをする。",
        "Dạo này tôi hay mệt nên hay mắc lỗi."
      ],
      [
        "雨の中を走って、くつが泥だらけになった。",
        "Chạy trong mưa nên giày dính đầy bùn."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 彼は、約束を忘れ（　）なので、メモをとっている。",
      "options": [
        "ほど",
        "だらけ",
        "しだい",
        "がち"
      ],
      "answer": 3,
      "explain": "忘れがち = hay quên."
    }
  },
  {
    "id": "qg8",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜うちに (trong lúc… thì đã…)",
    "tag": "Ngoài PDF · hay nhầm với わりに",
    "where": "Ngữ pháp · câu 8",
    "gist": "Trong lúc ngủ trưa thì trời đã chiều.",
    "pick": "わりに",
    "ans": "うちに",
    "why": "V ている + うちに = trong khoảng thời gian đang làm V, một việc khác xảy ra (thường không để ý): ngủ trưa, chiều lúc nào không hay. わりに = ‘so với…’ (nêu kết quả trái với dự đoán), không nói về khoảng thời gian.",
    "note": "うちに: (1) V ている/ない + うちに = trong lúc: テレビを見ているうちに寝てしまった. (2) V る + うちに = nhân lúc còn…: 温かいうちに食べてください. わりに = so với (年のわりに若い, PDF 097). Đề 14/11 bạn cũng nhầm わりに.",
    "examples": [
      [
        "本を読んでいるうちに、電車が駅に着いた。",
        "Trong lúc đọc sách thì tàu đã đến ga."
      ],
      [
        "忘れないうちに、メモをとっておきます。",
        "Tôi ghi chú lại trước khi quên."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 音楽を聞いている（　）、ねてしまった。",
      "options": [
        "わりに",
        "かわりに",
        "ために",
        "うちに"
      ],
      "answer": 3,
      "explain": "Trong lúc nghe nhạc thì ngủ mất → うちに."
    }
  },
  {
    "id": "qg9",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜たつもりで (coi như đã…)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 9",
    "gist": "Câu đầy đủ: mỗi ngày tôi coi như đã uống cà phê hết 300 yên (thực tế không uống), rồi quyết định gửi 300 yên đó vào tiết kiệm.",
    "pick": "かわり",
    "ans": "つもり",
    "why": "V た + つもりで = ‘coi như đã làm V’ (thực tế không làm) rồi làm việc khác. Ở đây: coi như đã uống cà phê 300 yên, nên không tiêu số tiền đó mà gửi tiết kiệm. Bạn chọn かわり vì nghĩa gần (‘thay vì uống cà phê thì tiết kiệm’). Nhưng かわり phải là 〜かわりに và đứng sau V る (飲むかわりに), nên ‘飲んだかわりで’ không tồn tại.",
    "note": "Ba cách dùng của つもり: V る/V ない + つもりだ = định (không) làm. V た + つもりで = coi như đã làm (giả tưởng), rồi làm việc khác. V た + つもりだった = tưởng là đã làm nhưng thực tế không (鍵をかけたつもりだった). 〜かわりに = thay vì, đổi lại.",
    "examples": [
      [
        "毎日500円、お菓子を食べたつもりで貯金している。",
        "Mỗi ngày tôi coi như đã ăn bánh kẹo hết 500 yên, rồi gửi số tiền đó vào tiết kiệm."
      ],
      [
        "鍵をかけたつもりだったが、ドアが開いていた。",
        "Tôi tưởng là đã khóa cửa, nhưng cửa lại đang mở."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 外食をした（　）で、そのお金を本に使った。",
      "options": [
        "かわり",
        "はず",
        "つもり",
        "ほど"
      ],
      "answer": 2,
      "explain": "Coi như đã đi ăn ngoài → 食べたつもりで."
    }
  },
  {
    "id": "qg12",
    "area": "grammar",
    "source": "dm-2111",
    "title": "お目にかかる (khiêm nhường của 会う)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 12",
    "gist": "Thư ký: ‘Xin cho biết việc của quý khách.’ Khách: ‘Tôi muốn gặp giám đốc Yamada ạ.’ Chỗ trống là động từ ‘gặp’ ở dạng khiêm nhường.",
    "pick": "ごらんになりたい",
    "ans": "お目にかかりたい",
    "why": "Người muốn làm hành động là khách (mình), người được gặp là giám đốc (người trên). Vậy cần dạng khiêm nhường của 会う: お目にかかる. ごらんになる là tôn kính của 見る (xem), dành cho hành động của người trên. おじゃまする là khiêm nhường của ‘đến thăm’ (nhà, văn phòng), không nói ‘gặp người’. 拝見する là khiêm nhường của 見る (xem tài liệu, ảnh), không phải 会う.",
    "note": "Hỏi hai câu: ai làm hành động (mình → khiêm nhường, người trên → tôn kính) và động từ gốc là gì. 会う: お会いになる (tôn kính) / お目にかかる (khiêm nhường). 見る: ごらんになる / 拝見する. 訪ねる: お訪ねになる / おじゃまする, 伺う. Mẹo nhớ: お目にかかる = ‘được chạm mắt’ với người trên. Bạn đã đúng cụm này ở 問題4 4番 của đề nghe JLPT 12/2025.",
    "examples": [
      [
        "先生にお目にかかりたいのですが、いらっしゃいますか。",
        "Tôi muốn gặp thầy, thầy có ở đây không ạ?"
      ],
      [
        "先生は、その本をごらんになりましたか。",
        "Thầy đã xem quyển sách đó chưa ạ?"
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: （受付で）部長に（　）のですが、いらっしゃいますか。",
      "options": [
        "お目にかかりたい",
        "お会いになりたい",
        "拝見したい",
        "ごらんになりたい"
      ],
      "answer": 0,
      "explain": "Mình gặp người trên → お目にかかる."
    }
  },
  {
    "id": "qg19",
    "area": "grammar",
    "source": "dm-2111",
    "title": "〜と思ってしまう (không kìm được mà nghĩ)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 19 (điền đoạn văn)",
    "gist": "Ở nước tôi ăn một mình là chuyện buồn, nên thấy người ăn một mình tôi cứ nghĩ ‘không có ai ăn cùng à?’.",
    "pick": "思ったようです",
    "ans": "思ってしまいます",
    "why": "Người viết kể cảm xúc của chính mình: ‘tôi (không kìm được) nghĩ…’. V てしまう diễn tả việc xảy ra ngoài ý muốn hoặc không kìm được. 思ったようです = ‘hình như đã nghĩ’ (suy đoán về người khác), không hợp với cảm xúc của người viết.",
    "note": "Vてしまう có hai nghĩa: (1) làm xong hẳn, (2) lỡ làm hoặc không kìm được (tiếc nuối): 思ってしまう, 笑ってしまう, 言ってしまった. 〜ようだ = hình như, suy đoán dựa trên quan sát.",
    "examples": [
      [
        "悲しい映画を見ると、つい泣いてしまいます。",
        "Xem phim buồn là tôi lại bật khóc."
      ],
      [
        "夜、お菓子を見ると、食べてしまいます。",
        "Buổi tối, thấy bánh kẹo là tôi lại ăn mất."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án điền vào chỗ trống: おいしそうなケーキを見ると、つい買って（　）。",
      "options": [
        "ほしいです",
        "きます",
        "しまいます",
        "ようです"
      ],
      "answer": 2,
      "explain": "Không kìm được mà mua → 買ってしまいます."
    }
  },
  {
    "id": "pv3",
    "area": "kanji",
    "source": "jlpt-1225",
    "title": "他人 (たにん)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 3",
    "gist": "Đọc 他人 (đừng cho người khác xem lá thư này).",
    "pick": "たんにん",
    "ans": "たにん",
    "why": "他人 đọc たにん, giữa hai âm không có ん. たんにん là 担任 (giáo viên chủ nhiệm), một từ khác nhưng nghe gần giống.",
    "note": "他人 たにん = người khác, người ngoài (↔ 自分, 家族). 人 đọc にん trong 他人, 本人 (ほんにん), 病人 (びょうにん). Mẹo: 他 đọc た (他国, 他社).",
    "examples": [
      [
        "他人に迷惑をかけないように気をつけている。",
        "Tôi chú ý để không làm phiền người khác."
      ],
      [
        "担任の先生は、毎朝あいさつをしてくれる。",
        "Thầy chủ nhiệm ngày nào cũng chào chúng tôi."
      ]
    ],
    "quiz": {
      "q": "Đọc 他人 trong câu: 他人の悪口を言うのはよくない。",
      "options": [
        "たじん",
        "たにん",
        "たんじん",
        "たんにん"
      ],
      "answer": 1,
      "explain": "他人 = たにん (không có ん ở giữa)."
    }
  },
  {
    "id": "pv5",
    "area": "kanji",
    "source": "jlpt-1225",
    "title": "終点 (しゅうてん)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 5",
    "gist": "Đọc 終点 (ga tiếp theo là ga cuối).",
    "pick": "じゅうてん",
    "ans": "しゅうてん",
    "why": "終 đọc しゅう, 点 đọc てん. じゅうてん là 重点 (trọng điểm), một từ khác có âm đầu じゅう. Hai chữ đầu khác nhau: 終 (kết thúc) và 重 (nặng).",
    "note": "終点 しゅうてん ↔ 起点 (きてん). 終電 しゅうでん = chuyến tàu cuối (電 đọc でん). 終 = しゅう: 終わる, 最終 (さいしゅう). 点 = てん: 得点, 重点 (じゅうてん).",
    "examples": [
      [
        "このバスは終点の駅前まで行きます。",
        "Xe buýt này đi đến bến cuối ở trước ga."
      ],
      [
        "この授業は、会話に重点を置いている。",
        "Lớp này đặt trọng tâm vào hội thoại."
      ]
    ],
    "quiz": {
      "q": "Đọc 終点 trong câu: この電車の終点は東京駅です。",
      "options": [
        "しゅうでん",
        "じゅうてん",
        "じゅうでん",
        "しゅうてん"
      ],
      "answer": 3,
      "explain": "終点 = しゅうてん (しゅう + てん)."
    }
  },
  {
    "id": "pv7",
    "area": "kanji",
    "source": "jlpt-1225",
    "title": "帯 (おび)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 7",
    "gist": "Đọc 帯 (cái obi của bộ kimono này rất đẹp).",
    "pick": "いと",
    "ans": "おび",
    "why": "帯 là dải thắt ngang eo khi mặc kimono, đọc おび. いと là 糸 (sợi chỉ). Hai đáp án còn lại cũng là bộ phận của kimono: 襟 (えり, cổ áo) và 袖 (そで, tay áo).",
    "note": "Từ về kimono: 帯 おび, 袖 そで, 襟 えり. Chữ 帯 còn gặp trong 包帯 (ほうたい), 携帯 (けいたい), 時間帯 (じかんたい). Nghĩa chung: dải, đai, vùng.",
    "examples": [
      [
        "浴衣に、赤い帯をしめた。",
        "Tôi thắt obi đỏ lên bộ yukata."
      ],
      [
        "この着物は、袖が長くて、とてもきれいです。",
        "Bộ kimono này tay dài và rất đẹp."
      ]
    ],
    "quiz": {
      "q": "Đọc 帯 trong câu: 母は着物に金色の帯をしめた。",
      "options": [
        "おび",
        "えり",
        "そで",
        "いと"
      ],
      "answer": 0,
      "explain": "帯 = おび (đai thắt eo của kimono)."
    }
  },
  {
    "id": "pv9",
    "area": "kanji",
    "source": "jlpt-1225",
    "title": "辺り (あたり)",
    "tag": "Chữ Hán · viết",
    "where": "Từ vựng · câu 9",
    "gist": "Viết bằng kanji từ あたり (quanh đây có nhiều chung cư).",
    "pick": "返り",
    "ans": "辺り",
    "why": "あたり = vùng quanh đây, viết 辺り. 返 là ‘trả lại, quay lại’ (返す, 返事). Các chữ 辺, 返, 迎, 通 đều có bộ 辶 nên dễ nhìn nhầm.",
    "note": "辺: へん / あた(り). 近辺 (きんぺん), 周辺 (しゅうへん), この辺 (このへん). 当たり (あたり) là ‘trúng’, cùng âm nhưng khác nghĩa. Mẹo: 辺 = quanh, vùng. 返 = trả. 迎 = đón. 通 = đi qua.",
    "examples": [
      [
        "この辺りは、夜になると静かになる。",
        "Quanh đây buổi tối rất yên tĩnh."
      ],
      [
        "駅の周辺には、店がたくさんある。",
        "Quanh ga có nhiều cửa hàng."
      ]
    ],
    "quiz": {
      "q": "Chọn kanji đúng cho あたり: このあたりに郵便局はありますか。",
      "options": [
        "近り",
        "返り",
        "週り",
        "辺り"
      ],
      "answer": 3,
      "explain": "あたり (vùng quanh đây) = 辺り."
    }
  },
  {
    "id": "pv17",
    "area": "vocab",
    "source": "jlpt-1225",
    "title": "決心 (けっしん)",
    "tag": "Chọn từ · ghi nhầm số",
    "where": "Từ vựng · câu 17",
    "gist": "Muốn chữa bệnh cho người ốm nên hồi cấp 3 đã quyết định làm bác sĩ.",
    "pick": "証明 (số 3, do ghi nhầm)",
    "ans": "決心 (số 2)",
    "why": "Bạn biết đáp án đúng là 決心 nhưng ghi nhầm thành số 3 (証明). Đây là lỗi ghi, không phải lỗi kiến thức. Thi thật thì câu này vẫn mất điểm, nên hãy khoanh đáp án trong đề, tô phiếu ngay, rồi soát lại số ở cuối giờ.",
    "note": "決心 = quyết tâm (giống Hán-Việt). Mẫu: 〜ことを決心する. Ba từ còn lại không nói về ý chí: 予想 = dự đoán, 証明 = chứng minh (無実を証明する), 仮定 = giả định.",
    "examples": [
      [
        "毎朝30分走ることを決心した。",
        "Tôi quyết tâm chạy 30 phút mỗi sáng."
      ],
      [
        "この書類は、身分を証明するために必要です。",
        "Giấy tờ này cần để chứng minh thân phận."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 日本で働くことを（　）して、日本語の勉強を始めた。",
      "options": [
        "証明",
        "予想",
        "決心",
        "仮定"
      ],
      "answer": 2,
      "explain": "Quyết định làm việc ở Nhật → 決心."
    }
  },
  {
    "id": "pv26",
    "area": "vocab",
    "source": "jlpt-1225",
    "title": "清潔 (せいけつ)",
    "tag": "Từ gần nghĩa",
    "where": "Từ vựng · câu 26",
    "gist": "Chọn từ gần nghĩa nhất với 清潔な (cái khăn sạch).",
    "pick": "柔らかい",
    "ans": "きれいな",
    "why": "清潔 = sạch sẽ, hợp vệ sinh, nghĩa gần nhất là きれい (sạch). 柔らかい nói về độ mềm. ぬれた là ướt, 乾いた là khô. Ba từ này không nói sạch hay bẩn.",
    "note": "清潔 ↔ 不潔 (ふけつ). 清潔な手, 清潔な部屋, 清潔にする. きれい có hai nghĩa: đẹp và sạch. Chữ 清 còn gặp trong 清掃 (せいそう, dọn vệ sinh).",
    "examples": [
      [
        "料理の前に、手を清潔にしてください。",
        "Trước khi nấu, hãy giữ tay sạch."
      ],
      [
        "この病院は、いつも清潔で気持ちがいい。",
        "Bệnh viện này lúc nào cũng sạch, dễ chịu."
      ]
    ],
    "quiz": {
      "q": "Chọn từ gần nghĩa nhất với 「清潔な」: 清潔なシャツに着がえた。",
      "options": [
        "きれいな",
        "柔らかい",
        "新しい",
        "ぬれた"
      ],
      "answer": 0,
      "explain": "清潔な = sạch sẽ = きれいな."
    }
  },
  {
    "id": "pv30",
    "area": "vocab",
    "source": "jlpt-1225",
    "title": "おしまい (kết thúc)",
    "tag": "Từ gần nghĩa",
    "where": "Từ vựng · câu 30",
    "gist": "Chọn câu gần nghĩa nhất với ‘sắp kết thúc thôi’ (おしまいにしましょう).",
    "pick": "休みましょう",
    "ans": "終わりにしましょう",
    "why": "おしまい = kết thúc, là cách nói mềm của 終わり. おしまいにする = dừng hẳn. 休みましょう chỉ là nghỉ một lúc rồi có thể làm tiếp.",
    "note": "今日はこれでおしまい = hôm nay đến đây thôi. おしまい còn nghĩa ‘hết rồi, xong đời’ (もうおしまいだ). Nghỉ giải lao: 休憩する, ひと休みする.",
    "examples": [
      [
        "今日の授業は、これでおしまいです。",
        "Buổi học hôm nay đến đây là hết."
      ],
      [
        "遅くなったから、仕事はそろそろおしまいにしよう。",
        "Muộn rồi, kết thúc công việc thôi."
      ]
    ],
    "quiz": {
      "q": "Chọn câu có nghĩa gần nhất với 「今日の練習は、これでおしまいです。」",
      "options": [
        "今日の練習は、これから始まります。",
        "今日の練習は、少し休みます。",
        "今日の練習は、これで終わりです。",
        "今日の練習は、とても難しいです。"
      ],
      "answer": 2,
      "explain": "これでおしまい = これで終わり."
    }
  },
  {
    "id": "pv31",
    "area": "vocab",
    "source": "jlpt-1225",
    "title": "にぎる (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 31",
    "gist": "Chọn câu dùng にぎる đúng.",
    "pick": "câu ‘にぎった’ khi khiêng đồ nặng lúc chuyển nhà",
    "ans": "câu ‘nắm chặt tay em ở lễ hội’",
    "why": "にぎる (握る) = nắm chặt bằng bàn tay: nắm tay, nắm vô lăng. Khiêng vật nặng là 運ぶ hoặc 持つ. Bắt chiếc mũ bay là つかまえる. Bế em bé là だく.",
    "note": "にぎる: 手をにぎる, ハンドルをにぎる, こぶしをにぎる. おにぎり (cơm nắm) cùng gốc. Nghĩa bóng: 権力をにぎる (nắm quyền). Câu 3 của đề có 飛ばされた = bị động thường của 飛ばす (mũ bị gió thổi bay). Ngữ pháp đó đúng, chỗ sai của câu 3 là dùng にぎる thay cho つかまえる.",
    "examples": [
      [
        "迷子にならないように、子どもの手をしっかりにぎった。",
        "Tôi nắm chặt tay con để con không lạc."
      ],
      [
        "車のハンドルをにぎって、ゆっくり運転した。",
        "Tôi nắm vô lăng và lái chậm."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng にぎる đúng.",
      "options": [
        "重い荷物を二階までにぎって運んだ。",
        "友だちの手をにぎって、「がんばって」と言った。",
        "赤ちゃんをやさしくにぎって、ねかせた。",
        "風で飛んだ帽子を走ってにぎった。"
      ],
      "answer": 1,
      "explain": "手をにぎる = nắm tay."
    }
  },
  {
    "id": "pv34",
    "area": "vocab",
    "source": "jlpt-1225",
    "title": "懐かしい (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 34",
    "gist": "Chọn câu dùng 懐かしい đúng.",
    "pick": "câu ‘vừa gặp đã thành bạn 懐かしい’",
    "ans": "câu ‘xem ảnh hồi nhỏ thấy 懐かしい’",
    "why": "懐かしい = bồi hồi, nhớ nhung khi gặp lại thứ thuộc về quá khứ (ảnh cũ, bài hát cũ). Không dùng để nói ‘cũ’ (古い), ‘thân thiết’ (親しい) hay ‘quan hệ lâu năm’ (長い).",
    "note": "懐かしい: 懐かしい思い出, 懐かしい歌, 懐かしい味. Thân thiết: 親しい友達. Cũ, có lịch sử: 古い寺. Vừa gặp lần đầu thì không dùng 懐かしい.",
    "examples": [
      [
        "久しぶりに母の料理を食べて、懐かしい味がした。",
        "Lâu lắm mới ăn món mẹ nấu, thấy vị quen thuộc đầy hoài niệm."
      ],
      [
        "この歌を聞くと、子どものころを思い出して懐かしい。",
        "Nghe bài này, tôi nhớ hồi nhỏ và thấy bồi hồi."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng 懐かしい đúng.",
      "options": [
        "古いアルバムを見て、懐かしい気持ちになった。",
        "この家は百年前に建てられた懐かしい家だ。",
        "会ってすぐに、彼とは懐かしい友達になった。",
        "結婚して長いので、妻とは懐かしい関係だ。"
      ],
      "answer": 0,
      "explain": "Xem ảnh cũ và nhớ lại → 懐かしい."
    }
  },
  {
    "id": "pg4",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "あまりに〜ので",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 4",
    "gist": "Mọi khi mưa vẫn đi xe đạp đến trường, nhưng sáng nay mưa quá mạnh nên đi xe buýt.",
    "pick": "今にも",
    "ans": "あまりに",
    "why": "Chỗ trống cần từ chỉ mức độ quá lớn, dẫn tới kết quả (đi xe buýt). あまりに = quá, vượt mức bình thường. 今にも luôn đi với 〜そうだ (sắp xảy ra đến nơi), mà câu này không có 〜そうだ.",
    "note": "あまりに(も) + A/V → kết quả: あまりに忙しくて、寝る時間がない. 今にも〜そうだ: 今にも雨が降りそうだ. 次第に = dần dần. ちっとも〜ない = không hề.",
    "examples": [
      [
        "この映画はあまりに悲しくて、泣いてしまった。",
        "Phim này buồn quá nên tôi đã khóc."
      ],
      [
        "空が暗くなって、今にも雨が降りそうだ。",
        "Trời tối sầm, sắp mưa đến nơi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 彼の話は（　）ひどかったので、だれも笑えなかった。",
      "options": [
        "ちっとも",
        "次第に",
        "今にも",
        "あまりに"
      ],
      "answer": 3,
      "explain": "Quá… nên không ai cười được → あまりに."
    }
  },
  {
    "id": "pg10",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜てほしいんですが (nhờ vả)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 10",
    "gist": "Ở công ty, nhờ đồng nghiệp: nếu biết phòng khám mắt nào tốt gần đây thì chỉ giúp, vì từ sáng bị ngứa mắt.",
    "pick": "教えてもらうんですか",
    "ans": "教えてほしいんですが",
    "why": "Người nói muốn nhờ người kia làm việc: ‘nếu anh biết thì tôi muốn anh chỉ giúp’ → 〜てほしいんですが. 教えたい là chính người nói muốn chỉ cho người khác. 教えてもいいですか là xin phép được chỉ. 教えてもらうんですか là câu hỏi ‘anh sẽ nhờ người ta chỉ à?’, sai chiều.",
    "note": "Nhờ ai làm gì: V てほしい(んですが), V てもらえませんか, V ていただけませんか. V てもらう = mình nhận hành động từ người khác. Đuôi 〜んですが nêu hoàn cảnh rồi chờ người nghe phản hồi.",
    "examples": [
      [
        "すみません、この荷物を運んでほしいんですが。",
        "Xin lỗi, tôi muốn nhờ anh mang giúp hành lý này."
      ],
      [
        "駅までの道を教えてもらえませんか。",
        "Anh chỉ giúp tôi đường đến ga được không?"
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: （同僚に頼みたい）すみません、この資料を5部（　）んですが。",
      "options": [
        "コピーしたい",
        "コピーしてもいい",
        "コピーしてもらう",
        "コピーしてほしい"
      ],
      "answer": 3,
      "explain": "Nhờ người khác làm → 〜てほしい."
    }
  },
  {
    "id": "pg12",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜てきてくれる (mua rồi mang về cho mình)",
    "tag": "PDF 139 · 140",
    "where": "Ngữ pháp · câu 12",
    "gist": "Mỗi lần đi công tác, bố luôn mua quà cho mẹ và tôi.",
    "pick": "買っていってくれる",
    "ans": "買ってきてくれる",
    "why": "Có hai cặp cần chọn. Hướng: bố mua quà ở nơi công tác rồi mang về nhà (chỗ người nói), nên dùng 〜てくる, không dùng 〜ていく. Người nhận: bố làm cho mẹ và tôi (phía người nói), nên dùng くれる, không dùng あげる.",
    "note": "V てくる = làm rồi quay về chỗ người nói: 買ってくる, 行ってくる (PDF 140). V ていく = làm rồi đi tới chỗ khác: 買っていく (PDF 139). くれる = người khác làm cho mình hoặc phía mình. あげる = mình làm cho người khác.",
    "examples": [
      [
        "友だちが旅行のお土産を買ってきてくれた。",
        "Bạn đã mua quà du lịch mang về cho tôi."
      ],
      [
        "これから友だちの家にケーキを買っていくつもりだ。",
        "Bây giờ tôi định mua bánh mang đến nhà bạn."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án đúng: 姉は旅行に行くと、いつも私にお土産を（　）。",
      "options": [
        "買ってきてあげる",
        "買っていってあげる",
        "買ってきてくれる",
        "買っていってくれる"
      ],
      "answer": 2,
      "explain": "Chị mua rồi mang về cho mình → 買ってきてくれる."
    }
  },
  {
    "id": "pg15",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜か何かで見たこと + ô ★",
    "tag": "PDF 125",
    "where": "Ngữ pháp · câu 15 (xếp câu)",
    "gist": "Nhớ là đã thấy quán cà phê này trên TV hay đâu đó, rủ bạn vào thử.",
    "pick": "mảnh ở ô thứ 4",
    "ans": "mảnh ở ô thứ 3 (で)",
    "why": "Câu đúng: テレビ → か何か → で → 見たこと. Mảnh ở ô ★ (ô thứ 3) là で. Bạn chọn mảnh cuối cụm, 見たこと, ở ô thứ 4. Thẻ ‘〜ようとしたところに + ô ★’ (câu 14 đề Dungmori) cũng sai đúng kiểu này.",
    "note": "N + か何か = N hay gì đó (PDF 125). N + で + V = qua phương tiện N. V た + ことがある = đã từng. Cách làm: sắp đủ 4 mảnh, đánh số ① ② ③ ④ lên 4 ô, đọc lại cả câu rồi mới lấy mảnh ở ô có ★.",
    "examples": [
      [
        "あの人、テレビか何かで見たことがある気がする。",
        "Tôi có cảm giác đã thấy người này trên TV hay đâu đó."
      ],
      [
        "コーヒーか何か、飲みませんか。",
        "Uống cà phê hay gì đó không?"
      ]
    ],
    "quiz": {
      "q": "Xếp 4 mảnh vào 4 ô của câu có ★ ở ô thứ 3. A 読んだこと / B で / C 新聞 / D か何か. Mảnh nào nằm ở ô ★?",
      "options": [
        "A 読んだこと",
        "B で",
        "C 新聞",
        "D か何か"
      ],
      "answer": 1,
      "explain": "Câu đúng: C → D → B → A (新聞か何かで読んだことがある). Ô thứ 3 là B."
    }
  },
  {
    "id": "pg16",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜ば〜ほど · 〜ようになっていく + ô ★",
    "tag": "PDF 001 · 139",
    "where": "Ngữ pháp · câu 16 (xếp câu)",
    "gist": "Tập guitar mỗi ngày, càng chơi càng thấy mình giỏi lên.",
    "pick": "mảnh ở ô thứ 4",
    "ans": "mảnh ở ô thứ 3 (弾けるように)",
    "why": "Câu đúng: 弾けば → 弾くほど → 上手に → 弾けるように → なっていくのが. Mảnh ở ô ★ (ô thứ 3) là 弾けるように. Bạn chọn なっていくのが, mảnh ở ô thứ 4. Lỗi giống câu 15: chọn mảnh cuối cụm.",
    "note": "V ば V ほど = càng… càng… (PDF 001). V ように + なる = trở nên có thể… V ていく = dần dần thay đổi về sau (PDF 139). Lưu ý: bản đề mình đọc in 弾くけど ở mảnh 2, có vẻ là lỗi in của 弾くほど.",
    "examples": [
      [
        "練習すればするほど、上手に歌えるようになる。",
        "Càng luyện càng hát hay."
      ],
      [
        "毎日勉強すれば、少しずつ漢字が読めるようになっていく。",
        "Học mỗi ngày thì dần dần sẽ đọc được kanji."
      ]
    ],
    "quiz": {
      "q": "Xếp 4 mảnh vào 4 ô của câu 「話せば＿＿ ＿＿ ★ ＿＿わかる。」(★ ở ô thứ 3). A 話せるように / B なっていくのが / C 日本語が / D 話すほど. Mảnh nào nằm ở ô ★?",
      "options": [
        "A 話せるように",
        "B なっていくのが",
        "C 日本語が",
        "D 話すほど"
      ],
      "answer": 0,
      "explain": "Câu đúng: D → C → A → B (話せば話すほど日本語が話せるようになっていくのがわかる). Ô thứ 3 là A."
    }
  },
  {
    "id": "pg18",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜ためには〜ことが重要だ + ô ★",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 18 (xếp câu)",
    "gist": "Phòng tắm dễ mọc nấm mốc. Để phòng nấm mốc, điều quan trọng là sau khi dùng đừng để ẩm ướt.",
    "pick": "mảnh ở ô thứ 2",
    "ans": "mảnh ở ô thứ 3 (ぬれたままにしない)",
    "why": "Câu đúng: ためには → 使った後 → ぬれたままにしない → ことが. Cụm thời gian 使った後 đứng ngay sau ためには (ô thứ 2). Mảnh ở ô ★ (ô thứ 3) là cụm động từ ぬれたままにしない, đứng ngay trước ことが.",
    "note": "Mẫu: V るために(は), … V る/ない + ことが 重要だ/大切だ. Khối đứng trước ことが phải là một cụm động từ thể thường. ままにする = để nguyên một trạng thái (ぬれたまま = cứ để ướt).",
    "examples": [
      [
        "健康のためには、毎日少し運動することが大切だ。",
        "Để khỏe mạnh, điều quan trọng là vận động một chút mỗi ngày."
      ],
      [
        "この本は、読んだあと、机の上に置いたままにしないでください。",
        "Quyển sách này đọc xong xin đừng để nguyên trên bàn."
      ]
    ],
    "quiz": {
      "q": "Xếp 4 mảnh vào 4 ô của câu 「風邪を防ぐ＿＿ ＿＿ ★ ＿＿大切だ。」(★ ở ô thứ 3). A ことが / B 手を洗う / C 帰った後 / D ためには. Mảnh nào nằm ở ô ★?",
      "options": [
        "A ことが",
        "B 手を洗う",
        "C 帰った後",
        "D ためには"
      ],
      "answer": 1,
      "explain": "Câu đúng: D → C → B → A (風邪を防ぐためには帰った後手を洗うことが大切だ). Ô thứ 3 là B."
    }
  },
  {
    "id": "pg19",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜と思っていたからです (câu giải thích lý do)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 19 (điền đoạn văn)",
    "gist": "Lúc mới sang Nhật, tôi không để ý khác biệt giữa các hãng cửa hàng tiện lợi. Câu cần điền giải thích lý do.",
    "pick": "思います",
    "ans": "思っていたからです",
    "why": "Câu trước kể chuyện quá khứ (lúc mới đến Nhật, không để ý khác biệt). Câu cần điền giải thích lý do cho việc đó: ‘vì hồi đó tôi nghĩ…’. Cần thì quá khứ 思っていた và cuối câu 〜からです. 思います (hiện tại) lệch thời điểm và không nêu lý do.",
    "note": "Điền đoạn văn: nhìn câu trước. Câu trước nêu hành động hoặc kết quả, câu sau giải thích lý do thì kết thúc bằng 〜からです. Nhìn thì (quá khứ hay hiện tại) của cả đoạn. V ている + た = hồi đó đã nghĩ như vậy.",
    "examples": [
      [
        "昨日は学校を休みました。熱があったからです。",
        "Hôm qua tôi nghỉ học. Vì tôi bị sốt."
      ],
      [
        "子どものころは、大人はみんな強いと思っていた。",
        "Hồi nhỏ tôi từng nghĩ người lớn ai cũng mạnh."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án điền vào chỗ trống: 以前は、駅の近くのコンビニしか知りませんでした。ほかの店は遠いと（　）。",
      "options": [
        "思っていたからです",
        "思います",
        "思ってしまいます",
        "思ったことです"
      ],
      "answer": 0,
      "explain": "Giải thích lý do cho việc ở quá khứ → 思っていたからです."
    }
  },
  {
    "id": "pg22",
    "area": "grammar",
    "source": "jlpt-1225",
    "title": "〜なのです (câu kết khẳng định)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 22 (điền đoạn văn)",
    "gist": "Câu kết bài văn: tiệm tiện lợi không chỉ để mua đồ mà còn là nơi làm tôi vui khi đến.",
    "pick": "場所なのでしょうか",
    "ans": "場所なのです",
    "why": "Đây là câu kết của bài: người viết khẳng định ý mình (‘đó là nơi…’). 〜なのです dùng để giải thích và khẳng định. 〜でしょうか là câu hỏi, không hợp ở cuối một đoạn khẳng định. 場所にした và 場所にする nói về việc quyết định biến thành, sai nghĩa.",
    "note": "Mẫu ‘A ではありません。B なのです。’ = không phải A mà là B. Câu cuối bài văn nêu quan điểm thì dùng 〜のです, 〜ことです. Câu hỏi 〜でしょうか thường chỉ dùng để đặt vấn đề ở đầu bài.",
    "examples": [
      [
        "私にとって、図書館は本を借りるだけの場所ではありません。静かに考えられる場所なのです。",
        "Với tôi, thư viện không chỉ là nơi mượn sách. Đó là nơi tôi suy nghĩ yên tĩnh."
      ],
      [
        "これは、私が一番好きな店なのです。",
        "Đây là quán tôi thích nhất."
      ]
    ],
    "quiz": {
      "q": "Chọn đáp án điền vào chỗ trống: 私にとって、この公園は散歩をするだけの場所ではありません。心が落ち着く（　）。",
      "options": [
        "場所なのでしょうか",
        "場所にしたのです",
        "場所なのです",
        "場所にするのでしょう"
      ],
      "answer": 2,
      "explain": "Câu kết khẳng định ý của người viết → 場所なのです."
    }
  },
  {
    "id": "v5",
    "area": "kanji",
    "source": "dm-1411",
    "title": "就職 (しゅうしょく)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 5",
    "gist": "Đọc 就職 (vào làm ở ngân hàng sau khi ra trường).",
    "pick": "しゅしょく",
    "ans": "しゅうしょく",
    "why": "就 đọc しゅう (âm dài). しゅしょく là 主食 (món ăn chính), một từ khác.",
    "note": "就職 しゅうしょく = xin được việc. 主食 しゅしょく = món chính. Mẹo: 就職活動 (しゅうしょくかつどう).",
    "examples": [
      [
        "兄は去年、旅行会社に就職しました。",
        "Năm ngoái anh trai tôi vào làm ở công ty du lịch."
      ],
      [
        "日本の主食はお米です。",
        "Món chính của người Nhật là cơm."
      ]
    ],
    "quiz": {
      "q": "Đọc 就職 trong câu: 兄は去年、旅行会社に就職しました。",
      "options": [
        "しゅしょく",
        "しゅうしょく",
        "しゅうしょ",
        "しゅしょ"
      ],
      "answer": 1,
      "explain": "就職 = しゅうしょく (có âm dài)."
    }
  },
  {
    "id": "v8",
    "area": "kanji",
    "source": "dm-1411",
    "title": "許可 (きょか)",
    "tag": "Chữ Hán · đọc",
    "where": "Từ vựng · câu 8",
    "gist": "Đọc 許可 (xin phép khi dùng phòng).",
    "pick": "きょうか",
    "ans": "きょか",
    "why": "許可 đọc ngắn: きょ + か. きょうか là 強化 hoặc 教科, có âm dài.",
    "note": "許 = きょ (không dài): 許可, 許す. Âm dài: 強化 きょうか, 教科 きょうか.",
    "examples": [
      [
        "先生の許可をもらって、教室を使った。",
        "Tôi xin phép thầy rồi dùng phòng học."
      ],
      [
        "基礎体力の強化が必要だ。",
        "Cần tăng cường thể lực nền."
      ]
    ],
    "quiz": {
      "q": "Đọc 許可 trong câu: 先生の許可をもらって、教室を使った。",
      "options": [
        "きょうか",
        "きょっか",
        "きょか",
        "きゅか"
      ],
      "answer": 2,
      "explain": "許可 = きょか (âm ngắn)."
    }
  },
  {
    "id": "v12",
    "area": "kanji",
    "source": "dm-1411",
    "title": "過去 (かこ)",
    "tag": "Chữ Hán · viết",
    "where": "Từ vựng · câu 12",
    "gist": "Viết bằng kanji từ かこ (quá khứ).",
    "pick": "過古",
    "ans": "過去",
    "why": "去 nghĩa là ‘đi qua’ (去年, 去る). 古 nghĩa là ‘cũ’ (古い). Quá khứ là thời đã đi qua, nên viết 過去.",
    "note": "過去 ↔ 未来. 古 chỉ độ cũ: 古い, 古典.",
    "examples": [
      [
        "過去の失敗から学ぶ。",
        "Học từ thất bại trong quá khứ."
      ],
      [
        "去年の夏は暑かった。",
        "Mùa hè năm ngoái rất nóng."
      ]
    ],
    "quiz": {
      "q": "Chọn kanji đúng cho かこ: かこの失敗から学ぶことは大切だ。",
      "options": [
        "過古",
        "週去",
        "週古",
        "過去"
      ],
      "answer": 3,
      "explain": "かこ = 過去."
    }
  },
  {
    "id": "v18",
    "area": "vocab",
    "source": "dm-1411",
    "title": "間隔",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 18",
    "gist": "Tàu đến cách nhau vài phút.",
    "pick": "短期",
    "ans": "間隔",
    "why": "〜分間隔で = cứ cách vài phút một lần. 間隔 là khoảng cách giữa các lần hoặc các vật. 短期 là ngắn hạn, 期間 là khoảng thời gian từ… đến….",
    "note": "間隔: 10分間隔で来る, 間隔をあけて座る. 期間: 期間限定. 時刻: giờ cụ thể.",
    "examples": [
      [
        "バスは10分間隔で来ます。",
        "Xe buýt cứ 10 phút một chuyến."
      ],
      [
        "席の間隔をあけて座ってください。",
        "Hãy ngồi cách nhau ra."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: バスは10分（　）で来ます。",
      "options": [
        "区間",
        "間隔",
        "時間",
        "期限"
      ],
      "answer": 1,
      "explain": "10分間隔で = cứ 10 phút một lần."
    }
  },
  {
    "id": "v20",
    "area": "vocab",
    "source": "dm-1411",
    "title": "期待 (きたい)",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 20",
    "gist": "Bố mẹ mong con vào được đại học tốt.",
    "pick": "指導",
    "ans": "期待",
    "why": "期待する = kỳ vọng, mong đợi. 指導 là hướng dẫn (thầy dạy trò). Bố mẹ mong con thì dùng 期待.",
    "note": "期待: 期待する, 期待に応える, 期待外れ. 指導 (しどう): 先生が指導する.",
    "examples": [
      [
        "みんなが彼の新しい作品を期待している。",
        "Mọi người mong chờ tác phẩm mới của anh ấy."
      ],
      [
        "先生に論文を指導してもらった。",
        "Tôi được thầy hướng dẫn viết luận văn."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 親は子どもの成功を（　）している。",
      "options": [
        "指導",
        "予約",
        "期待",
        "出発"
      ],
      "answer": 2,
      "explain": "Bố mẹ mong con thành công → 期待."
    }
  },
  {
    "id": "v22",
    "area": "vocab",
    "source": "dm-1411",
    "title": "複雑 (ふくざつ)",
    "tag": "Chọn từ · cùng gốc với 順調",
    "where": "Từ vựng · câu 22",
    "gist": "Nhiều người liên quan thì vấn đề trở nên rắc rối.",
    "pick": "順調",
    "ans": "複雑",
    "why": "順調 là suôn sẻ, tiến triển tốt, nghĩa ngược với ‘rắc rối’. Nhiều người liên quan làm vấn đề phức tạp: 複雑.",
    "note": "複雑 ↔ 単純, 簡単. 順調 = tiến triển tốt (công việc, hồi phục). Bạn đã nhầm 順調 ở cả câu 22 và câu 31.",
    "examples": [
      [
        "関係する人が増えると、話が複雑になる。",
        "Càng nhiều người liên quan, chuyện càng phức tạp."
      ],
      [
        "この地図は道が複雑で、よくわからない。",
        "Bản đồ này đường phức tạp, khó hiểu."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: この地図は道が（　）で、よくわからない。",
      "options": [
        "単純",
        "複雑",
        "簡単",
        "自由"
      ],
      "answer": 1,
      "explain": "Khó hiểu vì đường rắc rối → 複雑."
    }
  },
  {
    "id": "v23",
    "area": "vocab",
    "source": "dm-1411",
    "title": "しまう (cất)",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 23",
    "gist": "Không nhớ đã cất cái áo len đỏ ở đâu.",
    "pick": "かさねた",
    "ans": "しまった",
    "why": "しまう = cất vào chỗ của nó (tủ, ngăn kéo, két). かさねる là xếp chồng lên nhau. ‘Cất ở đâu’ thì dùng どこにしまったか.",
    "note": "しまう: 服をたんすにしまう. かさねる: 本を重ねる. はさむ: kẹp vào giữa. はずす: tháo ra. Đừng nhầm với 〜てしまう.",
    "examples": [
      [
        "パスポートをどこにしまったか忘れた。",
        "Tôi quên đã cất hộ chiếu ở đâu."
      ],
      [
        "冬になったので、夏の服を押し入れにしまった。",
        "Vào đông rồi nên tôi cất đồ hè vào tủ âm tường."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 大切な書類をなくさないように、金庫に（　）。",
      "options": [
        "はずした",
        "かさねた",
        "しまった",
        "はさんだ"
      ],
      "answer": 2,
      "explain": "Cất vào két → しまった."
    }
  },
  {
    "id": "v24",
    "area": "vocab",
    "source": "dm-1411",
    "title": "ふらふら / ぶらぶら",
    "tag": "Chọn từ",
    "where": "Từ vựng · câu 24",
    "gist": "Sốt từ hôm qua, đầu choáng nên nghỉ làm.",
    "pick": "ぶらぶら",
    "ans": "ふらふら",
    "why": "ふらふら = choáng váng, đi loạng choạng vì yếu hoặc say. ぶらぶら = đi dạo, rảnh rỗi, đung đưa.",
    "note": "ふらふら: 熱で足がふらふらする. ぶらぶら: 町をぶらぶら歩く. からから = khô, がらがら = vắng.",
    "examples": [
      [
        "お酒を飲みすぎて、ふらふらになった。",
        "Uống nhiều rượu quá nên loạng choạng."
      ],
      [
        "日曜日は、駅の周りをぶらぶら歩いた。",
        "Chủ nhật tôi đi dạo quanh ga."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: お酒を飲みすぎて、まっすぐ歩けないほど（　）だ。",
      "options": [
        "からから",
        "ふらふら",
        "ぶらぶら",
        "がらがら"
      ],
      "answer": 1,
      "explain": "Say đến mức đi không thẳng → ふらふら."
    }
  },
  {
    "id": "v31",
    "area": "vocab",
    "source": "dm-1411",
    "title": "順調 (cách dùng)",
    "tag": "Cách dùng từ · cùng gốc với câu 22",
    "where": "Từ vựng · câu 31",
    "gist": "Chọn câu dùng 順調 đúng.",
    "pick": "câu ‘nói tiếng Nhật 順調に’",
    "ans": "câu ‘công việc tiến triển 順調’",
    "why": "順調 = tiến triển suôn sẻ (công việc, hồi phục, kinh doanh). Chủ ngữ là quá trình, không phải người nói trôi chảy.",
    "note": "Nói trôi chảy: すらすら, 流暢に. Xếp hàng: きちんと. Xe đi suôn: スムーズに. 順調: 仕事が順調だ, 回復が順調だ.",
    "examples": [
      [
        "手術のあと、回復は順調です。",
        "Sau mổ, hồi phục suôn sẻ."
      ],
      [
        "商売が順調に伸びている。",
        "Việc kinh doanh phát triển thuận lợi."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng 順調 đúng.",
      "options": [
        "彼は英語が上手で、順調に話します。",
        "手術のあと、回復は順調です。",
        "電車で、人が順調に並んでいます。",
        "この道は狭くて、車が順調に通れません。"
      ],
      "answer": 1,
      "explain": "順調 đi với quá trình tiến triển (回復)."
    }
  },
  {
    "id": "v33",
    "area": "vocab",
    "source": "dm-1411",
    "title": "認める (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 33",
    "gist": "Chọn câu dùng 認める đúng.",
    "pick": "câu ‘xác nhận lịch rồi trả lời’",
    "ans": "câu ‘thừa nhận lỗi của mình’",
    "why": "認める = thừa nhận (lỗi, sự thật) hoặc công nhận (tài năng). Không dùng cho ‘xác nhận’ (確認する) hay ‘tra cứu’ (調べる).",
    "note": "認める: 間違いを認める, 才能を認める, 入学を認める. 確認する = kiểm tra, xác nhận.",
    "examples": [
      [
        "社長は彼の才能を認めて、重要な仕事をまかせた。",
        "Giám đốc công nhận tài năng của anh ấy và giao việc quan trọng."
      ],
      [
        "自分の失敗を認めるのは勇気がいる。",
        "Thừa nhận thất bại của mình cần can đảm."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng 認める đúng.",
      "options": [
        "約束の時間を認めてから、出かけます。",
        "辞書で、わからない言葉の意味を認めた。",
        "明日の天気を認めてから、傘を持って行く。",
        "社長は彼の才能を認めて、重要な仕事をまかせた。"
      ],
      "answer": 3,
      "explain": "認める = công nhận tài năng."
    }
  },
  {
    "id": "v34",
    "area": "vocab",
    "source": "dm-1411",
    "title": "かける (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 34",
    "gist": "Chọn câu dùng かける đúng.",
    "pick": "câu ‘手をかけて呼ぶ’",
    "ans": "câu ‘鍵をかける’",
    "why": "かける đi với danh từ cố định: 鍵をかける (khoá), 声をかける (gọi, bắt chuyện), 電話をかける. 手をかける là ‘đặt tay lên, chăm chút’, không phải vẫy tay gọi.",
    "note": "Gọi bạn: 声をかける. Vẫy tay: 手を振る. Liên lạc: 連絡をする/とる. Thắt cà vạt: ネクタイをしめる.",
    "examples": [
      [
        "ドアに鍵をかけてから、出かけた。",
        "Tôi khoá cửa rồi mới ra ngoài."
      ],
      [
        "後ろから友だちに声をかけた。",
        "Tôi gọi bạn từ phía sau."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng かける đúng.",
      "options": [
        "久しぶりに、友だちに連絡をかけた。",
        "手紙に切手をかけて、ポストに入れた。",
        "ドアに鍵をかけてから、出かけた。",
        "ネクタイをかけて、会社に行った。"
      ],
      "answer": 2,
      "explain": "鍵をかける = khoá cửa."
    }
  },
  {
    "id": "v35",
    "area": "vocab",
    "source": "dm-1411",
    "title": "落ち着く (cách dùng)",
    "tag": "Cách dùng từ",
    "where": "Từ vựng · câu 35",
    "gist": "Chọn câu dùng 落ち着く đúng.",
    "pick": "câu ‘ý kiến mọi người 落ち着かなかった’",
    "ans": "câu ‘tâm trạng ổn định lại sau khi bận’",
    "why": "落ち着く = bình tĩnh lại, ổn định (気持ち, 生活, 状況). Ý kiến thì ‘まとまる’. Đồ vật rơi là 落ちる.",
    "note": "落ち着く: 気持ちが/生活が/天気が落ち着く. 意見がまとまる. 時計が直る.",
    "examples": [
      [
        "引っ越しが終わって、やっと生活が落ち着いた。",
        "Chuyển nhà xong, cuộc sống mới ổn định."
      ],
      [
        "深呼吸をして、気持ちを落ち着かせた。",
        "Tôi hít sâu để bình tĩnh lại."
      ]
    ],
    "quiz": {
      "q": "Chọn câu dùng 落ち着く đúng.",
      "options": [
        "会議で、みんなの意見が落ち着いた。",
        "机の上のペンが落ち着いて、ころがった。",
        "壊れていた時計が、やっと落ち着いた。",
        "引っ越しが終わって、やっと生活が落ち着いた。"
      ],
      "answer": 3,
      "explain": "生活が落ち着く = cuộc sống ổn định."
    }
  },
  {
    "id": "g1",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜わりに(は)",
    "tag": "PDF 097",
    "where": "Ngữ pháp · câu 1",
    "gist": "Học ít mà điểm vẫn cao.",
    "pick": "ほど",
    "ans": "わりに",
    "why": "ほど nghĩa là ‘đến mức’ hoặc ‘càng… càng…’. Câu này nói kết quả ngược với điều ta đoán từ vế trước (ít học, điểm cao). Dùng わりに.",
    "note": "V/Aい thể thường, Aな〜な, N の + わりに(は) = ‘so với… thì’. Vế sau thường bất ngờ: tốt hơn hoặc kém hơn mong đợi.",
    "examples": [
      [
        "この店は安いわりに、料理がおいしい。",
        "Quán này rẻ mà đồ ăn lại ngon."
      ],
      [
        "彼は年のわりに若く見える。",
        "Anh ấy trông trẻ so với tuổi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 彼は年の（　）、とても元気だ。",
      "options": [
        "とおり",
        "わりに",
        "ばかり",
        "ついでに"
      ],
      "answer": 1,
      "explain": "年のわりに元気 = khỏe so với tuổi."
    }
  },
  {
    "id": "g2",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜に限り",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 2",
    "gist": "Ưu đãi chỉ áp dụng trong ngày hôm nay.",
    "pick": "だけに",
    "ans": "にかぎり",
    "why": "だけに nghĩa là ‘chính vì… nên’ (kết quả tương xứng với lý do). Câu này giới hạn phạm vi: chỉ hôm nay. Dùng に限り.",
    "note": "N + に限り = chỉ riêng N (ngày, hội viên, trường hợp đặc biệt). Đừng nhầm với 〜に限る (…là tốt nhất) và 〜とは限らない, hai mẫu này có trong PDF.",
    "examples": [
      [
        "今月に限り、送料が無料です。",
        "Chỉ trong tháng này, miễn phí vận chuyển."
      ],
      [
        "会員のお客様に限り、予約ができます。",
        "Chỉ khách hội viên mới đặt trước được."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: このクーポンは、今月（　）使えます。",
      "options": [
        "だけに",
        "に対して",
        "に限り",
        "につれて"
      ],
      "answer": 2,
      "explain": "今月に限り使えます = chỉ dùng được trong tháng này."
    }
  },
  {
    "id": "g4",
    "area": "grammar",
    "source": "dm-1411",
    "title": "お〜します (khiêm nhường)",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 4",
    "gist": "Nhân viên quán nói sẽ mang món ra ngay.",
    "pick": "お持ちください",
    "ans": "お持ちします",
    "why": "Người làm hành động là nhân viên, tức là mình. Mình làm cho khách thì dùng dạng khiêm nhường お〜します. お持ちください là lời mời khách làm (xin hãy cầm hoặc mang).",
    "note": "Tự hỏi: ai làm? Mình làm cho người trên → お/ご + V + します (いたします). Người trên làm → お〜になります. Mời người trên làm → お〜ください.",
    "examples": [
      [
        "お荷物は私がお持ちします。",
        "Hành lý để tôi mang giúp."
      ],
      [
        "資料はあとでお送りします。",
        "Tôi sẽ gửi tài liệu sau."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: （会社で、客に）資料は私があとでメールで（　）。",
      "options": [
        "お送りになります",
        "お送りします",
        "お送りください",
        "お送りです"
      ],
      "answer": 1,
      "explain": "Mình gửi cho khách → お送りします."
    }
  },
  {
    "id": "g5",
    "area": "grammar",
    "source": "dm-1411",
    "title": "Thể sai khiến bị động: 行かされる",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 5",
    "gist": "Hồi nhỏ bị bố mẹ bắt đi bơi mỗi ngày, rất ghét.",
    "pick": "行かさせられて",
    "ans": "行かされて",
    "why": "‘Bị bắt làm + không thích’ là thể sai khiến bị động. Động từ nhóm 1 dùng dạng ngắn: ない形 bỏ ない, thêm される (行く → 行かされる). 行かさせられる là dạng sai, thừa さ.",
    "note": "Nhóm 1: 書く → 書かされる, 飲む → 飲まされる (話す là ngoại lệ: 話させられる). Nhóm 2: 食べる → 食べさせられる. する → させられる. 来る → こさせられる.",
    "examples": [
      [
        "子どものころ、毎朝牛乳を飲まされて、いやだった。",
        "Hồi nhỏ sáng nào cũng bị ép uống sữa, tôi ghét lắm."
      ],
      [
        "上司に残業をさせられた。",
        "Tôi bị sếp bắt làm thêm giờ."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 子どものころ、先生に毎日漢字を（　）、いやだった。",
      "options": [
        "書かれて",
        "書かせて",
        "書かさせられて",
        "書かされて"
      ],
      "answer": 3,
      "explain": "Bị thầy bắt viết → 書かされて."
    }
  },
  {
    "id": "g6",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜ことだし",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 6",
    "gist": "Nghỉ hè rồi, muốn đi du lịch đâu đó.",
    "pick": "もので",
    "ans": "ことだし",
    "why": "もので/ものだから dùng để giải thích hoặc xin lỗi, vế sau là kết quả. Ở đây vế sau là mong muốn (〜たい). Dùng ことだし.",
    "note": "Thể thường + ことだし = ‘vì hoàn cảnh này nên…’. Vế sau thường là đề nghị, ý định, mong muốn: 〜ましょう, 〜たい, 〜ない?",
    "examples": [
      [
        "天気もいいことだし、公園でお弁当を食べませんか。",
        "Trời đẹp thế này, ra công viên ăn cơm hộp nhé?"
      ],
      [
        "みんな集まったことだし、そろそろ始めましょう。",
        "Mọi người đủ rồi, bắt đầu thôi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 天気もいい（　）、公園でお弁当を食べませんか。",
      "options": [
        "ものだから",
        "ことだし",
        "ばかりに",
        "わけで"
      ],
      "answer": 1,
      "explain": "Vế sau là lời rủ → ことだし."
    }
  },
  {
    "id": "g7",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜だらけ",
    "tag": "PDF 121",
    "where": "Ngữ pháp · câu 7",
    "gist": "Con chó thích chơi đến mức dính đầy bùn.",
    "pick": "がち",
    "ans": "だらけ",
    "why": "がち nghĩa là ‘hay, dễ (xảy ra)’ và đi với hành vi hoặc tình trạng (病気がち). Dính đầy bùn, bụi, lỗi thì dùng だらけ.",
    "note": "N + だらけ = đầy toàn N (thứ khó chịu): 泥だらけ, ゴミだらけ, 間違いだらけ. V ます + がち: 忘れがち, 遅れがち.",
    "examples": [
      [
        "机の上が書類だらけで、何も置けない。",
        "Bàn toàn giấy tờ, chẳng để được gì."
      ],
      [
        "彼の作文は間違いだらけだった。",
        "Bài văn của anh ấy toàn lỗi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 机の上が本と書類（　）で、何も置けない。",
      "options": [
        "がち",
        "ぎみ",
        "だらけ",
        "向け"
      ],
      "answer": 2,
      "explain": "Đầy toàn sách và giấy tờ → だらけ."
    }
  },
  {
    "id": "g8",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜ようになっている",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 8",
    "gist": "Cho thẻ vào thì cửa mở: cơ chế của cửa.",
    "pick": "ことになった",
    "ans": "ようになっている",
    "why": "Câu mô tả cách thiết bị hoạt động, nên dùng ようになっている. ことになった là ‘đã được quyết định’ (một sự việc), không mô tả cơ chế.",
    "note": "ようになっている = được làm hoặc thiết kế để như vậy (máy, hệ thống). ことになっている = quy định, lịch đã định (có trong PDF). ようになる = trở nên (thay đổi).",
    "examples": [
      [
        "この自動販売機は、お金を入れないとボタンが押せないようになっている。",
        "Máy bán hàng này được làm sao cho không bỏ tiền thì không bấm được nút."
      ],
      [
        "このいすは、高さを変えられるようになっている。",
        "Chiếc ghế này chỉnh được độ cao."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: この自動販売機は、お金を入れないとボタンが押せない（　）。",
      "options": [
        "ことになった",
        "ことにしている",
        "わけにはいかない",
        "ようになっている"
      ],
      "answer": 3,
      "explain": "Mô tả cơ chế của máy → ようになっている."
    }
  },
  {
    "id": "g13",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜そうにない",
    "tag": "PDF 028",
    "where": "Ngữ pháp · câu 13",
    "gist": "Xin chờ thêm vì không kịp trước sáng mai.",
    "pick": "できるかどうか",
    "ans": "できそうにないので",
    "why": "Lời xin chờ cần một lý do: ‘có vẻ không kịp nên…’. できるかどうか chỉ nói ‘chưa biết có làm được không’, không nêu lý do.",
    "note": "V ます + そうにない/そうもない = trông có vẻ không (thể xảy ra). Hay đi với ので/から để xin lỗi hoặc xin thêm thời gian.",
    "examples": [
      [
        "今日中には終わりそうにないので、明日まで待ってもらえませんか。",
        "Hôm nay có vẻ không xong, anh chờ đến mai được không?"
      ],
      [
        "雨がやみそうにないので、タクシーで行きましょう。",
        "Mưa có vẻ chưa tạnh, đi taxi thôi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 今日中には終わり（　）ので、明日まで待ってもらえませんか。",
      "options": [
        "そうにある",
        "そうにない",
        "そうもなく",
        "そうでも"
      ],
      "answer": 1,
      "explain": "Trông không kịp + ので → そうにないので."
    }
  },
  {
    "id": "g14",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜ようとしたところに + ô ★",
    "tag": "PDF 084",
    "where": "Ngữ pháp · câu 14 (xếp câu)",
    "gist": "Đúng lúc định ra ngoài thì mưa lớn, nên bỏ đi.",
    "pick": "mảnh ở ô thứ 4",
    "ans": "mảnh ở ô thứ 3",
    "why": "Bạn chọn mảnh đứng cuối cụm. Ô ★ là ô thứ 3, nên đáp án là mảnh đứng trước động từ cuối. Có thể bạn sắp đúng câu nhưng đếm nhầm ô.",
    "note": "Cách làm: sắp cả 4 mảnh, đánh số ① ② ③ ④ lên 4 ô, đọc lại cả câu, rồi mới lấy mảnh ở ô có ★. V ようとした + ところに = đúng lúc định làm gì thì có việc xen vào.",
    "examples": [
      [
        "寝ようとしたところに、友だちから電話がかかってきた。",
        "Đúng lúc định ngủ thì bạn gọi tới."
      ],
      [
        "出かけようとしたところへ、お客さんが来た。",
        "Đúng lúc định ra ngoài thì khách đến."
      ]
    ],
    "quiz": {
      "q": "Xếp 4 mảnh vào 4 ô của câu có ★ ở ô thứ 3. A 寝ようとした / B かかってきた / C 友だちから電話が / D ところに. Mảnh nào nằm ở ô ★?",
      "options": [
        "A 寝ようとした",
        "B かかってきた",
        "C 友だちから電話が",
        "D ところに"
      ],
      "answer": 2,
      "explain": "Câu đúng: A → D → C → B. Ô thứ 3 là C."
    }
  },
  {
    "id": "g19",
    "area": "grammar",
    "source": "dm-1411",
    "title": "〜というと / 〜といっても",
    "tag": "PDF 085 · 087",
    "where": "Ngữ pháp · câu 19 (điền đoạn văn)",
    "gist": "Nhắc đến tranh tô màu, người ta nghĩ ngay là trò của trẻ con.",
    "pick": "といっても",
    "ans": "というと",
    "why": "Câu mở bài: nhắc đến X thì người ta liên tưởng tới Y. Đó là というと. といっても cần vế sau giảm nhẹ kiểu ‘nói là A nhưng thật ra chỉ B’.",
    "note": "N + というと/といえば = nhắc đến N thì nghĩ tới… . Thể thường + といっても = tuy nói là… nhưng (mức độ thấp hơn tưởng).",
    "examples": [
      [
        "日本料理というと、すしを思い浮かべる人が多い。",
        "Nhắc đến món Nhật, nhiều người nghĩ tới sushi."
      ],
      [
        "日本語が話せるといっても、あいさつぐらいです。",
        "Nói là biết tiếng Nhật nhưng chỉ chào hỏi thôi."
      ]
    ],
    "quiz": {
      "q": "Chọn từ điền vào chỗ trống: 日本料理（　）、すしを思い浮かべる人が多いだろう。",
      "options": [
        "といっても",
        "にもかかわらず",
        "というと",
        "ばかりか"
      ],
      "answer": 2,
      "explain": "Liên tưởng ‘nhắc đến… thì nghĩ tới…’ → というと."
    }
  },
  {
    "id": "g22",
    "area": "grammar",
    "source": "dm-1411",
    "title": "というのも〜からだ",
    "tag": "Ngoài PDF",
    "where": "Ngữ pháp · câu 22 (điền đoạn văn)",
    "gist": "Câu sau giải thích lý do cho lời khuyên ở câu trước, và kết thúc bằng 〜からだ.",
    "pick": "したがって",
    "ans": "というのも",
    "why": "Câu kết thúc bằng 〜からだ nên cần liên từ nêu lý do. したがって nghĩa là ‘do đó’ (nêu kết quả), ngược chiều.",
    "note": "Dấu hiệu: câu kết thúc bằng 〜からだ/〜ためだ → というのも hoặc なぜなら. Dấu hiệu ‘do đó’ → したがって/だから.",
    "examples": [
      [
        "今日は早く帰ります。というのも、母の誕生日だからです。",
        "Hôm nay tôi về sớm. Vì hôm nay là sinh nhật mẹ."
      ],
      [
        "彼は人気がある。というのも、いつも親切だからだ。",
        "Anh ấy được yêu mến. Vì lúc nào anh cũng tử tế."
      ]
    ],
    "quiz": {
      "q": "Chọn liên từ điền vào chỗ trống: 今日は先に帰ります。（　）、明日の朝が早いからです。",
      "options": [
        "それなのに",
        "そのうえ",
        "ところが",
        "というのも"
      ],
      "answer": 3,
      "explain": "Câu sau là lý do (…からです) → というのも."
    }
  }
];
