# 🗺️ Spike Agents — Roadmap Days 2.5 → 14

> **תוכנית מפורטת לכל יום עד launch.** עם concrete tasks, file paths, ו-checkpoints.

---

## Day 2.5 — סיום Day 2 (3-4 שעות)

**יעד:** סיום login + dashboard skeleton + commit.

### Tasks

#### 1. Resend setup (45 דק')
- [ ] רישום ב-`resend.com` (אם עוד לא נעשה)
- [ ] הוספת domain `auth.spikeai.co.il`
- [ ] DNS records: SPF, DKIM, DMARC `p=quarantine; pct=100`
- [ ] **Disable click tracking** ב-domain settings ⚠️ קריטי ל-Magic Links
- [ ] **EU region** עבור delivery
- [ ] שמירת API key ב-`.env.local`: `RESEND_API_KEY=...`
- [ ] חיבור Resend ל-Supabase Auth (Authentication → Email Settings → SMTP)

#### 2. Hebrew Magic Link template (30 דק')
- [ ] Supabase Dashboard → Authentication → Email Templates → "Magic Link"
- [ ] Template עברי:
  ```html
  <!DOCTYPE html>
  <html lang="he" dir="rtl">
  <body style="font-family: 'Segoe UI', 'Arial Hebrew', 'David', Arial; direction: rtl; text-align: right;">
    <h1>שלום {{ .Email }},</h1>
    <p>לחץ על הקישור כדי להתחבר ל-Spike Agents:</p>
    <a href="{{ .ConfirmationURL }}">התחבר ל-Spike</a>
    <p>הקישור תקף ל-1 שעה.</p>
  </body>
  </html>
  ```
- [ ] Subject: "התחברות ל-Spike Agents" (עברית בהתחלה — חובה ל-RTL)

#### 3. Login page (60 דק')
- [ ] `src/app/(auth)/login/page.tsx`:
  - Hebrew form: "כתובת מייל" + "שלח לי קישור"
  - Validation עם Zod
  - Server Action שקוראת ל-`supabase.auth.signInWithOtp()`
  - State: idle / sending / sent / error
  - אחרי שליחה: "שלחנו לך מייל. בדוק את התיבה שלך."
- [ ] Components: Card, Input, Label, Button (shadcn)
- [ ] התקן: `npx shadcn@latest add card input label sonner`

#### 4. Auth callback (30 דק')
- [ ] `src/app/auth/callback/route.ts`:
  - GET handler
  - `supabase.auth.exchangeCodeForSession(code)`
  - Redirect ל-`/dashboard` או ל-`?next=` parameter
  - Error handling — redirect ל-`/auth/error`
- [ ] `src/app/auth/error/page.tsx` — Hebrew error page

#### 5. Dashboard skeleton (30 דק')
- [ ] `src/app/dashboard/page.tsx` (Server Component):
  - Get user via `await createClient().auth.getUser()`
  - Hebrew greeting: "בוקר טוב, [שם]" (gendered if `user_settings.gender_preference` set)
  - 9 agent cards (placeholder, lookup `tenant_agents`)
  - "אין לך עדיין tenant" → onboarding wizard CTA
- [ ] Layout עם sidebar (placeholder)

#### 6. pgTAP RLS isolation tests (30 דק', אופציונלי לDay 3)
- [ ] `supabase/tests/rls/010_tenant_isolation.sql`
- [ ] שני test users, שני tenants
- [ ] `tests.rls_enabled('public')` — fail-build על טבלה ללא RLS
- [ ] Run via `supabase test db`
- [ ] Add to CI later

#### 7. Commit + push (10 דק')
```bash
git add .
git commit -m "feat(day2): auth + dashboard skeleton

- Login page with Magic Link (Hebrew RTL form)
- Auth callback handler
- Dashboard skeleton with 9 agent cards
- Resend integration (auth subdomain)
- Hebrew email template for Magic Link
- pgTAP tenant isolation tests"
git push
```

### Checkpoints
- [ ] Login page נטען בלי errors
- [ ] שלחתי מייל לעצמי, קיבלתי, לחצתי, הגעתי ל-dashboard
- [ ] User ב-`auth.users` ב-Supabase
- [ ] (No `tenant_id` ב-JWT עדיין כי אין `memberships` row — צפוי, נטופל ב-onboarding)

