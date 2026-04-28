# 🛠️ Spike Agents — Technical Stack Deep-Dive

> **מטרה:** כל ההחלטות הטכניות, למה, מתי לא לשנות. הקובץ הזה הוא ה"חוקה" של הסטאק.

---

## 1. Frontend

### Next.js 16.2.4 LTS (לא 17, לא 15)

**למה 16.2.4 ספציפי:**
- 16.0 הוסיף `proxy.ts` במקום `middleware.ts` (Edge → Node default)
- 16.2.4 כולל patches ל-CVE-2026-29057, CVE-2026-23869, CVE-2025-66478
- אין Next 17 עדיין באפריל 2026

**מה לא לשנות:**
- `proxy.ts` הוא הקובץ שמרענן Supabase session — לא להחליף ל-middleware.ts
- `runtime: 'nodejs'` בכל route שקורא ל-Anthropic — Edge שובר את ה-SDK

### Tailwind v4 + shadcn/ui (preset b0)

**הותקן עם:**
```bash
npx shadcn@latest init --preset b0 --template next --rtl
```

**Preset b0 מקושר לחשבון של Din ב-shadcn.com** — אם הוא יימחק, הסטיילים לא יקראו אבל הקוד יעבוד. תמיד אפשר לבחור preset חדש דרך https://ui.shadcn.com/create

**למה shadcn ולא Mantine/Chakra:**
- copy-paste ownership של הקוד (אין dependency)
- RTL native מינואר 2026
- Tailwind v4 ready
- הקהילה הגדולה ביותר ב-2026

### Heebo font

```ts
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heebo",
  display: "swap",
});
```

**אלטרנטיבות שנדחו:** Assistant (פחות מודרני), Rubik (פחות נקי), Noto Sans Hebrew (טוב אבל פחות israeli-tech feel).

### RTL strategy

3 שכבות, כולן חובה:
1. `<html lang="he" dir="rtl">` — base direction
2. shadcn `--rtl` flag — physical→logical classes (`ml-` → `ms-`)
3. `<DirectionProvider>` (Radix) — portals (Dialog, Popover, etc.)

**אסור להוריד אחת מהן** — באג שתגלה רק כשמישהו פותח dropdown.

---

## 2. Backend (Supabase)

### Project: `ihzahyzejqpjxwouxuhj`

**Region:** Frankfurt (`eu-central-1`)
- GDPR-friendly
- Israel→Frankfurt latency ~50-80ms
- אדרהqואטיות ל-EU עצמה

**Plan:** Free tier כרגע, → Pro $25/חודש + PITR $100/חודש ב-**Day 14, לפני לקוח ראשון**

### Schema 2.0 (16 טבלאות)

ראה `04_DATABASE_SCHEMA.md` לפרטים מלאים. הקצרה:

```
tenants                    user_settings           memberships
agents (global)            agent_prompts           tenant_agents
agent_runs                 drafts                  integrations
notifications              events                  cost_ledger
system_alerts              outbox                  idempotency_keys
audit_log
```

### Authentication

**Method:** Magic Link עם Resend
**Hook:** `custom_access_token_hook` (Postgres function)
- מזריק `tenant_id` + `is_super_admin` ל-`app_metadata`
- קורא מ-`user_settings.active_tenant_id` עם fallback ל-`memberships`
- **חובה enabled מה-dashboard** (אנחנו עשינו את זה ב-Day 2)

**RLS pattern:**
```sql
using ( tenant_id = (select public.current_tenant_id()) )
```
- `(select ...)` wrap מפעיל initPlan — evaluates once per query
- helper functions stable + security definer
- כל policy גם super_admin override

### Cost cap (atomic)

3 פונקציות, כל אחת idempotent:
1. `reserve_spend(tenant, run, agent, estimate)` — לפני Anthropic call
2. `settle_spend(run, actual, tokens...)` — אחרי הצלחה
3. `refund_spend(run, reason)` — אחרי כשלון

**Unique partial indexes** מבטיחים idempotency:
```sql
create unique index cost_ledger_settle_uniq
  on cost_ledger(agent_run_id) where kind = 'settle';
```

**אסור** לדלג על reserve. לקוח שיחרוג = מערכת נופלת.

