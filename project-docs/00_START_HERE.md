# 🚀 Spike Agents — START HERE
> **שלום Claude.** קרא את כל המסמך הזה לפני שאתה עונה. בסוף יש "מה אנחנו עושים עכשיו". כשאתה מבין, אמור לי "מוכן" ואז נמשיך.
>
> **תאריך עדכון:** 28 באפריל 2026, אמצע Day 2.5.

---

## 1. מי אני (Din Moshe — DinSpikeAI)

יזם סולו, ישראלי, בוטסטרפ, סמי-טכני (לא מפתח). מ-PowerShell וקצת Node, לא מקצועי.
0 לקוחות. 0 הכנסה. אני בונה את **Spike Agents** מאפס, יום-אחר-יום, עם Claude כ-pair programmer.

**אני מבקש:**
- שלב-אחר-שלב, copy-paste-ready
- קוד שעובד מהפעם הראשונה (אין לי זמן לדבג typos)
- בדיקות אחרי כל שלב, לא רצף של 10 פקודות בלי checkpoint
- אזהרות **לפני** שאני שובר משהו (במיוחד secrets ב-Git)
- כשאני שואל "למה" — אני רוצה תשובה אמיתית, לא חלקית

**אל תניח שאני יודע:**
- regex
- mistakes ב-cd / pwd (אני שובר את זה לפעמים)
- difference בין `npm` ל-`pnpm`
- terminal vs SQL editor (תזכיר לי כשאני מבלבל)

---

## 2. המוצר — Spike Agents

**SaaS Multi-tenant של 9 סוכני AI לעסקים ישראלים קטנים-בינוניים (SMB).**

הלקוח (בעל עסק) נכנס לדשבורד עברי נקי ב-`app.spikeai.co.il`, רואה טיוטות שהסוכנים הכינו לו, ומאשר בלחיצה. **הסוכן לעולם לא מדבר עם לקוחות הקצה** — רק עם בעל העסק.

### תמחור (סופי)
| Tier | מחיר | סוכנים | מודל מנהל |
|---|---|---|---|
| Starter | ₪199/חודש | 4: בוקר, ביקורות, רשתות, לידים חמים | אין |
| **Pro** | **₪499/חודש** | כל 9 | Sonnet 4.6 + thinking 8000 |
| Business | ₪999/חודש | כל 9 + custom prompts | Opus 4.7 |

Margin ב-100 לקוחות: 89-94%.

### 9 הסוכנים
1. **בוקר** ☀️ — דוח יומי 7:00 (Haiku 4.5)
2. **ביקורות** ⭐ — תגובות Google/Insta כל שעתיים (Sonnet 4.6)
3. **רשתות** 📱 — 3 פוסטים יומיים (Sonnet 4.6, Batch API)
4. **מנהל** 🧠 — סיכום אסטרטגי 19:00 (**Sonnet 4.6 + thinking 8000**, NOT Opus)
5. **מעקב** 🎯 — התראות real-time כל 15 דק' (Haiku 4.5)
6. **ניקיון** 🧹 — pipeline hygiene יום ראשון (Haiku 4.5)
7. **מכירות** 💰 — follow-ups א-ה 10:00 (Sonnet 4.6)
8. **מלאי** 📦 — תחזית ביקוש 8:00 (Haiku 4.5 + thinking 2048)
9. **לידים חמים** 🔥 — דירוג כל 30 דק' (Haiku 4.5, **bucketed output**)

---

## 3. כללי ברזל (לא לשנות, אף פעם)

1. ❌ **המילה "בוט" אסורה** — רק "סוכן AI"
2. ❌ **אין מחירים פומביים באתר** (למה: לא רוצים race-to-bottom)
3. ❌ **אין GPT/Gemini** — Anthropic only
4. ❌ **הסוכן לא מדבר עם לקוחות הקצה** — רק עם בעל העסק
5. ❌ **secrets לא נכנסים ל-Git, אף פעם**
6. ❌ **לא Edge runtime ל-AI** — תמיד Node.js + Fluid Compute
7. ✅ **Multi-tenant מהיום הראשון** — RLS על כל טבלה
8. ✅ **9 סוכנים בייצור מהיום הראשון** (לא MVP של 2-3)
9. ✅ **Dashboard עברי בלבד** — RTL, Heebo, Apple-clean dark
10. ✅ **Native JSON Schema** ב-Anthropic (לא tool_use, לא prefilling)
11. ✅ **Prompt caching עם `ttl: "1h"` מפורש** (default ירד ל-5min ב-March 2026)
12. ✅ **Telegram = פנימי בלבד** ל-Dean alerts, אף פעם לא ללקוח

