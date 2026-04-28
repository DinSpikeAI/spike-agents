# 💎 Spike Agents — Code Patterns Reference

> **Reference implementations שאפשר להעתיק.** עדכן כשאנחנו מגלים pattern יותר טוב.

---

## 1. Supabase client patterns

### Browser (Client Component)
```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function MyComponent() {
  const supabase = createClient();  // safe to call in render
  // ...
}
```

### Server Component
```tsx
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // ...
}
```

### Server Action
```tsx
"use server";
import { createClient } from "@/lib/supabase/server";

export async function updateTenant(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tenants")
    .update({ name: formData.get("name") })
    .eq("id", tenantId);  // RLS enforces tenant ownership
}
```

### Route Handler (API)
```tsx
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  // RLS active — user sees only their tenant data
}
```

### Admin (cron, agent runner, webhook)
```tsx
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  // ⚠️ Verify webhook signature FIRST
  const supabase = createAdminClient();  // RLS BYPASSED
  // ...
}
```

---

## 2. Anthropic call pattern (the canonical one)

This is the pattern every agent uses. Memorize it.

```ts
// src/lib/anthropic.ts
import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});
```

```ts
// src/lib/agents/morning/run.ts
import { anthropic } from "@/lib/anthropic";
import { createAdminClient } from "@/lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";  // CRITICAL — not Edge!
export const maxDuration = 800;
export const preferredRegion = "iad1";

export async function runMorningAgent(tenantId: string) {
  const supabase = createAdminClient();
  const runId = uuidv4();

  // 1. Pre-create the run row (idempotency anchor)
  await supabase.from("agent_runs").insert({
    id: runId,
    tenant_id: tenantId,
    agent_id: "morning",
    status: "queued",
  });

  // 2. Estimate cost (rough heuristic)
  const estimateIls = 0.05;  // ₪0.05 default cap

  // 3. Reserve spend (atomic check-and-decrement)
  const { data: reserved } = await supabase.rpc("reserve_spend", {
    p_tenant_id: tenantId,
    p_agent_run_id: runId,
    p_agent_id: "morning",
    p_estimate_ils: estimateIls,
  });

  if (!reserved) {
    await supabase
      .from("agent_runs")
      .update({ status: "failed", error_message: "spend_cap_hit" })
      .eq("id", runId);
    return { ok: false, reason: "spend_cap" };
  }

  // 4. Mark as running
  await supabase
    .from("agent_runs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", runId);

  try {
    // 5. Build the prompt
    const tenant = await fetchTenant(supabase, tenantId);
    const data = await fetchYesterdayData(supabase, tenantId);

    // 6. Call Anthropic with native JSON Schema + cache_control
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: MORNING_SYSTEM_PROMPT,  // ~1500 tokens, stable
          cache_control: { type: "ephemeral", ttl: "1h" }  // EXPLICIT 1h!
        },
      ],
      messages: [
        {
          role: "user",
          content: JSON.stringify({ tenant, data }),
        },
      ],
      // @ts-expect-error - output_config not in current SDK types yet
      output_config: {
        format: {
          type: "json_schema",
          schema: MORNING_OUTPUT_SCHEMA,
        },
      },
    });

    // 7. Parse output
    const output = JSON.parse(response.content[0].text);

    // 8. Calculate actual cost
    const usage = response.usage;
    const costIls = calculateCost("claude-haiku-4-5", usage);

    // 9. Settle spend
    await supabase.rpc("settle_spend", {
      p_agent_run_id: runId,
      p_actual_ils: costIls,
      p_model: "claude-haiku-4-5",
      p_input_tokens: usage.input_tokens,
      p_output_tokens: usage.output_tokens,
      p_cache_read_tokens: usage.cache_read_input_tokens ?? 0,
      p_cache_create_5m_tokens: 0,
      p_cache_create_1h_tokens: usage.cache_creation_input_tokens ?? 0,
      p_metadata: null,
    });

    // 10. Update run as succeeded + emit outbox event
    await supabase
      .from("agent_runs")
      .update({
        status: "succeeded",
        finished_at: new Date().toISOString(),
        output,
        usage,
        cost_ils: costIls,
      })
      .eq("id", runId);

    await supabase.rpc("enqueue_outbox_event", {
      p_tenant_id: tenantId,
      p_event_type: "run.completed",
      p_payload: { run_id: runId, agent_id: "morning" },
      p_destination: "qstash",
    });

    return { ok: true, runId, output };

  } catch (error) {
    // 11. On failure: refund + mark failed
    await supabase.rpc("refund_spend", {
      p_agent_run_id: runId,
      p_reason: error instanceof Error ? error.message : "unknown",
    });

    await supabase
      .from("agent_runs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : "unknown",
      })
      .eq("id", runId);

    throw error;
  }
}
```

