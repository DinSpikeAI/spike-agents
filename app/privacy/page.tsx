import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | Spike AI Agents",
  description: "מדיניות הפרטיות של Spike AI Agents — איך אנו אוספים, משתמשים ומגנים על המידע שלך.",
};

export default function PrivacyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#07111A] text-white">
      {/* רקע גלו עדין */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22D3B0]/10 blur-[180px] rounded-full"></div>
      </div>

      {/* Navigation */}
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

      {/* תוכן */}
      <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-16 relative">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
            <span>מסמך משפטי</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">מדיניות פרטיות</h1>
          <p className="text-sm text-white/60">תאריך עדכון אחרון: [יעודכן עם השלמת ההקמה]</p>
        </div>

        <div className="prose-legal space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">1. כללי</h2>
            <p className="text-white/80 leading-relaxed">
              מדיניות פרטיות זו מתארת את האופן שבו Spike AI Agents, בבעלות דין משה (Dean Moshe),
              עוסק פטור (בהליכי הקמה), דוא&quot;ל spikeaistudio@gmail.com (להלן: &quot;העסק&quot;, &quot;אנו&quot;), אוספת,
              משתמשת, מאחסנת ומגלה מידע אישי שנמסר לה באמצעות אתר האינטרנט (להלן: &quot;האתר&quot;).
              מדיניות זו מהווה חלק בלתי-נפרד מתנאי השימוש באתר. המדיניות מנוסחת בלשון זכר מטעמי
              נוחות בלבד וחלה באופן זהה על כל המינים.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              מסמך זה מהווה גם הודעת יידוע לפי סעיף 11 לחוק הגנת הפרטיות, התשמ&quot;א-1981 (להלן: &quot;החוק&quot;),
              כפי שתוקן בתיקון 13 לחוק (תוקף החל מיום 14.8.2025).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">2. זהות בעל השליטה במאגר המידע</h2>
            <p className="text-white/80 leading-relaxed">
              בעל השליטה במאגר המידע (Data Controller), כהגדרתו בחוק, הוא:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 text-white/80 mr-4">
              <li>שם: דין משה (Dean Moshe), בשם העסק &quot;Spike AI Agents&quot;</li>
              <li>סטטוס: עוסק פטור (בהליכי הקמה — מסמך זה יעודכן עם השלמת הרישום)</li>
              <li>דואר אלקטרוני לפניות בענייני פרטיות: spikeaistudio@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">3. המידע הנאסף</h2>
            <p className="text-white/80 leading-relaxed">
              בעת שימושך באתר ומילוי טופס יצירת הקשר, אנו אוספים את סוגי המידע הבאים:
            </p>
            <ul className="list-disc list-inside space-y-3 mt-4 text-white/80 mr-4">
              <li>
                <strong className="text-white">מידע שמסרת באופן יזום בטופס:</strong>{" "}
                שם מלא, מספר טלפון, כתובת דואר אלקטרוני, סוג עסק/תחום פעילות.
              </li>
              <li>
                <strong className="text-white">מידע טכני שנאסף אוטומטית:</strong>{" "}
                כתובת IP, סוג דפדפן ומערכת הפעלה, אורך הביקור והדפים שנצפו, מקור ההפניה, תאריך ושעת הביקור.
              </li>
              <li>
                <strong className="text-white">קובצי Cookies:</strong>{" "}
                כמפורט ב<Link href="/cookies" className="text-[#5EEAD4] hover:underline">מדיניות העוגיות</Link> שלנו.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">4. בסיס משפטי, חובת מסירה ותוצאות אי-מסירה</h2>
            <p className="text-white/80 leading-relaxed">
              מסירת המידע אינה חובה חוקית והיא תלויה ברצונך ובהסכמתך החופשית. אינך חייב/ת על-פי דין למסור
              את המידע. ואולם, ללא מסירת הפרטים בשדות החובה, לא נוכל ליצור עמך קשר, לטפל בפנייתך או לספק
              לך מידע על שירותינו.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              עיבוד המידע מתבסס על הסכמתך המפורשת (כפי שניתנת באמצעות סימון תיבות ההסכמה בטופס), על קיום
              יחסים חוזיים או טרום-חוזיים עמך, ועל אינטרסים לגיטימיים שלנו לניהול קשרי לקוחות והגנה משפטית.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">5. מטרות השימוש במידע</h2>
            <p className="text-white/80 leading-relaxed">אנו עושים שימוש במידע למטרות הבאות:</p>
            <ol className="list-decimal list-inside space-y-2 mt-4 text-white/80 mr-4">
              <li>מענה לפנייתך, יצירת קשר עמך והעברת הצעת שירות בתחום סוכני AI ושירותים נלווים.</li>
              <li>ניהול קשרי לקוחות וטיפול בבקשות, שאלות ותלונות.</li>
              <li>שיפור האתר והשירותים, לרבות ניתוח סטטיסטי אגרגטיבי של תעבורה.</li>
              <li>משלוח עדכונים, חומר שיווקי ודברי פרסומת — אך ורק אם נתת לכך הסכמה מפורשת ונפרדת.</li>
              <li>עמידה בדרישות הדין ובצווים של רשויות מוסמכות.</li>
              <li>הגנה על זכויותינו המשפטיות ומניעת שימוש לרעה והונאות.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">6. העברת מידע לצדדים שלישיים והעברה אל מחוץ לישראל</h2>
            <p className="text-white/80 leading-relaxed">
              לצורך תפעול האתר ושירותינו אנו נעזרים בספקי שירות חיצוניים, אשר מעבדים את המידע מטעמנו בלבד
              ובהתאם להוראותינו:
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-3 px-3 text-[#5EEAD4]">ספק</th>
                    <th className="text-right py-3 px-3 text-[#5EEAD4]">שירות</th>
                    <th className="text-right py-3 px-3 text-[#5EEAD4]">מיקום</th>
                  </tr>
                </thead>
                <tbody className="text-white/75">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-3">Web3Forms</td>
                    <td className="py-3 px-3">קבלת ועיבוד טפסי יצירת-קשר ושליחתם בדוא&quot;ל</td>
                    <td className="py-3 px-3">שרתי AWS בארה&quot;ב</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-3">Vercel Inc.</td>
                    <td className="py-3 px-3">אירוח האתר (Hosting), CDN ולוגים טכניים</td>
                    <td className="py-3 px-3">ארה&quot;ב, רפליקציה גלובלית</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-3">Google Analytics 4</td>
                    <td className="py-3 px-3">ניתוח תעבורה — רק לאחר הסכמתך לעוגיות אנליטיות (אם נוסיף בעתיד)</td>
                    <td className="py-3 px-3">ארה&quot;ב / האיחוד האירופי</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-white/80 leading-relaxed mt-6">
              חלק מספקי השירות הללו ממוקמים בארצות הברית, מחוץ לגבולות מדינת ישראל. ארה&quot;ב אינה כלולה
              ברשימת המדינות בעלות הגנה הולמת לפי תקנות הגנת הפרטיות (העברת מידע אל מאגרי מידע שמחוץ
              לגבולות המדינה), התשס&quot;א-2001. בהתאם לכך, העברת המידע מתבצעת על בסיס{" "}
              <strong className="text-white">הסכמתך המפורשת</strong> הניתנת בעת מסירת הפרטים בטופס,
              וכן על בסיס התחייבויות חוזיות של ספקי השירות לרמת אבטחה ופרטיות מקובלת.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">7. עוגיות (Cookies)</h2>
            <p className="text-white/80 leading-relaxed">
              האתר משתמש בקובצי Cookies כמתואר ב<Link href="/cookies" className="text-[#5EEAD4] hover:underline">מדיניות העוגיות</Link> שלנו.
              עוגיות חיוניות בלבד נטענות אוטומטית. עוגיות שאינן חיוניות (לרבות עוגיות Google Analytics, ככל שנוסיף אותן בעתיד)
              ייטענו רק לאחר קבלת הסכמתך המפורשת באמצעות באנר ההסכמה.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">8. שמירת מידע ותקופת אחזקה</h2>
            <p className="text-white/80 leading-relaxed">
              אנו שומרים את המידע שמסרת רק למשך הזמן הדרוש להגשמת המטרות שלשמן נאסף:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 text-white/80 mr-4">
              <li>מידע של ליד שלא הבשיל לעסקה — עד 24 חודשים, ולאחר מכן יימחק או יעבור אנונימיזציה.</li>
              <li>מידע של לקוח פעיל — לכל אורך תקופת ההתקשרות, ועד 7 שנים מתום ההתקשרות לצרכים חשבונאיים והגנה משפטית.</li>
              <li>בשרתי Web3Forms — המידע נמחק אוטומטית לאחר 30 יום (תכנית חינם) כמדיניות הספק.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">9. אבטחת מידע</h2>
            <p className="text-white/80 leading-relaxed">
              אנו נוקטים אמצעי אבטחה סבירים ומקובלים בהתאם לתקנות הגנת הפרטיות (אבטחת מידע), התשע&quot;ז-2017,
              לרבות הצפנת תעבורה בפרוטוקול HTTPS/TLS, ניהול הרשאות גישה, ניטור והגבלת גישה למידע אישי.
              עם זאת, איננו יכולים להבטיח חסינות מוחלטת בפני חדירות, חשיפה או שיבושים.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">10. זכויותיך כנושא המידע</h2>
            <p className="text-white/80 leading-relaxed">בכפוף להוראות החוק, עומדות לך הזכויות הבאות:</p>
            <ul className="list-disc list-inside space-y-3 mt-4 text-white/80 mr-4">
              <li><strong className="text-white">זכות עיון</strong> (סעיף 13 לחוק) — לעיין במידע האישי המוחזק עליך.</li>
              <li><strong className="text-white">זכות תיקון או מחיקה</strong> (סעיף 14 לחוק) — לבקש לתקן או למחוק מידע שאינו נכון, שלם, ברור או מעודכן.</li>
              <li><strong className="text-white">זכות התנגדות לדיוור פרסומי</strong> — לבקש להסיר את פרטיך מרשימות התפוצה השיווקיות בכל עת.</li>
              <li><strong className="text-white">זכות חזרה מהסכמה</strong> — לחזור בך מכל הסכמה שניתנה.</li>
              <li>
                <strong className="text-white">זכות הגשת תלונה</strong> לרשות להגנת הפרטיות בכתובת{" "}
                <a href="https://www.gov.il/he/departments/the_privacy_protection_authority" className="text-[#5EEAD4] hover:underline" target="_blank" rel="noopener">gov.il</a>.
              </li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              למימוש זכויות אלה, אנא פנה/י בדואר אלקטרוני לכתובת{" "}
              <a href="mailto:spikeaistudio@gmail.com" className="text-[#5EEAD4] hover:underline">spikeaistudio@gmail.com</a>.
              נשתדל להשיב לפנייתך תוך 30 ימים. ייתכן שנידרש לאמת את זהותך לפני מסירת המידע.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">11. קישורים לאתרים חיצוניים</h2>
            <p className="text-white/80 leading-relaxed">
              האתר עשוי לכלול קישורים לאתרי צד שלישי. מדיניות הפרטיות של אתרים אלה היא באחריותם הבלעדית,
              ואיננו אחראים לתוכנם או לפרקטיקות הפרטיות שלהם.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">12. שינויים במדיניות</h2>
            <p className="text-white/80 leading-relaxed">
              אנו רשאים לעדכן מדיניות זו מעת לעת. הנוסח המעודכן יפורסם באתר וייכנס לתוקף ממועד הפרסום.
              בשינויים מהותיים נודיע לך באמצעי קשר סביר. מומלץ לשוב ולעיין במדיניות מעת לעת.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">13. דין וסמכות שיפוט</h2>
            <p className="text-white/80 leading-relaxed">
              על מדיניות זו יחולו אך ורק דיני מדינת ישראל. סמכות השיפוט הבלעדית בכל מחלוקת תהא נתונה
              לבתי המשפט המוסמכים בעיר תל אביב-יפו.
            </p>
          </section>

          <section className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-[#5EEAD4] mb-4">14. יצירת קשר</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              לכל שאלה בעניין מדיניות זו או בנוגע לטיפול במידע שלך, ניתן לפנות אלינו:
            </p>
            <ul className="space-y-2 text-white/80">
              <li>📧 דוא&quot;ל: <a href="mailto:spikeaistudio@gmail.com" className="text-[#5EEAD4] hover:underline">spikeaistudio@gmail.com</a></li>
              <li>👤 בעלים: דין משה (Dean Moshe) — Spike AI Agents</li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-[#07111A]/60 backdrop-blur-md mt-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-white/60">© 2026 Spike AI Agents. כל הזכויות שמורות.</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="text-[#5EEAD4]">מדיניות פרטיות</Link>
              <Link href="/terms" className="text-white/60 hover:text-[#5EEAD4] transition">תנאי שימוש</Link>
              <Link href="/cookies" className="text-white/60 hover:text-[#5EEAD4] transition">מדיניות עוגיות</Link>
              <Link href="/accessibility" className="text-white/60 hover:text-[#5EEAD4] transition">הצהרת נגישות</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
