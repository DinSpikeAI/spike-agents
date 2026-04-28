# 🐛 Spike Agents — Known Issues & Gotchas

> **כל באג שנתקלנו בו, וכל מלכודת שהמחקר חשף.** עדכן כשנתקלים במשהו חדש.

הקובץ הזה חוסך זמן: כשמשהו לא עובד, חפש פה לפני שמתחילים לדבג.

---

## 1. PowerShell — pwd confusion (חוזר ועולה)

**תסמין:** קובץ נשמר ב-`C:\Users\Din\` במקום ב-`spike-engine`.

**סיבה:** PowerShell חוזר ל-`C:\Users\Din>` בין פקודות. אם רצת sub-script שמשתמש ב-`__dirname`, הוא יזהה את התיקייה הלא נכונה.

**איך מזהים:** הפקודה `pwd` או ה-prompt עצמו מראים `C:\Users\Din>` במקום `C:\Users\Din\Desktop\spike-engine>`.

**פתרון:**
```powershell
cd C:\Users\Din\Desktop\spike-engine
pwd  # verify before any meaningful command
```

**מניעה:** כל script Node שאני נותן כולל את הבדיקה הזו:
```javascript
if (!__dirname.endsWith('spike-engine')) {
  console.error(`❌ Wrong directory: ${__dirname}`);
  process.exit(1);
}
```

---

## 2. `createContext only works in Client Components`

**תסמין:** Build error או runtime crash:
```
TypeError: createContext only works in Client Components.
Add the "use client" directive at the top of the file.
```

**סיבה:** Server Component (כמו `layout.tsx`) מייבא משהו שמשתמש ב-React Context (Radix DirectionProvider, Theme providers, etc.).

**פתרון:** אל תהפוך את ה-layout ל-Client. במקום, צור wrapper קטן עם `"use client"`:

```tsx
// src/components/providers/direction-provider.tsx
"use client";
import { DirectionProvider as Radix } from "@radix-ui/react-direction";
export function DirectionProvider({ children }) {
  return <Radix dir="rtl">{children}</Radix>;
}
```

ואז ייבא את ה-wrapper מ-layout (Server Component).

**עוד מקרים שצריכים wrapper:**
- ThemeProvider של next-themes
- TooltipProvider של Radix
- Toast/Sonner provider
- React Query QueryClientProvider

**עיקרון:** Server Components לא מחזיקים state. אם משהו צריך state/context, הוא Client.

---

## 3. `import "server-only"` חיוני ב-2 קבצים

**תסמין שלא תזהה (זאת הבעיה):** ה-secret key נכנס ל-bundle של ה-browser. אף אחד לא ראה. שבועיים אחר כך מישהו מוצא את ה-key במאגר אינטרנטי.

**פתרון:** כל קובץ שמכיל `SUPABASE_SERVICE_ROLE_KEY` או `ANTHROPIC_API_KEY` חייב להתחיל ב:

```ts
import "server-only";  // ⚠️ build fails if imported from a Client Component
```

**אצלנו זה ב:**
- `src/lib/supabase/admin.ts` ✅
- `src/lib/supabase/server.ts` ✅
- `src/lib/anthropic.ts` (ל-Day 3 ואילך)

**איך לבדוק:** אחרי build, תחפש בקבצי `.next/static/`:
```powershell
Select-String -Path .next\static\chunks\*.js -Pattern "sk-ant-"
```
אסור שיהיה תוצאה.

---

## 4. `getSession()` vs `getUser()` — אבטחה!

**טעות נפוצה:** משתמשים ב-`supabase.auth.getSession()` ב-server code לבדיקת auth.

**הבעיה:** `getSession()` קורא cookies בלי לאמת את ה-JWT מול השרת. תוקף יכול לשתול cookie מזויף.

**פתרון:** ב-server code, **תמיד** השתמש ב-`getUser()`:

```ts
// ❌ לא בטוח
const { data: { session } } = await supabase.auth.getSession();

