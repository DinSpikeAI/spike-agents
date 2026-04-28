# 📊 Spike Agents — Progress Log

> **תיעוד יום-אחר-יום של מה שנעשה.** עדכן בסוף כל יום.

---

## ✅ Day 1 — 26 באפריל 2026 (יום ראשון)

**משך:** ~5 שעות נטו
**סטטוס:** הושלם ✅
**Commit סופי:** `f9082df`

### מה הושלם
1. **Project scaffold:**
   - `npx create-next-app@latest spike-engine` עם:
     - TypeScript ✓
     - ESLint ✓
     - Tailwind CSS v4 ✓
     - App Router ✓
     - Turbopack ✓
     - import alias `@/*` ✓
   - תיקייה: `C:\Users\Din\Desktop\spike-engine\`

2. **Heebo + RTL setup:**
   - `next/font/google` עם subsets `["hebrew", "latin"]`
   - `<html lang="he" dir="rtl">` ב-layout.tsx
   - Variable: `--font-heebo`

3. **Design tokens מ-landing פורטו:**
   - teal-400: `#22D3B0`
   - navy/ink-bg: `#07111A`
   - cyan-300: `#5BD0F2`
   - blush: `#FFA4B5`
   - glass-card class
   - spike-float, spike-glow, spike-pulse animations
   - gradient-text

4. **Hero skeleton:**
   - "ברוכים הבאים ל-Spike Engine"
   - 3 status pills: Supabase (בדרך), Tailwind v4 ✓, Next.js 16 ✓
   - "Day 1 of 14" footer

5. **Supabase project:**
   - Created: `ihzahyzejqpjxwouxuhj.supabase.co`
   - Region: Frankfurt (eu-central-1)
   - Plan: Free
   - "Automatically expose new tables" = OFF (security choice)

6. **`.env.local`:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable)
   - `SUPABASE_SERVICE_ROLE_KEY` (secret)
   - **ב-`.gitignore`** ✅

7. **Schema 1.0 — 12 טבלאות:**
   - clients, memberships, agents, agent_prompts, client_agents
   - agent_runs, drafts, integrations, notifications, events
   - cost_ledger, system_alerts
   - RLS פעיל
   - 9 agents seeded (Manager על Opus 4.7 — שגיאה שתוקנה ב-Day 2)
   - Files: 001_schema.sql, 002_rls.sql, 003_seed.sql, 004_grants.sql

8. **3 Supabase clients:**
   - `src/lib/supabase/client.ts` (browser, publishable)
   - `src/lib/supabase/server.ts` (server, publishable + cookies)
   - `src/lib/supabase/admin.ts` (secret, RLS-bypass)

9. **Verification:**
   - `verify-supabase.js` ניסיון, החזיר 9 agents בהצלחה
   - הוסר אחרי

10. **Git:**
    - 3 commits
    - Push ל-`DinSpikeAI/spike-agents-engine`
    - Public repo

### Issues שטופלו ב-Day 1
- **Mascot PNG transparency** — נטוש לטובת text-only hero
- **3 secret-leak near-misses** — תיקייה "כל מה שחשוב!" עם API keys כמעט נכנסה ל-Git, נתפס וטופל
- **`.env.local` placement** — תוקן
- **Supabase API keys format** — עברנו ל-publishable/secret מה-JWT-style
- **`/rest/v1/` ב-URL** — תוקן

### Lessons
- Mascot PNG עם רקע שחור על navy background = רע, dropped
- Node scripts יותר אמינים מ-PowerShell `Copy-Item` לקבצים בעברית
- שני `.env` files חוסר — שמרנו רק `.env.local`

---

## ✅ Day 2 — 27 באפריל 2026 (יום שני)

**משך:** ~7 שעות נטו (כולל DNS migration ערב)
**סטטוס:** הושלם ✅ (login + dashboard + commit עברו ל-Day 2.5)
**Commit סופי:** `3108530`

### מה הושלם