### Realtime

**Pattern:** Broadcast (NOT Postgres Changes)
- topic: `tenant:<id>:agent_runs`
- DB trigger קורא ל-`realtime.broadcast_changes()`
- client subscribe עם `{ config: { private: true } }`
- חובה לקרוא ל-`supabase.realtime.setAuth(token)` לפני subscribe

**למה לא Postgres Changes:** single-thread bottleneck, Supabase docs ממליצים נגד.

---

## 3. Compute (Vercel)

### Plan
- Hobby עכשיו (free)
- Pro $20/חודש כשנגיע ל-`maxDuration > 60s` (Day 4)
- Pro גם נדרש ל-Cron jobs production-grade

### Runtime config (חובה לכל route שקורא ל-Anthropic)
```ts
export const runtime = 'nodejs';        // לא Edge!
export const maxDuration = 800;         // 13 דקות (Pro)
export const preferredRegion = 'iad1';  // Anthropic-friendly
```

### Fluid Compute caveat
**process state shared between requests** — ה-instance חי בין tenants.
**אסור:**
- ליצור Supabase client במ-module scope (יזלוג JWT)
- לאחסן in-memory cache ללא tenant key
- לאמן ב-`process.env` לדינמיות (immutable)

---

## 4. Queue (QStash)

### Plan
- Free tier: 500 messages/day, 1000 schedules
- מספיק עד ~50 לקוחות

### Patterns שאנחנו חייבים

**Idempotency:**
```ts
publishJSON({
  url: 'https://app.spikeai.co.il/api/agents/run',
  body: { run_id, tenant_id, agent_id },
  deduplicationId: `agent-run:${run_id}`,
});
```

**Signature verification (חובה!):**
```ts
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
export const POST = verifySignatureAppRouter(handler);
```

**Stale claim reaper** (pg_cron):
- Every 5 minutes
- `update agent_runs set status='failed' where status='running' and started_at < now() - interval '20 minutes'`
- ויחד עם זה: `refund_spend(run_id)` כדי לשחרר reservation

---

## 5. AI (Anthropic)

### Models (sticky decisions)

| Agent | Model | Thinking | Cache TTL |
|---|---|---|---|
| Morning | `claude-haiku-4-5` | – | `1h` |
| Reviews | `claude-sonnet-4-6` | – | `1h` |
| Social | `claude-sonnet-4-6` | – | `1h` |
| **Manager** | **`claude-sonnet-4-6`** | **8000** | `1h` |
| Watcher | `claude-haiku-4-5` | – | `5m` |
| Cleanup | `claude-haiku-4-5` | – | `1h` |
| Sales | `claude-sonnet-4-6` | – | `1h` |
| Inventory | `claude-haiku-4-5` | 2048 | `1h` |
| Hot leads | `claude-haiku-4-5` | – | `5m` |

**למה Manager על Sonnet ולא Opus:**
- Opus 4.7 = $5/$25 (כמו $5/$25 של Opus 4.6)
- Opus 4.7 tokenizer חדש מנפח עברית ב-25-35%
- Sonnet 4.6 + thinking 8000 = 95% מהאיכות, 60% מהעלות
- **Opus שמור ל-Business tier בלבד** ($999) — differentiator

### Pricing (אומת אפריל 2026)

| Model | Input | Output | Cache 5m | Cache 1h | Cache Read |
|---|---|---|---|---|---|
| Haiku 4.5 | $1 | $5 | $1.25 | $2 | $0.10 |
| Sonnet 4.6 | $3 | $15 | $3.75 | $6 | $0.30 |
| Opus 4.7 | $5 | $25 | $6.25 | $10 | $0.50 |

**Cache reads = 0.1× input** = חיסכון של 90% על system prompts חוזרים.

### Output: Native JSON Schema (NOT tool_use)

```ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  output_config: {
    format: {
      type: 'json_schema',
      schema: { /* Zod-derived JSON Schema */ }
    }
  },
  messages: [...],
});
```

**אסור:**
- `tool_use` כ-output mechanism (deprecated דרך)
- prefilling עם `assistant: '{'` (לא עובד על Opus 4.6/4.7, Sonnet 4.6)