---

## Day 3 — Morning Agent End-to-End

**יעד:** סוכן בוקר עובד מקצה לקצה — manual trigger מהדשבורד מחזיר briefing אמיתי.

### Tasks

#### 1. Anthropic SDK setup (15 דק')
- [ ] `npm install @anthropic-ai/sdk@latest`
- [ ] `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`
- [ ] `src/lib/anthropic.ts` — singleton client (server-only)

#### 2. Shared agent infrastructure (90 דק')
זו ה-**קוד שכל 9 הסוכנים יחלקו**. בנייה אחת, שימוש 9 פעמים.

- [ ] `src/lib/agents/run-agent.ts`:
  ```ts
  export async function runAgent({ tenantId, agentId, input }) {
    // 1. Generate runId (UUID)
    // 2. Insert agent_runs row (status='running')
    // 3. Estimate cost
    // 4. reserve_spend(tenant, run, agent, estimate)
    //    → if false: insert failed run, return
    // 5. Call Anthropic with native JSON Schema + cache_control 1h
    // 6. settle_spend(run, actual)
    // 7. Update agent_runs (status='succeeded', output)
    // 8. enqueue_outbox_event(run.completed)
    // 9. catch: refund_spend + update status='failed'
  }
  ```
- [ ] `src/lib/agents/types.ts` — TypeScript types matching DB schema
- [ ] `src/lib/agents/cost-estimator.ts` — heuristic by model + input length

#### 3. Morning agent (60 דק')
- [ ] `src/lib/agents/morning/prompt.ts` — full Hebrew system prompt
- [ ] `src/lib/agents/morning/schema.ts` — Zod schema → JSON Schema
- [ ] `src/lib/agents/morning/run.ts` — implementation:
  ```ts
  export async function runMorningAgent(tenantId: string) {
    const tenant = await getTenant(tenantId);
    const yesterdayData = await fetchYesterdayMetrics(tenantId);
    return runAgent({
      tenantId,
      agentId: 'morning',
      input: { tenant, yesterdayData },
      systemPrompt: buildMorningPrompt(tenant),
      outputSchema: MorningOutputSchema,
    });
  }
  ```

#### 4. Manual trigger UI (30 דק')
- [ ] `src/app/dashboard/page.tsx` — כפתור "הרץ עכשיו" על agent card
- [ ] Server Action: `triggerAgentNow(agentId)`
- [ ] Toast confirmation עם Sonner

#### 5. Test end-to-end (30 דק')
- [ ] לחיצה על "הרץ עכשיו" של בוקר
- [ ] Anthropic API call
- [ ] תשובה JSON תקינה
- [ ] `agent_runs.status = 'succeeded'`
- [ ] `cost_ledger` יש שורה settle
- [ ] `tenants.spend_used_ils` עלה

### Checkpoints
- [ ] Morning agent מחזיר briefing עברי תקין
- [ ] Cost ledger מתעדכן
- [ ] Spend cap כעובד (נסה לקבוע cap נמוך מאוד, ראה שזה חוסם)

---

## Day 4 — Master Scheduler + QStash

**יעד:** סוכנים רצים אוטומטית לפי schedule, לא רק ידנית.

### Tasks

1. **QStash setup** — Upstash account, FREE tier, schedules
2. **Master scheduler** ב-`src/app/api/cron/schedule/route.ts`:
   - Vercel cron כל 5 דק'
   - שאילתת `tenant_agents` עם `next_run_at <= now()`
   - `await qstash.publishJSON(...)` לכל אחד עם `deduplicationId: 'agent-run:' + runId`
3. **Consumer** ב-`src/app/api/agents/run/route.ts`:
   - `verifySignatureAppRouter(handler)`
   - `runAgent({ tenantId, agentId, runId })`
4. **Mid-stream cost check** — token counter callback
5. **Realtime Broadcast** — DB trigger `notify_run_complete`
6. **Frontend subscribe** — `useEffect` עם `supabase.channel('tenant:X:runs').setAuth(...)`
7. **Sentry init** — `Sentry.init` + `setTags({ tenant_id, agent_id, run_id })`
8. **Langfuse init** — `@observe()` decorators