// ✅ בטוח — מאמת מול Supabase
const { data: { user } } = await supabase.auth.getUser();
```

**יוצא דופן:** Client code (browser) — שם `getSession()` בסדר כי ה-attacker סמך על בעצמו.

---

## 5. JWT claim collision — `client_id` (תוקן ב-Schema 2.0)

**תסמין:** ה-RLS לא עובד. שאילתות מחזירות 0 שורות גם למשתמש מחובר.

**סיבה (היסטורית):** ב-Schema 1.0 השתמשנו ב-claim `client_id` ב-JWT. Supabase OAuth Server flow גם משתמש ב-`client_id` (תקני OAuth 2.0). התנגשות שקטה — שני המקורות דורסים זה את זה.

**פתרון:** השתמשנו ב-`tenant_id` ב-Schema 2.0. כל ה-RLS וה-hook משתמשים בשם הזה.

**אזהרה ל-עתיד:** **לעולם** אל תקרא לטענת JWT custom בשם שמופיע ב-OAuth/OIDC standard:
- ❌ `client_id`, `sub`, `iss`, `aud`, `exp`, `iat`, `scope`
- ✅ `tenant_id`, `organization_id`, `workspace_id`

---

## 6. Cache TTL silent default change (March 2026)

**תסמין:** "תאוריה: עם cache, צריך לחסוך 90% על קריאות חוזרות. בפועל: חסכון מינימלי."

**סיבה:** Anthropic שינו את ה-default TTL מ-1 שעה ל-5 דקות במרץ 2026, **בלי הודעה**. אם לא ציינת ttl במפורש, ה-cache פג אחרי 5 דק' = רוב הקריאות לא מנצלות אותו.

**פתרון:** **תמיד** ציין:

```ts
cache_control: {
  type: 'ephemeral',
  ttl: '1h'  // אל תסמוך על default!
}
```

**אם ה-prompt משתנה תכופות (watcher, hot_leads):** השתמש ב-`ttl: '5m'` — זול יותר ל-cache write.

---

## 7. Native JSON Schema (NOT tool_use)

**טעות:** משתמשים ב-`tools` עם tool_choice כדי לחלץ JSON מובנה.

**הבעיה:** Anthropic הוסיפו תמיכה native ב-JSON Schema, מה שמבטל את ההצורך ב-tool tricks. tool_use עכשיו דרך לעקוף — איטי, לא מדויק, lock-in.

**פתרון:**
```ts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-6',
  output_config: {
    format: {
      type: 'json_schema',
      schema: { /* your JSON Schema */ }
    }
  },
  messages: [...]
});

const data = JSON.parse(response.content[0].text);
```

**Prefilling assistant message לJSON גם דחוי:**
- ❌ `assistant: '{'` — לא עובד יציב על Sonnet 4.6, Opus 4.6/4.7
- ✅ output_config.format

---

## 8. Edge runtime שובר Anthropic SDK

**תסמין:** "Cannot use crypto in Edge runtime" או build error.

**סיבה:** Anthropic SDK מצפה ל-Node.js APIs (crypto, streams). Edge runtime ב-Vercel הוא חתך — חסר APIs.

**פתרון:** **כל route שקורא ל-Anthropic** חייב:

```ts
// בכל route handler
export const runtime = 'nodejs';        // לא 'edge'!
export const maxDuration = 800;         // 13 דקות (Vercel Pro)
export const preferredRegion = 'iad1';  // קרוב ל-Anthropic US
```

**בלי זה:** ה-route עובד דב-dev אבל נופל בייצור.

---

## 9. Vercel Fluid Compute — JWT leak בין tenants

**טעות שתעלה לך לקוח אם תעשה אותה:**

```ts
// ❌ קטסטרופה
import { createServerClient } from '@supabase/ssr';

const supabase = createServerClient(URL, KEY, { /* cookies */ });
//   ^^^^^^^^^ module-scope!