#### 1. מחקר עמוק (אפריל 2026)
- 25+ מקורות נסקרו
- 7 תיקונים קריטיים זוהו
- Roadmap מעודכן ל-Days 3-14
- סיווג: must-fix / should-fix / nice-to-have

#### 2. Schema 1.0 → 2.0 reset

**החלטה:** Reset מלא, לא migration. סיבה: 0 לקוחות, 0 נתונים אמיתיים.

**שינויים מבניים:**
- `clients` → `tenants` (התנגשות JWT עם Supabase OAuth `client_id`)
- `client_agents` → `tenant_agents`
- `cost_ledger` עם `kind` (reserve/settle/refund)
- `agents.default_thinking_budget` (חדש)
- `agents.default_cache_ttl` (חדש, ברירת מחדל '1h')

**טבלאות חדשות:**
- `user_settings` — `active_tenant_id` ל-tenant switching
- `outbox` — reliable event delivery
- `idempotency_keys` — HTTP-level dedup
- `audit_log` — Israeli A13 compliance

**7 קבצי SQL נוצרו:**
1. `001_reset.sql` — drop Schema 1.0
2. `002_schema.sql` — 16 tables
3. `003_rls.sql` — RLS + 30+ policies
4. `004_grants.sql` — anon/authenticated/service_role
5. `005_functions.sql` — atomic spend cap (reserve/settle/refund) + reaper
6. `006_hook.sql` — Custom Access Token Hook
7. `007_seed.sql` — 9 agents עם **Manager על Sonnet 4.6 + thinking 8000**

**v1 archived:** `supabase/migrations/_archive/v1/`

#### 3. Custom Access Token Hook
- Function: `public.custom_access_token_hook(event jsonb)`
- מזריק `tenant_id` + `is_super_admin` ל-`app_metadata`
- קורא מ-`user_settings.active_tenant_id` עם fallback ל-`memberships`
- **Enabled ב-dashboard** (Authentication → Hooks)

#### 4. App-side updates
- `@supabase/ssr` 0.10.2 verified
- `proxy.ts` נוצר (Next.js 16 middleware)
- 3 Supabase clients עודכנו עם `import "server-only"` guards
- `server-only` package הותקן

#### 5. shadcn/ui RTL native
- `npx shadcn@latest init --preset b0 --template next --rtl`
- Preset b0 בנוי ב-`https://ui.shadcn.com/create`
- Components installed: Button (default)
- `components.json` נוצר
- `src/lib/utils.ts` נוצר

#### 6. globals.css מיזוג
- שמרנו: Heebo, design tokens שלנו, animations
- הוספנו: shadcn CSS variables (`--background`, `--primary`, etc.)
- הפיכה ל-dark-only (`.dark` = `:root`)
- Charts: Spike palette (teal/cyan/blush) במקום grayscale

#### 7. DirectionProvider client wrapper
- `src/components/providers/direction-provider.tsx` (Client)
- `layout.tsx` (Server) מייבא אותו
- `@radix-ui/react-direction` package מאומת

#### 8. DNS migration (לא היה בתוכנית, הושלם בערב)
- ב-JetServer (רשם הדומיין), Nameservers שונו מ-`ns1-4.jetdns.net` ל-`ns1.vercel-dns.com` / `ns2.vercel-dns.com`
- ניסיון התחלתי להוסיף A record (`216.198.79.1`) + CNAME (`www → 90864206393cac85.vercel-dns-017.com.`) ב-JetServer
- JetServer הציג הודעה: "הדומיין לא מפנה אל ה-Nameservers שלהם"
- החלטה: לעבור ל-Vercel DNS במלואו (פחות שכבות, ניהול אחיד)
- DNS propagation הסתיים — Vercel = DNS authority יחיד
- CAA records של Vercel הוגדרו אוטומטית — לא לגעת
- spike-engine מוכן לקבלת subdomains: `app.`, `auth.`, `admin.`, `mail.`

