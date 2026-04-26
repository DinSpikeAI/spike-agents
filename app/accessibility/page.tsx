import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות | Spike AI Agents",
  description: "הצהרת נגישות של אתר Spike AI Agents.",
};

export default function AccessibilityPage() {
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
            <span>♿ נגישות</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">הצהרת נגישות</h1>
          <p className="text-sm text-white/60">תאריך עדכון אחרון: [יעודכן עם השלמת ההקמה]</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">מחויבות לנגישות</h2>
            <p className="text-white/80 leading-relaxed">
              Spike AI Agents (להלן: &quot;האתר&quot;), בבעלות דין משה (עוסק פטור — בהליכי הקמה), רואה חשיבות עליונה
              במתן שירות שוויוני, מכבד ונגיש לכלל הציבור, לרבות אנשים עם מוגבלות. אנו פועלים להנגיש את האתר
              ככל הניתן, מתוך הכרה בזכות כל אדם לחוות את השירות באופן עצמאי ובכבוד.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">בסיס משפטי וסטטוס פטור</h2>
            <p className="text-white/80 leading-relaxed">
              הצהרה זו ניתנת בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998, ובהתאם לתקנות
              שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013 (להלן: &quot;תקנות הנגישות&quot;).
            </p>
            <div className="mt-6 bg-[#22D3B0]/[0.05] border border-[#22D3B0]/20 rounded-xl p-6">
              <p className="text-white/80 leading-relaxed">
                בהתאם לתקנה 35(ט) לתקנות הנגישות, עוסק פטור לפי חוק מע&quot;מ, התשל&quot;ו-1975, פטור באופן אוטומטי
                מביצוע התאמות נגישות לאתר אינטרנט.{" "}
                <strong className="text-white">Spike AI Agents הינו עוסק פטור (בהליכי הקמה) ולפיכך חל עליו פטור זה.</strong>{" "}
                על אף הפטור, ביצענו על דעת עצמנו מספר התאמות נגישות, כמפורט להלן, ואנו מספקים אמצעים חלופיים
                נגישים לקבלת השירות.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">רמת הנגישות</h2>
            <p className="text-white/80 leading-relaxed">
              האתר נבנה בשאיפה לעמוד בהנחיות תקן ישראלי ת&quot;י 5568 ברמה AA, התואם את הנחיות WCAG 2.0/2.1
              של ארגון W3C.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">התאמות הנגישות שבוצעו באתר</h2>
            <ul className="list-disc list-inside space-y-3 text-white/80 mr-4">
              <li>תמיכה בניווט מלא באמצעות מקלדת (מקש Tab למעבר בין רכיבים, Shift+Tab לאחור, Enter להפעלה).</li>
              <li>תמיכה בקוראי מסך נפוצים (NVDA, JAWS, VoiceOver).</li>
              <li>היררכיית כותרות סמנטית (H1–H6) ומבנה עמוד תקין.</li>
              <li>טקסט חלופי (alt) לתמונות בעלות משמעות.</li>
              <li>ניגודיות צבעים בהתאם לדרישות התקן (יחס 4.5:1 לפחות לטקסט רגיל).</li>
              <li>תוויות (labels) ברורות לכל שדות הטופס.</li>
              <li>תמיכה בהגדלת טקסט באמצעות הדפדפן עד 200% ללא אובדן תוכן או פונקציונליות.</li>
              <li>אין באתר תוכן מהבהב או נע באופן בלתי-נשלט.</li>
              <li>תאימות לדפדפנים מודרניים (Chrome, Firefox, Edge, Safari) ולמכשירי קצה שונים.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">חלקים שאינם נגישים במלואם (החרגות)</h2>
            <p className="text-white/80 leading-relaxed">
              חרף מאמצינו, ייתכן שיתגלו דפים או רכיבים שטרם הונגשו במלואם, לרבות תכנים המסופקים על-ידי צדדים
              שלישיים (סרטונים משובצים, מפות Google, טפסים חיצוניים וכד&apos;). אנו פועלים להציע חלופה נגישה
              בכל מקרה כזה.
            </p>
          </section>

          <section className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">אמצעים חלופיים לקבלת שירות</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              ניתן לפנות אלינו בכל אחת מהדרכים הבאות לקבלת מידע, סיוע או תיאום שירות בדרך נגישה:
            </p>
            <ul className="space-y-3 text-white/80">
              <li>👤 איש קשר לנגישות: דין משה — בעל העסק</li>
              <li>📧 דואר אלקטרוני: <a href="mailto:spikeaistudio@gmail.com" className="text-[#5EEAD4] hover:underline">spikeaistudio@gmail.com</a></li>
              <li>📝 טופס יצירת קשר נגיש בדף הבית</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">פנייה בנושא נגישות וטיפול בליקויים</h2>
            <p className="text-white/80 leading-relaxed">
              אם נתקלת בבעיית נגישות באתר, נשמח אם תיידע אותנו ונפעל לתיקון בהקדם האפשרי, ולא יאוחר
              מ-60 ימים מיום קבלת הפנייה, בהתאם לתקנה 35א(ד)(1) לתקנות הנגישות.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              ניתן גם לפנות לנציבות שוויון זכויות לאנשים עם מוגבלויות במשרד המשפטים בכתובת{" "}
              <a href="mailto:pniotnez@justice.gov.il" className="text-[#5EEAD4] hover:underline">pniotnez@justice.gov.il</a>.
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
              <Link href="/cookies" className="text-white/60 hover:text-[#5EEAD4] transition">מדיניות עוגיות</Link>
              <Link href="/accessibility" className="text-[#5EEAD4]">הצהרת נגישות</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