export async function GET(req) {
  const { data } = await supabase.from('tenants').select();
  // ה-cookies של request 1 דולפים ל-request 2
  return Response.json(data);
}
```

**הסבר:** Vercel Fluid Compute שומר process state בין requests (קונטיינר חי). client שנוצר ב-module scope **משותף** בין tenants. ה-JWT של User A עלול לדלוף ל-request של User B.

**פתרון:** **תמיד** צור client בתוך handler:

```ts
// ✅ נכון
export async function GET(req) {
  const supabase = await createClient();  // per-request
  const { data } = await supabase.from('tenants').select();
  return Response.json(data);
}
```

**אצלנו זה כבר נכון** ב-`server.ts` ו-`client.ts` — אבל מי שיוסיף קוד צריך לזכור.

---

## 10. shadcn b0 preset font lock-in

**תסמין:** הפונט לא Heebo, או Heebo לא טוען.

**סיבה:** ה-preset b0 שהגדרנו ב-`https://ui.shadcn.com/create` בחר Inter כ-font. אין Heebo ברשימה.

**פתרון (כבר עשוי):** ב-`globals.css`:
```css
@theme inline {
  --font-sans: var(--font-heebo);   /* override של shadcn */
  --font-heading: var(--font-heebo);
}
```

ב-`layout.tsx`:
```tsx
import { Heebo } from "next/font/google";
const heebo = Heebo({ ..., variable: "--font-heebo" });
<html className={heebo.variable}>
```

**אם ה-Heebo לא טוען:** בדוק שיש לך internet (next/font מוריד מ-Google בזמן build) או הוסף `display: 'swap'` כדי לראות fallback.

---

## 11. shadcn דרס את `:root` ל-light theme

**תסמין:** אחרי `npx shadcn init`, האתר נראה לבן עם טקסט שחור — לא כחול-נייבי.

**סיבה:** shadcn מוסיף `:root { --background: oklch(1 0 0) }` (לבן) לקובץ globals.css.

**פתרון (כבר עשוי):** הפכנו את `:root` ב-globals.css ל-Spike-dark:
```css
:root {
  --background: #07111A;  /* navy */
  --foreground: #E8EBFF;  /* light text */
  /* ... */
}
.dark { /* same as :root for now */ }
```

**אם תפתח שיחה חדשה ושוב יוסיפו `npx shadcn init`** — זה ידרוס שוב. אל תריץ init פעמיים.

---

## 12. LF / CRLF warnings ב-Git (cosmetic)

**תסמין:**
```
warning: in the working copy of 'X', LF will be replaced by CRLF the next time Git touches it
```

**סיבה:** Windows משתמש ב-CRLF, Linux/Mac ב-LF. Git מנסה להמיר אוטומטית.

**הוא לא בעיה.** זה אזהרה cosmetic. הקבצים שלך תקינים.

**אם מציק:** הוסף לפרויקט:
```
# .gitattributes
* text=auto eol=lf
```

ואז:
```powershell
git add --renormalize .
git commit -m "chore: normalize line endings"
```

---

## 13. `node-domexception@1.0.0: Use your platform's native DOMException`

**תסמין:**
```
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

**סיבה:** dependency של dependency של dependency. אחת החבילות עדיין משתמשת ב-polyfill ישן.

**הוא לא בעיה.** האזהרה cosmetic. node 20+ יש DOMException native, ה-polyfill לא ירוץ.

**מתי לטפל:** אף פעם, אלא אם המקור (Vercel/Next) ידרוש upgrade.

---

## 14. `.env.local` placement מוזר

**טעות:** אנשים מנסים לשים `.env.local` ב-`src/` או ב-`scripts/`.

**הנכון:** **תמיד** ב-root של הפרויקט (לצד `package.json`).

```
spike-engine/
├── .env.local          ✅ פה
├── package.json
├── proxy.ts
└── src/
    └── ...
