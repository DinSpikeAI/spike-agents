# 🏗️ Spike AI Agents - Architecture

> מבנה הקוד, מבנה הסקציות, איך הכל מחובר

---

## 📁 מבנה תיקיות

```
spike-agents/
├── app/
│   ├── page.tsx              ⭐ הדף הראשי (כל הסקציות)
│   ├── layout.tsx            🎨 Layout בסיסי + RTL + Heebo
│   └── globals.css           🌐 Tailwind v4 + theme
├── public/
│   ├── spike-mascot.png      🤖 מסקוט קטן (לוגו, סקצית "איך זה עובד")
│   └── spike-mascot-pro.png  🤖✨ מסקוט גדול (Hero)
├── docs/                     📚 התיעוד הזה
│   ├── PROJECT-OVERVIEW.md
│   ├── DESIGN-SYSTEM.md
│   ├── COPY-GUIDE.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS-LOG.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── .gitignore
└── README.md
```

---

## 🛠️ Stack טכנולוגי

| שכבה | טכנולוגיה | גרסה |
|---|---|---|
| Framework | Next.js | 16.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| Build Tool | Turbopack | (Next.js native) |
| Font | Heebo | Google Fonts |
| Animations | CSS keyframes | (custom) |
| Forms | Web3Forms | API |
| Hosting | TBD | (Vercel candidate) |

---

## 📄 page.tsx - מבנה הדף

הדף בנוי כקובץ אחד גדול עם 6 סקציות עיקריות:

```tsx
<div dir="rtl">
  {/* רקע גלובלי - גריד + glows */}
  <div className="absolute inset-0 grid-bg" />
  <div className="absolute inset-0">{/* 12+ glow layers */}</div>

  {/* 1. Navigation */}
  <nav className="sticky top-0 z-50">
    {/* Logo + Menu + CTA */}
  </nav>

  {/* 2. Hero */}
  <section>
    {/* Robot (left) + Text & Form (right) */}
  </section>

  {/* 3. How It Works */}
  <section id="how">
    {/* 3 steps grid */}
  </section>

  {/* 4. Agents */}
  <section id="agents">
    {/* 9 agent cards in 3-col grid */}
  </section>

  {/* 5. Package */}
  <section id="pricing">
    {/* 3 columns: Connections | Agents (premium) | Service */}
  </section>

  {/* 6. CTA Form */}
  <section id="cta">
    {/* Detailed form with 4 fields */}
  </section>

  {/* 7. FAQ */}
  <section id="faq">
    {/* 6 accordion items */}
  </section>
</div>
```

---

## 🧠 State Management

הדף משתמש ב-`useState` של React לניהול 3 דברים:

### 1. Hero Quick Form
```tsx
const [heroForm, setHeroForm] = useState({ 
  name: "", phone: "", email: "" 
});
const [heroSubmitting, setHeroSubmitting] = useState(false);
const [heroSubmitted, setHeroSubmitted] = useState(false);
const [heroError, setHeroError] = useState("");
```

### 2. Detailed Form
```tsx
const [formData, setFormData] = useState({
  name: "", phone: "", email: "", businessType: ""
});
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
const [submitError, setSubmitError] = useState("");
```

### 3. FAQ Accordion
```tsx
const [openFaq, setOpenFaq] = useState<number | null>(0);
// 0 = שאלה ראשונה פתוחה כברירת מחדל
```

---

## 📡 חיבור ל-Web3Forms

### זרימה
```
משתמש ממלא טופס
    ↓
fetch() → POST https://api.web3forms.com/submit
    ↓
JSON body עם access_key + שדות
    ↓
Web3Forms שולח מייל ל-spikeaistudio@gmail.com
    ↓
מציגים הודעת תודה למשתמש
```

### Access Key
```typescript
const WEB3FORMS_KEY = "0b0d2e56-49e7-443f-b4bc-444c083b01ac";
```

### דוגמת שליחה
```typescript
const response = await fetch("https://api.web3forms.com/submit", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    access_key: WEB3FORMS_KEY,
    subject: "🔥 ליד מהיר חדש - Spike AI Agents",
    from_name: "Spike AI Agents - טופס מהיר",
    name: heroForm.name,
    phone: heroForm.phone,
    email: heroForm.email,
    form_source: "Hero Quick Form",
    submission_time: new Date().toLocaleString("he-IL"),
  }),
});

const result = await response.json();
if (result.success) {
  setHeroSubmitted(true);
} else {
  setHeroError("משהו השתבש. נסה שוב.");
}
```

### למה Web3Forms?
- ✅ חינם עד 250/חודש
- ✅ אין צריך backend
- ✅ אין SaaS חודשי
- ✅ הקמה ב-2 דקות
- ✅ מחזיר שגיאות ברורות

---

## 📚 Data Structures

### `agents[]` - מערך הסוכנים
```typescript
const agents = [
  {
    icon: "☀️",
    name: "סוכן בוקר",
    description: "..."
  },
  // ... 9 total
];
```

### `packageIncludes` - תוכן החבילה
```typescript
const packageIncludes = {
  agents: ["סוכן בוקר ☀️ - דוח יומי...", ...],
  connections: ["גוגל ביזנס - ...", ...],
  service: ["התאמה מלאה לעסק שלך", ...]
};
```

### `businessTypeLabels` - מיפוי תחומי עסק
```typescript
const businessTypeLabels: Record<string, string> = {
  service: "💼 עסק שירות (קליניקה, מספרה, מאמן)",
  // ... 16 total
};
```

### `faqs[]` - השאלות והתשובות
```typescript
const faqs = [
  {
    question: "כמה זה עולה?",
    answer: "כל עסק שונה..."
  },
  // ... 6 total
];
```