### Caching: ttl: "1h" מפורש (תמיד)

```ts
{
  type: 'text',
  text: SYSTEM_PROMPT,
  cache_control: { type: 'ephemeral', ttl: '1h' }  // לא ttl default!
}
```

**Anthropic הורידו את ה-default ל-5min ב-March 2026 בלי הודעה.** 1h הוא 4× יקר ל-cache write אבל פי 12 יותר חיסכון בהמשך.

### Order of cache breakpoints (אם יש כמה)
1. Tools (most stable)
2. System prompt
3. Per-tenant config
4. User message (least)

---

## 6. Email (Resend)

### Current account (Day 2.5)
- **Account email:** `din6915@gmail.com` (אישי, יוחלף בעתיד)
- **Region:** Ireland (eu-west-1) — אין Frankfurt ב-Resend
- **Verified domain:** `auth.spikeai.co.il` ✅ (28.4.2026 14:17)
- **GitHub OAuth:** `DinSpikeAI` (read-only email scope)

### Domain setup
- **Auth subdomain:** `auth.spikeai.co.il` (Magic Links + transactional)
- **Marketing subdomain:** `mail.spikeai.co.il` (newsletter, alerts)
- **NEVER mix them** — marketing complaint = auth deliverability dies

### Critical settings
- **Click tracking OFF** ב-`auth.spikeai.co.il` — link rewriting שובר Magic Links
- **DMARC `p=quarantine; pct=100`** מינימום
- **EU region** ל-shipping (לא us-east-1)

### Templates
- Hebrew RTL (`dir="rtl"` על body וגם על כל `<table>`)
- System fonts בלבד — `'Segoe UI', 'Arial Hebrew', 'David', Arial`
- Subject חייב להתחיל באות עברית, לא emoji
- 102KB Gmail clip — UTF-8 hebrew בעיה

### Cold start warm-up
- 50→500→5000/day across 2-3 weeks
- **התחל ב-Day 8** לא ב-Day 14
- אחרת לא תוכל לשלוח ל-mass של ישראלים בזמן

---

## 6.5. DNS & Domains

### Domain ownership
- **Registrar:** JetServer (ישראלי, חידוש שנתי)
- **DNS provider:** Vercel (מאז Day 2 evening, 27.4.2026)
- **Nameservers:** `ns1.vercel-dns.com`, `ns2.vercel-dns.com`

### Subdomain map (current state)

**Active:**
- `spikeai.co.il` (root) → landing repo (`spike-agents`), redirect ל-`www.`
- `www.spikeai.co.il` → landing
- **`auth.spikeai.co.il` → Resend transactional (Magic Links)** — ✅ verified 28.4.2026 14:17

**Planned:**
- `app.spikeai.co.il` → engine SaaS (זה אנחנו!) — לחבר ב-Day 2.5/Day 3
- `mail.spikeai.co.il` → Resend marketing (עתידי, Day 8+)
- `admin.spikeai.co.il` → super-admin dashboard (Day 9)
- `api.spikeai.co.il` → public API (Phase 2)

### DNS records (current — `spikeai.co.il`)

**CAA (auto, לא לגעת):**
```
CAA 0 issue "pki.goog"
CAA 0 issue "sectigo.com"
CAA 0 issue "letsencrypt.org"
```

**Resend (Day 2.5):**
```
TXT  resend._domainkey.auth   p=MIGfMA0GCSqGSIb...IDAQAB    TTL 60
MX   send.auth                feedback-smtp.eu-west-1.amazonses.com    TTL 60   Priority 10
TXT  send.auth                v=spf1 include:amazonses.com ~all    TTL 60
```

### כללי ברזל
- ❌ **לעולם** לא לערוך DNS דרך JetServer (השינויים שם מתעלמים)
- ✅ **תמיד** לערוך דרך Vercel → Settings → Domains
- ✅ verification: `https://www.whatsmydns.net/#NS/spikeai.co.il` — חייב להראות `vercel-dns.com`
- ⚠️ MX records ב-Vercel: ערך `Priority` חייב להיות **מוקלד ידנית** (placeholder לא נחשב!)

