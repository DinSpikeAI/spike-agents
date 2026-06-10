"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
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

/* ===== Premium motion helpers (pointer-fine only, reduced-motion safe) ===== */
function usePointerFine() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine && !reduce;
}

/* Thin scroll progress bar — grows from the right (RTL) */
function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 28, mass: 0.4 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 inset-x-0 z-[70] h-[2.5px] origin-right pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(to left, #22D3B0, #5EEAD4 50%, #5BD0F2)",
        boxShadow: "0 0 12px rgba(34,211,176,0.55)",
      }}
    />
  );
}

/* Magnetic hover — the element leans gently toward the cursor */
function Magnetic({
  children,
  className,
  strength = 0.22,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const fine = usePointerFine();
  const ref = useRef<HTMLDivElement>(null);
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(yRaw, { stiffness: 220, damping: 16, mass: 0.5 });
  if (!fine) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const lim = 12;
        xRaw.set(Math.max(-lim, Math.min(lim, (e.clientX - (r.left + r.width / 2)) * strength)));
        yRaw.set(Math.max(-lim, Math.min(lim, (e.clientY - (r.top + r.height / 2)) * strength)));
      }}
      onPointerLeave={() => {
        xRaw.set(0);
        yRaw.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* 3D tilt — the card leans toward the cursor, with a tracked glare + border spotlight */
function Tilt({
  children,
  className,
  outerClassName = "[perspective:1000px]",
  max = 6,
  scale = 1.015,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
}) {
  const fine = usePointerFine();
  const ref = useRef<HTMLDivElement>(null);
  const rxRaw = useMotionValue(0);
  const ryRaw = useMotionValue(0);
  const sRaw = useMotionValue(1);
  const rotateX = useSpring(rxRaw, { stiffness: 170, damping: 18, mass: 0.6 });
  const rotateY = useSpring(ryRaw, { stiffness: 170, damping: 18, mass: 0.6 });
  const tiltScale = useSpring(sRaw, { stiffness: 220, damping: 20, mass: 0.5 });
  if (!fine) return <div className={className}>{children}</div>;
  return (
    <div className={outerClassName}>
      <motion.div
        ref={ref}
        className={"group/tilt relative will-change-transform " + (className ?? "")}
        style={{ rotateX, rotateY, scale: tiltScale, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const el = ref.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          rxRaw.set((0.5 - py) * 2 * max);
          ryRaw.set((px - 0.5) * 2 * max);
          el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
        }}
        onPointerEnter={() => sRaw.set(scale)}
        onPointerLeave={() => {
          rxRaw.set(0);
          ryRaw.set(0);
          sRaw.set(1);
        }}
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300"
          />
        )}
      </motion.div>
    </div>
  );
}

/* Kinetic headline — words rise into place on load (copy stays verbatim) */
function RiseWords({
  text,
  wordClass,
  className,
  delay = 0,
}: {
  text: string;
  wordClass?: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) {
    return (
      <span className={className}>
        {wordClass ? <span className={wordClass}>{text}</span> : text}
      </span>
    );
  }
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={"inline-block " + (wordClass ?? "")}
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.75, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? "\u00A0" : null}
          </span>
        ))}
      </span>
    </span>
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
  tone = "dark",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`group/frame glow-breathe relative rounded-2xl border overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(34,211,176,0.12)] ${
        dark ? "border-white/12 bg-white/[0.03]" : "border-black/10 bg-white"
      }`}
    >
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${dark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-black/[0.03]"}`}>
        <span className="flex gap-1.5" aria-hidden>
          <span className={`w-2.5 h-2.5 rounded-full ${dark ? "bg-white/15" : "bg-black/15"}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${dark ? "bg-white/15" : "bg-black/15"}`} />
          <span className="w-2.5 h-2.5 rounded-full bg-[#16d3ab]/70" />
        </span>
        <span dir="ltr" className={`mx-auto font-grotesk text-[11px] tracking-wide ${dark ? "text-white/40" : "text-black/40"}`}>
          {label}
        </span>
      </div>
      <Image src={src} alt={alt} width={width} height={height} unoptimized className="block w-full h-auto" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/frame:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.05) 48%, rgba(94,234,212,0.09) 53%, transparent 66%)",
        }}
      />
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
    <div className="glow-breathe relative mx-auto w-[268px] sm:w-[300px] rounded-[2.4rem] border border-white/12 bg-[#0e0f11] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_50px_rgba(34,211,176,0.16)]">
      <div className="flex items-center justify-center h-6" aria-hidden>
        <span className="w-16 h-1.5 rounded-full bg-white/15" />
      </div>
      <div className="overflow-hidden rounded-[1.8rem] bg-white">
        <Image src={src} alt={alt} width={width} height={height} unoptimized className="block w-full h-auto" />
      </div>
    </div>
  );
}


