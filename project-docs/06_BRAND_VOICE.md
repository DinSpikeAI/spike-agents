# 🎨 Spike Agents — Brand Voice & Design

> **המסמך הזה מגדיר איך Spike נראה ומדבר.** עדכן כאן כל החלטה ויזואלית או חתימה לשונית.

---

## 1. ערכי מותג

**Spike =** הצוות השקט שעובד מאחורי הקלעים בעוד אתה ישן.

| ערך | מה זה אומר בפועל |
|---|---|
| **שקט** | אין איקונים מהבהבים, אין המון notifications, אין emoji bombs. הסוכנים עושים ולא מתפארים. |
| **דיוק** | ספרות מדויקות, לא עיגולים. אם המכירות עלו ב-7.3%, נכתוב 7.3%, לא "כמעט 10%". |
| **כבוד** | בעל העסק יודע מה הוא עושה. Spike לא מסביר לו את המקצוע שלו, רק מציג נתונים. |
| **חיסכון** | UI קומפקטי. אין הפסקות אווריריות. כל פיקסל רלוונטי. |
| **עברית-first** | זה לא אנגלית מתורגמת. זאת עברית מקורית, עם הקצב והסלנג של בעלי עסקים ישראלים. |

**מה Spike לא:**
- ❌ Disney-cute (אין mascots, אין humor רך)
- ❌ Wall Street (אין "ROI optimization")
- ❌ Silicon Valley (אין "we're building the future of...")
- ❌ Buzzwordy (אין AI/ML/Synergy/Disrupt)

---

## 2. פלטה

### Core colors (מ-landing, אומת ב-Day 1)
```
ink-bg          #07111A      רקע ראשי, navy שחור
ink-bg2         #0B1A22      קלפים, surfaces מוגבהים
ink-text        #E8EBFF      טקסט ראשי, לבן רך (לא טהור)
teal-400        #22D3B0      brand primary, CTAs, links
teal-300        #5EEAD4      hover, glow
teal-500        #14B8A6      pressed states
teal-700        #0F766E      muted teal, chart-5
cyan-300        #5BD0F2      accents, info
blush           #FFA4B5      destructive (יותר רך מ-red)
navy-950        #0a1f2c      overlays
```

### Tailwind aliases (ב-globals.css)
```css
bg-background         #07111A
bg-card               #0B1A22
bg-primary            #22D3B0    (button bg)
text-primary-foreground  #07111A (button text on primary)
text-foreground          #E8EBFF
text-muted-foreground    oklch(0.65 0 0)
border-border            white/8%
ring-ring                #22D3B0  (focus rings)
```

### Charts palette
```
chart-1   #22D3B0   teal-400
chart-2   #5BD0F2   cyan-300
chart-3   #FFA4B5   blush
chart-4   #5EEAD4   teal-300
chart-5   #0F766E   teal-700
```

### Gradients
```css
.gradient-text {
  linear-gradient(135deg, #22D3B0 0%, #5BD0F2 100%);
}
```

### Surfaces
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  &:hover {
    border-color: rgba(34, 211, 176, 0.4);
    transform: translateY(-4px);
  }
}
```

### אסור
- ❌ אדום טהור (`#FF0000`) — שובר את הפלטה. יש לנו blush.
- ❌ צהוב (`#FFFF00`) — אין לנו warning state בצהוב; severity דרך גודל וטקסט
- ❌ סגול — לא בפלטה
- ❌ Light theme — הכל dark, תמיד

---

## 3. טיפוגרפיה

### Font
**Heebo** (Google Fonts), subsets `["hebrew", "latin"]`
משקלים: 400, 500, 600, 700, 800

### Hierarchy
```
h1   text-5xl  font-bold    כותרת ראשית של דף (rare)
h2   text-3xl  font-bold    כותרת סקציה
h3   text-xl   font-semibold כותרת תת-סקציה / כרטיס
body text-base font-normal  טקסט רגיל
ui   text-sm   font-medium  כפתורים, labels, navigation
xs   text-xs   font-normal  metadata, timestamps
```

