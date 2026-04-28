# 🗄️ Spike Agents — Database Schema Reference

> **מבנה ה-DB המלא של Schema 2.0.** עדכן בסוף כל migration.

---

## 1. Project info

- **Project ref:** `ihzahyzejqpjxwouxuhj`
- **URL:** `https://ihzahyzejqpjxwouxuhj.supabase.co`
- **Region:** Frankfurt (`eu-central-1`)
- **Plan:** Free → Pro+PITR ב-Day 14
- **Schema version:** 2.0 (מ-27.4.2026)

---

## 2. 16 הטבלאות

### Core multi-tenancy

#### `tenants` (was `clients`)
שורש ה-multi-tenancy. כל שורה = עסק ישראלי אחד.

```sql
id uuid primary key default gen_random_uuid()
name text not null
business_type text                              -- מסעדה, חנות, וכו'
status text not null default 'trial'           -- trial | active | paused | churned
config jsonb not null default '{}'             -- per-tenant settings
spend_cap_ils numeric(10,2) not null default 250
spend_used_ils numeric(10,4) not null default 0     -- already settled
spend_reserved_ils numeric(10,4) not null default 0 -- reserved, not yet settled
spend_period_start date not null default date_trunc('month', now())::date
created_at timestamptz default now()
updated_at timestamptz default now()

CHECK: spend_used_ils + spend_reserved_ils <= spend_cap_ils
```

**Important:** ה-CHECK constraint הוא הגנה אחרונה. הלוגיקה האטומית של reserve_spend אמורה לחסום קודם.

#### `memberships`
many-to-many — user ↔ tenant. יוזם יכול להיות חבר במספר tenants.

```sql
user_id uuid → auth.users(id) on delete cascade
tenant_id uuid → tenants(id) on delete cascade
role text                                      -- owner | admin | member
is_super_admin boolean default false           -- Dean only
created_at timestamptz default now()
PRIMARY KEY (user_id, tenant_id)
```

#### `user_settings` (חדש ב-2.0)
פר-משתמש state, נקרא ע"י Custom Access Token Hook.

```sql
user_id uuid PRIMARY KEY → auth.users(id) on delete cascade
active_tenant_id uuid → tenants(id) on delete set null
preferences jsonb default '{}'                 -- gender_preference, theme, etc.
created_at timestamptz default now()
updated_at timestamptz default now()
```

### Agents (global)

#### `agents`
9 שורות. ה-9 סוכנים עצמם.

```sql
id text PRIMARY KEY                             -- 'morning', 'reviews', etc.
name_he text not null                           -- 'סוכן בוקר'
description_he text
default_model text not null                     -- 'claude-haiku-4-5' etc.
default_thinking_budget int                     -- NULL = no thinking
default_cache_ttl text default '1h'            -- '5m' | '1h'
default_schedule text                           -- cron: '0 7 * * *'
default_prompt_id uuid → agent_prompts(id)
icon text                                       -- '☀️'
display_order int default 0
```

#### `agent_prompts`
versioned. native JSON Schema (NOT tool_use).

```sql
id uuid PRIMARY KEY default gen_random_uuid()
agent_id text → agents(id) on delete cascade
version int default 1
template text not null                          -- with {{TENANT_NAME}}, {{USER_GENDER}}
output_schema jsonb default '{}'                -- native Anthropic JSON Schema
cache_breakpoints jsonb default '[]'            -- [{position, ttl}]
created_at timestamptz default now()
UNIQUE (agent_id, version)
```

#### `tenant_agents` (was `client_agents`)
פר-tenant config של כל סוכן.

```sql
tenant_id uuid → tenants(id) on delete cascade
agent_id text → agents(id) on delete cascade
enabled boolean default true
schedule_override text                          -- override default
model_override text                             -- override default
thinking_budget_override int                    -- override default
prompt_overrides jsonb default '{}'
next_run_at timestamptz                         -- master scheduler reads this
last_run_at timestamptz
created_at timestamptz default now()
PRIMARY KEY (tenant_id, agent_id)
```