### Cache breakpoint ordering

If multiple cache breakpoints, order **longest-TTL-first**:

```ts
system: [
  // 1. Tools (most stable)
  { type: "text", text: TOOLS_DEFINITION, cache_control: { type: "ephemeral", ttl: "1h" } },
  // 2. System prompt
  { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral", ttl: "1h" } },
  // 3. Per-tenant config
  { type: "text", text: tenantConfig, cache_control: { type: "ephemeral", ttl: "5m" } },
  // user message: no cache
],
```

---

## 3. Cost calculation

```ts
// src/lib/anthropic-pricing.ts
const PRICING = {
  "claude-haiku-4-5": { input: 1.0, output: 5.0, cache_read: 0.10, cache_create_5m: 1.25, cache_create_1h: 2.0 },
  "claude-sonnet-4-6": { input: 3.0, output: 15.0, cache_read: 0.30, cache_create_5m: 3.75, cache_create_1h: 6.0 },
  "claude-opus-4-7": { input: 5.0, output: 25.0, cache_read: 0.50, cache_create_5m: 6.25, cache_create_1h: 10.0 },
};

const USD_TO_ILS = 3.69;  // approximate, update from API or hardcode quarterly

export function calculateCost(
  model: keyof typeof PRICING,
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  }
): number {
  const p = PRICING[model];
  const usd = (
    (usage.input_tokens / 1_000_000) * p.input +
    (usage.output_tokens / 1_000_000) * p.output +
    ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * p.cache_read +
    ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * p.cache_create_1h  // assume 1h
  );
  return usd * USD_TO_ILS;
}
```

---

## 4. RLS-aware queries (frontend)

```tsx
// src/app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // RLS automatically filters to current tenant
  const { data: agents } = await supabase
    .from("agents")
    .select(`
      id, name_he, default_model, icon,
      tenant_agents!inner ( enabled, next_run_at )
    `)
    .order("display_order");

  // No need for `.eq("tenant_id", ...)` — RLS does it
  return <AgentGrid agents={agents} />;
}
```

---

## 5. Server Action pattern (with hardening)

```tsx
"use server";
import "server-only";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const TriggerAgentSchema = z.object({
  agentId: z.enum(["morning", "reviews", "social", "manager", "watcher", "cleanup", "sales", "inventory", "hot_leads"]),
});

export async function triggerAgentNow(input: { agentId: string }) {
  // 1. AUTH — re-check inside the action (don't trust client)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. VALIDATION
  const parsed = TriggerAgentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input" };
  }

  // 3. AUTHORIZATION — does user have permission?
  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return { error: "Forbidden" };
  }

  // 4. ACTION — call agent runner
  // (this would normally enqueue to QStash, but for manual trigger we run inline)
  // ...

  return { ok: true };
}
```

---

## 6. Magic Link login

### Client component
```tsx
// src/app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EmailSchema = z.string().email("כתובת מייל לא תקינה");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = EmailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setState("idle");
      toast.error("שליחה נכשלה. נסו שוב.");
      return;
    }

    setState("sent");
  };

  if (state === "sent") {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">בדקו את המייל ✓</h2>
        <p className="mt-2 text-muted-foreground">שלחנו לכם קישור התחברות.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">כתובת מייל</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"  // emails are LTR even in RTL UI
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <Button type="submit" disabled={state === "sending"} className="w-full">
        {state === "sending" ? "שולחים..." : "שלח לי קישור"}
      </Button>
    </form>
  );
}
```

### Auth callback handler
```tsx
// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}
```

---

## 7. Realtime Broadcast subscription (Day 4+)

```tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAgentRunUpdates(tenantId: string) {
  useEffect(() => {
    const supabase = createClient();

    // CRITICAL: setAuth before subscribing (private channel auth)
    supabase.realtime.setAuth();  // reads session token

    const channel = supabase
      .channel(`tenant:${tenantId}:agent_runs`, {
        config: { private: true },
      })
      .on("broadcast", { event: "UPDATE" }, (payload) => {
        // handle update — refresh UI, show toast, etc.
        console.log("Agent run updated:", payload);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [tenantId]);
}
```

---

## 8. QStash publish (Day 4+)

```ts
// src/lib/qstash.ts
import "server-only";
import { Client } from "@upstash/qstash";

export const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

export async function enqueueAgentRun(opts: {
  runId: string;
  tenantId: string;
  agentId: string;
}) {
  return qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/agents/run`,
    body: opts,
    deduplicationId: `agent-run:${opts.runId}`,  // idempotency
    retries: 3,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

### QStash consumer (with signature verification)
```ts
// src/app/api/agents/run/route.ts
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(req: Request) {
  const body = await req.json();
  // body = { runId, tenantId, agentId }
  // ... run agent, idempotent
  return new Response("OK");
}

export const POST = verifySignatureAppRouter(handler);
export const runtime = "nodejs";
export const maxDuration = 800;
```

---

## 9. Form with Zod + React Hook Form (shadcn pattern)

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

const Schema = z.object({
  businessName: z.string().min(2, "שם קצר מדי"),
  gender: z.enum(["male", "female", "plural"]),
});

export function OnboardingStep1() {
  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { businessName: "", gender: "plural" },
  });

  const onSubmit = (values: z.infer<typeof Schema>) => {
    // call server action
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם העסק</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">המשך</Button>
      </form>
    </Form>
  );
}
```

---

## 10. Hebrew gender helper

```ts
// src/lib/hebrew.ts
type Gender = "male" | "female" | "plural";

export function gendered(
  gender: Gender | undefined,
  forms: { male: string; female: string; plural: string; impersonal?: string }
): string {
  if (!gender || gender === "plural") {
    return forms.impersonal ?? forms.plural;
  }
  return forms[gender];
}

// Usage
const greeting = gendered(user.gender, {
  male: "ברוך הבא",
  female: "ברוכה הבאה",
  plural: "ברוכים הבאים",
});
```

---

## 11. RTL/LTR mixed content

```tsx
// English brand names in Hebrew text
<p>בוקר טוב, שלחת אתמול 47 הודעות מ-<bdi dir="ltr">CRM</bdi></p>

// Phone numbers
<span dir="ltr">+972-50-1234567</span>

// Emails — input always LTR
<Input type="email" dir="ltr" />

// Numbers in Hebrew sentence — okay native (digits are bidi-neutral)
<p>הזמנת 23 מנות אתמול.</p>
```

---

## 12. Error boundaries

```tsx
// src/app/error.tsx
"use client";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl">משהו השתבש 😕</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>נסו שוב</Button>
    </div>
  );
}
```

---

## 13. Loading state (per-route)

```tsx
// src/app/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
```

---

## 14. Test patterns (pgTAP)

```sql
-- supabase/tests/rls/010_morning_isolation.sql
begin;
select plan(3);

select tests.create_supabase_user('alice@a.co');
select tests.create_supabase_user('bob@b.co');
-- ... create tenants, memberships ...

-- Inject claims (pgTAP doesn't run real Auth Hook)
select set_config('request.jwt.claims',
  jsonb_build_object(
    'sub', tests.get_supabase_uid('alice@a.co'),
    'role', 'authenticated',
    'app_metadata', jsonb_build_object('tenant_id', tenant_a_id)
  )::text, true);

-- Alice should see only her runs
select results_eq(
  $$ select count(*)::int from agent_runs $$,
  $$ values (5) $$,
  'alice sees 5 runs (her tenant)'
);

-- Switch to Bob
select set_config('request.jwt.claims', /* bob's claims */, true);
select results_eq(
  $$ select count(*)::int from agent_runs $$,
  $$ values (3) $$,
  'bob sees 3 runs (his tenant)'
);

-- Verify RLS itself
select tests.rls_enabled('public');

select * from finish();
rollback;
```

---

## 15. Common imports cheat-sheet

```tsx
// Everything you need
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { anthropic } from "@/lib/anthropic";
import { qstash } from "@/lib/qstash";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
```