### Line height
- Hebrew דורש `leading-relaxed` או `leading-7` בטקסט ארוך — Heebo descenders עמוקים
- כותרות: `leading-tight` תקין

### Numerics
- מספרים תמיד **LTR** עם `font-variant-numeric: tabular-nums`
- ב-tables: `text-end` (RTL-aware) במקום `text-right`

### אסור
- ❌ Italic (לא קיים בעברית)
- ❌ Underline על לינקים שאינם hover (יש לנו teal accent)
- ❌ ALL CAPS על עברית (לא מתאים)
- ❌ Drop shadows על טקסט (זול)

---

## 4. Spacing (Tailwind v4)

ניתן ל-shadcn לבחור ברירות מחדל אבל הקווים שלנו:

```
gap-2 / p-2     8px     צמוד
gap-4 / p-4     16px    standard
gap-6 / p-6     24px    sections
gap-8 / p-8     32px    page padding
gap-12 / p-12   48px    hero spacing
```

**Density preference:** dashboards שלנו צפופים יותר מ-default shadcn. אנחנו בונים כלי עבודה, לא marketing site.

---

## 5. Animations

3 animations מ-landing:

```css
spike-float    4s ease-in-out infinite   ל-mascots/icons (לא בשימוש כרגע)
spike-glow     3s ease-in-out infinite   ל-status indicators (live!)
spike-pulse    3s ease-in-out infinite   ל-loading states
```

**עקרונות:**
- **Subtle motion** — never jarring
- **300ms** = standard transition duration
- **ease-in-out** — לא linear, לא bounce
- **prefers-reduced-motion** — חובה לכבד (תקן 5568)

---

## 6. Iconography

**Library:** Lucide (ברירת מחדל של shadcn b0)
**Stroke:** 2 (לא 1, לא 1.5)
**Size:** matches text — `text-base` → 16px icon

### לסוכנים — emoji כ-identity
```
☀️  morning      בוקר
⭐  reviews      ביקורות
📱  social       רשתות
🧠  manager      מנהל
🎯  watcher      מעקב
🧹  cleanup      ניקיון
💰  sales        מכירות
📦  inventory    מלאי
🔥  hot_leads    לידים חמים
```

ה-emoji האלה הם **מותג** — לא להחליף לאייקונים custom. הלקוח מזהה אותם.

---

## 7. שפה (Hebrew Copy Voice)

### עקרונות

| ❌ אנחנו לא כותבים | ✅ אנחנו כותבים |
|---|---|
| "ברוכים הבאים למערכת!" | "בוקר טוב, רחל." |
| "המערכת חוסכת לך זמן" | "חסכת אתמול 47 דקות." |
| "אנא בחר תכנית מתאימה" | "תכניות:" |
| "אנו מצטערים על אי הנעימות" | "אופס. ננסה שוב." |
| "צרו קשר עם נציג שירות" | "כתבו לנו: support@..." |
| "פעולה זו תבוצע..." | "נשלח את ההודעה" |

### Tone calibrations

| תרחיש | טון |
|---|---|
| Login screen | **ידידותי, רגוע** ("בוא נכנס") |
| Empty state | **תוסס, מזמין** ("עוד אין לידים — נחבר את ה-CRM שלך?") |
| Success | **קצר, חם** ("בוצע ✓") |
| Error | **כן, פתרון** ("לא הצלחנו להתחבר. נסה שוב או [צור קשר]") |
| Spend cap warning | **מקצועי, ברור** ("הגעת ל-80% מהתקציב. הנה הפירוט.") |
| Critical error | **רציני, פעולה** ("Anthropic API down. הסוכנים מושבתים זמנית.") |

### Gender forms (קריטי)

ב-onboarding מבקשים מהמשתמש לבחור: **זכר / נקבה / רבים** (לעסק עם שותפים).

ה-`user_settings.preferences.gender` מוזרק לכל system prompt. גם UI copy צריך לחבק את זה:

