import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות עוגיות | Spike AI Agents",
  description: "מדיניות העוגיות (Cookies) של אתר Spike AI Agents.",
};

export default function CookiesPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#07111A] text-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22D3B0]/10 blur-[180px] rounded-full"></div>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#07111A]/70 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="relative w-10 h-10">
              <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="40px" className="object-contain mix-blend-screen" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Spike AI</span>
              <span className="text-[10px] font-bold tracking-widest text-[#5EEAD4] bg-[#14B8A6]/15 border border-[#14B8A6]/30 px-2 py-0.5 rounded-full">
                AGENTS
              </span>
            </div>
          </Link>
          <Link href="/" className="text-sm text-white/70 hover:text-[#5EEAD4] transition flex items-center gap-2">
            <span>→</span>
            <span>חזרה לדף הבית</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-16 relative">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
            <span>🍪 עוגיות</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">מדיניות עוגיות</h1>
          <p className="text-sm text-white/60">תאריך עדכון אחרון: [יעודכן עם השלמת ההקמה]</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">מהן עוגיות?</h2>
            <p className="text-white/80 leading-relaxed">
              עוגיות (Cookies) הן קובצי טקסט קטנים המכילים מחרוזות של אותיות ומספרים, הנשמרים על המחשב או
              המכשיר הנייד שלך באמצעות הדפדפן בעת ביקורך באתר. קבצים אלה נשלחים בחזרה לאתר המקור בכל ביקור
              נוסף ומאפשרים זיהוי המכשיר ותיעוד פעילותך באתר.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">סוגי העוגיות באתר</h2>

            <div className="space-y-5 mt-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">1. עוגיות חיוניות (הכרחיות)</h3>
                <p className="text-white/75 leading-relaxed">
                  דרושות לפעולתו התקינה של האתר ולא ניתן לכבותן. בכלל זה: עוגיות אבטחה, ניהול תקיני של הטופס.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">2. עוגיות פונקציונליות</h3>
                <p className="text-white/75 leading-relaxed">
                  שומרות העדפות משתמש (כגון שפה, תצוגה).
                </p>
              </div>

              <div className="bg-[#22D3B0]/[0.05] border border-[#22D3B0]/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">3. עוגיות ניתוח וביצועים (אופציונליות, דורשות הסכמה)</h3>
                <p className="text-white/75 leading-relaxed">
                  בעתיד אנו עשויים לעשות שימוש ב-Google Analytics 4 של חברת Google LLC לצורך מדידת תעבורה,
                  מקורות הפניה ושיפור האתר. עוגיות אלה ייטענו{" "}
                  <strong className="text-white">רק לאחר קבלת הסכמתך המפורשת</strong> באמצעות באנר ההסכמה.
                  המידע הנאסף ב-Google Analytics מועבר לשרתי Google בארה&quot;ב ובאיחוד האירופי.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-2">4. עוגיות שיווק/פרסום</h3>
                <p className="text-white/75 leading-relaxed">
                  כיום לא מופעלות. אם נוסיף בעתיד פיקסלי שיווק (Meta Pixel, LinkedIn Insight וכד&apos;) — תינתן
                  לכך הסכמה נפרדת בבאנר.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">ניהול עוגיות</h2>
            <p className="text-white/80 leading-relaxed">
              ניתן לקבל, לדחות או להתאים אישית את העוגיות באמצעות באנר ההסכמה בכניסה לאתר. ניתן לשנות את
              ההעדפות בכל עת על-ידי לחיצה על הקישור &quot;שינוי העדפות עוגיות&quot; שבכותרת התחתונה (footer) של האתר.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              ניתן גם לחסום או למחוק עוגיות באמצעות הגדרות הדפדפן (Chrome, Firefox, Safari, Edge). שים/י לב
              כי השבתה גורפת של עוגיות עלולה לפגוע בתפקוד חלקים מהאתר.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              ניתן למנוע איסוף נתונים על-ידי Google Analytics באמצעות התקנת תוסף הדפדפן הזמין בכתובת:{" "}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#5EEAD4] hover:underline" target="_blank" rel="noopener">
                tools.google.com/dlpage/gaoptout
              </a>.
            </p>
          </section>

          <section className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">בסיס משפטי</h2>
            <p className="text-white/80 leading-relaxed">
              השימוש בעוגיות נעשה בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981 (כנוסחו לאחר תיקון 13, אוגוסט 2025)
              ולהנחיות הרשות להגנת הפרטיות. עוגיות שאינן חיוניות ייטענו אך ורק לאחר קבלת הסכמה מפורשת ופעילה
              מצדך (opt-in).
            </p>
          </section>

        </div>
      </main>

      <footer className="relative border-t border-white/10 bg-[#07111A]/60 backdrop-blur-md mt-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/60">© 2026 Spike AI Agents. כל הזכויות שמורות.</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-[#5EEAD4] transition">מדיניות פרטיות</Link>
              <Link href="/terms" className="text-white/60 hover:text-[#5EEAD4] transition">תנאי שימוש</Link>
              <Link href="/cookies" className="text-[#5EEAD4]">מדיניות עוגיות</Link>
              <Link href="/accessibility" className="text-white/60 hover:text-[#5EEAD4] transition">הצהרת נגישות</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