```

**ניסיונות עוקפים שלא יעבדו:**
- ❌ הוספת `.env.local` כ-import ב-Next.js
- ❌ שימוש ב-`dotenv` package (Next מטפל אוטומטית)
- ❌ multiple `.env.local` files (רק אחד נטען)

---

## 15. `next dev` vs `npm run dev` — אותו דבר?

**כן.** `package.json` מכיל:
```json
"scripts": {
  "dev": "next dev"
}
```

**אבל:** אם תפתח שיחה חדשה ותחשוב שאני אבחר אחד מהם — תזכור: **תמיד** `npm run dev`.

זה נכון לכל הפקודות:
- ✅ `npm run dev` (לא `next dev`)
- ✅ `npm run build` (לא `next build`)
- ✅ `npm run start` (לא `next start`)

הסיבה: בעתיד נוסיף scripts מותאמים (תיקון auto, lint, etc.). הריצה דרך `npm run` תופסת אותם.

---

## 16. Server Actions — re-validate auth!

**טעות:** "המשתמש כבר עבר login, למה לבדוק auth שוב?"

**סיבה לבדוק:** Server Actions מקבלים POST requests. תוקף יכול לזייף את הקריאה ישירות:
```bash
curl -X POST https://app.spikeai.co.il/api/agents/run \
  -H "Cookie: faked-session" \
  -d '{...}'
