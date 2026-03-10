---
title: "Rails Concurrency P1: Process, Thread và GVL"
description: "Hiểu đúng mối quan hệ giữa CPU, Process, Thread và GVL trong Ruby/Rails để biết cách scale đúng hướng"
pubDate: 2026-03-10
tags: ["rails", "ruby", "concurrency", "backend"]
lang: "vi"
---

## "Sao app mình chậm thế mà CPU chỉ có 10%?"

Bạn deploy Rails app lên production. Traffic tăng. Response time tệ dần. Bạn mở dashboard, thấy CPU usage chỉ 10–15%. *Ủa, CPU còn rảnh mà sao lại chậm?*  
*-> Bạn đi search hoặc hỏi AI thì được chỉ có thể tăng 1 trong các chỉ số sau để giải quyết vấn đề:*

1. Tăng số Thread trên 1 process
2. Tăng số process

Nhưng bạn không hiểu tăng bao nhiêu là hợp lí trên cấu hình server hiện tại?  
**Đây là bài viết dành cho bạn**

Câu trả lời nằm ở cách Rails/Ruby xử lý concurrency — và để hiểu được điều đó, bạn cần hiểu đúng mối quan hệ giữa ba thứ: CPU, Process, và Thread. Ba khái niệm này thường bị giải thích lẫn lộn với nhau.

---

## TL;DR

- **Process** có vùng nhớ riêng; **Thread** chạy bên trong process và chia sẻ chung bộ nhớ.
- **CPU không biết gì về process** — OS scheduler mới là người giao thread cho CPU core chạy.
- Ruby chọn multi-threading vì GC (Garbage Collector) dễ quản lý hơn trên shared memory, và web app vốn là **I/O-bound** — nghĩa là phần lớn thời gian xử lý một request không phải là tính toán (CPU), mà là *chờ*: chờ database trả kết quả, chờ Redis, chờ external API. Thread đang chờ I/O không chiếm CPU — OS scheduler có thể tận dụng thời gian đó để chạy thread khác.
- **GVL** (Ruby Global VM Lock) tồn tại vì Ruby VM viết bằng C và không thread-safe — chỉ một thread chạy Ruby code trong một process tại một thời điểm, nhưng nhiều thread có thể chờ I/O song song.
- GVL không phải điểm yếu của Rails — nó là trade-off có chủ ý, và hoạt động tốt với web workload thông thường.

---

## Tại Sao Chủ Đề Này Quan Trọng?

Nếu bạn không hiểu cơ chế này:


| Triệu chứng                       | Nguyên nhân thực sự                               |
| --------------------------------- | ------------------------------------------------- |
| App chậm dù CPU thấp              | Thread bị block chờ DB, không phải CPU bottleneck |
| Tăng thread nhưng không giúp được | GVL: chỉ 1 thread chạy Ruby code — nếu workload là CPU-bound, thêm thread không có tác dụng |
| Memory tăng khi scale             | Tăng process tốn RAM tuyến tính, tăng thread thì không |
| Race condition ở production       | Shared state không được bảo vệ đúng cách          |


Hậu quả không chỉ là app chậm — bạn có thể scale sai hướng, tốn tiền server mà không giải quyết được vấn đề.

---

## Phần 1: CPU, Process, Thread — Ai Làm Gì?

Trước khi nói về Rails, cần làm rõ mối quan hệ giữa ba khái niệm hay bị nhầm lẫn: **CPU**, **Process**, và **Thread**.

- **Process** là một chương trình đang chạy — có vùng nhớ riêng, PID riêng do OS cấp. Mỗi process chứa một hoặc nhiều thread bên trong.
- **Thread** là đơn vị thực thi *bên trong* process. Các thread trong cùng process chia sẻ chung vùng nhớ với nhau.
- **CPU** là nơi code thực sự được thực thi — nhưng điểm quan trọng là: **CPU không biết gì về process. CPU chỉ thực thi thread.**

Chính **OS scheduler** là người điều phối — nó quyết định thread nào được đưa lên CPU chạy tại từng thời điểm, bất kể thread đó thuộc process nào.

<video autoplay loop muted playsinline>
  <source src="/rails-concurrency-os-scheduler.webm" type="video/webm" />
</video>

*OS scheduler giao thread cho từng CPU core độc lập — Core 1 và Core 2 có thể chạy hai thread khác nhau cùng lúc, bất kể chúng thuộc process nào. Đây là lý do số CPU core ảnh hưởng trực tiếp đến số thread có thể chạy song song thực sự.*

Hiểu đúng điều này giúp bạn hình dung sự khác biệt về RAM giữa hai cách scale:

- **Tăng thread**: các thread dùng chung vùng RAM của process — tốn thêm RAM không đáng kể (chủ yếu là stack của mỗi thread, khoảng vài MB).
- **Tăng process**: mỗi process là một bản copy độc lập của toàn bộ app trong RAM — tốn RAM tuyến tính theo số process.

Đây là lý do khi server hết RAM, thủ phạm thường là số process, không phải số thread.

### Tại Sao Ruby Chọn Threading?