```ts
// Helper utility
function gendered(gender: 'male' | 'female' | 'plural', forms: { male: string; female: string; plural: string }) {
  return forms[gender];
}

// Example
gendered(user.gender, {
  male: "תרצה לאשר?",
  female: "תרצי לאשר?",
  plural: "תרצו לאשר?",
});
```

**Default אם לא ידוע:** **לשון סתמית** — "אפשר", "ניתן", "כדאי".
לא לשון זכר! זה ברירת מחדל גרועה.

### מילים שאסור לכתוב

| ❌ אסור | ✅ במקום |
|---|---|
| **בוט** | סוכן AI |
| **תוכנה** | מערכת / Spike |
| **משתמש** | בעל העסק / [שם פרטי] |
| **לקוח** | (זה כבר תפוס למי שמשלם — לקוחות הקצה הם "לקוחות העסק") |
| **AI** (לבד) | סוכן AI / Claude (אם רלוונטי) |
| **בינה מלאכותית** (פורמלי מדי) | AI / סוכן AI |

### תאריכים ומספרים

```
תאריך:    "27 באפריל" (לא "27/4/2026")
שעה:      "07:00" (24h, לא AM/PM)
סכום:     "₪247" (לא "247 ש״ח")
אחוז:     "12%" (לא "12 אחוזים")
```

---

## 8. Layout patterns

### Page structure (Dashboard)
```
┌───────────────────────────────────────┐
│  Sidebar (fixed)  │  Main content     │
│  ▸ סקירה          │                   │
│  ▸ סוכנים         │   <hero>          │
│  ▸ Inbox          │   <agent-grid>    │
│  ▸ הגדרות         │   <recent-runs>   │
└───────────────────────────────────────┘
```

**Sidebar:** `w-64` (256px), מקובע, ב-`bg-card` (`#0B1A22`)
**Main:** `flex-1`, padding `p-8`
**Max-width:** `max-w-7xl mx-auto` ל-center על מסכים גדולים

### Agent card
```
┌──────────────────────────┐
│  ☀️  סוכן בוקר            │   ← icon + name_he
│                          │
│  🟢 פעיל • 7:00          │   ← status + schedule
│                          │
│  אתמול: ✓ 23 דקות         │   ← last run summary
│                          │
│  [פתח] [הרץ עכשיו]       │   ← actions
└──────────────────────────┘
```

### Drafts inbox
- 3-col layout: list | preview | actions
- `Sheet` (drawer) על mobile
- "אישור" ירוק, "דחיה" rose, "ערוך" outline

---

## 9. Loading states

**3 רמות:**

1. **Inline spinner** (`<Loader2 className="animate-spin" />`) — actions זריזים (<3s)
2. **Skeleton** (shadcn) — content שעוד נטען (>1s)
3. **Full-screen splash** (לוגו עם spike-pulse) — only on auth callback / page transitions

**לעולם לא:**
- ❌ "Loading..." טקסט (יבש, לא מותגי)
- ❌ Generic spinners בלי context

---

## 10. Empty states

תבנית:
```
[ icon גדול, muted ]
[ כותרת קצרה ]
[ הסבר של 1-2 משפטים ]
[ CTA primary ]
```

**דוגמה — Inbox ריק:**
```
   📭
אין טיוטות שמחכות
הסוכנים יכינו טיוטות וירשמו פה.
[חבר את ה-CRM כדי להתחיל]
```

**אסור:**
- ❌ "אין נתונים" יבש
- ❌ Empty illustration cute (Spike רציני)

---

## 11. Toasts (Sonner)

- **Success:** ✓ + טקסט ירוק עדין
- **Error:** ✗ + טקסט rose
- **Info:** ⓘ + נייטרלי
- **Position:** top-end (RTL → top-left)
- **Duration:** 4 שניות לדיפולט, 8 לכשלון

```ts
import { toast } from 'sonner';

toast.success("נשלח ✓");
toast.error("לא הצלחנו לשלוח", { duration: 8000 });
```

---

## 12. Mascot (אופציונלי, לא בשימוש כרגע)

Mascot SVG/PNG עם רקע שקוף קיים (`spike-mascot.png` ב-uploads).