---

## 4. הסטאק (אומת אפריל 2026)

```
Frontend:   Next.js 16.2.4 + Tailwind v4 + shadcn/ui RTL native + Heebo font
Auth:       Supabase Magic Link + Custom Access Token Hook → tenant_id ב-JWT
Database:   Supabase Postgres + RLS + Realtime Broadcast + Vault + pg_cron
Backend:    Vercel Fluid Compute (Node, NOT Edge) + QStash queues
AI:         Anthropic only — Haiku 4.5 / Sonnet 4.6 / Opus 4.7
            output_config.format עם Native JSON Schema
            Prompt caching עם ttl: "1h" מפורש
Email:      Resend (auth subdomain נפרד, click-tracking off)
Secrets:    .env.local זמנית, יעבור ל-Doppler/Infisical ב-Day 14
Region:     Frankfurt (eu-central-1)
```

### Resources חיים
- **Supabase project:** `ihzahyzejqpjxwouxuhj` (URL: `https://ihzahyzejqpjxwouxuhj.supabase.co`)
- **GitHub engine:** `DinSpikeAI/spike-agents-engine` (Public) — **זה איפה שאנחנו עובדים**
- **GitHub landing:** `DinSpikeAI/spike-agents` (Public, **לא נוגעים** ב-Day 1-7)
- **GitHub studio:** `DinSpikeAI/spike-ai-studio` (פרויקט אחר, לא קשור)
- **DNS provider:** Vercel (nameservers `ns1.vercel-dns.com` / `ns2.vercel-dns.com`) — מאז Day 2 evening
- **Domain registrar:** JetServer (חידוש דומיין בלבד — DNS לא נערך שם!)
- **Email service:** Resend (חשבון `din6915@gmail.com`, region Ireland eu-west-1)
- **Verified email subdomain:** `auth.spikeai.co.il` — מאז Day 2.5 (28.4.2026 14:17)

### Local paths
- **engine** (פעיל): `C:\Users\Din\Desktop\spike-engine\`
- **landing** (לא לגעת): `C:\Users\Din\Desktop\spike-agents\`
- **vault** (סיסמאות, מחקרים): `C:\Users\Din\Desktop\לא למחוק!!! כל הדברים החשובים של כל הפרוייקטים\`

### Domain map (עתידי)
```
spikeai.co.il               → Spike AI Studio (פרויקט אחר, לא קשור)
agents.spikeai.co.il        → landing שיווקי של Spike Agents
app.spikeai.co.il           → ה-SaaS עצמו ⭐ זה אנחנו!
admin.spikeai.co.il         → Dean only (Day 9)
api.spikeai.co.il           → API ציבורי (Phase 2)
auth.spikeai.co.il          → תת-דומיין ל-transactional emails (Resend)
mail.spikeai.co.il          → תת-דומיין ל-marketing emails (עתידי)
```

---

## 5. מצב הפרויקט (אמצע Day 2.5)

### ✅ Day 1 — הושלם (26.4.2026)
- Next.js 16.2.4 scaffolded
- Tailwind v4 + Heebo + RTL
- Design tokens מ-landing פורטו (teal `#22D3B0`, navy `#07111A`)
- Supabase project חי
- `.env.local` מאובטח (לא ב-Git)
- Schema 1.0: 12 טבלאות, RLS, 9 agents (השמדנו ב-Day 2)
- 3 Supabase clients
- Git: 3 commits, push ל-GitHub