#### 9. Day 2 commit + push (סוף לילה ~23:30)
- 12 קבצים committed ב-commit `3108530`
- 5,509 שורות נוספו, 287 שורות נמחקו
- Pushed ל-`DinSpikeAI/spike-agents-engine` בהצלחה
- ה-7 קבצי SQL migrations + `_archive/v1/` מאומתים מקומית

### בעיות שטופלו ב-Day 2

1. **PowerShell `cd` confusion** — מספר פעמים sub-script רץ מ-`C:\Users\Din\` במקום `spike-engine`. תיקון: כל סקריפט בודק `__dirname.endsWith('spike-engine')`.

2. **`createContext is not a function`** — `<DirectionProvider>` ב-Server Component. תיקון: client wrapper נפרד.

3. **`004_grants.sql` חסר ב-Downloads** — הורד שוב, הועבר.

4. **shadcn b0 preset החליף Inter במקום Heebo** — Heebo לא קיים ברשימה. תיקון: שמרנו Inter, הזרקנו Heebo דרך CSS variable.

5. **shadcn דרס `:root` עם light theme** — תיקון: globals.css מאוחד עם `:root` = dark.

### Files modified ב-Day 2

```
NEW:
  proxy.ts
  src/components/providers/direction-provider.tsx
  src/components/ui/button.tsx
  src/lib/utils.ts
  components.json
  supabase/migrations/001_reset.sql
  supabase/migrations/002_schema.sql
  supabase/migrations/003_rls.sql
  supabase/migrations/005_functions.sql
  supabase/migrations/006_hook.sql
  supabase/migrations/007_seed.sql

MODIFIED:
  src/app/layout.tsx (DirectionProvider import)
  src/app/globals.css (merged shadcn + Spike)
  src/lib/supabase/client.ts (no change actually)
  src/lib/supabase/server.ts (server-only guard)
  src/lib/supabase/admin.ts (server-only guard)
  package.json (server-only, @radix-ui/react-direction)

ARCHIVED:
  supabase/migrations/001_schema.sql → _archive/v1/
  supabase/migrations/002_rls.sql → _archive/v1/
  supabase/migrations/003_seed.sql → _archive/v1/
  supabase/migrations/004_grants.sql → _archive/v1/ (also kept at root, idempotent)