Ruby được thiết kế với triết lý **"developer happiness"**: code dễ đọc, bộ nhớ được quản lý tự động qua Garbage Collector (GC). Chính GC này là điểm mấu chốt.

GC cần duyệt toàn bộ object trong bộ nhớ để tìm cái nào có thể xóa. Điều này dễ đảm bảo hơn nhiều khi tất cả object nằm trong *cùng một vùng nhớ* (threading), thay vì bị phân tán ra nhiều process riêng lẻ. Vì vậy, **multi-threading là lựa chọn tự nhiên hơn cho Ruby** — GC chỉ cần chạy một lần cho toàn bộ thread trong cùng process.

Threading cũng phát huy tốt nhất khi workload là **I/O-bound**. Trong Rails, mỗi HTTP request được Puma giao cho một thread để xử lý — thread đó chạy controller, gọi DB, rồi trả response. Phần lớn thời gian của một request không phải là tính toán, mà là đi... chờ: chờ database trả kết quả, chờ Redis, chờ external API.

Trong thời gian thread A đang chờ DB (không làm gì cả), OS scheduler có thể giao CPU cho thread B — thread B đang xử lý một request khác. Nhờ đó server phục vụ được nhiều request đồng thời dù chỉ có một vài thread.

> Đây là lý do tăng CPU không giải quyết được "app chậm vì DB query lâu". CPU đang rảnh — vấn đề là thread bị block chờ I/O. Ruby chọn threading vì nó khớp hoàn hảo với đặc tính này.

---

## Phần 2: GVL — Cái "Khóa" Mà Ai Cũng Nên Biết

Ruby dùng interpreter **YARV** (Yet Another Ruby VM) từ Ruby 1.9 trở đi — đây là interpreter mặc định hiện tại, sử dụng native OS thread. YARV có một cơ chế gọi là **GVL — Global VM Lock** (trước đây gọi là GIL — Global Interpreter Lock).

**GVL là gì?** Một cái khóa gắn với **mỗi Ruby process** — đảm bảo trong cùng một process, tại một thời điểm chỉ **một thread duy nhất** được thực thi Ruby bytecode. Nếu bạn chạy 2 process Ruby riêng biệt, mỗi process có GVL của riêng mình — hai process có thể chạy Ruby bytecode song song hoàn toàn trên 2 CPU core khác nhau.

**Tại sao lại có GVL?** Có hai lý do chính:

Thứ nhất, **Ruby VM (YARV) viết bằng C và không thread-safe**. Bên trong VM có rất nhiều data structure dùng chung — object allocation, method dispatch, GC tracking... Nếu hai thread cùng truy cập VM đồng thời mà không có lock, các cấu trúc này sẽ bị corrupt, dẫn đến crash khó đoán. GVL là giải pháp đơn giản nhất: lock toàn bộ VM lại, đảm bảo chỉ một thread tương tác với VM tại một thời điểm.

Thứ hai, **C extensions**. Phần lớn gem phổ biến của Ruby có phần native code viết bằng C, và những thư viện C này thường không thread-safe. GVL bảo vệ chúng khỏi bị gọi đồng thời mà không cần sửa lại từng gem.

GC cũng hưởng lợi từ GVL — nhưng GC chỉ là một trong nhiều thành phần được bảo vệ, không phải lý do duy nhất GVL tồn tại.

Đây là trade-off có chủ ý: đổi lấy sự đơn giản và an toàn của VM, Ruby chấp nhận không thể chạy Ruby code song song thực sự trên nhiều CPU core trong cùng một process (cho đến Ruby 3.x với Ractor).

Nghe có vẻ tệ? Trên thực tế thì không — vì GVL tự động được nhả ra khi thread đợi I/O:

<video autoplay loop muted playsinline>
  <source src="/rails-concurrency-gvl.webm" type="video/webm" />
</video>

*Khi Thread 1 chờ DB, nó nhả GVL — Thread 2 lập tức chiếm lock và bắt đầu chạy. Cả hai thread thực chất đang chờ DB song song, dù chỉ một thread giữ GVL tại mỗi thời điểm.*

**Kết luận thực tế:** GVL không ảnh hưởng đến performance của web app thông thường, vì web app dành phần lớn thời gian chờ I/O — không phải tính toán CPU.

> **Why this matters:** Nếu bạn có endpoint Rails không có bất kỳ DB call hay HTTP call nào — chỉ thuần tính toán CPU — thì multi-threading sẽ không giúp được gì. Lúc đó bạn cần multi-processing hoặc Ractor (Ruby 3.x).

---

## Kết Luận

Bây giờ bạn đã hiểu nền tảng: Ruby chọn threading vì GC dễ quản lý trên shared memory và web workload vốn I/O-bound. GVL tồn tại vì Ruby VM không thread-safe và cần bảo vệ C extensions — nhưng GVL không phải vấn đề với web app vì thread tự nhả lock khi chờ I/O.

Câu hỏi tiếp theo là: **Puma tận dụng tất cả điều này như thế nào, và bạn nên config ra sao?** Đó là nội dung của bài tiếp theo — bao gồm thread pool, clustered mode, DB connection pool, và 4 pitfall phổ biến nhất khi config Puma sai.