### ✅ Day 2 — הושלם מלא (27.4.2026)
- **מחקר עמוק** של 25+ מקורות — אומת ועודכן
- **Schema 1.0 → 2.0:**
  - clients → tenants (התנגשות JWT עם Supabase OAuth)
  - 16 טבלאות (12 + outbox + idempotency_keys + audit_log + user_settings)
  - 30+ RLS policies
  - 11 helper functions
  - **Custom Access Token Hook חי ופעיל** ✨
  - Atomic spend cap: reserve/settle/refund
- **Manager על Sonnet 4.6 + thinking 8000** (לא Opus!)
- **`@supabase/ssr` 0.10.2** מאומת (פגיעות JWT-leak מתוקנת)
- **`proxy.ts`** (Next.js 16 middleware)
- **`server-only` guards** ב-server.ts ו-admin.ts
- **`shadcn/ui` עם RTL native** (preset b0)
- **`globals.css` מאוחד** (Spike + shadcn tokens)
- **`<DirectionProvider>` client wrapper** + עטיפת ה-app
- **`localhost:3000` עובד** עם dark theme + Heebo + RTL
- **DNS migration:** Nameservers ב-JetServer הועברו מ-`jetdns.net` ל-`vercel-dns.com`
- **Propagation completed** — Vercel = DNS authority יחיד של `spikeai.co.il`
- **Day 2 commit + push:** `3108530` — 12 קבצים, 5,509 שורות נוספו

### 🔄 Day 2.5 — בעבודה (28.4.2026, התחיל ~14:00)

**הושלם:**
- ✅ Resend account נפתח (`din6915@gmail.com`, Ireland eu-west-1)
- ✅ Domain `auth.spikeai.co.il` נוצר ב-Resend
- ✅ 3 DNS records נוספו ב-Vercel:
  - DKIM TXT (`resend._domainkey.auth`)
  - MX (`send.auth` → `feedback-smtp.eu-west-1.amazonses.com`, priority 10)
  - SPF TXT (`send.auth` → `v=spf1 include:amazonses.com ~all`)
- ✅ Domain **verified** ב-Resend (28.4.2026 14:17)

**בתור (לא הושלם):**
- ⏳ Click tracking OFF (לטפל בזה ב-Settings אחרי שהדומיין verified)
- ⏳ Resend → Supabase Auth SMTP integration
- ⏳ Hebrew Magic Link template ב-Supabase
- ⏳ Login page (`/login` עם Magic Link form עברי)
- ⏳ `/auth/callback` route handler
- ⏳ `/auth/error` page
- ⏳ Dashboard skeleton placeholder עם 9 agent cards
- ⏳ Day 2.5 commit + push

### 📅 Day 3+ — ראה `03_ROADMAP_DAYS_3_TO_14.md`

---

## 6. מה אנחנו עושים עכשיו

> **[Din: עדכן את הסעיף הזה לפני שאתה מעלה את המסמך לשיחה חדשה]**

תיאור המשימה: _[כתוב כאן]_

זמן נוכחי אצלי: _[HH:MM]_

זמן זמין משוער: _[X שעות]_

---

## 7. מסמכי הפרויקט — מפת ניווט

| # | קובץ | מתי להעלות | גודל בערך |
|---|---|---|---|
| **00** | `START_HERE.md` ⭐ | **תמיד** ראשון | 11 KB |
| 01 | `TECHNICAL_STACK.md` | שאלות stack/architecture | 12 KB |
| 02 | `PROGRESS_LOG.md` | חזרה לימים קודמים | 9 KB |
| 03 | `ROADMAP_DAYS_3_TO_14.md` | תכנון יום | 14 KB |
| 04 | `DATABASE_SCHEMA.md` | DB / RLS / migrations | 16 KB |
| 05 | `AGENTS_SPEC.md` | בניית סוכן | 17 KB |
| 06 | `BRAND_VOICE.md` | UI / copy / Hebrew | 14 KB |
| 07 | `CODE_PATTERNS.md` | קוד אמיתי | 18 KB |
| 08 | `KNOWN_ISSUES.md` | bugs / gotchas | 14 KB |
| 09 | `HANDOFF_TEMPLATE.md` | פתיחת שיחות חדשות | 8 KB |