### Execution

#### `agent_runs`
כל הפעלה של כל סוכן. id מסומן ע"י producer ל-idempotency.

```sql
id uuid PRIMARY KEY                             -- chosen by producer
tenant_id uuid → tenants(id) on delete cascade
agent_id text → agents(id)
status text                                     -- queued | running | succeeded | failed | skipped | cancelled
started_at timestamptz default now()
finished_at timestamptz
input jsonb
output jsonb
error_message text
model_used text
thinking_used boolean default false
usage jsonb                                     -- {input_tokens, output_tokens, cache_read, cache_create_5m, cache_create_1h}
cost_ils numeric(10,4)
```

#### `drafts`
טיוטות מחכות לאישור הבעלים.

```sql
id uuid PRIMARY KEY default gen_random_uuid()
tenant_id uuid → tenants(id) on delete cascade
agent_run_id uuid → agent_runs(id)
agent_id text → agents(id)
type text                                       -- review_reply | social_post | sales_email
content jsonb not null
status text default 'pending'                   -- pending | approved | rejected | expired | sent
context jsonb                                   -- source data
approved_by uuid → auth.users(id)
approved_at timestamptz
external_target jsonb                           -- {channel, recipient}
created_at timestamptz default now()
expires_at timestamptz default now() + interval '7 days'
```

### External

#### `integrations`
OAuth tokens encrypted ב-Supabase Vault.

```sql
id uuid PRIMARY KEY default gen_random_uuid()
tenant_id uuid → tenants(id) on delete cascade
provider text                                   -- google_business | meta | sheets
status text                                     -- connected | expired | revoked | error
vault_token_id uuid                             -- → vault.secrets
vault_refresh_id uuid
scopes text[]
metadata jsonb
expires_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
UNIQUE (tenant_id, provider)
```

#### `events`
inbound webhooks (GBP, Meta, Stripe). id מ-provider ל-idempotency.

```sql
id text PRIMARY KEY                             -- from provider
tenant_id uuid → tenants(id)
provider text
event_type text
payload jsonb
received_at timestamptz default now()
```

### Notifications

#### `notifications`
in-app bell icon. user_id NULL = לכל ה-tenant.

```sql
id uuid PRIMARY KEY default gen_random_uuid()
tenant_id uuid → tenants(id) on delete cascade
user_id uuid → auth.users(id)                   -- NULL = all members
type text
title_he text not null
body_he text
link text
read_at timestamptz
created_at timestamptz default now()
```

#### `system_alerts`
פנימי, super_admin only (Telegram + admin dashboard).

```sql
id uuid PRIMARY KEY default gen_random_uuid()
severity text                                   -- info | warn | error | critical
tenant_id uuid                                  -- nullable
message text
metadata jsonb
created_at timestamptz default now()
resolved_at timestamptz
```

### Cost tracking

#### `cost_ledger`
שורה לכל movement: reserve / settle / refund.

```sql
id bigserial PRIMARY KEY
tenant_id uuid → tenants(id) on delete cascade
agent_run_id uuid → agent_runs(id)
agent_id text → agents(id)
kind text                                       -- reserve | settle | refund
amount_ils numeric(10,6)                        -- positive=debit, negative=credit
model text                                      -- only for 'settle'
input_tokens int
output_tokens int
cache_read_tokens int default 0
cache_create_5m_tokens int default 0
cache_create_1h_tokens int default 0
metadata jsonb
created_at timestamptz default now()
```

**Unique partial indexes (CRITICAL):**
```sql
unique index ON cost_ledger(agent_run_id) WHERE kind = 'settle'
unique index ON cost_ledger(agent_run_id) WHERE kind = 'refund'
```

### New in 2.0

#### `outbox`
reliable event delivery. write inside DB transaction, drain to QStash.