**החלטה ב-Day 1:** dropped מהדף הראשי כי ה-PNG transparency יצא לא טוב על navy. **שמור לעתיד** — אולי נחזיר אותו לעמוד 404 או לאמייל warmup.

**אם נחזיר:**
- רק ב-marketing/landing, לא ב-app dashboard
- עם `spike-float` animation
- בגודל max `h-32` (128px)

---

## 13. Component naming

```
src/components/
├── ui/               ← shadcn components (button, card, input...)
├── providers/        ← context wrappers (DirectionProvider...)
├── agents/           ← agent-specific UI (MorningCard, ReviewDrawer...)
├── layouts/          ← page shells (DashboardLayout, AuthLayout)
└── shared/           ← reusable (Spinner, EmptyState, Toast...)
```

**Naming convention:**
- PascalCase for component files
- kebab-case for utility files
- One component per file (default export)

---

## 14. Metadata (HTML head)

### Default title
`Spike Engine — סוכני AI לעסק שלך`

### Per-page titles
```
/ → "Spike Engine"
/login → "התחבר — Spike"
/dashboard → "סקירה — Spike"
/agents → "הסוכנים — Spike"
/inbox → "Inbox — Spike"
/settings → "הגדרות — Spike"
```

### OG image
Spike logo על navy background, 1200×630, עם הטקסט "9 סוכני AI שעובדים בשבילך" בעברית.
**ייצור ב-Day 8** ב-onboarding launch.

### Favicon
Spike "S" עם teal-400, על navy.
**TODO Day 3.**

---

## 15. Voice examples (per agent)

### Morning briefing
```
בוקר טוב, רחל.

אתמול היו 23 הזמנות חדשות, מעל לממוצע השבועי (19).
3 לקוחות חדשים בחנות, אחד מהם מכפר סבא — אזור חדש בשבילך.

היום:
• 4 פגישות, אחת חשובה ב-15:00 (קונה potential, ראה Inbox)
• המלאי של "סלמון נורבגי" עומד להיגמר תוך יומיים
• ביקורת חדשה ב-Google מחכה לתגובה

היום שווה להתמקד בקונה של ה-15:00 — זה deal של ₪12,000.
```

**Voice notes:**
- מכבד את הזמן (קצר)
- מספרים מדויקים
- מסיים ב-priority אחד
- אפס מילים מיותרות

### Reviews — Positive (5 stars)
```
תודה רחל ❤️ ממש שמחנו לקבל את התגובה שלך! נחכה לראות אותך שוב בקרוב.
```

### Reviews — Negative (2 stars)
```
לי, אנחנו ממש מצטערים שלא נהנית מהביקור. רוצה לתת לנו הזדמנות לתקן? תכתבי לנו ב-DM ונחזור אליך תוך שעה.
```

**Voice notes:**
- שמות פרטיים (לא "לקוחה יקרה")
- "אנחנו" (לא "המסעדה")
- אופציה להמשך בערוץ פרטי
- אין הכחשה / הצדקות

---

## 16. Accessibility (תקן 5568)

מחויבים ל-**WCAG 2.1 AA**:

- ניגודיות **4.5:1** לטקסט רגיל, **3:1** ל-UI elements
- כל form input עם `<label>` מקושר (htmlFor)
- focus indicators ברורים (יש לנו teal ring)
- keyboard navigation מלאה (אין רק-mouse)
- `prefers-reduced-motion` — נכבד את ה-animations
- ARIA labels על כפתורי icon-only

**Audit ב-Day 10** עם NVDA + Hebrew SAPI5.

---

## 17. הזכות לשנות

החלטות עיצוב **לא מוקפאות.** אם משהו לא עובד אחרי 2-3 לקוחות אמיתיים — נשנה.

**מה לא משתנה:**
- שם המוצר (Spike Agents)
- 9 emojis של הסוכנים
- כללי הברזל ב-`00_START_HERE.md`
- Heebo

**מה גמיש:**
- Density spacing
- Empty states copy
- Onboarding flow
- Animations specifics
