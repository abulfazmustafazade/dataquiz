# 🎯 QuizLive! v3 — Modular Edition

Real vaxt rejimində Kahoot tipli interaktiv quiz platforması — modul React layihəsi.

## 🎁 Yenilik (v3)

✅ **Modul struktur** — Vite + React, hər komponent ayrı faylda
✅ **Performance düzəldi** — Firebase real-time listener (1.2s polling əvəzinə)
✅ **Qiymətləndirmə düzəldi** — host və iştirakçı eyni `scoreAnswer()` istifadə edir
✅ **Branded splash screen** — yüklənmə zamanı animasiyalı logo
✅ **Skeleton loading + animated loader**
✅ **Floating animations** — arxa fonda yüzən rəngli kürələr
✅ **Joining sound** — yeni iştirakçı qoşulduqda ses effekti
✅ **Confetti** — qaliblər üçün konfeti partlayışı
✅ **Live counter animation** — rəqəmlər hamar artır
✅ **Avatar system** — hər iştirakçıya unikal emoji avatar
✅ **Framer Motion** — bütün keçidlərdə hamar animasiyalar
✅ **Progress bar animasiyası** — taymerlə senxron
✅ **Sound on/off toggle** — istənilən vaxt səsi söndür/aç

## 🏗 Layihə Strukturu

```
quizlive/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html              ← Branded splash screen burada
├── src/
│   ├── main.jsx            ← React giriş nöqtəsi
│   ├── App.jsx             ← Əsas orkestrator (routing + handlers)
│   ├── index.css
│   ├── lib/
│   │   ├── constants.js    ← Sual tipləri, rənglər, avatar siyahısı
│   │   ├── utils.js        ← genId, normalize, shuffle, time helpers
│   │   ├── scoring.js      ← ⭐ Vahid qiymətləndirmə alqoritmi
│   │   ├── storage.js      ← Quiz kitabxanası (localStorage)
│   │   ├── firebase.js     ← Firebase modular SDK + game API
│   │   ├── sounds.js       ← Web Audio API ilə sintez səslər
│   │   └── confetti.js     ← canvas-confetti effektləri
│   ├── hooks/
│   │   ├── useGameState.js ← Real-time Firebase listener hook
│   │   ├── useQuestionTimer.js ← RAF əsaslı taymer
│   │   └── useToast.js
│   ├── components/
│   │   ├── AnimatedBackground.jsx  ← Yüzən rəngli kürələr
│   │   ├── AnimatedNumber.jsx      ← Hamar rəqəm animasiyası
│   │   ├── Avatar.jsx              ← Emoji + qradient avatar
│   │   ├── BrandLogo.jsx
│   │   ├── Loading.jsx             ← Skeleton + Spinner
│   │   ├── SoundToggle.jsx
│   │   ├── Toast.jsx
│   │   └── FirebaseWarning.jsx
│   └── views/
│       ├── HomeView.jsx
│       ├── AdminLibraryView.jsx    ← Quiz kitabxanası
│       ├── AdminQuizEditView.jsx
│       ├── AdminQuestionEditView.jsx ← 5 sual tipi sub-redaktoru
│       ├── HostLobbyView.jsx       ← QR + iştirakçı kartları + join sound
│       ├── HostQuestionView.jsx
│       ├── HostResultsView.jsx
│       ├── HostFinalView.jsx       ← Podium + confetti
│       ├── PlayerJoinView.jsx
│       ├── PlayerNameView.jsx
│       ├── PlayerLobbyView.jsx
│       ├── PlayerPlayingView.jsx   ← 5 sual tipi
│       ├── PlayerAnsweredView.jsx
│       ├── PlayerResultView.jsx    ← Host ilə eyni nəticə!
│       └── PlayerFinalView.jsx
```

## 🚀 Quraşdırma

### 1. Asılılıqları yüklə

```bash
cd quizlive
npm install
```

### 2. Firebase config qoy

`src/lib/firebase.js` faylını aç və `firebaseConfig` obyektini öz Firebase layihənin dəyərləri ilə əvəz et:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "https://...firebaseio.com", // ⚠️ MÜTLƏQ!
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