```sql
id bigserial PRIMARY KEY
tenant_id uuid                                  -- nullable for system events
event_type text                                 -- run.completed, draft.created
payload jsonb
destination text                                -- qstash | webhook | telegram_internal
status text default 'pending'                   -- pending | sent | failed | dead
attempts int default 0
next_attempt_at timestamptz default now()
last_error text
created_at timestamptz default now()
sent_at timestamptz
```

#### `idempotency_keys`
HTTP-level dedup לwebhook handlers.

```sql
key text PRIMARY KEY
tenant_id uuid
request_hash text                               -- SHA-256 of request body
response jsonb                                  -- cached response
status text default 'in_progress'               -- in_progress | completed | failed
expires_at timestamptz default (now() + interval '24 hours')
created_at timestamptz default now()
```

#### `audit_log`
Israeli A13 compliance. 7-year retention.

```sql
id bigserial PRIMARY KEY
tenant_id uuid
user_id uuid → auth.users(id)
action text                                     -- tenant.create | integration.connect
resource_type text
resource_id text
before_state jsonb
after_state jsonb
ip inet
user_agent text
created_at timestamptz default now()
```

---

## 3. Helper Functions

### Auth helpers (used in RLS)

```sql
public.current_tenant_id() → uuid
public.is_super_admin() → boolean
public.user_tenant_ids() → setof uuid
```

**Always use with `(select ...)` wrapper in RLS:**
```sql
using ( tenant_id = (select public.current_tenant_id()) )
```

### Cost cap functions

```sql
public.reserve_spend(p_tenant_id uuid, p_agent_run_id uuid, p_agent_id text, p_estimate_ils numeric) → boolean
```
- Atomic check-and-reserve
- Returns `false` if cap would be exceeded (no row updated)
- Inserts `cost_ledger(kind='reserve')` if successful
- Logs `system_alerts(severity='warn')` if blocked

```sql
public.settle_spend(p_agent_run_id, p_actual_ils, p_model, p_input_tokens, p_output_tokens, p_cache_read_tokens, p_cache_create_5m_tokens, p_cache_create_1h_tokens, p_metadata) → boolean
```
- Idempotent via unique partial index
- Looks up reserve, releases it, charges actual amount
- Returns `false` if already settled (no-op)

```sql
public.refund_spend(p_agent_run_id uuid, p_reason text) → boolean
```
- Idempotent via unique partial index
- Releases reservation without charging
- Returns `false` if already refunded

### Cron functions

```sql
public.reset_monthly_spend() → int
```
- Run by pg_cron on 1st of month
- Resets all `spend_used_ils` and `spend_reserved_ils` to 0
- Updates `spend_period_start`

```sql
public.reap_stale_runs(p_queued_threshold_minutes int default 30, p_running_threshold_minutes int default 20) → table(id, status)
```
- Run by pg_cron every 5 min
- Marks stuck runs as `failed`
- Calls `refund_spend()` for each (releases reservations)

### Outbox helper

```sql
public.enqueue_outbox_event(p_tenant_id, p_event_type, p_payload, p_destination) → bigint
```
- Helper for app code
- Returns outbox row id

---

## 4. Custom Access Token Hook

```sql
public.custom_access_token_hook(event jsonb) → jsonb
```

**Logic:**
1. Lookup `user_settings.active_tenant_id` for the user
2. If found, lookup matching `memberships` row for role + super_admin flag
3. Fall back to first `memberships` row if no active tenant set
4. Inject `tenant_id`, `role`, `is_super_admin` into `app_metadata` of JWT
5. **Never raise exception** — log and return unchanged event on error

**Enabled in dashboard:** Authentication → Hooks → "Customize Access Token (JWT) Claims" → ENABLED ✅

**Grants:**
- `execute` to `supabase_auth_admin`
- `select` on `memberships` to `supabase_auth_admin`
- `select` on `user_settings` to `supabase_auth_admin`

---

## 5. RLS Patterns

### Standard tenant isolation
```sql
create policy "..." on TABLE for select to authenticated
  using ( tenant_id = (select public.current_tenant_id()) );
```