```

**פתרון:** בכל Server Action:

```ts
"use server";
export async function triggerAgent(input) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // עכשיו authorization check (לא רק authentication)
  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (membership?.role !== "owner") {
    throw new Error("Forbidden");
  }

  // עכשיו בטוח לבצע
}
```

---

## 17. RLS — `(select auth.jwt())` wrap

**טעות לא מודעת:** policies שכותבים ככה:
```sql
using ( tenant_id = ((auth.jwt() #>> '{app_metadata,tenant_id}')::uuid) )
```

**הבעיה:** Postgres מעריך את `auth.jwt()` **פעם לכל שורה**. על טבלה של 100K שורות = 100K function calls. שאילתה איטית.

**פתרון:** עטוף ב-`(select ...)`:
```sql
using ( tenant_id = (select public.current_tenant_id()) )
```

זה מפעיל InitPlan — Postgres מעריך פעם אחת לכל שאילתה, לא לכל שורה.

**אצלנו זה כבר נכון** ב-`003_rls.sql`. אם תוסיף policies חדשים — תעטוף.

---

## 18. Custom Access Token Hook — אסור להשליך exception

**תסמין מסוכן:** משתמש לא יכול להיכנס. בכלל.

**סיבה:** ה-hook function שלך השליכה exception (NULL pointer, type error, missing column).

**פתרון:** **תמיד** עטוף ב-try/catch:

```sql
exception
  when others then
    raise log 'custom_access_token_hook error: %', sqlerrm;
    return event;  -- חזרה לא-משונה. עדיף JWT בלי tenant_id מ-no JWT.
end;
```

**אצלנו זה כבר נכון** ב-`006_hook.sql`. אבל אם תערוך — שמור.

---

## 19. Hebrew gender — default לא זכר

**טעות תרבותית:** "אם לא ידוע, נשתמש בלשון זכר. זה ה-default."

**הבעיה:** לקוחה אחת תפתח את האפליקציה, תקרא "ברוך הבא", תחשוב שהמערכת לא בנויה לה, ותעזוב ב-30 שניות.

**פתרון:** Default = **לשון סתמית**:
- ❌ "ברוך הבא"
- ❌ "ברוכה הבאה"
- ✅ "ברוכים הבאים" / "אפשר להתחיל" / "בואו נכנס"

**או:** בקש מין בכל onboarding (`user_settings.preferences.gender`), אז תוכל להתאים.

---

## 20. `dir="ltr"` על email/phone inputs

**תסמין:** המשתמש מקליד "user@example.com" וזה מופיע "moc.elpmaxe@resu" (מהפך).

**סיבה:** ה-`<html dir="rtl">` משפיע על כל input. דירקטיביות BiDi של עברית הופכת את הסדר.

**פתרון:**
```tsx
<Input type="email" dir="ltr" />
<Input type="tel" dir="ltr" />
<Input type="url" dir="ltr" />
```

**רק על הטקסט בתוך:** label בעברית נשאר RTL.

---

## 21. Resend — click tracking שובר Magic Link

**תסמין:** משתמש מקבל email, לוחץ link, מגיע ל-401 או דף ריק.

**סיבה:** Resend "click tracking" עוטף את ה-URL ב-redirect דרך השרתים שלהם. Supabase Magic Link מצפה לקוד מקורי ב-URL — ה-redirect מוסיף parameters שמבלבלים אותו.

**פתרון:** ב-Resend dashboard, על subdomain `auth.spikeai.co.il`:
- Settings → Tracking → **Click tracking: OFF**
- Open tracking: לפי טעם, אבל יותר טוב OFF גם הוא

**עיקרון:** subdomain `auth.` רק ל-transactional. subdomain `mail.` או `marketing.` ל-newsletters עם tracking ON.

---

## 22. Hebrew email subject — מתחיל באות עברית, לא emoji

**תסמין:** Email subject נראה ב-LTR ב-Gmail/Outlook למרות RTL בגוף.

**סיבה:** Email clients קוראים את התו הראשון של ה-subject כדי לקבוע direction. אם הראשון הוא emoji (`📧 ההודעה שלך`), הוא נכנס במצב LTR.

**פתרון:**
```
❌ subject: "🔐 התחברות ל-Spike"
✅ subject: "התחברות ל-Spike 🔐"
```

או בלי emoji בכלל לטרנזקציות.

---

## 23. spend cap — `service_role` עוקף!

**טעות שתעלה לך 500 שקלים:**

```ts
// בקוד של agent runner
const supabase = createAdminClient();  // service_role, RLS bypass

// קורא ישירות ל-Anthropic בלי reserve_spend
const response = await anthropic.messages.create({...});
```

**הבעיה:** RLS לא מגן עליך פה — `service_role` יש לו את כל ההרשאות. אבל גם `reserve_spend` הוא רק function — אם לא קוראים לה, אין מי שיחסום.

**פתרון:** **תמיד** קרא ל-`reserve_spend` לפני Anthropic, גם ב-admin context. זה convention, לא enforcement.

**איך אתה יודע אם פיספסת:** `cost_ledger` יראה רק `kind='settle'` בלי `kind='reserve'` תואם. בעיה.

---

## 24. Realtime — `setAuth` חובה לפני `subscribe`

**תסמין:** Subscribe לchannel, אבל לא מקבלים updates.

**סיבה:** Private channels (אלה עם `config.private: true`) דורשים auth. בלי `setAuth`, ה-server דוחה בלי error visible.

**פתרון:**
```ts
const supabase = createClient();
supabase.realtime.setAuth();  // קורא session token

const channel = supabase
  .channel(`tenant:${id}:runs`, { config: { private: true } })
  .on("broadcast", {...})
  .subscribe();
```

**Stub mode (Day 4):** אנחנו לא משתמשים ב-Realtime עדיין. כשנגיע — לזכור.

---

## 25. כפתור Send Magic Link → Wait → Re-send

**טעות UX:** משתמש לוחץ "שלח", לא רואה כלום, לוחץ שוב. עכשיו 2 emails.

**פתרון בקוד:**
```tsx
const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

<Button disabled={state !== "idle"}>
  {state === "sending" ? "שולחים..." : "שלח לי קישור"}
</Button>
```

ואחרי success:
```tsx
{state === "sent" && (
  <p>בדקו את המייל. הקישור תקף ל-60 דקות. <button onClick={resend}>שלח שוב</button></p>
)}
```

**עיקרון:** Disable כפתורים בזמן action, ותראה feedback ברור.

---

## 26. Supabase פעיל = ה-banner המעצבן

**תסמין:** ב-dashboard של Supabase יש banner צהוב למעלה: "We are investigating a technical issue".

**סיבה:** זה banner גנרי שמופיע גם כש-99% מהפלטפורמה עובדת. הם משאירים אותו "ליתר ביטחון".

**איך לבדוק שעובד:** SQL Editor — אם שאילתה רצה והחזירה תוצאה, ה-DB עובד. אל תחשוש מה-banner.

**רשמית:** `https://status.supabase.com/` — תבדוק אם הצלחת בעצמך.

---

## 27. `npm install` warnings על vulnerabilities

**תסמין:**
```
2 moderate severity vulnerabilities
To address all issues (including breaking changes), run:
  npm audit fix --force
```

**אל תריץ `--force`!** זה ישבור dependencies.

**מה לעשות:**
1. `npm audit` — תראה מה ה-vulnerabilities
2. רוב הזמן זה ב-dev dependencies (eslint, etc.) — לא פוגע ב-production
3. אם ב-runtime dep — `npm update PACKAGE` ידנית

**עכשיו:** 2 moderate הקיימים אצלנו הם בdev tools. לא מעניין.

---

## 28. כל יום — בדיקה לפני התחלת עבודה

תרגיל של 30 שניות לפני שאתה מתחיל לעבוד:

```powershell
cd C:\Users\Din\Desktop\spike-engine
pwd                      # ✅ spike-engine
git status               # ✅ clean או רק קבצים שאתה מצפה
git pull                 # ✅ up to date (לא צריך אם עובד לבד)
ls .env.local            # ✅ קיים
npm run dev              # ✅ Ready in <1s, אין errors
```

אם משהו מהדברים האלה לא נכון — **תקן לפני שאתה ממשיך**, לא במהלך.

---

## 29. Git — אל תכניס secrets, אל תכניס `node_modules`

**`.gitignore` שלנו צריך לכלול:**
```
.env.local
.env*.local
node_modules/
.next/
.vercel/
*.tsbuildinfo
```

**בדיקה לפני כל commit:**
```powershell
git status
# אסור לראות:
# - .env.local
# - node_modules/...
# - secrets בכל פורמט
```

**אם בטעות committed secret:**
1. **שנה את ה-secret מיד** (Supabase dashboard → API → reset)
2. `git filter-branch` או `BFG Repo-Cleaner` להסיר מההיסטוריה
3. `git push --force` (אם repo public, השינוי public)

**מקרה אמיתי שלנו:** ב-Day 1 כמעט הכנסנו תיקייה "כל מה שחשוב!" עם API keys ל-Git. נתפס בזכות `git status` שראה את הקובץ. תמיד תסתכל על הפלט!

---

## 30. תקלות זרימה ב-PowerShell

### "The 'from' keyword is not supported"
**סיבה:** הדבקת SQL ב-PowerShell במקום ב-Supabase SQL Editor.
**פתרון:** SQL → Supabase. PowerShell → רק `npm`, `git`, `cd`, `ls`, `Move-Item`.

### "A positional parameter cannot be found"
**סיבה:** הדבקה אקראית של טקסט מהפלט הקודם.
**פתרון:** הקש `Esc` לנקות את ה-input. הקש `Enter` בריק. נסה שוב.

### "Cannot find path because it does not exist"
**סיבה:** או pwd לא נכון, או הקובץ באמת לא שם.
**פתרון:**
```powershell
pwd                              # מאשרים מיקום
ls path-that-failed              # רואים אם זה שם
ls $env:USERPROFILE\Downloads    # אם downloads, אולי כבר הועבר
```

---

## 31. DNS — Vercel היחיד שעורכים, לא JetServer

**תסמין:** ניסית להוסיף A record או CNAME ב-JetServer DNS Records. JetServer הציג הודעה: "הדומיין לא מפנה אל ה-Nameservers שלהם".

**סיבה:** ב-Day 2 (27.4.2026) הועברו ה-Nameservers מ-`jetdns.net` ל-`vercel-dns.com`. כל ניהול DNS עובר עכשיו דרך Vercel dashboard בלבד. JetServer ממשיך להיות ה-registrar (חידוש דומיין, WHOIS) אבל לא ה-DNS provider.

**איפה לעבוד:**
- ✅ Vercel → Settings → Domains → `spikeai.co.il` → DNS Records
- ❌ JetServer → ניהול DNS (שינויים שם מתעלמים, לא מתפשטים לאינטרנט)

**JetServer רלוונטי רק ל:**
- חידוש דומיין שנתי
- WHOIS information
- העברת רישום (אם פעם תעבור לרשם אחר)

**איך לאמת ש-Vercel הוא ה-DNS פעיל:**
```
https://www.whatsmydns.net/#NS/spikeai.co.il
```
- אם רואים `vercel-dns.com` ברוב המיקומים — Vercel פעיל ✅
- אם רואים `jetdns.net` — JetServer עדיין פעיל, וכל שינוי ב-Vercel לא יעבוד

**הכלל הזהב:** Resend, Supabase, Stripe, או כל שירות שמבקש DNS records — **תוסיף ב-Vercel בלבד.**

---

## 32. Vercel MX records — Priority הוא placeholder, לא ערך

**תסמין:** הוספת MX record ב-Vercel נכשלת עם error: `Invalid request: missing required property 'mxPriority'`. שדה Priority מציג `10` בצבע אפור, נראה תקין.

**סיבה:** מה שאתה רואה ב-Priority הוא **placeholder text** (טקסט-רקע אפור), לא ערך אמיתי. Vercel דורש שתקליד את הערך ידנית.

**פתרון:**
1. לחץ בתוך השדה Priority
2. הקלד `10` ידנית (או כל מספר אחר רלוונטי)
3. ודא שהצבע הפך מאפור ללבן/בהיר — זה סימן לערך אמיתי
4. עכשיו לחץ Add

**מניעה:** תמיד לוודא שכל שדה placeholder הוקלד ידנית לפני שלוחצים Add — לא לסמוך על הצגה ויזואלית.

**רלוונטי גם ל:** TTL fields, Comment fields, ושדות אחרים ב-Vercel UI.

---

## 33. Resend Domains ≠ Vercel Domains — בלבול UI חמור

**תסמין:** ראית "spikeai.co.il" ב-screenshot, חשבת ש-Resend כבר מוגדר. בפועל זה היה Vercel.

**סיבה:** שני ה-UIs (Vercel Domains + Resend Domains) משתמשים בעיצובים דומים: רקע כהה, רשימת domains, הצגת תאריכים, "Third Party" labels.

**איך להבדיל:**
- **URL ב-tab:** `vercel.com/...` vs `resend.com/...`
- **Logo בפינה:** Vercel triangle vs Resend "R"
- **תפריט צד:** Vercel = Projects/Storage/Settings | Resend = Emails/Domains/API keys

**מניעה:** לפני שלוקחים החלטה על בסיס screenshot של "domain ב-Resend" — תמיד לוודא URL ב-tab.

---

## 34. Resend domain creation — Click tracking by default ON

**תסמין:** ב-Add domain flow ב-Resend, "Enable click tracking" מסומן (V) ולא תמיד ניתן להוריד אותו לפני יצירת הדומיין.

**סיבה:** Resend ממוקד ב-marketing emails, ושם click tracking הוא ברירת מחדל.

**הבעיה אצלנו:** Click tracking עוטף לינקים ב-redirect של Resend, מה ששובר Magic Links (Supabase מצפה לקוד מקורי).

**פתרון:**
1. ניצור דומיין רגיל (גם אם click tracking דלוק)
2. אחרי verification — Settings → Tracking → uncheck "Enable click tracking"
3. השינוי תופס מיידית, לא דורש re-verification

**מניעה:** לאחר verification של כל auth domain ב-Resend, מיד לבדוק Settings → Tracking ולהוריד click tracking.

**זכור:** auth subdomain → click tracking OFF, marketing subdomain → click tracking ON.

---

## איך להוסיף gotcha חדש למסמך הזה

תבנית:

```markdown
## NN. שם הבעיה (במשפט)

**תסמין:** מה רואים — error message או התנהגות.

**סיבה:** למה זה קורה (1-2 משפטים).

**פתרון:** קוד או step-by-step.

**מניעה:** איך לוודא שלא יחזור.
```

**עדכן בסוף יום עם כל גילוי חדש.** המסמך הזה הכי שימושי כשהוא חי.
