import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תנאי שימוש | Spike AI Agents",
  description: "תנאי השימוש באתר Spike AI Agents.",
};

export default function TermsPage() {
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
            <span>מסמך משפטי</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">תנאי שימוש</h1>
          <p className="text-sm text-white/60">תאריך עדכון אחרון: [יעודכן עם השלמת ההקמה]</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">1. כללי וקבלת התנאים</h2>
            <p className="text-white/80 leading-relaxed">
              ברוכים הבאים לאתר Spike AI Agents (להלן: &quot;האתר&quot;), המופעל על ידי דין משה (Dean Moshe),
              עוסק פטור (בהליכי הקמה) (להלן: &quot;המפעיל&quot; או &quot;אנו&quot;). השימוש באתר, לרבות גלישה בו והזנת
              פרטים בטופסי יצירת קשר, כפוף לתנאי שימוש אלה (להלן: &quot;התקנון&quot;) ומהווה הסכמה מלאה ומפורשת
              לכל האמור בו. אם אינך מסכים/ה לתנאים — אנא הימנע/י משימוש באתר.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              התקנון מנוסח בלשון זכר מטעמי נוחות בלבד ומופנה לכל המינים כאחד.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">2. הגדרות</h2>
            <ul className="list-disc list-inside space-y-2 text-white/80 mr-4">
              <li>&quot;האתר&quot; — אתר האינטרנט של Spike AI Agents, על כל דפיו, תכניו ומערכותיו.</li>
              <li>&quot;המשתמש&quot; — כל אדם או תאגיד הגולש באתר או מוסר בו פרטים.</li>
              <li>&quot;השירותים&quot; — שירותי ייעוץ, פיתוח והטמעה של סוכני AI לעסקים, וכל שירות נלווה המוצע על ידי המפעיל.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">3. אופי האתר ותיאור השירות</h2>
            <p className="text-white/80 leading-relaxed">
              האתר משמש כאתר תדמית ולגיוס לידים בלבד. המידע באתר מוצג למטרות אינפורמטיביות ושיווקיות
              ואינו מהווה הצעה מחייבת. ההתקשרות הסופית למתן שירותים תיעשה אך ורק באמצעות הסכם נפרד שייחתם
              בין הצדדים.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              השירותים כוללים פיתוח והטמעה של פתרונות מבוססי בינה מלאכותית.{" "}
              <strong className="text-white">המשתמש מאשר ומבין כי תוצרי מערכות AI עשויים לכלול שגיאות,
              אי-דיוקים או &quot;הזיות&quot; (hallucinations), וכי באחריותו לבדוק ולאמת כל תוצר לפני הסתמכות עסקית עליו.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">4. סטטוס עוסק פטור</h2>
            <p className="text-white/80 leading-relaxed">
              המפעיל הינו עוסק פטור (בהליכי הקמה) לפי חוק מס ערך מוסף, התשל&quot;ו-1975. בהתאם לכך, המחירים
              שיוצעו אינם כוללים מע&quot;מ ולא תונפק חשבונית מס בגין השירות, אלא קבלה בלבד. הלקוח מאשר כי
              קרא והבין סטטוס זה והשלכותיו הפיסקאליות.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">5. השימוש המותר באתר</h2>
            <p className="text-white/80 leading-relaxed mb-4">אסור למשתמש:</p>
            <ul className="list-disc list-inside space-y-2 text-white/80 mr-4">
              <li>לעשות שימוש באתר למטרה בלתי-חוקית, פוגענית או מטעה;</li>
              <li>להעתיק, לשכפל או לאסוף מידע באמצעות &quot;crawlers&quot;, &quot;scrapers&quot; או כל כלי אוטומטי אחר ללא אישור מראש ובכתב;</li>
              <li>לשבש את פעולת האתר, לעקוף את אבטחתו או להעמיס על שרתיו;</li>
              <li>למסור פרטים כוזבים או של אדם אחר ללא הסכמתו;</li>
              <li>להשתמש באתר לתחרות מסחרית עם המפעיל.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">6. קניין רוחני</h2>
            <p className="text-white/80 leading-relaxed">
              כל זכויות הקניין הרוחני באתר ובשירותים — לרבות זכויות יוצרים, סימני מסחר, עיצוב, קוד מקור,
              גרפיקה, טקסטים, סרטונים, תבניות-הנחיה (Prompts), מודלים מותאמים ולוגו &quot;Spike AI Agents&quot; —
              שמורות במלואן למפעיל או למעניקי הרישיון לו. אין להעתיק, לשכפל, להפיץ, לפרסם, ליצור יצירה נגזרת,
              להנדס לאחור או לעשות כל שימוש מסחרי בכל חומר מהאתר ללא אישור מראש ובכתב של המפעיל.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">© 2026 Spike AI Agents. כל הזכויות שמורות.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">7. הגבלת אחריות</h2>
            <p className="text-white/80 leading-relaxed">
              האתר והתכנים בו מסופקים{" "}
              <strong className="text-white">&quot;כמות שהם&quot; (As Is) ולפי זמינותם (As Available)</strong>,
              ללא כל מצג, התחייבות או אחריות מכל סוג, מפורשת או משתמעת. מבלי לגרוע מכלליות האמור, וככל המותר בדין:
            </p>
            <ul className="list-disc list-inside space-y-3 mt-4 text-white/80 mr-4">
              <li>המפעיל אינו אחראי לכל נזק עקיף, מקרי, מיוחד או תוצאתי, לרבות אובדן רווחים, הזדמנויות עסקיות, מוניטין או מידע, הנובעים משימוש או מאי-יכולת להשתמש באתר או בתוכנו.</li>
              <li>המפעיל אינו אחראי לתקלות, הפרעות, וירוסים, או פגיעות אבטחה אצל ספקי שירות חיצוניים (לרבות Vercel, Web3Forms, Google).</li>
              <li>אחריותו הכוללת של המפעיל בכל מקרה ובכל עילה לא תעלה על הסכום הכולל ששולם בפועל למפעיל בגין השירות הספציפי שעורר את עילת התביעה ב-12 החודשים שקדמו למועד הולדתה של עילת התביעה.</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              האמור בסעיף זה כפוף להוראות הדין הקוגנטיות; ככל שייקבע על-ידי בית משפט מוסמך כי תנאי הגבלת אחריות
              כלשהו אינו ניתן לאכיפה, ייאכפו יתר התנאים במלואם.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">8. שיפוי</h2>
            <p className="text-white/80 leading-relaxed">
              המשתמש מתחייב לשפות את המפעיל, מנהליו ומי מטעמו בגין כל נזק, הפסד, הוצאה או תשלום (לרבות שכ&quot;ט עו&quot;ד
              והוצאות משפט) שייגרמו להם עקב הפרת תנאי שימוש אלה על-ידי המשתמש או עקב שימוש בלתי-חוקי או בלתי-ראוי
              בו באתר.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">9. פרטיות</h2>
            <p className="text-white/80 leading-relaxed">
              איסוף ועיבוד מידע אישי במסגרת השימוש באתר כפופים ל
              <Link href="/privacy" className="text-[#5EEAD4] hover:underline">מדיניות הפרטיות</Link>{" "}
              שלנו, המהווה חלק בלתי-נפרד מתקנון זה.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">10. קישורים לאתרי צד ג&apos;</h2>
            <p className="text-white/80 leading-relaxed">
              האתר עשוי לכלול קישורים לאתרים של צדדים שלישיים. הקישורים ניתנים לנוחות המשתמש בלבד, ואין למפעיל
              שליטה או אחריות לתוכנם, למדיניותם או לזמינותם.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">11. שינויים בתקנון ובאתר</h2>
            <p className="text-white/80 leading-relaxed">
              המפעיל רשאי לשנות מעת לעת את התקנון, את מבנה האתר, את עיצובו, את היקף השירותים ואת זמינותם, לפי
              שיקול דעתו הבלעדי וללא הודעה מוקדמת. הנוסח המעודכן יפורסם באתר וייכנס לתוקף ממועד פרסומו. שינויים
              מהותיים יסומנו בבירור בפסקת &quot;תאריך עדכון אחרון&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">12. סיום ההתקשרות</h2>
            <p className="text-white/80 leading-relaxed">
              המפעיל רשאי, לפי שיקול דעתו ובהתאם לדין, להפסיק או להגביל את השימוש של משתמש שהפר את התקנון, את
              הדין או את זכויות צדדים שלישיים, ללא הודעה מוקדמת ומבלי שהדבר יקנה למשתמש זכות לפיצוי או החזר כלשהו.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">13. דין וסמכות שיפוט</h2>
            <p className="text-white/80 leading-relaxed">
              על תקנון זה, על השימוש באתר ועל כל הקשור בהם יחולו אך ורק דיני מדינת ישראל (מבלי ליתן תוקף לכללי
              ברירת הדין הבינלאומי שבהם). סמכות השיפוט הבלעדית בכל סכסוך, בלא יוצא מן הכלל, נתונה לבתי המשפט
              המוסמכים בעיר תל אביב-יפו בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">14. הוראות כלליות</h2>
            <p className="text-white/80 leading-relaxed">
              תקנון זה יחד עם מדיניות הפרטיות מהווים את ההסכם המלא בין הצדדים. כל הוויתור על זכות לפי התקנון
              מחייב מסמך בכתב. אם תנאי כלשהו ייקבע כבטל או לא ניתן לאכיפה, יתר ההוראות יישארו בתוקפן המלא.
              אין להמחות זכויות או חובות לפי תקנון זה ללא הסכמת המפעיל מראש ובכתב.
            </p>
          </section>

          <section className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">15. יצירת קשר</h2>
            <ul className="space-y-2 text-white/80">
              <li>👤 בעלים: דין משה (Dean Moshe) — Spike AI Agents</li>
              <li>🪪 סטטוס: עוסק פטור (בהליכי הקמה)</li>
              <li>📧 דוא&quot;ל: <a href="mailto:spikeaistudio@gmail.com" className="text-[#5EEAD4] hover:underline">spikeaistudio@gmail.com</a></li>
            </ul>
          </section>

        </div>
      </main>

      <footer className="relative border-t border-white/10 bg-[#07111A]/60 backdrop-blur-md mt-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/60">© 2026 Spike AI Agents. כל הזכויות שמורות.</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-[#5EEAD4] transition">מדיניות פרטיות</Link>
              <Link href="/terms" className="text-[#5EEAD4]">תנאי שימוש</Link>
              <Link href="/cookies" className="text-white/60 hover:text-[#5EEAD4] transition">מדיניות עוגיות</Link>
              <Link href="/accessibility" className="text-white/60 hover:text-[#5EEAD4] transition">הצהרת נגישות</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
