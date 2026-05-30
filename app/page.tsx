"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const WEB3FORMS_KEY = "0b0d2e56-49e7-443f-b4bc-444c083b01ac";

// גרסת המדיניות שהליד ראה בעת ההסכמה - לעדכן בכל שינוי מהותי במדיניות הפרטיות/תנאי השימוש
const POLICY_VERSION = "1.0";

/* ===== Monochrome line icons (Lucide-style, 24x24, currentColor) ===== */
type IconKey =
  | "sun"
  | "share"
  | "compass"
  | "target"
  | "trending"
  | "star"
  | "package"
  | "flame"
  | "sprout";

function AgentGlyph({ name, className }: { name: IconKey; className?: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "trending":
      return (
        <svg {...common}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M16.5 9.4 7.55 4.24" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "sprout":
      return (
        <svg {...common}>
          <path d="M7 20h10" />
          <path d="M10 20c5.5-2.5.8-6.4 3-10" />
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
          <path d="M14.1 6c-.9.8-2 2.3-2.6 3.5 1.5.2 2.7-.2 3.9-1.2 1.1-1 2-2.4 2.6-4.3-2.4.1-3.8.7-3.9 2z" />
        </svg>
      );
  }
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const agents: { iconKey: IconKey; name: string; description: string }[] = [
  {
    iconKey: "sun",
    name: "סוכן בוקר",
    description: "כל בוקר ב-7:00 דוח מלא בוואטסאפ. מה קרה אתמול, מה ההזדמנויות החמות, ומה צריך לטפל היום.",
  },
  {
    iconKey: "share",
    name: "סוכן רשתות",
    description: "3 פוסטים ביום (9:00, 14:00, 19:00), מותאמים לטון של העסק. מוכנים ללחיצה אחת והעלאה.",
  },
  {
    iconKey: "compass",
    name: "סוכן מנהל",
    description: "סיכום אסטרטגי יומי בעברית עם המלצות אמיתיות. כמו מנהל אישי שמכיר את העסק שלך.",
  },
  {
    iconKey: "target",
    name: "סוכן מעקב",
    description: "התראות בזמן אמת על אירועים חמים - לקוח חדש, ביקורת חדשה, ליד שמתקרר. אתה הראשון לדעת.",
  },
  {
    iconKey: "trending",
    name: "סוכן מכירות",
    description: "מנתח deals תקועים, מסמן לידים חמים, ומנסח follow-ups שמחזירים שיחות לחיים.",
  },
  {
    iconKey: "star",
    name: "סוכן ביקורות",
    description: "סורק ביקורות חדשות בגוגל ובאינסטגרם, מנסח תגובות, ומתריע על ביקורות שדורשות טיפול דחוף.",
  },
  {
    iconKey: "package",
    name: "סוכן מלאי",
    description: "מתריע על מלאי נמוך לפני שאוזל, חוזה ביקוש, ומסמן מוצרים שמתחילים לרדת בביצועים.",
  },
  {
    iconKey: "flame",
    name: "סוכן לידים חמים",
    description: "מדרג לידים נכנסים אוטומטית, מתעדף לפי סבירות לסגירה, ומסמן את אלה ששווה לחזור אליהם עכשיו.",
  },
  {
    iconKey: "sprout",
    name: "סוכן צמיחה",
    description: "מאתר לקוחות רדומים ולידים שנשכחו, ומנסח להם הודעת חזרה אישית. הכנסה שכבר הייתה ביד וחיכתה.",
  },
];

const packageIncludes = {
  agents: [
    "סוכן בוקר ☀️ - דוח יומי בוואטסאפ ב-7:00",
    "סוכן רשתות 📱 - 3 פוסטים מוכנים בכל יום",
    "סוכן מנהל 🧠 - סיכום אסטרטגי יומי",
    "סוכן מעקב 🎯 - התראות בזמן אמת",
    "סוכן מכירות 💰 - מנתח deals תקועים",
    "סוכן ביקורות ⭐ - סורק ומגיב לביקורות",
    "סוכן מלאי 📦 - חיזוי ביקוש (לעסקי מכירות)",
    "סוכן לידים חמים 🔥 - דירוג חכם של לידים",
    "סוכן צמיחה 🌱 - החזרת לקוחות רדומים",
  ],
  connections: [
    "גוגל ביזנס - ביקורות וצפיות",
    "גוגל שיטס - לידים, לקוחות, מלאי",
    "וואטסאפ - דוחות והתראות",
    "ועוד כלים - אנחנו מתאימים לעסק שלך",
  ],
  service: [
    "התאמה מלאה לעסק שלך",
    "הקמה תוך 7 ימים",
    "תמיכה בעברית",
    "בלי התחייבות לתקופה",
  ],
};

const businessTypeLabels: Record<string, string> = {
  service: "💼 עסק שירות (קליניקה, מספרה, מאמן)",
  sales: "🛒 עסק מכירות (חנות, סוכן, ביטוח)",
  "real-estate": "🏠 נדל\"ן",
  online: "🛍️ חנות אונליין",
  consulting: "💡 ייעוץ / טיפול",
  dental: "🦷 רפואת שיניים / אסתטיקה",
  fitness: "🏋️ כושר / יוגה / פילאטיס",
  nutrition: "🥗 תזונה / דיאטנית",
  psychology: "🧠 פסיכולוג / מטפל",
  spa: "💆 ספא / טיפוח",
  education: "🎓 קורסים / הדרכה",
  restaurant: "🍔 מסעדה / קייטרינג",
  auto: "🚗 מוסך / רכב",
  construction: "🏗️ שיפוצים / קבלן",
  creative: "🎨 שירותים יצירתיים (צילום, עיצוב)",
  other: "❓ אחר",
};

const faqs = [
  {
    question: "כמה זה עולה?",
    answer: "כל עסק שונה - לכן אנחנו לא מציגים מחירים גנריים שלא תואמים לך. בשיחה איתנו נבין מה אתה צריך, ונבנה הצעה אישית מותאמת לעסק ולתקציב שלך. אנחנו פתוחים לעבוד עם עסקים בכל הגדלים.",
  },
  {
    question: "האם הנתונים שלי בטוחים?",
    answer: "לחלוטין. הסוכנים שלנו פועלים עם הרשאות מוגבלות ומאובטחות בלבד - הם רואים רק את מה שאתה מאפשר. כל הנתונים נשארים בחשבונות שלך (גוגל, וואטסאפ וכו'), ואנחנו לא שומרים מידע אצלנו. אתה תמיד יכול לבטל גישה בלחיצה אחת.",
  },
  {
    question: "אני לא מבין במחשבים. זה יסתבך לי?",
    answer: "לא. כל ההתקנה וההגדרות נעשות על ידינו - אתה לא צריך לעשות שום דבר טכני. אחרי ההקמה, כל מה שאתה צריך זה לפתוח את וואטסאפ ולקרוא את הדוחות. אם משהו לא ברור - אנחנו תמיד זמינים בעברית.",
  },
  {
    question: "מתי אראה תוצאות?",
    answer: "תוך 7 ימים מהאישור הסוכנים כבר עובדים ושולחים לך דוחות. תוך שבועיים-שלושה כבר תרגיש בהבדל - יותר זמן ביד, פחות לידים שנופלים בין הכיסאות, ותחושה ברורה של שליטה בעסק. אנחנו רואים תוצאות אצל הלקוחות שלנו תוך החודש הראשון.",
  },
  {
    question: "מה אם אני לא מרוצה?",
    answer: "בלי התחייבות לתקופה - אתה יכול לעצור מתי שתרצה, בלי קנסות ובלי הסברים. בנוסף, אנחנו עובדים איתך תוך כדי תנועה - אם משהו לא עובד מספיק טוב, אנחנו מכוונים את הסוכן. המטרה שלנו היא שתישאר כי אתה רוצה, לא כי אתה חייב.",
  },
  {
    question: "האם זה מתאים לעסק קטן?",
    answer: "דווקא לעסקים קטנים זה הכי משתלם. בעל עסק קטן הוא בדרך כלל גם המנהל, גם המכירות, גם השיווק וגם השירות - הסוכנים שלנו מורידים לך משם המון עומס. אנחנו עובדים עם עסקים של אדם אחד עד עסקים עם 20 עובדים.",
  },
];

/* ===== Scroll reveal (respects prefers-reduced-motion) ===== */
function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* ===== Light-zone product mock: the Spike WhatsApp morning report ===== */
/* ===== Product screenshot frame (real app screens exported as PNG) ===== */
function BrowserFrame({
  src,
  alt,
  width,
  height,
  label,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/12 bg-white/[0.03] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(34,211,176,0.12)]">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22D3B0]/60" />
        </span>
        <span dir="ltr" className="mx-auto font-grotesk text-[11px] tracking-wide text-white/40">
          {label}
        </span>
      </div>
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="block w-full h-auto" />
    </div>
  );
}

/* ===== Phone frame for tall screenshots (insight moment) ===== */
function PhoneFrame({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="relative mx-auto w-[268px] sm:w-[300px] rounded-[2.4rem] border border-white/12 bg-[#0e0f11] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_50px_rgba(34,211,176,0.16)]">
      <div className="flex items-center justify-center h-6" aria-hidden>
        <span className="w-16 h-1.5 rounded-full bg-white/15" />
      </div>
      <div className="overflow-hidden rounded-[1.8rem] bg-white">
        <Image src={src} alt={alt} width={width} height={height} unoptimized className="block w-full h-auto" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [heroForm, setHeroForm] = useState({ name: "", phone: "", email: "" });
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroError, setHeroError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroSubmitting(true);
    setHeroError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "🔥 ליד מהיר חדש - Spike AI Agents",
          from_name: "Spike AI Agents - טופס מהיר",
          name: heroForm.name,
          phone: heroForm.phone,
          email: heroForm.email,
          form_source: "Hero Quick Form",
          submission_time: new Date().toLocaleString("he-IL", {
            timeZone: "Asia/Jerusalem",
          }),
          // תיעוד הסכמה פסיבית (לחיצה על הכפתור = הסכמה למדיניות + תנאי שימוש)
          consent_type: "implicit (button click)",
          consent_privacy_terms: "כן ✓ (בלחיצה על הכפתור)",
          consent_marketing: "לא נשאל בטופס המהיר",
          policy_version: POLICY_VERSION,
          consent_timestamp_iso: new Date().toISOString(),
          consent_page_url: typeof window !== "undefined" ? window.location.href : "",
          consent_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setHeroSubmitted(true);
      } else {
        setHeroError("משהו השתבש. נסה שוב או צור קשר טלפונית.");
        console.error("Web3Forms error:", result);
      }
    } catch (error) {
      setHeroError("בעיה בחיבור לשרת. בדוק את האינטרנט ונסה שוב.");
      console.error("Submission error:", error);
    } finally {
      setHeroSubmitting(false);
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeroForm({ ...heroForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "🎯 ליד חדש (טופס מפורט) - Spike AI Agents",
          from_name: "Spike AI Agents - טופס מפורט",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          business_type: businessTypeLabels[formData.businessType] || formData.businessType,
          form_source: "Detailed Form",
          submission_time: new Date().toLocaleString("he-IL", {
            timeZone: "Asia/Jerusalem",
          }),
          // תיעוד הסכמה משפטי (תיקון 13 לחוק הגנת הפרטיות)
          consent_privacy_terms: agreedToTerms ? "כן ✓" : "לא ✗",
          consent_marketing: agreedToMarketing ? "כן ✓" : "לא ✗",
          policy_version: POLICY_VERSION,
          consent_timestamp_iso: new Date().toISOString(),
          consent_page_url: typeof window !== "undefined" ? window.location.href : "",
          consent_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError("משהו השתבש. נסה שוב או צור קשר טלפונית.");
        console.error("Web3Forms error:", result);
      }
    } catch (error) {
      setSubmitError("בעיה בחיבור לשרת. בדוק את האינטרנט ונסה שוב.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navLinks = [
    { href: "#video", label: "סרטון" },
    { href: "#how", label: "איך זה עובד" },
    { href: "#agents", label: "סוכנים" },
    { href: "#product", label: "המוצר" },
    { href: "#pricing", label: "החבילה" },
    { href: "#faq", label: "שאלות נפוצות" },
  ];

  return (
    <>
      <style jsx global>{`
        .mascot-mono {
          filter: drop-shadow(0 24px 70px rgba(34, 211, 176, 0.30))
            drop-shadow(0 0 40px rgba(91, 208, 242, 0.18));
        }
        @keyframes mono-drift {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        .drift { animation: mono-drift 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .drift { animation: none; }
        }
        .agent-tile {
          transition: transform 0.4s ease, border-color 0.4s ease,
            background-color 0.4s ease;
        }
        .agent-tile:hover .agent-glyph { color: #fff; transform: translateY(-2px); }
        .agent-glyph {
          color: var(--brand-soft);
          transition: color 0.4s ease, transform 0.4s ease;
        }
        .video-frame {
          position: relative;
          border-radius: 26px;
          padding: 6px;
          background: linear-gradient(135deg, rgba(34, 211, 176, 0.22), rgba(91, 208, 242, 0.12));
          box-shadow: 0 0 60px rgba(34, 211, 176, 0.22), 0 20px 50px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(94, 234, 212, 0.22);
        }
        .video-frame video {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 20px;
          background: #0e0f11;
          aspect-ratio: 16 / 9;
        }
        .consent-box {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          min-width: 18px;
          margin-top: 2px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .consent-box:hover { border-color: rgba(255, 255, 255, 0.6); }
        .consent-box:checked { background: #ffffff; border-color: #ffffff; }
        .consent-box:checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #08090a;
          font-weight: 900;
          font-size: 12px;
          line-height: 1;
        }
      `}</style>

      <div className="grain relative">
        {/* ===== NAV ===== */}
        <nav dir="rtl" className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#08090A]/60 border-b border-white/[0.06]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="40px" className="object-contain mascot-mono" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-grotesk text-base sm:text-xl font-bold tracking-tight text-white">Spike AI</span>
                <span className="font-grotesk hidden sm:inline-block text-[10px] font-medium tracking-[0.25em] text-white/70 border border-white/15 px-2 py-0.5 rounded-full">
                  AGENTS
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
            </div>

            <a href="#cta" className="hidden sm:inline-flex btn-primary text-sm px-5 py-2.5">
              קבל הצעה אישית
            </a>

            <button
              type="button"
              aria-label="פתיחת תפריט"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition flex-shrink-0 cursor-pointer"
            >
              <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""}`}></span>
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-[#08090A]/95 backdrop-blur-xl">
              <div className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base text-white/80 hover:text-white transition py-3 px-3 rounded-lg hover:bg-white/5 text-right"
                  >
                    {l.label}
                  </a>
                ))}
                <a href="#cta" onClick={() => setMobileMenuOpen(false)} className="mt-2 btn-primary text-base px-5 py-3">
                  קבל הצעה אישית
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* ================= DARK: HERO + HOW + AGENTS ================= */}
        <div dir="rtl" className="relative bg-[#08090A] text-white overflow-x-clip">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="ambient top-[-160px] left-1/2 -translate-x-1/2 w-[1100px] h-[680px]" />
            <div className="ambient top-[1500px] right-[-150px] w-[640px] h-[640px]" />
            <div className="ambient top-[2900px] left-[-150px] w-[600px] h-[600px]" />
          </div>

          {/* ===== HERO (dark, quiet) ===== */}
          <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1280px] mx-auto relative">
              <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 items-center">
                {/* Mascot */}
                <div className="relative flex items-center justify-center order-2 lg:order-1 min-h-[240px] sm:min-h-[360px] lg:min-h-[520px]">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(34,211,176,0.22) 0%, rgba(91,208,242,0.10) 38%, transparent 70%)",
                      filter: "blur(80px)",
                    }}
                  />
                  <div className="relative drift z-10 w-[200px] sm:w-[330px] lg:w-[480px]">
                    <Image src="/spike-mascot-pro.png" alt="Spike AI" width={520} height={520} priority className="relative w-full h-auto mascot-mono" />
                  </div>
                </div>

                {/* Copy + quick form */}
                <div className="order-1 lg:order-2 text-right">
                  <div className="eyebrow mb-5 sm:mb-6"><span>חדש בישראל - לא עוד בוט. סוכן.</span></div>

                  <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black leading-[1.06] tracking-[-0.035em] mb-5 sm:mb-6">
                    צוות שלם שעובד בשבילך,{" "}
                    <span className="sheen">בלי לבקש משכורת</span>
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed mb-7 sm:mb-8 max-w-2xl">
                    סוכני Spike עושים את העבודה שפעם היית משלם עליה אלפים: מניהול הרשתות ועד סינון לידים ובקרת איכות. כל העסק שלך מתופעל 24/7, בלי הוצאות שכר ובלי כאבי ראש.
                  </p>

                  {!heroSubmitted ? (
                    <form onSubmit={handleHeroSubmit} className="space-y-3 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" name="name" value={heroForm.name} onChange={handleHeroChange} placeholder="שם מלא" required className="field px-4 py-3.5" aria-label="שם מלא" />
                        <input type="tel" name="phone" value={heroForm.phone} onChange={handleHeroChange} placeholder="טלפון" required className="field px-4 py-3.5" aria-label="טלפון" />
                      </div>
                      <input type="email" name="email" value={heroForm.email} onChange={handleHeroChange} placeholder="אימייל" required className="field px-4 py-3.5" aria-label="אימייל" />

                      {heroError && (
                        <div className="rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-sm text-white/90 text-center">{heroError}</div>
                      )}
                      <button type="submit" disabled={heroSubmitting} className="w-full btn-primary px-8 py-4 text-base">
                        {heroSubmitting ? "שולח..." : "קבל הצעה אישית"}
                      </button>
                      <p className="text-xs text-white/45 text-center">נחזור אליך תוך 24 שעות. בלי התחייבות.</p>
                      <p className="text-[11px] text-white/35 text-center leading-relaxed mt-2">
                        בלחיצה על &quot;קבל הצעה אישית&quot; אני מסכים/ה ל
                        <Link href="/privacy" target="_blank" rel="noopener" className="text-white/55 hover:text-white underline underline-offset-2">מדיניות הפרטיות</Link>
                        {" "}ול
                        <Link href="/terms" target="_blank" rel="noopener" className="text-white/55 hover:text-white underline underline-offset-2">תנאי השימוש</Link>.
                      </p>
                    </form>
                  ) : (
                    <div className="glass rounded-2xl p-6 mb-6 text-center">
                      <h3 className="text-2xl font-black mb-2">תודה <span className="sheen">{heroForm.name}!</span></h3>
                      <p className="text-base text-white/75">קיבלנו את הפרטים. נחזור אליך תוך 24 שעות.</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-white/55">
                    <span className="flex items-center gap-1.5"><Check className="text-white" />הקמה תוך 7 ימים</span>
                    <span className="flex items-center gap-1.5"><Check className="text-white" />בלי התחייבות</span>
                    <span className="flex items-center gap-1.5"><Check className="text-white" />עברית מלאה</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== VIDEO (normal, right after hero) ===== */}
          <section id="video" className="relative pt-2 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1100px] mx-auto relative">
              <Reveal className="text-center mb-6 sm:mb-8">
                <div className="eyebrow mb-4"><span>צפה בפעולה</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-[-0.03em] mb-3">
                  ראה את הסוכנים <span className="sheen">בפעולה</span>
                </h2>
                <p className="text-base text-[var(--text-2)] max-w-xl mx-auto">
                  60 שניות שמסבירות הכל. מה הם עושים, איך הם עובדים, ואיך זה משנה את היום שלך.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="video-frame">
                <video controls preload="metadata" playsInline poster="/og-image.png">
                  <source src="/spike-explainer.mp4" type="video/mp4" />
                  הדפדפן שלך לא תומך בנגן וידאו.
                </video>
              </Reveal>
            </div>
          </section>

          {/* ===== LIGHT: PRODUCT SHOWCASE (tablet) — right under the video ===== */}
          <section id="product" className="zone-light relative overflow-hidden">
            <div className="pt-16 sm:pt-20 text-center px-4">
              <div className="eyebrow mb-5"><span>המוצר</span></div>
            </div>
            <ContainerScroll
              titleComponent={
                <div className="px-4 pb-6">
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] text-[#0a0a0a] mb-4">
                    כל הסוכנים שלך, <span className="sheen">במסך אחד</span>
                  </h2>
                  <p className="text-base sm:text-lg text-soft leading-relaxed max-w-2xl mx-auto">
                    רואים מה כל סוכן עשה, מתי, ומריצים בלחיצה. שליטה מלאה על העסק - בלי שום דבר טכני.
                  </p>
                </div>
              }
            >
              <div className="relative h-full w-full bg-white">
                <Image
                  src="/shots/agents.png"
                  alt="דשבורד הסוכנים של Spike - כל הסוכנים, סטטוסים והרצה ידנית במסך אחד"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover object-top"
                />
              </div>
            </ContainerScroll>
          </section>

          {/* ===== HOW IT WORKS ===== */}
          <section id="how" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1280px] mx-auto relative">
              <Reveal className="text-center mb-12 sm:mb-16 lg:mb-20">
                <div className="eyebrow mb-5"><span>איך זה עובד</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  3 שלבים. <span className="sheen">תוך 7 ימים.</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  מהקליק הראשון עד שהסוכן שלך כבר עובד - תוך שבוע. בלי בירוקרטיה, בלי בלאגן.
                </p>
              </Reveal>

              <div className="relative">
                <div className="hidden lg:block absolute top-12 right-[16.6%] left-[16.6%] h-px bg-gradient-to-l from-transparent via-white/15 to-transparent pointer-events-none"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
                  {[
                    { num: "01", title: "ממלאים טופס קצר", desc: "5 דקות. אתה מספר על העסק - איזה תחום, איך עובדים היום, ומה הכי כואב. זה הכל.", footer: "5 דקות מקסימום" },
                    { num: "02", title: "שיחה איתנו", desc: "אנחנו לומדים את העסק שלך - איזה סוכנים יביאו לך הכי הרבה ערך. תוך כמה ימים מקבלים הצעה מותאמת.", footer: "בלי לחץ של מכירה" },
                    { num: "03", title: "הסוכן מתחיל לעבוד", desc: "אישרת את ההצעה? תוך 7 ימים הסוכן שלך כבר חי, מנתח, ושולח לך דוחות לוואטסאפ כל בוקר.", footer: "תוך 7 ימים" },
                  ].map((step, i) => (
                    <Reveal key={i} delay={i * 0.12} className="glass glass-hover rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                      <div className="font-grotesk absolute top-2 left-4 sm:top-4 sm:left-6 text-6xl sm:text-7xl lg:text-8xl font-bold text-white/[0.04] leading-none select-none">{step.num}</div>
                      <div className="relative z-10">
                        <div className="font-grotesk w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center mb-5 sm:mb-6 mx-auto lg:mx-0">
                          <span className="text-2xl sm:text-3xl font-bold text-white">{step.num}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center lg:text-right">{step.title}</h3>
                        <p className="text-sm sm:text-base text-[var(--text-2)] leading-relaxed text-center lg:text-right mb-4">{step.desc}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 justify-center lg:justify-start">
                          <Check className="text-white" />
                          <span>{step.footer}</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ===== MAGIC MOMENT — real-time pipeline (real product screenshot) ===== */}
          <section id="magic" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1100px] mx-auto relative">
              <Reveal className="text-center mb-10 sm:mb-12">
                <div className="eyebrow mb-5"><span>בזמן אמת</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  תראה את הקסם <span className="sheen">בזמן אמת</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  הודעת וואטסאפ נכנסת מליד חם. הסוכן מסווג, מתעדף, ומכין טיוטת תגובה - תוך 15 שניות. אתה רק מאשר.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <BrowserFrame
                  src="/shots/pipeline.png"
                  alt="Spike מזהה ליד חם בוואטסאפ ומכין טיוטת תגובה בזמן אמת"
                  width={1552}
                  height={1162}
                  label="app.spikeai.co.il/dashboard/showcase"
                />
              </Reveal>
            </div>
          </section>

          {/* ===== AGENTS ===== */}
          <section id="agents" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1280px] mx-auto relative">
              <Reveal className="text-center mb-12 sm:mb-16 lg:mb-20">
                <div className="eyebrow mb-5"><span>הצוות שלך</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  הצוות <span className="sheen">שעובד בשבילך</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  כל סוכן הוא מומחה בתחום שלו. ביחד הם מטפלים בכל הצדדים של העסק - מהבוקר ועד הלילה.
                </p>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {agents.map((agent, index) => (
                  <Reveal key={index} delay={(index % 3) * 0.1} className="agent-tile glass glass-hover rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative">
                    <div className="relative z-10">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/12 bg-white/[0.04] flex items-center justify-center mb-5">
                        <AgentGlyph name={agent.iconKey} className="agent-glyph" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-right">{agent.name}</h3>
                      <p className="text-[var(--text-2)] leading-relaxed text-right text-sm">{agent.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ===== INSIGHT — inventory foresight (real product screenshot, phone frame) ===== */}
          <section id="insight" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <Reveal className="text-center lg:text-right order-2 lg:order-1">
                <div className="eyebrow mb-5"><span>תובנה</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-[-0.035em] mb-5">
                  יודע מה אוזל, <span className="sheen">לפני שזה קורה</span>
                </h2>
                <p className="text-base sm:text-lg text-[var(--text-2)] leading-relaxed max-w-xl mx-auto lg:mx-0">
                  הסוכן סורק את המלאי, חוזה ביקוש, ומסמן בדיוק מה צריך הזמנה - לפני שנגמר. דוגמה אמיתית מתוך המערכת.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="order-1 lg:order-2">
                <PhoneFrame
                  src="/shots/inventory.png"
                  alt="ניתוח מלאי של הסוכן: התראות על מוצרים שעומדים להיגמר וחיזוי ביקוש"
                  width={1261}
                  height={1291}
                />
              </Reveal>
            </div>
          </section>

          {/* ===== APPROVALS — AI flags, owner decides (real product screenshot) ===== */}
          <section id="approvals" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1100px] mx-auto relative">
              <Reveal className="text-center mb-10 sm:mb-12">
                <div className="eyebrow mb-5"><span>אתה בשליטה</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  AI מסמן. <span className="sheen">אתה מחליט.</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  כל פעולה היא טיוטה שמחכה לך. מאשר בלחיצה - ואז נשלח. אף פעם לא אוטומטית, אף פעם לא בלי האישור שלך.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <BrowserFrame
                  src="/shots/approvals.png"
                  alt="טיוטות פוסטים שהסוכן הכין, ממתינות לאישור או דחייה של בעל העסק"
                  width={1571}
                  height={1270}
                  label="app.spikeai.co.il/dashboard/approvals"
                />
              </Reveal>
            </div>
          </section>
        </div>

        {/* ================= COLORFUL: VALUE / CTA STATEMENT (shader) ================= */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <WebGLShader />
          </div>
          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#f5f5f7]/0 via-black/25 to-[#08090A]" />

          <div dir="rtl" className="relative z-10 text-center px-4 sm:px-6 py-24 max-w-3xl mx-auto">
            <div className="eyebrow mb-6 border-white/25 bg-white/10 text-white/90"><span>קבל הצעה</span></div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.04] tracking-[-0.04em] text-white mb-5">
              מוכן להתחיל?{" "}
              <span className="block">בוא נדבר.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-9">
              השאר פרטים ונחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך. בלי התחייבות, בלי לחץ.
            </p>
            <LiquidButton
              size="xl"
              className="text-white border border-white/30 rounded-full text-base font-bold"
              onClick={() => {
                if (typeof document !== "undefined") {
                  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              קבל הצעה אישית
            </LiquidButton>
          </div>
        </section>

        {/* ================= DARK: PRICING + FORM + FAQ + FOOTER ================= */}
        <div dir="rtl" className="relative bg-[#08090A] text-white overflow-x-clip">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="ambient top-[200px] right-[-120px] w-[560px] h-[460px]" />
            <div className="ambient top-[1700px] left-1/2 -translate-x-1/2 w-[900px] h-[520px]" />
          </div>

          {/* ===== PACKAGE ===== */}
          <section id="pricing" className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1280px] mx-auto relative">
              <Reveal className="text-center mb-12 sm:mb-16">
                <div className="eyebrow mb-5"><span>החבילה</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  חבילה אחת. <span className="sheen">הכל כלול.</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  בלי שדרוגים. בלי תוספות. בלי הפתעות בחשבון. כל הסוכנים, כל החיבורים, וכל ההתאמות - בחבילה אחת מותאמת לעסק שלך.
                </p>
              </Reveal>

              <Reveal delay={0.1} className="glass rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 lg:p-12 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 text-white font-semibold text-xs px-4 py-1.5 rounded-full mb-5 sm:mb-6">
                      הכל כלול במחיר אחד
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black mb-3 sm:mb-4">החבילה המלאה</h3>
                    <p className="text-base sm:text-lg text-[var(--text-2)] max-w-2xl mx-auto">
                      הצעה מותאמת אישית לעסק שלך. בשיחה איתנו נבין את הצרכים שלך ונבנה את החבילה הנכונה.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12 items-stretch">
                    <div className="glass rounded-2xl p-5 sm:p-6 order-2 md:order-1">
                      <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/10">
                        <h4 className="text-base sm:text-lg font-bold">מתחבר ל-</h4>
                      </div>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {packageIncludes.connections.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/85">
                            <Check className="text-white mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="edge-shimmer glass rounded-2xl p-5 sm:p-6 lg:p-7 order-1 md:order-2 relative bg-white/[0.06] md:scale-[1.04]">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[#08090A] font-bold text-xs px-4 py-1.5 rounded-full whitespace-nowrap z-10">
                        הלב של החבילה
                      </div>
                      <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/15 mt-2">
                        <div>
                          <h4 className="text-lg sm:text-xl font-black">הסוכנים</h4>
                          <p className="text-xs text-white/55">הצוות שעובד בשבילך 24/7</p>
                        </div>
                      </div>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {packageIncludes.agents.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white">
                            <Check className="text-white mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="glass rounded-2xl p-5 sm:p-6 order-3">
                      <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/10">
                        <h4 className="text-base sm:text-lg font-bold">השירות</h4>
                      </div>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {packageIncludes.service.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/85">
                            <Check className="text-white mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <a href="#cta" className="inline-flex btn-primary px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg">
                      קבל הצעה אישית
                    </a>
                    <p className="text-xs sm:text-sm text-white/45 mt-3 sm:mt-4">בלי התחייבות. בלי לחץ של מכירה.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ===== DETAILED FORM ===== */}
          <section id="cta" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[800px] mx-auto relative">
              <Reveal className="text-center mb-8 sm:mb-12">
                <div className="eyebrow mb-5"><span>קבל הצעה</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  מוכן להתחיל? <span className="sheen">בוא נדבר.</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  השאר פרטים ונחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך. בלי התחייבות, בלי לחץ.
                </p>
              </Reveal>

              <Reveal delay={0.05} className="glass rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 lg:p-12 relative overflow-hidden">
                <div className="relative z-10">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-2 text-right text-white/90">שם מלא</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="ישראל ישראלי" required className="field px-5 py-4" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-right text-white/90">טלפון</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="050-1234567" required className="field px-5 py-4" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2 text-right text-white/90">אימייל</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="israel@example.com" required className="field px-5 py-4" />
                      </div>
                      <div>
                        <label htmlFor="businessType" className="block text-sm font-semibold mb-2 text-right text-white/90">תחום העסק</label>
                        <select id="businessType" name="businessType" value={formData.businessType} onChange={handleChange} required className="field field-select px-5 py-4">
                          <option value="">בחר תחום</option>
                          <option value="service">💼 עסק שירות (קליניקה, מספרה, מאמן)</option>
                          <option value="sales">🛒 עסק מכירות (חנות, סוכן, ביטוח)</option>
                          <option value="real-estate">🏠 נדל&quot;ן</option>
                          <option value="online">🛍️ חנות אונליין</option>
                          <option value="consulting">💡 ייעוץ / טיפול</option>
                          <option value="dental">🦷 רפואת שיניים / אסתטיקה</option>
                          <option value="fitness">🏋️ כושר / יוגה / פילאטיס</option>
                          <option value="nutrition">🥗 תזונה / דיאטנית</option>
                          <option value="psychology">🧠 פסיכולוג / מטפל</option>
                          <option value="spa">💆 ספא / טיפוח</option>
                          <option value="education">🎓 קורסים / הדרכה</option>
                          <option value="restaurant">🍔 מסעדה / קייטרינג</option>
                          <option value="auto">🚗 מוסך / רכב</option>
                          <option value="construction">🏗️ שיפוצים / קבלן</option>
                          <option value="creative">🎨 שירותים יצירתיים (צילום, עיצוב)</option>
                          <option value="other">❓ אחר</option>
                        </select>
                      </div>

                      {/* === צ'קבוקסי הסכמה משפטית === */}
                      <div className="space-y-1 pt-2">
                        <label className="flex items-start gap-2.5 py-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            required
                            aria-label="אישור מדיניות הפרטיות ותנאי השימוש (חובה)"
                            className="consent-box"
                          />
                          <span className="text-[13px] leading-relaxed text-white/70 flex-1">
                            <span className="text-white/90 font-semibold text-[11px] ml-1">חובה</span>
                            קראתי את{" "}
                            <Link href="/privacy" target="_blank" rel="noopener" className="text-white underline underline-offset-2 hover:text-white/80">מדיניות הפרטיות</Link>
                            {" "}ואת{" "}
                            <Link href="/terms" target="_blank" rel="noopener" className="text-white underline underline-offset-2 hover:text-white/80">תנאי השימוש</Link>
                            {" "}ואני מסכים/ה להם.
                          </span>
                        </label>

                        <label className="flex items-start gap-2.5 py-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreedToMarketing}
                            onChange={(e) => setAgreedToMarketing(e.target.checked)}
                            aria-label="אישור קבלת חומר שיווקי (אופציונלי)"
                            className="consent-box"
                          />
                          <span className="text-[13px] leading-relaxed text-white/70 flex-1">
                            <span className="text-white/40 font-medium text-[11px] ml-1">אופציונלי</span>
                            אני מאשר/ת לקבל חומר שיווקי, עדכונים והצעות בדוא&quot;ל ובהודעות.
                          </span>
                        </label>
                      </div>

                      {submitError && (
                        <div className="rounded-xl border border-white/25 bg-white/5 px-4 py-3 text-sm text-white/90 text-center">{submitError}</div>
                      )}

                      <button type="submit" disabled={isSubmitting || !agreedToTerms} className="w-full btn-primary px-8 py-5 text-lg">
                        {isSubmitting ? "שולח..." : "שלח ובוא נדבר"}
                      </button>

                      <p className="text-xs text-white/45 text-center mt-4">הפרטים שלך מוגנים. אנחנו לא משתפים אותם עם אף אחד.</p>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-3xl lg:text-4xl font-black mb-4">תודה <span className="sheen">{formData.name}!</span></h3>
                      <p className="text-lg text-white/85 mb-2">קיבלנו את הפרטים שלך.</p>
                      <p className="text-base text-[var(--text-2)] mb-8">נחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך.</p>
                      <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 rounded-full px-4 py-2 text-sm text-white/80">
                        <span>תקבל אישור באימייל</span>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>

              <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-white/55">
                <span className="flex items-center gap-2"><Check className="text-white" /><span>תגובה תוך 24 שעות</span></span>
                <span className="flex items-center gap-2"><Check className="text-white" /><span>בלי התחייבות</span></span>
                <span className="flex items-center gap-2"><Check className="text-white" /><span>שירות בעברית</span></span>
              </div>
            </div>
          </section>

          {/* ===== FAQ ===== */}
          <section id="faq" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[900px] mx-auto relative">
              <Reveal className="text-center mb-12 sm:mb-16">
                <div className="eyebrow mb-5"><span>שאלות נפוצות</span></div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] mb-5 sm:mb-6">
                  יש לך שאלות? <span className="sheen">יש לנו תשובות.</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                  התשובות לשאלות הנפוצות שאנחנו מקבלים. אם משהו לא ברור - תמיד אפשר לפנות אלינו.
                </p>
              </Reveal>

              <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq, index) => {
                  const open = openFaq === index;
                  return (
                    <div key={index} className={`glass rounded-xl sm:rounded-2xl overflow-hidden ${open ? "border-white/25 bg-white/[0.06]" : ""}`}>
                      <button
                        className="w-full px-5 sm:px-7 py-4 sm:py-6 text-right flex justify-between items-center gap-4 cursor-pointer"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={open}
                      >
                        <span className="text-sm sm:text-base lg:text-lg font-bold text-right flex-1">{faq.question}</span>
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-lg font-light text-white transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                          aria-hidden
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <div className="px-5 sm:px-7 pb-5 sm:pb-6 text-sm lg:text-base text-[var(--text-2)] leading-relaxed text-right">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center mt-10 sm:mt-12">
                <p className="text-sm sm:text-base text-white/55 mb-3 sm:mb-4">יש לך שאלה אחרת?</p>
                <a href="#cta" className="inline-flex btn-ghost px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">בוא נדבר ←</a>
              </div>
            </div>
          </section>

          {/* ===== FOOTER ===== */}
          <footer className="relative border-t border-white/10 bg-[#08090A]/60 backdrop-blur-md mt-12">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-8 mb-8 sm:mb-10">
                <div className="text-center md:text-right">
                  <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                    <div className="relative w-10 h-10">
                      <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="40px" className="object-contain mascot-mono" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-grotesk text-xl font-bold tracking-tight">Spike AI</span>
                      <span className="font-grotesk text-[10px] font-medium tracking-[0.25em] text-white/70 border border-white/15 px-2 py-0.5 rounded-full">
                        AGENTS
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto md:mx-0">
                    צוות שעובד בשבילך, בלי לבקש משכורת.
                  </p>
                </div>

                <div className="text-center md:text-right">
                  <h4 className="text-sm font-bold text-white/90 mb-4 tracking-wide">ניווט</h4>
                  <ul className="space-y-2.5">
                    <li><a href="#how" className="text-sm text-white/55 hover:text-white transition-colors">איך זה עובד</a></li>
                    <li><a href="#agents" className="text-sm text-white/55 hover:text-white transition-colors">סוכנים</a></li>
                    <li><a href="#pricing" className="text-sm text-white/55 hover:text-white transition-colors">החבילה</a></li>
                    <li><a href="#faq" className="text-sm text-white/55 hover:text-white transition-colors">שאלות נפוצות</a></li>
                  </ul>
                </div>

                <div className="text-center md:text-right">
                  <h4 className="text-sm font-bold text-white/90 mb-4 tracking-wide">מידע משפטי</h4>
                  <ul className="space-y-2.5">
                    <li><Link href="/privacy" className="text-sm text-white/55 hover:text-white transition-colors">מדיניות פרטיות</Link></li>
                    <li><Link href="/terms" className="text-sm text-white/55 hover:text-white transition-colors">תנאי שימוש</Link></li>
                    <li><Link href="/cookies" className="text-sm text-white/55 hover:text-white transition-colors">מדיניות עוגיות</Link></li>
                    <li><Link href="/accessibility" className="text-sm text-white/55 hover:text-white transition-colors">הצהרת נגישות</Link></li>
                  </ul>
                </div>

                <div className="text-center md:text-right">
                  <h4 className="text-sm font-bold text-white/90 mb-4 tracking-wide">יצירת קשר</h4>
                  <a href="mailto:spikeaistudio@gmail.com" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors" dir="ltr">
                    <span>spikeaistudio@gmail.com</span>
                  </a>
                  <p className="text-xs text-white/40 mt-3 leading-relaxed">נחזור אליך תוך 24 שעות</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 text-center">
                <p className="text-xs text-white/40">© 2026 Spike AI Agents. כל הזכויות שמורות.</p>
              </div>
            </div>
          </footer>
        </div>

        {/* ===== Sticky mobile CTA ===== */}
        <a href="#cta" className="sm:hidden fixed bottom-4 inset-x-4 z-50 btn-primary py-3.5 text-base shadow-2xl">
          קבל הצעה אישית
        </a>
      </div>
    </>
  );
}