Firebase config harada əldə etmək olar:
1. [Firebase Console](https://console.firebase.google.com) → yeni layihə yarat
2. **Build → Realtime Database** → Create Database → Test mode
3. Layihə əsas səhifəsində **`</>`** ikonu → web app qeydiyyatı → config-i kopyala

### 3. Lokal sınaq

```bash
npm run dev
```

Brauzerdə açılan `http://localhost:5173` ünvanını iki ayrı pəncərədə aç (biri admin, biri iştirakçı) və sınaqdan keçir.

### 4. Production build

```bash
npm run build
```

`dist/` qovluğunda hazır fayllar yaradılır.

## 📤 GitHub Pages-ə Deploy

### Variant A — Avtomatik (`gh-pages` paketi)

```bash
npm run deploy
```

Bu komanda `dist/` qovluğunu repo-nun `gh-pages` budağına push edir.

⚠️ **Vacib**: GitHub repo-nun adı `quizlive` deyilsə, `vite.config.js`-də `base` parametrini repo adına dəyiş:

```js
export default defineConfig({
  // ...
  base: '/sənin-repo-adın/',  // əgər `https://user.github.io/sənin-repo-adın/` ünvanında host olunacaqsa
});
```

Sonra GitHub repo-da: **Settings → Pages → Source: `gh-pages` branch** seç.

### Variant B — Manual

```bash
npm run build
# dist/ qovluğundakı bütün faylları repo-nun `gh-pages` branch-na yüklə
```

### Variant C — Custom domain

Əgər öz domeninizdən istifadə edirsinizsə, `base` parametrini `'/'` saxlayın.

## ⚙️ Necə işləyir

### Qiymətləndirmə vahidliyi (host vs player)

Əvvəlki versiyada host və iştirakçı eyni cavabı fərqli qiymətləndirə bilirdi (asinxron yenilənmə + ayrı hesablama). İndi:

1. **Host** sualı bitirəndə `scoreAnswer()` funksiyası ilə hər cavabı qiymətləndirir
2. Nəticələri (`correct`, `points`, `correctness`, `details`) **Firebase-ə yazır**
3. **İştirakçı** ekranı eyni Firebase-dən bu rəsmi nəticələri **oxuyur**
4. Heç bir lokal hesablama yoxdur — bir mənbə var

### Performance

- **Real-time Firebase listener** (`onValue`) — 1.2 saniyəlik polling-i əvəz etdi
- **Granular yeniləmələr** — bütün oyunu deyil, yalnız dəyişən sahəni yazır
  - `gameAPI.submitAnswer()` yalnız `answers/{qIdx}/{playerId}` yolunu yazır
  - `gameAPI.update()` yalnız dəyişənləri update edir
- **RAF əsaslı taymer** — `useQuestionTimer` hook-u 10Hz throttling ilə hamar UI yenilənməsi təmin edir
- **Vendor chunks** — React, Firebase, Framer Motion ayrı bundle-larda

### Sual tipləri və qiymətləndirmə

| Tip | Qiymətləndirmə |
|---|---|
| Çoxvariantlı | Binar (düz/səhv) |
| Hə/Yox | Binar |
| Çoxlu seçim | Binar (TAM düz lazım) |
| Mətn cavab | Binar (normalize edilmiş, alternativlər ilə) |
| Sıralama | **Qismi xal** — hər düzgün yer üçün proporsional |

Xal düsturu: `1000 × correctness × (0.5 + speedFactor × 0.5)`
- `correctness` = 0..1 (sıralama üçün hissə-hissə)
- `speedFactor` = sürət bonusu (1.0 = dərhal cavab, 0.5 = vaxtın yarısı keçib)

## 🎨 Animasiya & UX detalları

- **Splash screen** — `index.html`-də CSS animasiyası, React mount olduqda yumşaq yox olur
- **Floating background** — 3 yüzən rəngli kürə Framer Motion ilə
- **Live counters** — `AnimatedNumber` komponenti `useMotionValue` istifadə edir
- **Confetti** — qalib üçün 3 saniyəlik yan-tərəflərdən partlayış
- **Joining sound** — yeni iştirakçı detect ediləndə ses (Web Audio API)
- **Tick sounds** — son 5 saniyədə hər saniyə tıq səsi
- **Avatar sistem** — player ID hash-ı ilə deterministik emoji + rəng

## 🔒 Firebase Təhlükəsizlik

Test rejimində qaydalar açıqdır. Production üçün:

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

## 📜 Lisenziya

MIT — istədiyiniz kimi istifadə edin.