/* ===== Sticker badge ===== */
function Sticker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={"sticker " + (className ?? "")}>{children}</span>;
}

/* ===== Marquee strip ===== */
function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (dup: boolean) => (
    <div className="marquee-item" aria-hidden={dup}>
      {items.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-12">
          <span>{t}</span>
          <span className="w-2 h-2 rounded-full bg-current opacity-40 inline-block" aria-hidden />
        </span>
      ))}
    </div>
  );
  return (
    <div className={"marquee " + (className ?? "")}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ===== Interactive approval demo — the Iron Rule as a toy ===== */
const demoInbox = [
  {
    from: "דנה כהן",
    tag: "ליד חם",
    msg: "היי, אפשר תור למחר בבוקר? משהו ב-9:00?",
    draft: "בוקר טוב דנה! מחר ב-9:00 פנוי לנו. לשריין לך?",
  },
  {
    from: "יוסי לוי",
    tag: "שאלת מחיר",
    msg: "כמה עולה טיפול קרטין אצלכם?",
    draft: "היי יוסי! קרטין מתחיל ב-450 ₪, תלוי באורך. רוצה ייעוץ קצר בטלפון?",
  },
  {
    from: "גוגל ביזנס",
    tag: "ביקורת חדשה",
    msg: "מיכל השאירה 5 כוכבים: שירות מדהים, אחזור בקרוב!",
    draft: "מיכל, תודה ענקית! מחכים לראות אותך שוב 💚",
  },
  {
    from: "נועה ברק",
    tag: "ליד חוזר",
    msg: "דיברנו לפני חודש... זה עדיין רלוונטי?",
    draft: "היי נועה, ברור! נשאר לך מקום. מתי נוח לך השבוע?",
  },
];

function ApprovalDemo() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [approved, setApproved] = useState(27);
  const [flash, setFlash] = useState(false);
  const item = demoInbox[idx % demoInbox.length];
  const approve = () => {
    setApproved((n) => n + 1);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 900);
    setIdx((i) => i + 1);
  };
  return (
    <div className="relative w-full max-w-[460px] mx-auto">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="flex items-center gap-2 text-sm font-bold text-white/90">
          <span className="pulse-dot" aria-hidden />
          תיבת האישורים שלך
        </span>
        <span className="font-grotesk text-xs text-white/55" dir="ltr">
          <span className="text-[var(--teal-soft)] font-bold">{approved}</span> אושרו היום
        </span>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={idx}
          initial={reduce ? false : { opacity: 0, y: 30, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -46, rotate: -4 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="card-live glass rounded-3xl p-5 sm:p-6 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-white">{item.from}</span>
            <span className="sticker sticker-teal !rotate-0 text-[11px] !py-1 !px-2.5">{item.tag}</span>
          </div>

          <div className="rounded-2xl rounded-tr-sm bg-white/[0.07] border border-white/10 px-4 py-3 text-sm leading-relaxed text-white/90 mb-3 w-fit max-w-[92%]">
            {item.msg}
          </div>

          <p className="text-[11px] font-bold tracking-wide text-[var(--teal-soft)] mb-1.5">Spike ניסח עבורך:</p>
          <div className="rounded-2xl rounded-tl-sm bg-[var(--teal)] text-[var(--ink)] font-semibold px-4 py-3 text-sm leading-relaxed mb-5 w-fit max-w-[92%] mr-auto">
            {item.draft}
          </div>

          <div className="flex gap-2.5">
            <button type="button" onClick={approve} className="btn-primary flex-1 py-3 text-sm">
              אשר ✓
            </button>
            <button type="button" onClick={() => setIdx((i) => i + 1)} className="btn-ghost px-5 py-3 text-sm">
              דלג
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute -top-4 right-6 z-10 sticker !rotate-2"
          >
            נשלח ✓
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-3 text-center text-[11px] text-white/40">דמו אינטראקטיבי · נתונים להמחשה בלבד</p>
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
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        .consent-box:checked { background: #16d3ab; border-color: #16d3ab; }
        .consent-box:checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #04100d;
          font-weight: 900;
          font-size: 12px;
          line-height: 1;
        }
      `}</style>

      <div className="grain relative overflow-x-clip">
        <ScrollProgress />

        {/* ===== NAV (floating pill) ===== */}
        <nav dir="rtl" className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3">
          <div
            className={`max-w-[1200px] mx-auto flex items-center justify-between gap-2 rounded-2xl border px-3 sm:px-5 py-2.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
              scrolled
                ? "bg-[#04100d]/85 border-white/12 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]"
                : "bg-[#04100d]/55 border-white/[0.07]"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="36px" className="object-contain mascot-mono" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-grotesk text-base sm:text-lg font-bold tracking-tight text-white">Spike AI</span>
                <span className="font-grotesk hidden sm:inline-block text-[10px] font-medium tracking-[0.25em] text-[var(--teal-soft)] border border-[rgba(22,211,171,0.35)] px-2 py-0.5 rounded-full">
                  AGENTS
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
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
            <div className="md:hidden max-w-[1200px] mx-auto mt-2 rounded-2xl border border-white/10 bg-[#04100d]/95 backdrop-blur-xl overflow-hidden">
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

        {/* ===== HERO — ink, with the interactive approval demo ===== */}
        <section dir="rtl" className="zone-ink relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12">
          <div className="aurora" aria-hidden />
          <div className="max-w-[1240px] mx-auto relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
              {/* Interactive demo + mascot */}
              <div className="relative order-2 lg:order-1">
                <div className="relative h-[140px] sm:h-[175px] flex items-end justify-center -mb-6 z-10 pointer-events-none">
                  <div className="mascot-halo" aria-hidden />
                  <div className="drift w-[140px] sm:w-[175px]">
                    <Image src="/spike-mascot-pro.png" alt="Spike AI" width={520} height={520} priority className="w-full h-auto mascot-mono" />
                  </div>
                  <span aria-hidden className="float-dot absolute top-[6%] right-[18%] w-1.5 h-1.5" />
                  <span aria-hidden className="float-dot absolute top-[44%] left-[16%] w-2 h-2" style={{ animationDelay: "-2.4s" }} />
                </div>
                <ApprovalDemo />
              </div>

              {/* Copy + quick form */}
              <div className="order-1 lg:order-2 text-right">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-6"
                >
                  <Sticker>חדש בישראל · לא עוד בוט. סוכן.</Sticker>
                </motion.div>

                <h1 className="text-[clamp(2.6rem,6.2vw,4.9rem)] font-black leading-[1.06] tracking-[-0.03em] mb-6">
                  <RiseWords text="צוות שלם שעובד בשבילך," />{" "}
                  <RiseWords text="בלי לבקש משכורת" wordClass="hl" delay={0.32} />
                </h1>

                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed mb-7 sm:mb-8 max-w-2xl"
                >
                  סוכני Spike עושים את העבודה שפעם היית משלם עליה אלפים: מניהול הרשתות ועד סינון לידים ובקרת איכות. כל העסק שלך מתופעל 24/7, בלי הוצאות שכר ובלי כאבי ראש.
                </motion.p>

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                >
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
                    <h3 className="text-2xl font-black mb-2">תודה <span className="hl">{heroForm.name}!</span></h3>
                    <p className="text-base text-white/75">קיבלנו את הפרטים. נחזור אליך תוך 24 שעות.</p>
                  </div>
                )}
                </motion.div>

                <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-white/55">
                  <span className="flex items-center gap-1.5"><Check className="text-[var(--teal-soft)]" />הקמה תוך 7 ימים</span>
                  <span className="flex items-center gap-1.5"><Check className="text-[var(--teal-soft)]" />בלי התחייבות</span>
                  <span className="flex items-center gap-1.5"><Check className="text-[var(--teal-soft)]" />עברית מלאה</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MARQUEE ===== */}
        <div dir="rtl" className="zone-ink border-y border-white/10 py-4 sm:py-5 text-lg sm:text-2xl font-black text-[var(--teal-soft)]">
          <Marquee items={["AI מסמן, בעלים מחליט", "9 סוכנים שעובדים בשבילך", "דוחות בוואטסאפ", "עברית מלאה", "24/7", "בלי הוצאות שכר"]} />
        </div>

        {/* ===== VIDEO — full teal ===== */}
        <section id="video" dir="rtl" className="zone-teal relative py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1060px] mx-auto relative">
            <Reveal className="text-center mb-8 sm:mb-10">
              <div className="mb-5"><Sticker>60 שניות</Sticker></div>
              <h2 className="text-[clamp(2rem,4.6vw,3.6rem)] font-black leading-[1.07] tracking-[-0.03em] mb-3">
                ראה את הסוכנים <span className="hl">בפעולה</span>
              </h2>
              <p className="text-base sm:text-lg text-soft max-w-xl mx-auto">
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

        {/* ===== PRODUCT — paper proof zone ===== */}
        <section id="product" dir="rtl" className="zone-paper relative overflow-hidden">
          <div className="pt-16 sm:pt-20 text-center px-4">
            <div className="eyebrow mb-5"><span>המוצר</span></div>
          </div>
          <ContainerScroll
            titleComponent={
              <div className="px-4 pb-6">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.08] tracking-[-0.035em] text-[#0a1411] mb-4">
                  כל הסוכנים שלך, <span className="hl">במסך אחד</span>
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

          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24 grid lg:grid-cols-2 gap-12 lg:gap-14 items-start">
            <Reveal>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
                תראה את הקסם <span className="hl">בזמן אמת</span>
              </h3>
              <p className="text-base text-soft leading-relaxed mb-6 max-w-xl">
                הודעת וואטסאפ נכנסת מליד חם. הסוכן מסווג, מתעדף, ומכין טיוטת תגובה - תוך 15 שניות. אתה רק מאשר.
              </p>
              <Tilt max={3} scale={1.006} outerClassName="[perspective:1400px]">
                <BrowserFrame
                  tone="light"
                  src="/shots/pipeline.png"
                  alt="Spike מזהה ליד חם בוואטסאפ ומכין טיוטת תגובה בזמן אמת"
                  width={1552}
                  height={1162}
                  label="app.spikeai.co.il/dashboard/showcase"
                />
              </Tilt>
              <p className="mt-3 text-center text-xs text-black/40">להמחשה · נתוני דמו</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
                יודע מה אוזל, <span className="hl">לפני שזה קורה</span>
              </h3>
              <p className="text-base text-soft leading-relaxed mb-6 max-w-xl">
                הסוכן סורק את המלאי, חוזה ביקוש, ומסמן בדיוק מה צריך הזמנה - לפני שנגמר. דוגמה אמיתית מתוך המערכת.
              </p>
              <Tilt max={5} scale={1.012} outerClassName="[perspective:1100px]">
                <PhoneFrame
                  src="/shots/inventory.png"
                  alt="ניתוח מלאי של הסוכן: התראות על מוצרים שעומדים להיגמר וחיזוי ביקוש"
                  width={1261}
                  height={1291}
                />
              </Tilt>
            </Reveal>
          </div>
        </section>

        {/* ===== HOW IT WORKS — ink ===== */}
        <section id="how" dir="rtl" className="zone-ink relative py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1240px] mx-auto relative">
            <Reveal className="text-center mb-12 sm:mb-16">
              <div className="eyebrow mb-5"><span>איך זה עובד</span></div>
              <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black leading-[1.07] tracking-[-0.03em] mb-5">
                3 שלבים. <span className="hl">תוך 7 ימים.</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                מהקליק הראשון עד שהסוכן שלך כבר עובד - תוך שבוע. בלי בירוקרטיה, בלי בלאגן.
              </p>
            </Reveal>

            <div className="relative">
              <div className="hidden lg:block absolute top-14 right-[16.6%] left-[16.6%] pointer-events-none" aria-hidden>
                <svg className="w-full overflow-visible" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="how-line" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="rgba(22,211,171,0)" />
                      <stop offset="18%" stopColor="rgba(22,211,171,0.65)" />
                      <stop offset="82%" stopColor="rgba(91,208,242,0.65)" />
                      <stop offset="100%" stopColor="rgba(91,208,242,0)" />
                    </linearGradient>
                  </defs>
                  <motion.line
                    x1="100" y1="1" x2="0" y2="1"
                    stroke="url(#how-line)" strokeWidth="2" strokeLinecap="round"
                    initial={reduceMotion ? undefined : { pathLength: 0 }}
                    whileInView={reduceMotion ? undefined : { pathLength: 1 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 1.3, ease: "easeInOut" }}
                  />
                </svg>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 relative">
                {[
                  { num: "01", title: "ממלאים טופס קצר", desc: "5 דקות. אתה מספר על העסק - איזה תחום, איך עובדים היום, ומה הכי כואב. זה הכל.", footer: "5 דקות מקסימום" },
                  { num: "02", title: "שיחה איתנו", desc: "אנחנו לומדים את העסק שלך - איזה סוכנים יביאו לך הכי הרבה ערך. תוך כמה ימים מקבלים הצעה מותאמת.", footer: "בלי לחץ של מכירה" },
                  { num: "03", title: "הסוכן מתחיל לעבוד", desc: "אישרת את ההצעה? תוך 7 ימים הסוכן שלך כבר חי, מנתח, ושולח לך דוחות לוואטסאפ כל בוקר.", footer: "תוך 7 ימים" },
                ].map((step, i) => (
                  <Reveal key={i} delay={i * 0.12} className="glass glass-hover rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                    <div className="num-ghost font-grotesk absolute -top-4 left-3 text-[6.5rem] lg:text-[8.5rem] select-none" aria-hidden>{step.num}</div>
                    <div className="relative z-10">
                      <div className="font-grotesk w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 text-2xl font-bold"
                        style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-2))", color: "var(--ink)" }}>
                        {step.num}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2.5 text-center lg:text-right">{step.title}</h3>
                      <p className="text-sm sm:text-base text-[var(--text-2)] leading-relaxed text-center lg:text-right mb-4">{step.desc}</p>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 justify-center lg:justify-start">
                        <Check className="text-[var(--teal-soft)]" />
                        <span>{step.footer}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== AGENTS — bento grid ===== */}
        <section id="agents" dir="rtl" className="zone-ink relative py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1240px] mx-auto relative">
            <Reveal className="text-center mb-12 sm:mb-16">
              <div className="eyebrow mb-5"><span>הצוות שלך</span></div>
              <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black leading-[1.07] tracking-[-0.03em] mb-5">
                הצוות <span className="hl">שעובד בשבילך</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                כל סוכן הוא מומחה בתחום שלו. ביחד הם מטפלים בכל הצדדים של העסק - מהבוקר ועד הלילה.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
              {agents.map((agent, index) => {
                const featured = index === 0;
                return (
                  <Reveal
                    key={index}
                    delay={(index % 3) * 0.08}
                    className={`h-full ${featured ? "sm:col-span-2 lg:col-span-4" : "lg:col-span-2"}`}
                  >
                    <div
                      className="agent-float h-full"
                      style={{ animationDelay: `${(index % 3) * 0.7 + Math.floor(index / 3) * 0.35}s` }}
                    >
                      <Tilt
                        max={8}
                        scale={1.02}
                        outerClassName="h-full [perspective:900px]"
                        className="card-live spotlight-card glass rounded-3xl p-6 sm:p-8 relative h-full"
                      >
                        <div className="relative z-10">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                            style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-2))", color: "var(--ink)" }}
                          >
                            <AgentGlyph name={agent.iconKey} />
                          </div>
                          <h3 className={`${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"} font-bold mb-2.5 text-right`}>{agent.name}</h3>
                          <p className="text-[var(--text-2)] leading-relaxed text-right text-sm max-w-xl">{agent.description}</p>
                          {featured && (
                            <div className="mt-6 space-y-2.5 max-w-md" aria-hidden>
                              <div className="rounded-2xl rounded-tr-sm bg-white/[0.07] border border-white/10 px-4 py-2.5 text-sm text-white/90 w-fit">
                                בוקר טוב! 3 לידים חדשים מחכים לך 🔥
                              </div>
                              <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm font-semibold w-fit mr-auto" style={{ background: "var(--teal)", color: "var(--ink)" }}>
                                תודה ספייק, מתחיל מהחם ביותר
                              </div>
                            </div>
                          )}
                        </div>
                      </Tilt>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== STATEMENT — full teal, the Iron Rule ===== */}
        <section id="approvals" dir="rtl" className="zone-teal relative py-16 sm:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden">
          <div className="max-w-[1060px] mx-auto text-center relative">
            <Reveal>
              <div className="mb-6"><Sticker>ככה זה נראה במערכת</Sticker></div>
              <h2 className="text-[clamp(2.6rem,7vw,5.4rem)] font-black leading-[1.02] tracking-[-0.035em] mb-5">
                AI מסמן. <span className="hl">אתה מחליט.</span>
              </h2>
              <p className="text-base sm:text-xl text-soft leading-relaxed max-w-2xl mx-auto mb-10">
                כל פעולה היא טיוטה שמחכה לך. מאשר בלחיצה - ואז נשלח. אף פעם לא אוטומטית, אף פעם לא בלי האישור שלך.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="-rotate-1">
              <Tilt max={3} scale={1.006} outerClassName="[perspective:1400px]">
                <BrowserFrame
                  tone="light"
                  src="/shots/approvals.png"
                  alt="טיוטות פוסטים שהסוכן הכין, ממתינות לאישור או דחייה של בעל העסק"
                  width={1571}
                  height={1270}
                  label="app.spikeai.co.il/dashboard/approvals"
                />
              </Tilt>
            </Reveal>
          </div>
        </section>

        {/* ===== COLORFUL: SHADER CTA ===== */}
        <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <WebGLShader />
          </div>
          <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-black/25 to-[#04100d]" />

          <div dir="rtl" className="relative z-10 text-center px-4 sm:px-6 py-24 max-w-3xl mx-auto">
            <div className="eyebrow mb-6 border-white/25 bg-white/10 text-white/90"><span>קבל הצעה</span></div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.04] tracking-[-0.04em] text-white mb-5">
              מוכן להתחיל?{" "}
              <span className="block">בוא נדבר.</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-9">
              השאר פרטים ונחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך. בלי התחייבות, בלי לחץ.
            </p>
            <Magnetic strength={0.25} className="inline-block">
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
            </Magnetic>
          </div>
        </section>

        {/* ===== PACKAGE — paper ticket on ink ===== */}
        <section id="pricing" dir="rtl" className="zone-ink relative py-16 sm:py-28 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1240px] mx-auto relative">
            <Reveal className="text-center mb-12 sm:mb-16">
              <div className="eyebrow mb-5"><span>החבילה</span></div>
              <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black leading-[1.07] tracking-[-0.03em] mb-5">
                חבילה אחת. <span className="hl">הכל כלול.</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                בלי שדרוגים. בלי תוספות. בלי הפתעות בחשבון. כל הסוכנים, כל החיבורים, וכל ההתאמות - בחבילה אחת מותאמת לעסק שלך.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card-paper rounded-[2rem] overflow-hidden max-w-[1100px] mx-auto">
                <div
                  className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-10 py-6 sm:py-7"
                  style={{ background: "linear-gradient(135deg, var(--teal-surface), var(--teal-surface-2))" }}
                >
                  <div className="text-right">
                    <h3 className="text-2xl sm:text-4xl font-black text-[#04100d]">החבילה המלאה</h3>
                    <p className="text-sm sm:text-base text-[#04100d]/75 mt-1 max-w-xl">
                      הצעה מותאמת אישית לעסק שלך. בשיחה איתנו נבין את הצרכים שלך ונבנה את החבילה הנכונה.
                    </p>
                  </div>
                  <Sticker className="!rotate-2">הכל כלול במחיר אחד</Sticker>
                </div>

                <div className="p-5 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10 items-stretch">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.025] p-5 sm:p-6 order-2 md:order-1">
                      <div className="flex items-center gap-3 mb-4 pb-3.5 border-b border-black/10">
                        <h4 className="text-base sm:text-lg font-bold">מתחבר ל-</h4>
                      </div>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {packageIncludes.connections.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#0a1411]/85">
                            <Check className="text-[#0c7a63] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border-2 border-[var(--teal)] bg-white p-5 sm:p-6 lg:p-7 order-1 md:order-2 relative md:scale-[1.04] shadow-[0_20px_50px_rgba(16,184,148,0.25)]">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <Sticker className="sticker-teal !rotate-0 whitespace-nowrap">הלב של החבילה</Sticker>
                      </div>
                      <div className="flex items-center gap-3 mb-4 pb-3.5 border-b border-black/10 mt-3">
                        <div>
                          <h4 className="text-lg sm:text-xl font-black">הסוכנים</h4>
                          <p className="text-xs text-[#0a1411]/55">הצוות שעובד בשבילך 24/7</p>
                        </div>
                      </div>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {packageIncludes.agents.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#0a1411]">
                            <Check className="text-[#0c7a63] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.025] p-5 sm:p-6 order-3">
                      <div className="flex items-center gap-3 mb-4 pb-3.5 border-b border-black/10">
                        <h4 className="text-base sm:text-lg font-bold">השירות</h4>
                      </div>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {packageIncludes.service.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-[#0a1411]/85">
                            <Check className="text-[#0c7a63] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <Magnetic strength={0.22} className="inline-flex">
                    <a href="#cta" className="inline-flex btn-primary px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg">
                      קבל הצעה אישית
                    </a>
                    </Magnetic>
                    <p className="text-xs sm:text-sm text-[#0a1411]/55 mt-3 sm:mt-4">בלי התחייבות. בלי לחץ של מכירה.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== DETAILED FORM ===== */}
        <section id="cta" dir="rtl" className="zone-ink relative py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto relative">
            <Reveal className="text-center mb-8 sm:mb-12">
              <div className="eyebrow mb-5"><span>קבל הצעה</span></div>
              <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black leading-[1.07] tracking-[-0.03em] mb-5">
                מוכן להתחיל? <span className="hl">בוא נדבר.</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                השאר פרטים ונחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך. בלי התחייבות, בלי לחץ.
              </p>
            </Reveal>

            <Reveal delay={0.05} className="card-live glass rounded-[2rem] p-5 sm:p-8 lg:p-12 relative">
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

                    {/* === Legal consent checkboxes (Amendment 13) === */}
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
                    <h3 className="text-3xl lg:text-4xl font-black mb-4">תודה <span className="hl">{formData.name}!</span></h3>
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
              <span className="flex items-center gap-2"><Check className="text-[var(--teal-soft)]" /><span>תגובה תוך 24 שעות</span></span>
              <span className="flex items-center gap-2"><Check className="text-[var(--teal-soft)]" /><span>בלי התחייבות</span></span>
              <span className="flex items-center gap-2"><Check className="text-[var(--teal-soft)]" /><span>שירות בעברית</span></span>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" dir="rtl" className="zone-ink relative py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[900px] mx-auto relative">
            <Reveal className="text-center mb-12 sm:mb-16">
              <div className="eyebrow mb-5"><span>שאלות נפוצות</span></div>
              <h2 className="text-[clamp(2rem,5vw,3.8rem)] font-black leading-[1.07] tracking-[-0.03em] mb-5">
                יש לך שאלות? <span className="hl">יש לנו תשובות.</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-2xl mx-auto">
                התשובות לשאלות הנפוצות שאנחנו מקבלים. אם משהו לא ברור - תמיד אפשר לפנות אלינו.
              </p>
            </Reveal>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div key={index} className={`glass rounded-2xl overflow-hidden ${open ? "border-white/25 bg-white/[0.06]" : ""}`}>
                    <button
                      className="w-full px-5 sm:px-7 py-4 sm:py-6 text-right flex items-center gap-4 cursor-pointer"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={open}
                    >
                      <span className="font-grotesk text-sm text-[var(--teal-soft)]/70 w-7 flex-shrink-0" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-right flex-1">{faq.question}</span>
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-lg font-light text-white transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="answer"
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-7 pb-5 sm:pb-6 text-sm lg:text-base text-[var(--text-2)] leading-relaxed text-right">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
        <footer dir="rtl" className="zone-ink relative border-t border-white/10 mt-8 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-8 mb-8 sm:mb-10">
              <div className="text-center md:text-right">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="relative w-10 h-10">
                    <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="40px" className="object-contain mascot-mono" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-grotesk text-xl font-bold tracking-tight">Spike AI</span>
                    <span className="font-grotesk text-[10px] font-medium tracking-[0.25em] text-[var(--teal-soft)] border border-[rgba(22,211,171,0.35)] px-2 py-0.5 rounded-full">
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

            <div aria-hidden className="pointer-events-none select-none font-grotesk font-bold text-white/[0.045] text-[17vw] leading-[0.8] text-center -mb-[2vw]" dir="ltr">
              SPIKE
            </div>

            <div className="pt-8 border-t border-white/5 text-center space-y-2 relative">
              <p className="text-xs text-white/35">כל התצוגות באתר להמחשה בלבד · הנתונים והשמות לדוגמה ואינם לקוחות אמיתיים.</p>
              <p className="text-xs text-white/40">© 2026 Spike AI Agents. כל הזכויות שמורות.</p>
            </div>
          </div>
        </footer>

        {/* ===== Sticky mobile CTA ===== */}
        <a href="#cta" className="sm:hidden fixed bottom-4 inset-x-4 z-50 btn-primary py-3.5 text-base shadow-2xl">
          קבל הצעה אישית
        </a>
      </div>
    </>
  );
}