### Owner/admin only (sensitive ops like integrations)
```sql
create policy "..." on TABLE for all to authenticated
  using (
    tenant_id in (
      select tenant_id from public.memberships
      where user_id = (select auth.uid()) and role in ('owner', 'admin')
    )
  );
```

### Super admin override (Dean)
```sql
create policy "..._admin_all" on TABLE for all to authenticated
  using ( (select public.is_super_admin()) )
  with check ( (select public.is_super_admin()) );
```

### Self only (user_settings)
```sql
create policy "..." on TABLE for all to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );
```

### System tables (super_admin only)
- `events` — webhooks ingress
- `system_alerts` — internal monitoring
- `outbox` — internal infra
- `idempotency_keys` — internal infra

---

## 6. Performance indexes

```sql
-- agent_runs queries
agent_runs(tenant_id, started_at desc)
agent_runs(status) WHERE status IN ('queued', 'running')
agent_runs(started_at) WHERE status = 'queued'   -- reaper

-- drafts queries
drafts(tenant_id, status)
drafts(tenant_id, created_at desc) WHERE status = 'pending'

-- notifications
notifications(user_id, created_at desc) WHERE read_at IS NULL

-- outbox drain
outbox(next_attempt_at) WHERE status = 'pending'

-- cost_ledger uniqueness
UNIQUE INDEX cost_ledger_settle_uniq(agent_run_id) WHERE kind = 'settle'
UNIQUE INDEX cost_ledger_refund_uniq(agent_run_id) WHERE kind = 'refund'

-- audit_log queries
audit_log(tenant_id, created_at desc)
audit_log(user_id, created_at desc)
audit_log(action, created_at desc)

-- memberships lookups
memberships(user_id)
memberships(tenant_id)
```

---

## 7. Triggers

```sql
trigger tenants_updated_at — sets updated_at on update
trigger user_settings_updated_at
trigger integrations_updated_at
```

All use `public.set_updated_at()` function.

**Future triggers (Day 4+):**
- `notify_run_complete` — broadcasts `realtime.broadcast_changes` on `agent_runs.status = 'succeeded'`

---

## 8. Migration files

```
supabase/migrations/
├── _archive/v1/                          ← Schema 1.0 (deleted from active DB)
│   ├── 001_schema.sql
│   ├── 002_rls.sql
│   ├── 003_seed.sql
│   └── 004_grants.sql
├── 001_reset.sql                         ← drops Schema 1.0
├── 002_schema.sql                        ← creates 16 tables
├── 003_rls.sql                           ← RLS + 30+ policies
├── 004_grants.sql                        ← role privileges
├── 005_functions.sql                     ← spend cap + reaper + outbox
├── 006_hook.sql                          ← Custom Access Token Hook
└── 007_seed.sql                          ← 9 agents
```

**To run on fresh DB:** execute 001-007 in order via SQL Editor.

---

## 9. Common queries (cheatsheet)

### Get all agents for a tenant
```sql
select a.*, ta.enabled, ta.next_run_at
from agents a
left join tenant_agents ta
  on ta.agent_id = a.id
  and ta.tenant_id = (select current_tenant_id())
order by a.display_order;
```

### Recent runs for current tenant
```sql
select * from agent_runs
where tenant_id = (select current_tenant_id())
order by started_at desc
limit 50;
```

### Pending drafts count
```sql
select count(*) from drafts
where tenant_id = (select current_tenant_id())
  and status = 'pending';
```

### Spend used this month
```sql
select spend_used_ils, spend_reserved_ils, spend_cap_ils,
       (spend_used_ils + spend_reserved_ils) / spend_cap_ils * 100 as percent_used
from tenants
where id = (select current_tenant_id());
```

### Cost breakdown by agent (last 30 days)
```sql
select agent_id,
       count(*) filter (where kind = 'settle') as runs,
       sum(amount_ils) filter (where kind = 'settle') as total_cost_ils
from cost_ledger
where tenant_id = (select current_tenant_id())
  and created_at > now() - interval '30 days'
group by agent_id
order by total_cost_ils desc;
```