### למה Vercel ולא Cloudflare
- כבר קונקטד אוטומטית ל-Vercel hosting
- אינטגרציה native עם Vercel deployments
- חינמי במלואו עד אינסוף traffic
- Cloudflare = יותר control אבל שכבה נוספת לתחזק

### היסטוריה
- **Day 1-2 morning (26-27.4.2026):** הדומיין נרשם ב-JetServer. Nameservers דיפולטיים של JetServer (`ns1-4.jetdns.net`)
- **Day 2 evening (27.4.2026):** ניסיון להוסיף A record ב-JetServer DNS — נכשל כי ה-nameservers לא הצביעו ל-JetServer DNS שלהם
- **Day 2 evening:** החלטה לעבור ל-Vercel DNS במלואו. Nameservers שונו ל-`vercel-dns.com`
- **Day 2 night:** propagation הסתיים. Vercel = single source of truth ל-DNS
- **Day 2.5 (28.4.2026 14:00–14:17):** הוספת `auth.spikeai.co.il` ל-Resend, 3 DNS records ב-Vercel, verification מלא ב-15 דקות

---

## 7. Secrets management

### Day 1-13: `.env.local` (תקין זמנית)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...           ⚠️ secret!
ANTHROPIC_API_KEY=...                    ⚠️ secret!
QSTASH_TOKEN=...                         ⚠️ secret!
QSTASH_CURRENT_SIGNING_KEY=...           ⚠️ secret!
QSTASH_NEXT_SIGNING_KEY=...              ⚠️ secret!
RESEND_API_KEY=...                       ⚠️ secret!
```

### Day 14+: Doppler או Infisical
**למה לא Vercel env vars:** OAuth supply-chain breach בפברואר 2026. עדיף secret manager ייעודי.

**Free tiers מספיקים:**
- Doppler: 5 users, 3 projects
- Infisical: 5 users, unlimited projects

---

## 8. Observability (Day 9+)

### Sentry Team ($26/חודש)
```ts
Sentry.setTags({ tenant_id, agent_id, run_id, model });
```

### Langfuse Cloud Core ($29/חודש + ~$24 overage)
```ts
@observe()
async function runMorningAgent() { ... }
// userId = tenant_id ל-grouping
```

### Postgres materialized view (free)
```sql
create materialized view agent_perf_5m as
select tenant_id, agent_id, ...
group by tenant_id, agent_id, time_bucket('5 minutes', started_at);

-- pg_cron refresh כל 5 דק'
```

---

## 9. Israeli compliance

### Accessibility (תקן 5568)
- **WCAG 2.1 AA** target (2.0 AA legal floor)
- Audit חובה **לפני** first paying customer
- הצהרת נגישות ב-`/accessibility` (10 רכיבים חובה)
- NVDA + Hebrew SAPI5 + VoiceOver iOS

### Privacy (חוק A13, אוגוסט 2025)
- Hebrew privacy notice ב-`/privacy`
- Explicit consent (granular)
- Breach notification "מיד"
- 30-day response on data subject requests

### Email (חוק הספאם)
- "פרסומת" בכותרת (marketing only)
- One-click unsubscribe
- שם השולח, ת.ז./ח.פ., כתובת

### Payments
- **PayPlus** (Stripe Israel עדיין לא acquirer ב-2026)
- **Bit support חובה** (90% מהלקוחות מצפים)
- **Greeninvoice POPULAR** ל-invoicing (₪59/חודש)
- Type 320 (חשבונית מס-קבלה) ל-subscriptions

---

## 10. Decisions שדחינו ל-post-MVP

- Voice mode (ElevenLabs Hebrew) — איכות לא מספיק
- Drizzle ORM — RLS bypass risk
- DictaLM 3.0 self-hosted — Claude מספיק
- Custom Hebrew TTS — דחוי
- Highlight.io / OpenReplay — Sentry מספיק
- Braintrust — Langfuse מספיק עד 50 לקוחות
- Supabase Branches — נחמד אבל לא קריטי ל-MVP
- Edge Functions — Fluid Compute מנצח

---

**אם משהו ב-stack לא מסתדר עם המסמך הזה — עצור ושאל את Din לפני שאתה משנה.**
