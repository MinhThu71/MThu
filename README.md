# Kéo – Búa – Bao (Rock–Paper–Scissors)

Trò chơi **Kéo–Búa–Bao** với giao diện hiện đại **glassmorphism**, AI thích nghi, đa ngôn ngữ (vi/en), hỗ trợ chạy hoàn toàn **offline** không cần server.

---

## Cách chạy

### Cách 1 – Mở trực tiếp (không cần cài đặt)
1. Tải hoặc clone repo về máy.
2. Mở file `index.html` bằng trình duyệt hiện đại (Chrome/Edge/Firefox/Safari).
3. Chơi ngay! ✊✋✌

> **Lưu ý:** Vì game dùng ES Module (`type="module"`), một số trình duyệt yêu cầu mở qua HTTP chứ không phải `file://`. Dùng cách 2 nếu gặp lỗi.

### Cách 2 – Dùng local server (khuyến nghị)
```bash
# Python 3
python -m http.server 8080

# Node.js (cần cài npx)
npx serve .

# VS Code: cài extension "Live Server" → click "Go Live"
```
Sau đó mở `http://localhost:8080` trên trình duyệt.

---

## Cấu trúc dự án

```
/
├─ index.html               # Giao diện chính
├─ styles.css               # CSS3: glassmorphism, responsive, animations
├─ app.js                   # Điểm vào: khởi tạo game, gắn sự kiện UI
├─ game/
│   ├─ engine.js            # Luật chơi, vòng/loạt trận, tính điểm
│   ├─ ai.js                # AI thích nghi: tần suất + trọng số
│   └─ storage.js           # localStorage: điểm, lịch sử, cấu hình
├─ ui/
│   ├─ dom.js               # Query selector, render helpers, i18n
│   ├─ animations.js        # Hiệu ứng thắng/thua/hòa, confetti
│   └─ sounds.js            # Web Audio API: click, thắng, thua, hòa
├─ assets/
│   └─ icons.svg            # SVG sprite: rock, paper, scissors + UI icons
├─ manifest.webmanifest     # PWA manifest
├─ sw.js                    # Service Worker – offline cache
└─ README.md
```

---

## Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🎮 Chế độ chơi | Chơi nhanh, Bo3, Bo5, First to N (3–10) |
| 🤖 AI thích nghi | Phân tích tần suất 10 lượt gần nhất; độ khó Dễ/Vừa/Khó |
| 🌗 Dark/Light theme | Chuyển đổi tức thì, lưu localStorage |
| 🌐 Đa ngôn ngữ | Tiếng Việt / English, lưu localStorage |
| 🎨 Glassmorphism UI | Responsive mobile-first, 480/768/1024px breakpoints |
| ✨ Animations | Glow (thắng), Shake (thua), Pulse (hòa), Confetti |
| 🔊 Âm thanh | Web Audio API – không cần file .mp3 ngoài |
| ⌨️ Phím tắt | Điều khiển hoàn toàn bằng bàn phím |
| ♿ Accessibility | WCAG AA, aria-labels, live region, focus ring |
| 💾 Offline PWA | Service Worker cache tĩnh |

---

## Hướng dẫn sử dụng & Phím tắt

### Cách chơi
1. Chọn một trong ba lựa chọn: **Búa (✊)**, **Bao (✋)**, **Kéo (✌)**
2. Đếm ngược 3–2–1 → Máy lật bài → Xem kết quả
3. Luật: Búa thắng Kéo · Bao thắng Búa · Kéo thắng Bao

### Chế độ chơi
- **Chơi nhanh**: Mỗi lần chọn là 1 ván độc lập
- **Bo3/Bo5**: Thắng đa số trong 3 hoặc 5 vòng
- **First to N**: Ai đạt N điểm trước thì thắng (N: 3–10)

### Phím tắt

