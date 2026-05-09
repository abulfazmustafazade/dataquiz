# 🎯 QuizLive!

Real vaxt rejimində interaktiv təlim quiz platforması — Kahoot tipli oyunlar yarat və paylaş.

![QuizLive](https://img.shields.io/badge/status-active-success) ![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Xüsusiyyətlər

### 📚 Quiz Kitabxanası
- **Yüzlərlə quiz saxlaya bilərsiniz** — hamısı brauzerinizdə qalır
- Quiz axtarışı, redaktə, kopyalama, silmə
- **Avtomatik saxlama** — yazdıqca itməz
- **Yedək al / Bərpa et** — JSON faylı kimi export/import

### 🎮 5 Fərqli Sual Tipi
1. **🎯 Çoxvariantlı (1 cavab)** — 2-4 variant, bir düzgün cavab
2. **✓ Hə / Yox** — sadə True/False sualları
3. **☑ Çoxlu seçim** — 2-6 variant, bir neçə düzgün cavab
4. **✏️ Mətn cavabı** — sərbəst yazma, alternativ cavablarla
5. **🔢 Sıralama (puzzle)** — elementləri düzgün ardıcıllıqla sıralama

### 🚀 Oyun Xüsusiyyətləri
- 📱 **QR kod ilə qoşulma** — bir skanla oyuna keç
- 👥 **Real vaxt sinxronlaşma** — Firebase ilə dərhal yenilənir
- ⏱ **Çevik vaxt** — saniyə və ya dəqiqə ilə təyin edilir
- 🏆 **Sürət bonusu** — tez cavablayan daha çox xal qazanır
- 📊 **Detallı statistika** — hər sual üçün düz/səhv/qismi düz
- 🥇 **Yekun podyum** — Top 3 qalib göstəricisi

## 🚀 Tez Quraşdırma (5 dəqiqə)

### 1. Firebase layihəsi yaradın

1. [Firebase Console](https://console.firebase.google.com)-a daxil olun
2. **"Add project"** → layihə adı verin → Google Analytics söndürün → yaradın

### 2. Realtime Database aktivləşdirin

1. Sol menyudan **Build → Realtime Database** seçin
2. **"Create Database"** → region seçin (məs. `europe-west1`)
3. **"Start in test mode"** → bitirin

### 3. Web tətbiqini qeydiyyatdan keçirin

1. Layihə əsas səhifəsində **`</>`** ikonuna basın
2. Tətbiqə ad verin və qeydiyyatdan keçirin
3. **`firebaseConfig`** obyektini kopyalayın

### 4. index.html faylını redaktə edin

`index.html` faylında **24-cü sətir** ətrafında `firebaseConfig`-i öz dəyərlərinizlə əvəz edin.

> ⚠️ `databaseURL` sahəsi mütləq olmalıdır!

## 📤 GitHub-da Paylaşmaq

### A. Yeni repo yarat
1. [GitHub](https://github.com)-da yeni **public** repo yaradın
2. **"uploading an existing file"** linkinə basın
3. `index.html` və `README.md` fayllarını yükləyin

### B. GitHub Pages aktivləşdir
1. Repo → **Settings → Pages**
2. **Source**: `Deploy from a branch` → `main` → `/ (root)` → **Save**
3. 1-2 dəqiqə gözləyin

Saytınız hazır: `https://SIZIN-USERNAME.github.io/REPO-ADI/`

## 📖 İstifadə Qaydası

### Admin (təlimçi) tərəfi

**Quiz yaratmaq:**
1. Ana səhifədə **"Admin"** seçin → kitabxana açılır
2. **"Yeni Quiz"** düyməsi ilə yeni quiz yaradın
3. Quiz adını yazın (avtomatik saxlanılır)
4. Aşağıdakı **5 sual tipindən** birini seçin və əlavə edin
5. Hər sual üçün vaxtı təyin edin

**Quiz idarəsi (kitabxanada):**
- 🟢 **Başlat** — quizi indi başladır
- ✏️ **Redaktə** — sualları dəyişir
- 📋 **Kopyala** — eyni quizdən yeni nüsxə yaradır
- 🗑 **Sil** — quizi silir

**Yedəkləmə:**
- **"Yedək al"** — bütün quizləri JSON kimi endirir
- **"Yedəkdən bərpa et"** — JSON faylından idxal edir

### İştirakçı tərəfi
1. QR skan edin **və ya** sayta gedib **"Oyuna qoşul"** seçin
2. PIN-i daxil edin və adınızı yazın
3. Hostun başlatmasını gözləyin
4. Sual tipinə görə cavab verin:
   - **Çoxvariantlı/Hə-Yox** — düyməyə basın
   - **Çoxlu seçim** — bir neçə variant seçin və təsdiqləyin
   - **Mətn** — cavabı yazın və göndərin
   - **Sıralama** — elementləri düzgün ardıcıllıqla yığın

## 🎯 Sual Tipləri haqqında detallar

### Çoxvariantlı (1 cavab)
- 2, 3, və ya 4 variant olar
- Bir düzgün cavab seçilir
- Kahoot-vari rəngli formalar (▲ ◆ ● ■)

### Hə / Yox
- Sürətli True/False sualları üçün
- 2 böyük rəngli düymə (yaşıl/qırmızı)

### Çoxlu seçim (multi-select)
- 2-6 variant olar
- Bir neçə düzgün cavab ola bilər
- İştirakçı bütün düzgünləri seçməlidir
- Yalnız tam düzgün cavab xal qazandırır

### Mətn cavabı
- İştirakçı cavabı sərbəst yazır
- **Alternativ cavablar** əlavə oluna bilər (məs: "5", "beş")
- Böyük/kiçik hərflər və əlavə boşluqlar nəzərə alınmır
- Hər iştirakçının cavabı host ekranında görünür

### Sıralama (puzzle)
- 3-6 element olar
- İştirakçılar qarışıq görür və düzgün ardıcıllığa yığır
- **Qismi xal** sistemi — hər düzgün yer üçün proporsional xal
- Tarixi hadisələr, addım-addım proseslər üçün ideal

## 💾 Verilənlərin Saxlanması

- **Quiz kitabxanası**: brauzerinizin `localStorage`-ında saxlanılır
- **Aktiv oyunlar**: Firebase Realtime Database-də
- **Yedəkləmə**: vaxtaşırı **"Yedək al"** etmək tövsiyə olunur

## 🔒 Təhlükəsizlik

Test rejimində Firebase qaydaları açıqdır. İctimai istifadə üçün qaydaları məhdudlaşdırın:

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
- **Storage**: localStorage (quizlər) + Firebase Realtime Database (oyunlar)
- **Build**: Yoxdur — saf HTML/CSS/JS
- **Hosting**: GitHub Pages (pulsuz)

## 📝 Lisenziya

MIT — istədiyiniz kimi istifadə edin.

---

**Hazırlayan**: Claude (Anthropic) ilə