**עדיפות בכל שיחה:**
1. ⭐⭐⭐ `00_START_HERE.md` (תמיד)
2. ⭐⭐ `08_KNOWN_ISSUES.md` (תמיד — חוסך זמן רב)
3. ⭐ הקבצים הרלוונטיים למשימה

---

## 8. זרימת עבודה מומלצת לכל שיחה

1. **תמיד תעלה את `00_START_HERE.md` (זה שאתה קורא עכשיו) ראשון**
2. **תעדכן סעיף 6** ("מה אנחנו עושים עכשיו") לפני העלאה
3. **תעלה מסמכים נוספים** רלוונטיים למשימה (ראה טבלת מסמכים למעלה)
4. **תעלה `08_KNOWN_ISSUES.md`** — תמיד שווה, חוסך טעויות חוזרות
5. **תכתוב הודעת פתיחה** לפי `09_HANDOFF_TEMPLATE.md`
6. **חכה ל"מוכן"** של Claude לפני שאתה מבקש משימה
7. **בסוף שיחה** — בקש מ-Claude recap + commit message + רישום ל-PROGRESS_LOG

---

## 9. שאלות שClaude תמיד צריך לשאול לפני קוד מורכב

- **"מה השעה אצלך עכשיו?"** (אם אחרי 23:00 — מציע לעצור)
- **"כמה זמן יש לך היום?"** (חישוב משימה מול זמן)
- **"איך עברה השיחה הקודמת?"** (אם יש sub-context שלא במסמכים)
- **"האם יש שינויים בכללי הברזל?"** (נדיר, אבל אם כן — חשוב)

---

## 10. סיגנלים שמשהו לא בסדר

🚨 **אם Claude רואה אחד מאלה — הוא צריך לעצור ולשאול אותי:**
- אני מבקש לעקוף RLS / לכתוב SQL כ-service_role בלי סיבה ברורה
- אני מבקש להוסיף secret ל-Git
- אני מבקש לדלג על step בתוכנית (Day X לפני שסיימנו Day X-1)
- אני מבקש לחבר GPT/Gemini במקום Anthropic
- אני מתחיל לדבר על voice/Telegram-customer-facing (חזרה ל-MVP הישן)
- אני נראה לחוץ ומבקש "סיים את זה ולא משנה איך"

---

## 11. דברים שClaude חייב לזכור

- **אני שובר tabs ב-PowerShell** — תמיד תזכיר `cd C:\Users\Din\Desktop\spike-engine` בתחילת sequence
- **אני שואל שאלות באמצע** — תענה ברצינות, גם אם זה רחוק מהמשימה
- **אם אתה לא בטוח, תגיד.** "לא יודע" עדיף על "אני מנחש"
- **אם אנחנו עייפים — תגיד.** עצירה זה תקין. בנייה כשעייף = bugs מחר
- **אני סמי-טכני.** הסבר את ה"למה" לפני ה"איך", אבל אל תהיה מתנשא
- **אני אוהב transparency** על trade-offs. אם החלטה לא חד-משמעית — הצג 2-3 אופציות

---

## 12. אני מעדיף Move-Item על Node scripts

**עדכון Day 2:** התחלנו עם Node scripts לכל העברת קובץ. זה היה overkill.

**מעכשיו:**
- ✅ `Move-Item C:\Users\Din\Downloads\file.ts .\src\lib\file.ts -Force`
- ❌ Node scripts (אלא אם דרוש logic מיוחד — יצירת תיקיות, rename, וכו')

PowerShell `Move-Item` עם `-Force` עובד. פשוט.

---

## 13. מצב Anthropic spend

**Claude API spend cap:** $10/חודש (קשיח, לא מועלה)

לכן:
- כל מה שאני בונה דורש **prompt caching** מהיום הראשון
- **`ttl: "1h"` תמיד** במפורש
- אם משהו דורש >50K tokens של context, חשוב לחשוב איך להוריד

---

**עכשיו אמור לי "מוכן" אם הבנת. אחרי זה — תקרא את שאר המסמכים שאעלה, ותגיד לי מה לעשות הלאה.**