### Checkpoints
- [ ] Morning agent רץ אוטומטית ב-7:00 (ללקוח דמה)
- [ ] Dashboard מתעדכן בזמן אמת
- [ ] Sentry מקבל event על כשלון יזום
- [ ] Langfuse מציג trace

---

## Day 5 — Reviews Agent + Drafts Approval

**יעד:** ביקורות נכנסות → טיוטה → אישור בלחיצה → נשלח.

### Tasks

1. **Google Business Profile webhook** — receive new reviews
2. **Insert ל-`events` table** (idempotent ע"י external event ID)
3. **Reviews agent** (Sonnet 4.6):
   - Input: review text + business context
   - Output: `{sentiment, response_he, requires_human_review}`
4. **Insert ל-`drafts` table** (status='pending')
5. **Drawer UI:**
   - shadcn `Sheet` component
   - List of pending drafts
   - Click → open drawer with full draft + edit textarea
   - "אשר ושלח" / "דחה" / "ערוך" buttons
6. **Send action:**
   - `drafts.status = 'approved'`
   - Outbox event → external posting service

### Checkpoints
- [ ] ביקורת חדשה מגיעה
- [ ] תוך דקה — טיוטה ב-drafts
- [ ] לחיצה על "אשר" → נשלח ל-Google
- [ ] Audit log רושם את הפעולה

---

## Day 6 — Social, Sales, Hot Leads

**יעד:** 3 סוכנים נוספים בייצור.

### Tasks

1. **Social agent (Sonnet 4.6, Batch API):**
   - 3 פוסטים/יום
   - **Batch API** (50% הנחה, 24h SLA — מתאים)
   - Output: array of 3 posts
2. **Sales agent (Sonnet 4.6):**
   - Cached brand voice (1h TTL)
   - Input: deal details
   - Output: follow-up email draft
3. **Hot leads agent (Haiku 4.5):**
   - **BUCKETED schema** (`cold/warm/hot/burning`)
   - NOT freeform 0-100
   - Score signals: recency, engagement, fit, intent
4. **Inbox page** — aggregates drafts מכל הסוכנים

### Checkpoints
- [ ] 3 פוסטים בעברית, batch processing עובד
- [ ] Sales follow-up draft נראה כמו טקסט אמיתי
- [ ] Hot leads bucket מתפלג נכון (לא הכל "warm")

---

## Day 7 — Manager, Watcher, Cleanup, Inventory

**יעד:** כל 9 הסוכנים פעילים.

### Tasks

1. **Manager agent (Sonnet 4.6 + thinking 8000):**
   - 19:00 daily summary
   - Cross-references all other agents' output
   - Output: headline + decisions + red flags + opportunities
2. **Watcher agent (Haiku 4.5, 5m cache):**
   - Real-time event triage
   - Decides: alert / queue / ignore
   - Streaming response, low effort
3. **Cleanup agent (Haiku 4.5):**
   - Sunday 9:00
   - Stale leads, duplicates, missing follow-ups
4. **Inventory agent (Haiku 4.5 + thinking 2048):**
   - Daily 8:00
   - Demand forecasting
5. **Circuit breakers:**
   - 60s `AbortController` timeout
   - 3 consecutive failures per (tenant, agent) → open circuit
   - Auto-reset after 1h

### Checkpoints
- [ ] כל 9 הסוכנים רצים על schedule
- [ ] Manager summary נקרא טוב בעברית
- [ ] Circuit breaker פותח אחרי 3 כשלונות

---

## Day 8 — Onboarding + Email + Payments

**יעד:** משתמש חדש יכול להירשם, להגדיר עסק, ולהפעיל סוכנים.

### Tasks

1. **Signup wizard** (3 שלבים):
   - שלב 1: פרטי עסק (שם, סוג, אזור)
   - שלב 2: **Gender preference** (זכר/נקבה/רבים) — קריטי ל-LLM output
   - שלב 3: בחירת סוכנים פעילים (Starter = 4, Pro/Business = 9)
2. **`tenants` insert** + **`memberships` insert** + **`tenant_agents` inserts**
3. **Refresh JWT** — `supabase.auth.refreshSession()` כדי לקבל `tenant_id`
4. **Resend cold-start warm-up** — מתחיל עכשיו, לא ב-Day 14
5. **PayPlus merchant application** — 1-2 שבועות underwriting, מתחיל עכשיו
6. **Greeninvoice POPULAR plan** ($59/חודש) — register

### Checkpoints
- [ ] משתמש חדש יוצר tenant ומגיע ל-dashboard
- [ ] JWT מכיל `tenant_id` נכון
- [ ] קיבלתי email warmup מ-Resend
- [ ] PayPlus application submitted

---

## Day 9 — Admin Dashboard (admin.spikeai.co.il)

**יעד:** Dean רואה את כל הלקוחות ויכול להתערב.

### Tasks

1. **Subdomain routing** — `admin.spikeai.co.il`
2. **`/admin` route group** — RLS check + `is_super_admin`
3. **Tenants table** — list + spend + last_active
4. **Cost ledger view** — חיתוכים לפי tenant/agent/month
5. **Materialized view `agent_perf_5m`** + pg_cron refresh
6. **Manual interventions:**
   - Force-trigger agent
   - Reset spend cap
   - Pause tenant
7. **Daily cron** — 3 כשלונות רצופים → Telegram alert ל-Dean
8. **Sentry tags** + Axiom logs per tenant

### Checkpoints
- [ ] `admin.spikeai.co.il` עובד, only super_admin
- [ ] רואה את כל הלקוחות
- [ ] יכול להפעיל סוכן ידנית
- [ ] Telegram alert בודק עובד

---

## Day 10 — Polish + Israeli Accessibility

**יעד:** WCAG 2.1 AA + תקן 5568 compliance.

### Tasks

1. **NVDA + Hebrew SAPI5 audit** — כל מסך
2. **VoiceOver iOS audit** — כל מסך
3. **`/accessibility` page** — הצהרת נגישות בעברית, 10 רכיבים חובה:
   - רמת תאימות
   - היקף
   - אמצעי נגישות
   - דפדפנים נתמכים
   - מגבלות ידועות
   - תאריך ביקורת אחרונה
   - מבקר
   - **רכז נגישות** (אם 25+ עובדים — לא רלוונטי כרגע)
   - **פרטי קשר** (טלפון, מייל, כתובת, התחייבות תגובה תוך 30 יום)
   - מקור החוק
4. **WCAG 2.1 AA fixes:**
   - Color contrast (4.5:1 לטקסט, 3:1 ל-UI)
   - Keyboard navigation
   - ARIA labels
   - Form errors מקושרים
   - Focus indicators ברורים
5. **Empty states + loading + error** — לכל מסך
6. **pgTAP RLS suite** ב-CI — fail-build על טבלה ללא RLS

### Checkpoints
- [ ] Audit עבר עם NVDA
- [ ] `/accessibility` published
- [ ] CI fails אם נוסיף טבלה ללא RLS

---

## Days 11-14 — Pre-Launch Hardening

### Day 11 — Supabase Pro + PITR
- [ ] Upgrade ל-$25/חודש
- [ ] Enable PITR ($100/חודש)
- [ ] Test restore ב-staging branch

### Day 12 — Secrets migration ל-Doppler/Infisical
- [ ] רישום Doppler או Infisical (Free tier)
- [ ] העברת כל ה-secrets מ-`.env.local`
- [ ] Vercel integration
- [ ] **לא להסיר מ-`.env.local` עד שעובד ב-prod**

### Day 13 — Compliance docs
- [ ] **Privacy Notice (חוק A13)** ב-`/privacy`
- [ ] **Terms of Service** ב-`/terms`
- [ ] **DPA agreements** חתומים:
  - Anthropic
  - Supabase
  - Vercel
  - Resend
  - Upstash
- [ ] **Subprocessors page** ב-`/subprocessors`
- [ ] Greeninvoice integration ל-invoicing

### Day 14 — First customer onboarding
- [ ] Final security audit
- [ ] Smoke tests של כל ה-9 סוכנים
- [ ] Manual run של כל אחד מהם
- [ ] First real client (לקוח 1) onboarded
- [ ] Week 1 of monitoring

---

## Templates ל-tasks

```markdown
### Task X.Y — שם המשימה

**משך משוער:**
**Dependencies:**
**Files:**
- NEW: ...
- MODIFIED: ...

**Steps:**
1. ...

**Checkpoint:**
- [ ] ...
```
