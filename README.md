# 🎯 QuizLive!

Real vaxt rejimində interaktiv təlim quiz platforması — Kahoot tipli oyunlar yarat və paylaş.

![QuizLive](https://img.shields.io/badge/status-active-success) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Xüsusiyyətlər

- 🎨 **Admin paneli** — Quiz yarat, sual əlavə et, vaxtı saniyə/dəqiqə ilə təyin et
- 📱 **QR kod ilə qoşulma** — İştirakçılar QR kodu skan edib birbaşa oyuna qoşulur
- 👥 **Real vaxt sinxronlaşma** — Bütün cihazlar arasında dərhal yenilənir
- 🏆 **Sürət bonusu** — Tez cavablayan daha çox xal qazanır
- 📊 **Canlı statistika** — Hər sual üçün düz/səhv/cavabsız sayı və lider lövhəsi
- 🥇 **Yekun podyum** — Top 3 qalib göstəricisi

## 🚀 Tez Quraşdırma (5 dəqiqə)

### 1. Firebase layihəsi yaradın

1. [Firebase Console](https://console.firebase.google.com)-a daxil olun
2. **"Add project"** düyməsinə basın və layihə adı verin (məsələn: `quizlive-mysite`)
3. Google Analytics söndürün (lazım deyil) və layihəni yaradın

### 2. Realtime Database aktivləşdirin

1. Sol menyudan **"Build" → "Realtime Database"** seçin
2. **"Create Database"** düyməsinə basın
3. Region seçin (Avropa üçün `europe-west1` yaxşıdır)
4. **"Start in test mode"** seçin və bitirin

### 3. Web tətbiqini qeydiyyatdan keçirin

1. Layihə əsas səhifəsində **`</>`** ikonuna basın (Web app əlavə et)
2. Tətbiqə ad verin (məsələn: `quizlive`) və qeydiyyatdan keçirin
3. **`firebaseConfig`** obyektini kopyalayın — belə görünəcək:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "quizlive-mysite.firebaseapp.com",
  databaseURL: "https://quizlive-mysite-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizlive-mysite",
  storageBucket: "quizlive-mysite.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. index.html faylını redaktə edin

`index.html` faylında **24-cü sətir** ətrafında `firebaseConfig` obyektini tapın və yuxarıdakı dəyərlərinizlə əvəz edin.

> ⚠️ **Vacib**: `databaseURL` sahəsi mütləq olmalıdır! Əgər Firebase sizə bu dəyəri verməyibsə, Realtime Database səhifəsindən URL-i kopyalayın (`https://...firebasedatabase.app`).

## 📤 GitHub-da Paylaşmaq

### A. Yeni repo yarat

1. [GitHub](https://github.com)-da yeni repo yaradın (məsələn: `quizlive`)
2. **Public** olaraq qoyun (GitHub Pages üçün lazımdır)

### B. Faylları yüklə

**Brauzerdən asan üsul:**
1. Yeni repo səhifəsində **"uploading an existing file"** linkinə basın
2. `index.html` və `README.md` fayllarını sürüşdürərək yükləyin
3. **"Commit changes"**

**Terminal ilə:**
```bash
git clone https://github.com/SIZIN-USERNAME/quizlive.git
cd quizlive
# index.html və README.md fayllarını bura kopyalayın
git add .
git commit -m "İlk versiya"
git push
```

### C. GitHub Pages aktivləşdir

1. Repo səhifəsində **Settings → Pages** bölməsinə gedin
2. **"Source"** altında: **`Deploy from a branch`** seçin
3. **Branch**: `main`, **Folder**: `/ (root)` seçin
4. **Save** düyməsinə basın
5. 1-2 dəqiqə gözləyin

Saytınız hazırdır:
```
https://SIZIN-USERNAME.github.io/quizlive/
```

## 📖 İstifadə Qaydası

### Admin (təlimçi) tərəfi
1. Saytı açın və **"Quiz yarat"** seçin
2. Quiz adını yazın və sualları əlavə edin
3. Hər sual üçün 4 cavab variantı və düzgün cavabı seçin
4. Vaxtı saniyə və ya dəqiqə ilə təyin edin
5. **"Oyunu Başlat"** — 6 rəqəmli PIN və QR kod görünəcək

### İştirakçı tərəfi
1. QR kodu telefonla skan edin **və ya** sayta gedib **"Oyuna qoşul"** seçin
2. PIN-i daxil edin və adınızı yazın
3. Hostun başlatmasını gözləyin
4. Sualları cavablandırın

## 🔒 Təhlükəsizlik

Test rejimində Firebase qaydaları açıqdır (hər kəs oxuya/yaza bilər). Bu, **demo və daxili istifadə üçün uyğundur**.

İctimai istifadə üçün Firebase Realtime Database qaydalarını məhdudlaşdırın:

```json
{
  "rules": {
    "games": {
      "$pin": {
        ".read": true,
        ".write": true,
        ".validate": "$pin.matches(/^[0-9]{6}$/)"
      }
    }
  }
}
```

## 🛠 Texniki Detallar

- **Frontend**: React 18 (CDN), Tailwind CSS (CDN), Babel (browser)
- **Backend**: Firebase Realtime Database (pulsuz plan kifayətdir)
- **Build**: Yox — saf HTML/CSS/JS
- **Hosting**: GitHub Pages (pulsuz)

## 📝 Lisenziya

MIT — istədiyiniz kimi istifadə edin və dəyişdirin.

## 🤝 Töhfə

Pull request-lərə açığam! Problem tapsanız, GitHub Issues-da yazın.

---

**Hazırlayan**: Claude (Anthropic) ilə