---

## 🎨 CSS Architecture

### Inline `<style jsx global>`
כל ה-CSS המותאם נמצא ב-`<style jsx global>` בתחילת הקומפוננט:
- 🎬 30+ keyframes
- 🎨 12+ utility classes
- 📱 Media queries

### למה inline ולא קובץ נפרד?
- Tailwind v4 לא תמיד טוען keyframes חדשים מ-`globals.css`
- הקבוע אינו ב-component scope
- קל להעתיק/לערוך הכל יחד

### קלאסים מרכזיים
```css
.shimmer-text         /* טקסט נוצץ */
.grid-bg              /* רקע גריד */
.robot-floating       /* מסקוט מרחף */
.robot-stage          /* רקע אווירה למסקוט */
.glow-layer-1/2/3     /* שכבות זוהר */
.particle-1/2/3       /* חלקיקים */
.step-card            /* כרטיס שלב */
.step-circle          /* עיגול מספר עם פולס */
.agent-card           /* כרטיס סוכן */
.package-column       /* עמודה בחבילה */
.package-column-premium /* עמודה פרימיום (אמצע) */
.faq-item             /* שאלה ב-FAQ */
.cta-input            /* שדה טופס */
```

---

## 🌐 RTL Implementation

### ב-HTML
```html
<html lang="he" dir="rtl">
  <body>
    <div dir="rtl">
      {/* כל התוכן */}
    </div>
  </body>
</html>
```

### ב-Tailwind
- Default text alignment: `text-right`
- Icons placement: `flex flex-row-reverse` באזורים מסויימים
- Gradients: `to-l` (left) במקום `to-r` (right)

### Mixed Hebrew + English
לדוגמה, שמות אינגרציות באנגלית בתוך טקסט עברי:
```jsx
<span>אינטגרציה עם <span dir="ltr">Google Business</span></span>
```

---

## 📱 Responsive Strategy

### Breakpoints
```css
sm:  640px   /* טלפון אופקי */
md:  768px   /* טאבלט */
lg:  1024px  /* לפטופ */
xl:  1280px  /* מסך גדול */
```

### עקרונות
1. **Mobile First** - בסיס למובייל, מתרחב למעלה
2. **Grid changes:** 1 → 2 → 3 עמודות
3. **Font sizes:** מקטינים במובייל
4. **Padding:** קטן יותר במובייל
5. **Hero layout:** עמודה אחת במובייל, 2 במחשב

### דוגמה
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 9 כרטיסים */}
</div>
```

---

## ⚡ Performance Considerations

### Image Optimization
- `next/image` עם `priority` רק על ה-Hero mascot
- מסקוטים ב-PNG עם רקע שקוף (אחרי remove.bg)
- שאר התמונות (אם יהיו) - WebP

### Font Loading
- Heebo נטען מ-Google Fonts ב-`layout.tsx`
- משקלים: 300, 400, 500, 600, 700, 800, 900
- `display: swap` למניעת FOIT

### Animation Performance
- כל האנימציות משתמשות ב-`transform` ו-`opacity` (GPU)
- אין JavaScript animations - רק CSS
- `will-change` לא משתמשים בו (אופטימיזציה אוטומטית)

---

## 🔒 Security Notes

### Web3Forms Key
- ✅ זה לא secret - זה זיהוי בלבד
- ✅ הוא מוטמע בקוד (visible)
- ✅ Web3Forms מאפשרים rate limiting אוטומטי
- ⚠️ אם יזלוג - אפשר לייצר חדש ב-30 שניות

### Form Validation
- HTML native (`required`, `type="email"`, `type="tel"`)
- Server-side validation אצל Web3Forms
- Honeypot מובנה ב-Web3Forms (anti-spam)

### XSS / CSRF
- React escape automatically
- אין eval / dangerouslySetInnerHTML
- אין session או cookies (אין backend)

---

## 🚀 Deployment Plan (עתידי)

### שלב 1: Vercel
```bash
# התקנה אחת
npm install -g vercel

# מ-תוך הפרויקט
vercel
```

זה יקח ב-2 דקות + ייתן URL זמני (`spike-agents.vercel.app`).

### שלב 2: דומיין מותאם
- לקנות דומיין (Namecheap / Google Domains)
- חיבור ל-Vercel דרך DNS
- SSL אוטומטי מ-Vercel

### שלב 3: Analytics
- Vercel Analytics (חינם)
- Google Analytics 4 (אופציונלי)
- Hotjar / Microsoft Clarity (לבדיקת התנהגות)

---

## 🧪 Testing

### ידני (לעת עתה)
- [ ] Hero Form - 3 שדות, שולח, מציג הצלחה
- [ ] Detailed Form - 4 שדות, שולח, מציג הצלחה
- [ ] Navigation - גלילה חלקה לכל סקציה
- [ ] FAQ - פתיחה/סגירה של כל שאלה
- [ ] Mobile - תצוגה במכשיר אמיתי
- [ ] קבלת מייל - מבדיקה אמיתית

### בעתיד
- Cypress E2E tests
- Form submission tests
- Visual regression (Percy / Chromatic)

---

## 🎯 Build & Run

### Development
```bash
npm install      # פעם אחת
npm run dev      # שרת מקומי ב-localhost:3000
```

### Production
```bash
npm run build    # יצירת build מקומי
npm start        # שרת production מקומי
```

### Lint
```bash
npm run lint
```

---

## 📊 Performance Budget

| מטריקה | יעד | סטטוס |
|---|---|---|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |
| Bundle Size | < 200kb | TBD |
| Time to Interactive | < 3s | TBD |

---

**גרסה:** 1.0
**עודכן:** אפריל 2026