| Phím | Hành động |
|---|---|
| `1` | Chọn Búa (Rock) |
| `2` | Chọn Bao (Paper) |
| `3` | Chọn Kéo (Scissors) |
| `R` | Chơi lại loạt mới |
| `M` | Bật/tắt âm thanh |
| `T` | Đổi theme Sáng/Tối |
| `?` | Mở trợ giúp |
| `Esc` | Đóng hộp thoại |

---

## AI – Cách hoạt động

AI phân tích **10 lượt gần nhất** của người chơi để dự đoán nước đi tiếp theo, rồi chọn nước khắc chế. Tỉ lệ sử dụng dự đoán:

| Độ khó | Theo dự đoán | Ngẫu nhiên |
|---|---|---|
| Dễ | 50% | 50% |
| Vừa | 70% | 30% |
| Khó | 85% | 15% |

**Yếu tố công bằng**: Nếu AI thắng >70% trong 10 lượt gần nhất, hệ thống tự giảm 10% trọng số dự đoán.

---

## Kiểm thử nhanh (Acceptance Tests)

| # | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| UI-1 | Mở trên màn hình <480px | Nút không tràn, chữ không vỡ, layout 1 cột |
| UI-2 | Mở trên tablet 768px | Layout 2 cột (khu chơi + sidebar) |
| LOGIC-1 | Chọn Búa khi máy chọn Kéo | Kết quả: Thắng |
| LOGIC-2 | Chọn Bao khi máy chọn Búa | Kết quả: Thắng |
| LOGIC-3 | Chọn Kéo khi máy chọn Bao | Kết quả: Thắng |
| LOGIC-4 | Chọn cùng lựa chọn với máy | Kết quả: Hòa |
| AI-1 | Chọn Búa liên tục ở độ khó Khó | Máy phản ứng Bao nhiều hơn sau 10 lượt |
| STATE-1 | Refresh trang | Giữ điểm, lịch sử, theme, âm thanh, ngôn ngữ |
| CTRL-1 | Đổi sang "First to 5" | Thanh tiến trình cập nhật đúng; loạt kết thúc khi ai đạt 5 |
| A11Y-1 | Dùng Tab+Enter | Tất cả nút có thể focus và kích hoạt bằng bàn phím |
| A11Y-2 | Screen reader | Thông báo "Bạn thắng/Thua/Hòa" qua aria-live |
| A11Y-3 | Phím tắt 1/2/3 | Chọn đúng lựa chọn tương ứng |
| RESET-1 | Nhấn "Đặt lại" | Hiện hộp thoại xác nhận trước khi xóa dữ liệu |
| RESET-2 | Xác nhận reset | Điểm, lịch sử trở về 0/rỗng |
| THEME-1 | Nhấn nút theme hoặc phím T | Giao diện chuyển Sáng↔Tối tức thì |
| LANG-1 | Nhấn nút VI/EN | Toàn bộ text chuyển ngôn ngữ |
| ANIM-1 | Thắng | Card người chơi phát sáng, confetti |
| ANIM-2 | Thua | Card người chơi rung lắc |
| ANIM-3 | Hòa | Cả hai card nhịp đập |
| ANIM-4 | Tắt hiệu ứng | Animation biến mất, countdown bỏ qua |
| SOUND-1 | Nhấn nút | Có âm click |
| SOUND-2 | Thắng | Có âm nhạc vui |
| SOUND-3 | Tắt âm (M) | Không có âm thanh |
| PWA-1 | Offline | Game vẫn chạy sau lần đầu tải xong |

---

## Công nghệ

- **HTML5** – semantic markup, accessibility attributes
- **CSS3** – Custom Properties, glassmorphism, responsive grid, keyframe animations
- **JavaScript ES6 Module** – không bundler, không framework
- **Web Audio API** – âm thanh tổng hợp, không cần file .mp3
- **LocalStorage API** – lưu trạng thái offline
- **Canvas API** – confetti animation
- **Service Worker** – PWA offline cache
- **Google Fonts** – Inter (display=swap)

---

## Tác giả & Bản quyền

Kéo–Búa–Bao Game · v1.0.0  
Được xây dựng với HTML5 + CSS3 + JavaScript ES6 Module thuần.