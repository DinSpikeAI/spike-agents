# 🎨 Spike AI Agents - Design System

> מערכת העיצוב המלאה: צבעים, גופנים, אנימציות, רכיבים

---

## 🎨 פלטת צבעים

### צבעים ראשיים
```css
--spike-teal:        #22D3B0  /* טורקיז ראשי - כפתורים, גרדיאנטים */
--spike-cyan:        #5BD0F2  /* ציאן משלים - גרדיאנטים, accents */
--spike-light-teal:  #5EEAD4  /* טורקיז בהיר - טקסט מודגש, ✓ */
--spike-deep-teal:   #14B8A6  /* טורקיז עמוק - hovers, glows */
```

### רקעים
```css
--bg-primary:    #07111A  /* רקע ראשי - כהה כמעט שחור */
--bg-glass:      rgba(255, 255, 255, 0.03)  /* glassmorphism */
--bg-glass-hover: rgba(255, 255, 255, 0.06)
```

### טקסט
```css
--text-primary:    #FFFFFF
--text-secondary:  rgba(255, 255, 255, 0.7)   /* פסקאות */
--text-tertiary:   rgba(255, 255, 255, 0.6)   /* trust badges */
--text-muted:      rgba(255, 255, 255, 0.5)   /* תת-כותרות */
--text-subtle:     rgba(255, 255, 255, 0.4)   /* placeholders */
```

### גבולות (borders)
```css
--border-subtle:   rgba(255, 255, 255, 0.08)
--border-medium:   rgba(255, 255, 255, 0.15)
--border-accent:   rgba(34, 211, 176, 0.3)   /* hover */
--border-active:   rgba(34, 211, 176, 0.5)   /* focus, active */
```

### גרדיאנטים מרכזיים
```css
/* גרדיאנט הכפתור הראשי */
background: linear-gradient(to left, #22D3B0, #5BD0F2);

/* גרדיאנט Shimmer (אנימציה) */
background: linear-gradient(90deg, 
  #22D3B0 0%, 
  #5BD0F2 25%, 
  #ffffff 50%, 
  #5BD0F2 75%, 
  #22D3B0 100%
);
```

---

## ✏️ טיפוגרפיה

### גופן ראשי
```css
font-family: 'Heebo', sans-serif;
```
**Heebo** - גופן עברי מודרני מ-Google Fonts. תומך משקלים 300-900.

### היררכיה

| שימוש | גודל | משקל | דוגמה |
|---|---|---|---|
| H1 (Hero) | 4xl-6xl | 900 (black) | "צוות שלם שעובד בשבילך" |
| H2 (Section) | 4xl-6xl | 900 (black) | "3 שלבים. תוך 7 ימים." |
| H3 (Card) | 2xl | 700 (bold) | "ממלאים טופס קצר" |
| H4 (Sub) | xl | 700 (bold) | "הסוכנים" |
| Body | base-xl | 400 (normal) | תיאורים |
| Small | sm | 400-600 | trust badges |
| Tiny | xs | 400 | privacy notes |

### Line Heights
- כותרות: `leading-[1.1]` (טייט)
- פסקאות: `leading-relaxed` (1.625)
- רשימות: `leading-7`

---

## 🎬 אנימציות

### ✨ Shimmer Text (טקסט נוצץ)
**מתי:** על מילים מודגשות בכותרות
```css
@keyframes spike-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
/* duration: 4s linear infinite */
```

### 🎈 Float (ריחוף)
**מתי:** המסקוט הגדול ב-Hero
```css
@keyframes spike-float {
  0%, 100% { transform: translateY(-15px); }
  50%      { transform: translateY(15px); }
}
/* duration: 5s ease-in-out infinite */
```

### 💫 Mascot Glow (זוהר מסקוט)
**מתי:** מתחת לרובוט הראשי
```css
@keyframes spike-mascot-glow {
  0%, 100% { 
    filter: drop-shadow(0 30px 80px rgba(20, 184, 166, 0.7))
            drop-shadow(0 0 60px rgba(94, 234, 212, 0.5))
            drop-shadow(0 -10px 40px rgba(91, 208, 242, 0.4));
  }
  50% { /* יותר עוצמתי */ }
}
/* duration: 4s ease-in-out infinite */
```

### 💎 Premium Glow (זוהר פרימיום)
**מתי:** עמודת הסוכנים בחבילה
```css
@keyframes spike-premium-glow {
  0%, 100% { box-shadow: 0 25px 60px rgba(34, 211, 176, 0.35), ... }
  50%      { box-shadow: 0 35px 80px rgba(34, 211, 176, 0.55), ... }
}
/* duration: 4s ease-in-out infinite */
```

### ⭕ Pulse (פולס מספרים)
**מתי:** עיגולי 01/02/03 בשלבים
```css
@keyframes spike-step-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 176, 0.4); }
  50%      { box-shadow: 0 0 0 12px rgba(34, 211, 176, 0); }
}
/* duration: 3s ease-in-out infinite */
```

### 🎈 Particles (חלקיקים)
**מתי:** סביב המסקוט ב-Hero
- 3 סוגי חלקיקים שעולים למעלה ונעלמים
- צבעים: `#5EEAD4`, `#5BD0F2`, `#22D3B0`
- duration: 4-6 שניות

### 📐 Grid Pulse (גריד פולס)
**מתי:** רקע גריד בכל הדף
```css
@keyframes spike-grid-pulse {
  0%, 100% { opacity: 0.04; }
  50%      { opacity: 0.08; }
}
/* duration: 8s ease-in-out infinite */
```