```

### ⏳ הועבר ל-Day 2.5

- [ ] **Resend cleanup** ✅ הוחלף ב: יצירת חשבון Resend חדש, הוספת `auth.spikeai.co.il`
- [ ] Login page עם Magic Link
- [ ] `/auth/callback` route handler
- [ ] Resend setup (auth subdomain) ✅ הושלם ב-Day 2.5
- [ ] Hebrew email template ל-Magic Link
- [ ] Dashboard skeleton placeholder
- [x] Commit + push של כל ה-Day 2 — **הושלם בלילה (commit `3108530`)**

### Verification (סוף Day 2)
- ✅ `localhost:3000` עובד
- ✅ Heebo רנדר נכון
- ✅ Dark theme פעיל
- ✅ RTL נכון
- ✅ "Spike Engine-ל" עם gradient teal→cyan
- ✅ אין errors ב-terminal
- ✅ אין warnings ב-browser console
- ✅ 9 agents ב-DB (verified via SQL)
- ✅ Custom Access Token Hook ENABLED

---

## 🔄 Day 2.5 — 28 באפריל 2026 (יום שלישי) [בעבודה]

**משך:** התחיל ~14:00, ~1.5 שעות עד נקודת התיעוד
**סטטוס:** Resend + DNS הושלם ✅ | Login + dashboard בתור ⏳

### מה הושלם

#### 1. Resend account creation (~14:00)
- חשבון Resend נפתח בהצלחה: `din6915@gmail.com` (Gmail אישי, נחליף בעתיד)
- OAuth דרך GitHub `DinSpikeAI` (read-only email scope)
- אישור: זהו חשבון חדש לחלוטין — לא היה Resend אצל Din לפני זה
- Region נבחר: **Ireland (eu-west-1)** — אין Frankfurt ב-Resend, Ireland הקרוב ביותר
- Latency צפויה ל-Supabase Frankfurt: 30-50ms (סביר)

#### 2. הוספת domain `auth.spikeai.co.il` (~14:02)
- שם: `auth.spikeai.co.il` (subdomain — לא `spikeai.co.il` השורש!)
- Custom Return-Path: `send` (default, שמרנו)
- Tracking Subdomain: `links` (default — לא נשתמש)
- ⚠️ **לא הצלחנו להוריד את "Enable click tracking" ב-creation flow** — הצ'קבוקס מוצג כ-disabled
  - **TODO:** לבדוק Settings אחרי verification → Tracking → uncheck click tracking
  - חשוב: link rewriting שובר Magic Links!

#### 3. בחירת Manual setup (לא Auto configure)
**החלטה:** Manual setup על פני Auto configure.
**הסיבות:**
- Auto configure דורש OAuth ל-Vercel עם הרשאת **כתיבה** ל-DNS — סיכון לדריסת CAA records הקיימים
- Manual נותן visibility מלא לפני שמוסיפים
- לימוד SPF/DKIM ל-DNS records עתידיים

#### 4. הוספת 3 DNS records ב-Vercel (~14:10–14:14)

**Record 1 — DKIM:**
| שדה | ערך |
|---|---|
| Name | `resend._domainkey.auth` |
| Type | TXT |
| Value | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCufc8K/yASUiWk41/RLKa+EetIb9LmHSHTMih/zVtvvur94zj96UViRbQvI11tJR+UOYLlv7spqAKQ54yG6ZNqxtiBkzdZoCnSKKF3uzTZNDwSdlZpKFlN9jjm8U/YHu5ITDVS6PNF6AWZI9+mKvBYhXwc1vrFY/HDb51+m4a6iwIDAQAB` |
| TTL | 60 |

**Record 2 — MX:**
| שדה | ערך |
|---|---|
| Name | `send.auth` |
| Type | MX |
| Value | `feedback-smtp.eu-west-1.amazonses.com` |
| TTL | 60 |
| Priority | **10** ⚠️ חובה |

**Record 3 — SPF:**
| שדה | ערך |
|---|---|
| Name | `send.auth` |
| Type | TXT |
| Value | `v=spf1 include:amazonses.com ~all` |
| TTL | 60 |

**DMARC לא נוסף** — Resend הציע אבל זה היה משפיע על כל `spikeai.co.il` (כולל landing). דחוי ל-Day 13 (compliance).

#### 5. Verification ב-Resend (~14:15–14:17)
- `Domain added` 14:02 → `DNS verified` 14:15 → `Domain verified` 14:17
- **15 דקות בלבד מהוספת records** — מהיר מאוד (ציפיתי עד 24 שעות)
- Domain status: ירוק ✅
- Resend מוכן לשלוח מיילים מ-`auth.spikeai.co.il`

### ⚠️ Issues שטופלו ב-Day 2.5

#### Issue 1 — Vercel: `Invalid request: missing required property 'mxPriority'`
**תסמין:** ניסיון להוסיף MX record נכשל עם error אדום.
**סיבה:** השדה Priority הציג `10` כ-**placeholder** (טקסט אפור) ולא כערך אמיתי. Vercel לא קורא ערכי placeholder.
**פתרון:** להקליד `10` ידנית בשדה Priority (הצבע משתנה לבן כשהערך אמיתי).
**מניעה:** תמיד לוודא שה-placeholder הפך לטקסט אמיתי לפני Add.

#### Issue 2 — Resend חשבון מבולבל
**תסמין:** בתחילת השיחה חשבתי ש-`spikeai.co.il` (השורש) רשום כבר ב-Resend מאתמול.
**סיבה:** Screenshot מ-Vercel Domains הוצג כ-Resend Domains. שני UIs דומים שגורמים בלבול.
**פתרון:** screenshot מ-`resend.com/domains` בלבד הוא המקור-אמת.
**מניעה:** תמיד לוודא URL בכותרת ה-tab לפני שמדברים על "Resend".

