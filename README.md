# 🤖 Spike AI Agents

> סוכני AI מותאמים לעסקים ישראליים - בלי לבקש משכורת.

דף נחיתה פרימיום בעברית B2B עבור Spike AI Agents — שירות Done-For-You שמספק חבילת סוכני AI לעסקים. הסוכנים עובדים 24/7, סורקים את הדאטה של העסק, ושולחים דוחות לטלגרם.

🟢 **חי באוויר:** [spikeai.co.il](https://spikeai.co.il)

---

## 🚀 פיצ'רים

* ✨ עיצוב פרימיום עם glassmorphism וגרדיאנט טורקיז
* 🇮🇱 תמיכה מלאה בעברית RTL
* 📱 רספונסיבי מלא (מובייל, טאבלט, מחשב) – כולל hamburger menu
* ⚡ 2 טפסים ללכידת לידים (מהיר ב-Hero + מפורט בסוף)
* 🤖 9 סוכני AI מוצגים בכרטיסים
* 🎬 סרטון explainer 60 שניות עם קריינות עברית
* 💎 עמודת חבילה פרימיום עם אנימציות
* ❓ FAQ אינטראקטיבי (accordion)
* 📧 חיבור ל-Web3Forms לקבלת לידים במייל
* 📲 Open Graph metadata לתצוגה מקדימה יפה (וואטסאפ/טלגרם/פייסבוק)
* 🛡️ 4 עמודים משפטיים (פרטיות, תנאים, נגישות, עוגיות)

---

## 📚 תיעוד מלא

הפרויקט מתועד ברמה מקצועית בתיקיית `/docs`:

| מסמך | מה יש בו |
| --- | --- |
| 📘 [`PROJECT-OVERVIEW.md`](https://github.com/DinSpikeAI/spike-agents/blob/main/docs/PROJECT-OVERVIEW.md) | סקירה כללית, מודל עסקי, קהל יעד |
| 🎨 [`DESIGN-SYSTEM.md`](https://github.com/DinSpikeAI/spike-agents/blob/main/docs/DESIGN-SYSTEM.md) | פלטת צבעים, גופנים, אנימציות |
| ✍️ [`COPY-GUIDE.md`](https://github.com/DinSpikeAI/spike-agents/blob/main/docs/COPY-GUIDE.md) | כל הטקסטים בדף + הסבר למה |
| 🏗️ [`ARCHITECTURE.md`](https://github.com/DinSpikeAI/spike-agents/blob/main/docs/ARCHITECTURE.md) | מבנה הקוד, איך הכל מחובר |
| 📋 [`DECISIONS-LOG.md`](https://github.com/DinSpikeAI/spike-agents/blob/main/docs/DECISIONS-LOG.md) | החלטות שעשינו ולמה |

> **למפתחים חדשים / Claude session חדש:** התחל מ-`PROJECT-OVERVIEW.md`!

---

## 🛠️ Stack טכנולוגי

* **Framework:** Next.js 16.2.4 (App Router)
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS v4
* **Build:** Turbopack
* **Font:** Heebo (Google Fonts)
* **Forms:** Web3Forms API
* **Hosting:** Vercel (פרודקשן ב-spikeai.co.il)
* **Domain:** JetServer (NS מנותב ל-Vercel)
* **Animations:** Framer Motion 12

---

## 🏃 הרצה מקומית

```
# התקנת חבילות (פעם ראשונה)
npm install

# שרת פיתוח
npm run dev

# פתיחה בדפדפן
http://localhost:3000
```

---

## 📦 Build לפרודקשן

```
npm run build
npm start
```

הדפלוי האמיתי לפרודקשן הוא דרך `git push` — Vercel עושה build ופריסה אוטומטית.

---

## 🎨 פלטת צבעים מהירה

```
--spike-teal:        #22D3B0  /* ראשי */
--spike-cyan:        #5BD0F2  /* משלים */
--spike-light-teal:  #5EEAD4  /* בהיר */
--spike-deep-teal:   #14B8A6  /* עמוק */
--bg-primary:        #07111A  /* רקע */
```

---

## 📁 מבנה תיקיות

```
spike-agents/
├── app/
│   ├── page.tsx              # דף ראשי (כל הסקציות)
│   ├── layout.tsx            # RTL + Heebo + OG metadata
│   ├── globals.css           # Tailwind v4
│   ├── privacy/page.tsx      # מדיניות פרטיות
│   ├── terms/page.tsx        # תנאי שימוש
│   ├── accessibility/page.tsx # הצהרת נגישות
│   └── cookies/page.tsx      # מדיניות עוגיות
├── public/
│   ├── spike-mascot.png      # מסקוט קטן
│   ├── spike-mascot-pro.png  # מסקוט גדול (Hero)
│   ├── spike-explainer.mp4   # סרטון explainer
│   └── og-image.png          # תמונת Open Graph
├── docs/                     # תיעוד מלא
│   ├── PROJECT-OVERVIEW.md
│   ├── DESIGN-SYSTEM.md
│   ├── COPY-GUIDE.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS-LOG.md
└── package.json
```

---

## 🤖 9 הסוכנים

| # | סוכן | מה עושה |
| --- | --- | --- |
| ☀️ | סוכן בוקר | דוח יומי בטלגרם ב-7:00 |
| 📱 | סוכן רשתות | 3 פוסטים מוכנים בכל יום |
| 🧠 | סוכן מנהל | סיכום אסטרטגי יומי |
| 🎯 | סוכן מעקב | התראות בזמן אמת |
| 🧹 | סוכן ניקיון | pipeline נקי תמיד |
| 💰 | סוכן מכירות | מנתח deals תקועים |
| ⭐ | סוכן ביקורות | סורק ומגיב לביקורות |
| 📦 | סוכן מלאי | חיזוי ביקוש |
| 🔥 | סוכן לידים חמים | דירוג חכם של לידים |

> 💡 **חשוב:** מספר הסוכנים יכול לגדול בעתיד. בשיווק לא להתחייב על מספר ספציפי – להגיד "צוות שלם".

---

## 📧 לידים

שני הטפסים מחוברים ל-**Web3Forms** ושולחים את הלידים ישירות למייל `spikeaistudio@gmail.com`.

* **טופס Hero (מהיר):** שם, טלפון, אימייל
* **טופס מפורט:** שם, טלפון, אימייל, תחום עסק (16 אפשרויות)

---

## 🚧 סטטוס

🟢 **חי בפרודקשן** ב-[spikeai.co.il](https://spikeai.co.il)

### מה מוכן ✅

* Hero, How It Works, Agents, Package, Forms, FAQ, Footer
* שני המסקוטים מוטמעים
* סרטון explainer 60 שניות עם קריינות מ-ElevenLabs
* חיבור Web3Forms פעיל
* עיצוב פרימיום מלא + RTL
* רספונסיבי מלא (mobile-first) עם hamburger menu
* 4 עמודים משפטיים ישראליים
* דומיין רשמי spikeai.co.il עם SSL
* Vercel deploy אוטומטי דרך GitHub
* Open Graph metadata עם תמונה ממותגת
* SEO basics (canonical, robots, theme-color)

### מה הלאה 🔮

* באנר הסכמת עוגיות
* Google Analytics 4 / Vercel Analytics
* Nagish Li accessibility widget
* בדיקת עו"ד מומחה לפני השקה ציבורית רחבה
* חיבור לבוט טלגרם (אחרי 5 לידים ראשונים)
* גרסה אנכית 9:16 של הסרטון לסטוריז/ריילז
* תשתית multi-tenant ב-Supabase (כשיגיעו לקוחות)

---

## 📝 רישיון

Public → All rights reserved © 2026 Spike AI Agents

---

**Maintainer:** Dean Moshe ([@DinSpikeAI](https://github.com/DinSpikeAI))
**Last updated:** April 2026