---

## 🧩 רכיבי UI

### כפתור ראשי (Primary CTA)
```jsx
<a className="
  bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2]
  text-[#07111A] font-black
  px-8 py-4 rounded-xl text-base
  shadow-lg shadow-[#22D3B0]/40
  hover:shadow-xl hover:shadow-[#22D3B0]/60
  hover:scale-105 transition-all
">
  קבל הצעה אישית
</a>
```

### כפתור משני
```jsx
<a className="
  bg-white/5 border border-white/15
  text-white font-semibold
  px-8 py-4 rounded-xl
  hover:bg-white/10 transition
">
  צפה בדמו
</a>
```

### Glass Card
```jsx
<div className="
  bg-white/[0.03] backdrop-blur-md
  border border-white/[0.08]
  rounded-3xl p-8
  hover:transform hover:-translate-y-2
  hover:border-[#22D3B0]/40
  transition-all duration-400
">
  {/* תוכן */}
</div>
```

### Tag/Badge
```jsx
<div className="
  inline-flex items-center gap-2
  bg-[#14B8A6]/10 border border-[#14B8A6]/30
  rounded-full px-4 py-2
  text-sm text-[#5EEAD4]
">
  איך זה עובד
</div>
```

### Input Field
```jsx
<input className="
  bg-white/[0.05] border border-white/15
  text-white placeholder-white/40
  px-5 py-4 rounded-xl
  focus:border-[#22D3B0]
  focus:bg-white/[0.08]
  focus:shadow-[0_0_0_3px_rgba(34,211,176,0.2)]
  text-right direction-rtl
" />
```

### Premium Card (חבילה - אמצע)
```jsx
<div className="
  bg-gradient-to-br from-[#22D3B0]/[0.18] via-[#5BD0F2]/[0.12] to-[#14B8A6]/[0.10]
  border-2 border-[#22D3B0]/50
  scale-[1.05]
  shadow-[0_25px_60px_rgba(34,211,176,0.35)]
  animate-premium-glow
">
  <div className="badge-floating">⭐ הלב של החבילה</div>
  {/* תוכן */}
</div>
```

---

## 📐 Layout & Spacing

### Container
```css
max-width: 1280px;
margin: 0 auto;
padding: 0 1.5rem;  /* mobile */
padding: 0 3rem;    /* desktop */
```

### Section Padding
```css
padding-top: 8rem;    /* py-32 */
padding-bottom: 8rem;
```

### Grid Gaps
- כרטיסים: `gap-6` (24px)
- כרטיסים גדולים: `gap-8` (32px)

---

## 🌌 רקעים מיוחדים

### Grid Background (רקע גריד)
```css
.grid-bg {
  background-image:
    linear-gradient(rgba(94, 234, 212, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 234, 212, 0.06) 1px, transparent 1px);
  background-size: 60px 60px;
}
```

### Ambient Glows (זוהר אווירה)
שכבות של עיגולים מטושטשים בצבעי המותג:
- גודל: 500-1000px
- blur: 100-180px
- opacity: 0.10-0.30
- מיקומים: לאורך כל הדף בעומקים שונים

### Robot Stage (במה למסקוט)
```css
background: radial-gradient(
  ellipse at center,
  rgba(20, 184, 166, 0.3) 0%,
  rgba(20, 184, 166, 0.12) 30%,
  transparent 60%
);
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* טלפון אופקי */
md:  768px   /* טאבלט */
lg:  1024px  /* לפטופ */
xl:  1280px  /* מסך גדול */
```

### עקרונות
- **Mobile-first** - בסיס למובייל, מתרחב לדסקטופ
- **Hero**: עמודה אחת במובייל, 2 עמודות במחשב
- **Cards**: 1 → 2 → 3 עמודות
- **טקסט**: גודלים קטנים יותר במובייל

---

## 🎯 RTL Specifics

### כיוון
```jsx
<div dir="rtl">
```

### ב-Tailwind
- `text-right` במקום `text-left` (ברירת מחדל ב-RTL)
- `mr-` (margin-right) פועל כ-`ml-` בעצם
- `gradient-to-l` במקום `gradient-to-r` לאפקט מימין-לשמאל

---

## 🔥 רמות hover ו-focus

### Hover - Levels
| רמה | אפקט | דוגמה |
|---|---|---|
| 🟢 Subtle | רקע +0.03 | כרטיס סטנדרטי |
| 🟡 Medium | translate-y-2, border accent | כרטיס בולט |
| 🔴 Strong | scale-105, shadow xl | כפתור CTA |

### Focus States
- מסגרת: `border-[#22D3B0]`
- ring: `shadow-[0_0_0_3px_rgba(34,211,176,0.2)]`

---

## 📊 דוגמאות מהדף

### Hero Section
- **רובוט הענק** (520x520px) עם 3 שכבות glow
- **טקסט בצד שני** עם shimmer על "בלי לבקש משכורת"
- **טופס מהיר** (3 שדות)
- **Trust badges** עם ✓ ירוקים

### Section Headers
תבנית קבועה:
1. **תג עליון** קטן וטורקיז
2. **כותרת ענקית** עם shimmer
3. **תת-כותרת** רחבה ושקטה

### CTA Sections
- כפתור גרדיאנט גדול
- משפט הרגעה ("בלי התחייבות, בלי לחץ")

---

**גרסה:** 1.0
**עודכן:** אפריל 2026