#### Issue 3 — Google Gmail signup blocked
**תסמין:** ניסיון ליצור `spikeagents@gmail.com` חדש נחסם ב-"This phone number has been used too many times".
**סיבה:** מספר הטלפון של Din משויך ל-3+ חשבונות Gmail (`din6915`, `spikeaistudio`, אולי עוד).
**פתרון:** ממשיכים עם `din6915@gmail.com` (אישי) לעת עתה. נחליף ב-Resend Settings בעתיד כשנגיע ל-Pro/Business plan.
**מניעה:** לעתיד — ל-projects חדשים, להשתמש בטלפון אחר ל-verification או email forwarding ב-Gmail.

### Files modified ב-Day 2.5

```
NO CODE FILES YET (רק configuration ב-Vercel + Resend, ב-DNS records)

DNS records hosted in Vercel for spikeai.co.il:
  + resend._domainkey.auth (TXT)
  + send.auth (MX, priority 10)
  + send.auth (TXT, SPF)

Existing CAA records (auto, do not modify):
  pki.goog
  sectigo.com
  letsencrypt.org
```

### ⏳ נשאר ב-Day 2.5

- [ ] Click tracking OFF ב-Resend Settings (עכשיו שיש verification)
- [ ] Resend → Supabase Auth SMTP integration
  - Supabase Dashboard → Authentication → Email Settings → SMTP
  - Resend SMTP credentials
- [ ] Hebrew Magic Link template ב-Supabase
  - Subject חייב להתחיל באות עברית (לא emoji)
  - Body: RTL, system fonts only
- [ ] Login page (`src/app/(auth)/login/page.tsx`)
  - Hebrew form עם Zod
  - Server Action `signInWithOtp()`
  - State: idle/sending/sent/error
  - Sonner toasts
  - **חשוב:** `<Input type="email" dir="ltr">` (אחרת ה-email מתהפך)
- [ ] `/auth/callback/route.ts`
  - `exchangeCodeForSession(code)`
  - Redirect to `/dashboard` או `?next=`
- [ ] `/auth/error/page.tsx`
- [ ] Dashboard skeleton (`src/app/dashboard/page.tsx`)
  - Hebrew greeting
  - 9 agent cards placeholder
- [ ] Commit + push ל-`spike-agents-engine`
- [ ] Documentation push ל-`spike-agents` (private docs repo)

### Verification (אמצע Day 2.5)
- ✅ Resend חשבון פעיל
- ✅ Domain `auth.spikeai.co.il` verified
- ✅ 3 DNS records חיים ב-Vercel
- ✅ propagation מהיר (15 דק')
- ⏳ עוד לא נשלח email טסט (יקרה אחרי SMTP integration)

### Lessons (Day 2.5)
- DNS verification לא תמיד לוקח שעות — לפעמים 15 דק'
- Vercel placeholders יוצרים false sense of completion — תמיד לוודא ערך אמיתי
- שני Tabs דומים (Vercel Domains / Resend Domains) יוצרים בלבול — תמיד לבדוק URL
- Manual setup > Auto configure כשעובדים על dns שכבר יש בו records חשובים
- Region של Resend חייב להיות EU (Ireland) לא US — ישראל גם תחת GDPR

---

## ⏳ Day 3 — מתוכנן

ראה `03_ROADMAP_DAYS_3_TO_14.md`

---

## Template ליום חדש

```markdown
## ✅ Day X — DD בחודש 2026 (יום הX)

**משך:**
**סטטוס:** הושלם / חלקי / נחסם
**Commit:**

### מה הושלם
1. ...

### Issues שטופלו
1. ...

### Files modified
NEW: ...
MODIFIED: ...

### ⏳ לא הושלם
- [ ] ...

### Verification
- ✅ ...

### Lessons
- ...
```
