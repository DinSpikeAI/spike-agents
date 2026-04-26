"use client";

import Image from "next/image";
import { useState } from "react";

const WEB3FORMS_KEY = "0b0d2e56-49e7-443f-b4bc-444c083b01ac";

const agents = [
  {
    icon: "☀️",
    name: "סוכן בוקר",
    description: "כל בוקר ב-7:00 דוח מלא בטלגרם. מה קרה אתמול, מה ההזדמנויות החמות, ומה צריך לטפל היום.",
  },
  {
    icon: "📱",
    name: "סוכן רשתות",
    description: "3 פוסטים ביום (9:00, 14:00, 19:00), מותאמים לטון של העסק. מוכנים ללחיצה אחת והעלאה.",
  },
  {
    icon: "🧠",
    name: "סוכן מנהל",
    description: "סיכום אסטרטגי יומי בעברית עם המלצות אמיתיות. כמו מנהל אישי שמכיר את העסק שלך.",
  },
  {
    icon: "🎯",
    name: "סוכן מעקב",
    description: "התראות בזמן אמת על אירועים חמים - לקוח חדש, ביקורת חדשה, ליד שמתקרר. אתה הראשון לדעת.",
  },
  {
    icon: "🧹",
    name: "סוכן ניקיון",
    description: "מנקה אוטומטית לידים מתים, מתריע על תקועים, ושומר על pipeline נקי ומסודר.",
  },
  {
    icon: "💰",
    name: "סוכן מכירות",
    description: "מנתח deals תקועים, מסמן לידים חמים, ומנסח follow-ups שמחזירים שיחות לחיים.",
  },
  {
    icon: "⭐",
    name: "סוכן ביקורות",
    description: "סורק ביקורות חדשות בגוגל ובאינסטגרם, מנסח תגובות, ומתריע על ביקורות שדורשות טיפול דחוף.",
  },
  {
    icon: "📦",
    name: "סוכן מלאי",
    description: "מתריע על מלאי נמוך לפני שאוזל, חוזה ביקוש, ומסמן מוצרים שמתחילים לרדת בביצועים.",
  },
  {
    icon: "🔥",
    name: "סוכן לידים חמים",
    description: "מדרג לידים נכנסים אוטומטית, מתעדף לפי סבירות לסגירה, ומסמן את אלה ששווה לחזור אליהם עכשיו.",
  },
];

const packageIncludes = {
  agents: [
    "סוכן בוקר ☀️ - דוח יומי בטלגרם ב-7:00",
    "סוכן רשתות 📱 - 3 פוסטים מוכנים בכל יום",
    "סוכן מנהל 🧠 - סיכום אסטרטגי יומי",
    "סוכן מעקב 🎯 - התראות בזמן אמת",
    "סוכן ניקיון 🧹 - pipeline תמיד נקי",
    "סוכן מכירות 💰 - מנתח deals תקועים",
    "סוכן ביקורות ⭐ - סורק ומגיב לביקורות",
    "סוכן מלאי 📦 - חיזוי ביקוש (לעסקי מכירות)",
    "סוכן לידים חמים 🔥 - דירוג חכם של לידים",
  ],
  connections: [
    "גוגל ביזנס - ביקורות וצפיות",
    "גוגל שיטס - לידים, לקוחות, מלאי",
    "טלגרם - דוחות והתראות",
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
    answer: "לחלוטין. הסוכנים שלנו פועלים עם הרשאות מוגבלות ומאובטחות בלבד - הם רואים רק את מה שאתה מאפשר. כל הנתונים נשארים בחשבונות שלך (גוגל, טלגרם וכו'), ואנחנו לא שומרים מידע אצלנו. אתה תמיד יכול לבטל גישה בלחיצה אחת.",
  },
  {
    question: "אני לא מבין במחשבים. זה יסתבך לי?",
    answer: "לא. כל ההתקנה וההגדרות נעשות על ידינו - אתה לא צריך לעשות שום דבר טכני. אחרי ההקמה, כל מה שאתה צריך זה לפתוח את טלגרם ולקרוא את הדוחות. אם משהו לא ברור - אנחנו תמיד זמינים בעברית.",
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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  return (
    <>
      <style jsx global>{`
        @keyframes spike-float {
          0%, 100% { transform: translateY(-15px); }
          50%      { transform: translateY(15px); }
        }
        @keyframes spike-float-small {
          0%, 100% { transform: translateY(-8px); }
          50%      { transform: translateY(8px); }
        }
        @keyframes spike-glow-pulse-1 {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes spike-glow-pulse-2 {
          0%, 100% { opacity: 0.4; transform: scale(1.15); }
          50%      { opacity: 0.8; transform: scale(1); }
        }
        @keyframes spike-glow-pulse-3 {
          0%, 100% { opacity: 0.3; transform: scale(0.9) rotate(0deg); }
          50%      { opacity: 0.6; transform: scale(1.05) rotate(5deg); }
        }
        @keyframes spike-particle-1 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translate(30px, -60px) scale(0); opacity: 0; }
        }
        @keyframes spike-particle-2 {
          0%   { transform: translate(0, 0) scale(1); opacity: 0; }
          50%  { opacity: 0.9; }
          100% { transform: translate(-40px, -70px) scale(0); opacity: 0; }
        }
        @keyframes spike-particle-3 {
          0%   { transform: translate(0, 0) scale(0.8); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translate(20px, -80px) scale(0); opacity: 0; }
        }
        @keyframes spike-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spike-grid-pulse {
          0%, 100% { opacity: 0.04; }
          50%      { opacity: 0.08; }
        }
        @keyframes spike-step-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 176, 0.4); }
          50%      { box-shadow: 0 0 0 12px rgba(34, 211, 176, 0); }
        }
        @keyframes spike-mascot-glow {
          0%, 100% { 
            filter: drop-shadow(0 30px 80px rgba(20, 184, 166, 0.7))
                    drop-shadow(0 0 60px rgba(94, 234, 212, 0.5))
                    drop-shadow(0 -10px 40px rgba(91, 208, 242, 0.4));
          }
          50% { 
            filter: drop-shadow(0 40px 100px rgba(20, 184, 166, 0.9))
                    drop-shadow(0 0 80px rgba(94, 234, 212, 0.7))
                    drop-shadow(0 -10px 50px rgba(91, 208, 242, 0.6));
          }
        }
        @keyframes spike-section-glow {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.5; }
        }
        @keyframes spike-icon-bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%      { transform: scale(1.1) rotate(-5deg); }
        }
        @keyframes spike-package-glow {
          0%, 100% { 
            box-shadow: 0 30px 80px rgba(34, 211, 176, 0.3), 
                        0 0 0 1px rgba(34, 211, 176, 0.4),
                        inset 0 0 60px rgba(34, 211, 176, 0.05);
          }
          50% { 
            box-shadow: 0 40px 100px rgba(34, 211, 176, 0.5), 
                        0 0 0 1px rgba(34, 211, 176, 0.6),
                        inset 0 0 80px rgba(34, 211, 176, 0.08);
          }
        }
        @keyframes spike-success-pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spike-premium-glow {
          0%, 100% { 
            box-shadow: 0 25px 60px rgba(34, 211, 176, 0.35),
                        0 0 0 2px rgba(34, 211, 176, 0.5),
                        inset 0 0 40px rgba(34, 211, 176, 0.08);
          }
          50% { 
            box-shadow: 0 35px 80px rgba(34, 211, 176, 0.55),
                        0 0 0 2px rgba(34, 211, 176, 0.7),
                        inset 0 0 60px rgba(34, 211, 176, 0.12);
          }
        }
        @keyframes spike-icon-spin-glow {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            box-shadow: 0 8px 25px rgba(34, 211, 176, 0.5);
          }
          50% { 
            transform: scale(1.05) rotate(3deg);
            box-shadow: 0 12px 35px rgba(34, 211, 176, 0.7);
          }
        }
        @keyframes spike-faq-fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .robot-floating {
          animation: spike-float 5s ease-in-out infinite, spike-mascot-glow 4s ease-in-out infinite;
        }
        .robot-floating-small {
          animation: spike-float-small 3.5s ease-in-out infinite;
        }
        .glow-layer-1 { animation: spike-glow-pulse-1 3.5s ease-in-out infinite; }
        .glow-layer-2 { animation: spike-glow-pulse-2 4.5s ease-in-out infinite; }
        .glow-layer-3 { animation: spike-glow-pulse-3 6s ease-in-out infinite; }
        .section-glow { animation: spike-section-glow 6s ease-in-out infinite; }
        .particle-1 { animation: spike-particle-1 4s ease-out infinite; }
        .particle-2 { animation: spike-particle-2 5s ease-out infinite; animation-delay: 1s; }
        .particle-3 { animation: spike-particle-3 6s ease-out infinite; animation-delay: 2s; }
        .step-circle { animation: spike-step-pulse 3s ease-in-out infinite; }
        
        .shimmer-text {
          background: linear-gradient(90deg, #22D3B0 0%, #5BD0F2 25%, #ffffff 50%, #5BD0F2 75%, #22D3B0 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: spike-shimmer 4s linear infinite;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(94, 234, 212, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 234, 212, 0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: spike-grid-pulse 8s ease-in-out infinite;
        }
        .robot-stage {
          background: radial-gradient(ellipse at center, rgba(20, 184, 166, 0.3) 0%, rgba(20, 184, 166, 0.12) 30%, transparent 60%);
        }
        .step-card, .agent-card, .package-column {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.4s ease;
        }
        .step-card:hover {
          transform: translateY(-8px);
          border-color: rgba(34, 211, 176, 0.4);
          background: rgba(34, 211, 176, 0.04);
        }
        .agent-card { position: relative; overflow: hidden; }
        .agent-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 100%; height: 100%;
          background: radial-gradient(circle at top right, rgba(34, 211, 176, 0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .agent-card:hover {
          transform: translateY(-6px);
          border-color: rgba(34, 211, 176, 0.4);
          box-shadow: 0 20px 60px rgba(34, 211, 176, 0.15);
        }
        .agent-card:hover::before { opacity: 1; }
        .agent-card:hover .agent-icon { animation: spike-icon-bounce 0.6s ease; }
        .package-column:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(34, 211, 176, 0.3);
        }
        .package-hero {
          background: linear-gradient(135deg, rgba(34, 211, 176, 0.12) 0%, rgba(91, 208, 242, 0.08) 50%, rgba(20, 184, 166, 0.06) 100%);
          backdrop-filter: blur(20px);
          animation: spike-package-glow 5s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }
        
        .package-column-premium {
          background: linear-gradient(135deg, 
            rgba(34, 211, 176, 0.18) 0%, 
            rgba(91, 208, 242, 0.12) 50%, 
            rgba(20, 184, 166, 0.10) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(34, 211, 176, 0.5);
          animation: spike-premium-glow 4s ease-in-out infinite;
          transform: scale(1.05);
          transition: all 0.4s ease;
          position: relative;
          z-index: 2;
        }
        .package-column-premium:hover {
          transform: scale(1.07) translateY(-4px);
        }
        .premium-icon {
          animation: spike-icon-spin-glow 4s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .package-column-premium {
            transform: scale(1);
          }
          .package-column-premium:hover {
            transform: translateY(-4px);
          }
        }
        
        .cta-form-card {
          background: linear-gradient(135deg, rgba(34, 211, 176, 0.15) 0%, rgba(91, 208, 242, 0.08) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(34, 211, 176, 0.4);
          animation: spike-package-glow 5s ease-in-out infinite;
        }
        .cta-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          width: 100%;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.3s ease;
          text-align: right;
          direction: rtl;
        }
        .cta-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .cta-input:focus {
          outline: none;
          border-color: #22D3B0;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(34, 211, 176, 0.2);
        }
        .cta-input:hover:not(:focus) { border-color: rgba(255, 255, 255, 0.25); }
        .cta-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2322D3B0' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 16px center;
          padding-left: 40px !important;
          appearance: none;
          -webkit-appearance: none;
        }
        .cta-select option { background: #07111A; color: white; }
        .success-message { animation: spike-success-pop 0.5s ease; }
        
        .hero-quick-input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          padding: 14px 18px;
          border-radius: 12px;
          width: 100%;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s ease;
          text-align: right;
          direction: rtl;
        }
        .hero-quick-input::placeholder { color: rgba(255, 255, 255, 0.45); }
        .hero-quick-input:focus {
          outline: none;
          border-color: #22D3B0;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3px rgba(34, 211, 176, 0.2);
        }
        .hero-quick-input:hover:not(:focus) { border-color: rgba(255, 255, 255, 0.2); }
        
        .faq-item {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .faq-item:hover {
          border-color: rgba(34, 211, 176, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }
        .faq-item.faq-open {
          border-color: rgba(34, 211, 176, 0.5);
          background: rgba(34, 211, 176, 0.05);
          box-shadow: 0 10px 30px rgba(34, 211, 176, 0.1);
        }
        .faq-button {
          width: 100%;
          padding: 24px 28px;
          text-align: right;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          background: transparent;
          border: none;
          color: white;
          font-family: inherit;
        }
        .faq-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22D3B0 0%, #5BD0F2 100%);
          color: #07111A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 16px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .faq-open .faq-icon {
          transform: rotate(45deg);
        }
        .faq-answer {
          padding: 0 28px 24px 28px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          animation: spike-faq-fade-in 0.3s ease;
        }
        
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          text-align: center;
        }
      `}</style>

      <div dir="rtl" className="min-h-screen bg-[#07111A] text-white overflow-x-hidden relative">
        
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#22D3B0]/30 blur-[180px] rounded-full"></div>
          <div className="absolute top-32 left-1/4 w-[600px] h-[600px] bg-[#5BD0F2]/20 blur-[140px] rounded-full"></div>
          <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-[#14B8A6]/20 blur-[120px] rounded-full"></div>
          <div className="absolute top-[1100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#22D3B0]/15 blur-[160px] rounded-full section-glow"></div>
          <div className="absolute top-[1300px] right-1/3 w-[500px] h-[400px] bg-[#5BD0F2]/12 blur-[140px] rounded-full section-glow" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-[1500px] left-1/3 w-[450px] h-[350px] bg-[#14B8A6]/12 blur-[120px] rounded-full section-glow" style={{ animationDelay: "4s" }}></div>
          <div className="absolute top-[2200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#22D3B0]/15 blur-[160px] rounded-full section-glow"></div>
          <div className="absolute top-[2500px] right-1/4 w-[500px] h-[400px] bg-[#5BD0F2]/12 blur-[140px] rounded-full section-glow" style={{ animationDelay: "3s" }}></div>
          <div className="absolute top-[2800px] left-1/4 w-[450px] h-[350px] bg-[#14B8A6]/10 blur-[120px] rounded-full section-glow" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-[3400px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#22D3B0]/15 blur-[160px] rounded-full section-glow"></div>
          <div className="absolute top-[3700px] right-1/3 w-[500px] h-[400px] bg-[#5BD0F2]/12 blur-[140px] rounded-full section-glow" style={{ animationDelay: "2.5s" }}></div>
          <div className="absolute top-[4500px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#22D3B0]/20 blur-[160px] rounded-full section-glow"></div>
          <div className="absolute top-[4800px] right-1/3 w-[500px] h-[400px] bg-[#5BD0F2]/15 blur-[140px] rounded-full section-glow" style={{ animationDelay: "1.5s" }}></div>
          <div className="absolute top-[5500px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#22D3B0]/12 blur-[140px] rounded-full section-glow" style={{ animationDelay: "0.5s" }}></div>
        </div>

        <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#07111A]/70 border-b border-white/5">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="40px" className="object-contain mix-blend-screen" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Spike AI</span>
                <span className="text-[10px] font-bold tracking-widest text-[#5EEAD4] bg-[#14B8A6]/15 border border-[#14B8A6]/30 px-2 py-0.5 rounded-full">
                  AGENTS
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#how" className="text-sm text-white/70 hover:text-white transition">איך זה עובד</a>
              <a href="#agents" className="text-sm text-white/70 hover:text-white transition">סוכנים</a>
              <a href="#pricing" className="text-sm text-white/70 hover:text-white transition">החבילה</a>
              <a href="#faq" className="text-sm text-white/70 hover:text-white transition">שאלות נפוצות</a>
            </div>

            <a href="#cta" className="bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2] text-[#07111A] font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#22D3B0]/40 transition">
              קבל הצעה אישית
            </a>
          </div>
        </nav>

        {/* === HERO === */}
        <section className="relative pt-12 pb-32 px-6 lg:px-12">
          <div className="max-w-[1280px] mx-auto relative">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-center">
              <div className="relative flex flex-col items-center order-2 lg:order-1 py-8 min-h-[600px] justify-center">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] robot-stage pointer-events-none rounded-full" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none glow-layer-1" style={{ background: "radial-gradient(circle, rgba(94,234,212,0.6) 0%, rgba(20,184,166,0.25) 30%, transparent 70%)", filter: "blur(90px)" }} />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none glow-layer-2" style={{ background: "radial-gradient(circle, rgba(91,208,242,0.5) 0%, rgba(91,208,242,0.15) 50%, transparent 80%)", filter: "blur(60px)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none glow-layer-3" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.4) 0%, transparent 60%)", filter: "blur(40px)" }} />

                <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#5EEAD4] particle-1 pointer-events-none" />
                <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-[#5BD0F2] particle-2 pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-[#22D3B0] particle-3 pointer-events-none" />
                <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-[#5EEAD4] particle-1 pointer-events-none" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 rounded-full bg-[#5BD0F2] particle-2 pointer-events-none" style={{ animationDelay: "2.5s" }} />
                <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full bg-[#22D3B0] particle-3 pointer-events-none" style={{ animationDelay: "3s" }} />

                <div className="relative robot-floating z-10">
                  <Image src="/spike-mascot-pro.png" alt="Spike AI" width={520} height={520} priority className="relative" />
                </div>
              </div>

              <div className="order-1 lg:order-2 text-right">
                <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
                  <span>חדש בישראל - לא עוד בוט. סוכן.</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                  צוות שלם שעובד בשבילך,{" "}
                  <span className="shimmer-text">בלי לבקש משכורת</span>
                </h1>

                <p className="text-base lg:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                  סוכני Spike עושים את העבודה שפעם היית משלם עליה אלפים: מניהול הרשתות ועד סינון לידים ובקרת איכות. כל העסק שלך מתופעל 24/7, בלי הוצאות שכר ובלי כאבי ראש.
                </p>

                {!heroSubmitted ? (
                  <form onSubmit={handleHeroSubmit} className="space-y-3 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" name="name" value={heroForm.name} onChange={handleHeroChange} placeholder="שם מלא" required className="hero-quick-input" />
                      <input type="tel" name="phone" value={heroForm.phone} onChange={handleHeroChange} placeholder="טלפון" required className="hero-quick-input" />
                    </div>
                    <input type="email" name="email" value={heroForm.email} onChange={handleHeroChange} placeholder="אימייל" required className="hero-quick-input" />
                    {heroError && (
                      <div className="error-message">⚠️ {heroError}</div>
                    )}
                    <button type="submit" disabled={heroSubmitting} className="w-full bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2] text-[#07111A] font-black px-8 py-4 rounded-xl text-base shadow-lg shadow-[#22D3B0]/40 hover:shadow-xl hover:shadow-[#22D3B0]/60 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                      {heroSubmitting ? "שולח..." : "🚀 קבל הצעה אישית"}
                    </button>
                    <p className="text-xs text-white/50 text-center">
                      ⚡ נחזור אליך תוך 24 שעות. בלי התחייבות.
                    </p>
                  </form>
                ) : (
                  <div className="success-message bg-gradient-to-l from-[#22D3B0]/20 to-[#5BD0F2]/10 border border-[#22D3B0]/40 rounded-2xl p-6 mb-6 text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="text-2xl font-black mb-2">
                      תודה <span className="shimmer-text">{heroForm.name}!</span>
                    </h3>
                    <p className="text-base text-white/80">
                      קיבלנו את הפרטים. נחזור אליך תוך 24 שעות.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
                  <span className="flex items-center gap-1.5"><span className="text-[#5EEAD4] font-bold">✓</span>הקמה תוך 7 ימים</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#5EEAD4] font-bold">✓</span>בלי התחייבות</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#5EEAD4] font-bold">✓</span>עברית מלאה</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section id="how" className="relative py-32 px-6 lg:px-12">
          <div className="max-w-[1280px] mx-auto relative">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
                <span>איך זה עובד</span>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative robot-floating-small" style={{ filter: "drop-shadow(0 15px 30px rgba(20, 184, 166, 0.4))" }}>
                  <Image src="/spike-mascot.png" alt="Spike Mascot" width={140} height={140} className="mix-blend-screen" />
                </div>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                3 שלבים. <span className="shimmer-text">תוך 7 ימים.</span>
              </h2>

              <p className="text-base lg:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                מהקליק הראשון עד שהסוכן שלך כבר עובד - תוך שבוע. בלי בירוקרטיה, בלי בלאגן.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-12 right-[16.6%] left-[16.6%] h-px bg-gradient-to-l from-transparent via-[#22D3B0]/40 to-transparent pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative">
                {[
                  { num: "01", title: "ממלאים טופס קצר", desc: "5 דקות. אתה מספר על העסק - איזה תחום, איך עובדים היום, ומה הכי כואב. זה הכל.", icon: "⏱", footer: "5 דקות מקסימום" },
                  { num: "02", title: "שיחה איתנו", desc: "אנחנו לומדים את העסק שלך - איזה סוכנים יביאו לך הכי הרבה ערך. תוך כמה ימים מקבלים הצעה מותאמת.", icon: "💬", footer: "בלי לחץ של מכירה" },
                  { num: "03", title: "הסוכן מתחיל לעבוד", desc: "אישרת את ההצעה? תוך 7 ימים הסוכן שלך כבר חי, מנתח, ושולח לך דוחות לטלגרם כל בוקר.", icon: "🚀", footer: "תוך 7 ימים" },
                ].map((step, i) => (
                  <div key={i} className="step-card rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-7xl font-black text-white/[0.03] leading-none select-none">{step.num}</div>
                    <div className="relative z-10">
                      <div className="step-circle w-24 h-24 rounded-full bg-gradient-to-br from-[#22D3B0] to-[#5BD0F2] flex items-center justify-center mb-6 mx-auto lg:mx-0">
                        <span className="text-3xl font-black text-[#07111A]">{step.num}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-center lg:text-right">{step.title}</h3>
                      <p className="text-white/70 leading-relaxed text-center lg:text-right mb-4">{step.desc}</p>
                      <div className="flex items-center gap-2 text-sm text-[#5EEAD4] justify-center lg:justify-start">
                        <span>{step.icon}</span>
                        <span>{step.footer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* === AGENTS === */}
        <section id="agents" className="relative py-32 px-6 lg:px-12">
          <div className="max-w-[1280px] mx-auto relative">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
                <span>הצוות שלך</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                הצוות <span className="shimmer-text">שעובד בשבילך</span>
              </h2>

              <p className="text-base lg:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                כל סוכן הוא מומחה בתחום שלו. ביחד הם מטפלים בכל הצדדים של העסק - מהבוקר ועד הלילה.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, index) => (
                <div key={index} className="agent-card rounded-3xl p-8 relative">
                  <div className="relative z-10">
                    <div className="agent-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22D3B0] to-[#5BD0F2] flex items-center justify-center mb-5 text-3xl shadow-lg shadow-[#22D3B0]/20">
                      {agent.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-right">{agent.name}</h3>
                    <p className="text-white/70 leading-relaxed text-right text-sm">{agent.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === PACKAGE === */}
        <section id="pricing" className="relative py-32 px-6 lg:px-12">
          <div className="max-w-[1280px] mx-auto relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
                <span>החבילה</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                חבילה אחת. <span className="shimmer-text">הכל כלול.</span>
              </h2>

              <p className="text-base lg:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                בלי שדרוגים. בלי תוספות. בלי הפתעות בחשבון. כל הסוכנים, כל החיבורים, וכל ההתאמות - בחבילה אחת מותאמת לעסק שלך.
              </p>
            </div>

            <div className="package-hero rounded-[2rem] p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#22D3B0]/20 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#5BD0F2]/20 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2] text-[#07111A] font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-[#22D3B0]/40 mb-6">
                    🎁 הכל כלול במחיר אחד
                  </div>

                  <h3 className="text-3xl lg:text-5xl font-black mb-4">החבילה המלאה</h3>

                  <p className="text-lg text-white/80 max-w-2xl mx-auto">
                    הצעה מותאמת אישית לעסק שלך. בשיחה איתנו נבין את הצרכים שלך ונבנה את החבילה הנכונה.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
                  
                  <div className="package-column rounded-2xl p-6 order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3B0] to-[#5BD0F2] flex items-center justify-center text-xl">🔗</div>
                      <h4 className="text-lg font-bold">מתחבר ל-</h4>
                    </div>
                    <ul className="space-y-3">
                      {packageIncludes.connections.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                          <span className="text-[#5EEAD4] font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="package-column-premium rounded-2xl p-6 lg:p-7 order-1 md:order-2 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2] text-[#07111A] font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-[#22D3B0]/50 whitespace-nowrap z-10">
                      ⭐ הלב של החבילה
                    </div>

                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#22D3B0]/20 mt-2">
                      <div className="premium-icon w-12 h-12 rounded-xl bg-gradient-to-br from-[#22D3B0] to-[#5BD0F2] flex items-center justify-center text-2xl">
                        🤖
                      </div>
                      <div>
                        <h4 className="text-xl font-black">הסוכנים</h4>
                        <p className="text-xs text-[#5EEAD4]">הצוות שעובד בשבילך 24/7</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {packageIncludes.agents.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white">
                          <span className="text-[#5EEAD4] font-black mt-0.5 flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="package-column rounded-2xl p-6 order-3">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22D3B0] to-[#5BD0F2] flex items-center justify-center text-xl">⚡</div>
                      <h4 className="text-lg font-bold">השירות</h4>
                    </div>
                    <ul className="space-y-3">
                      {packageIncludes.service.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                          <span className="text-[#5EEAD4] font-bold mt-0.5 flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <a href="#cta" className="inline-block bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2] text-[#07111A] font-black px-12 py-5 rounded-xl text-lg shadow-lg shadow-[#22D3B0]/40 hover:shadow-xl hover:shadow-[#22D3B0]/60 hover:scale-105 transition-all">
                    קבל הצעה אישית
                  </a>
                  <p className="text-sm text-white/50 mt-4">
                    בלי התחייבות. בלי לחץ של מכירה.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === DETAILED FORM === */}
        <section id="cta" className="relative py-32 px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
                <span>קבל הצעה</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                מוכן להתחיל? <span className="shimmer-text">בוא נדבר.</span>
              </h2>

              <p className="text-base lg:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                השאר פרטים ונחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך. בלי התחייבות, בלי לחץ.
              </p>
            </div>

            <div className="cta-form-card rounded-[2rem] p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#22D3B0]/20 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#5BD0F2]/20 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2 text-right text-white/90">שם מלא</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="ישראל ישראלי" required className="cta-input" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-right text-white/90">טלפון</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="050-1234567" required className="cta-input" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2 text-right text-white/90">אימייל</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="israel@example.com" required className="cta-input" />
                    </div>

                    <div>
                      <label htmlFor="businessType" className="block text-sm font-semibold mb-2 text-right text-white/90">תחום העסק</label>
                      <select id="businessType" name="businessType" value={formData.businessType} onChange={handleChange} required className="cta-input cta-select">
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

                    {submitError && (
                      <div className="error-message">⚠️ {submitError}</div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-l from-[#22D3B0] to-[#5BD0F2] text-[#07111A] font-black px-8 py-5 rounded-xl text-lg shadow-lg shadow-[#22D3B0]/40 hover:shadow-xl hover:shadow-[#22D3B0]/60 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                      {isSubmitting ? "שולח..." : "שלח ובוא נדבר"}
                    </button>

                    <p className="text-xs text-white/50 text-center mt-4">
                      🔒 הפרטים שלך מוגנים. אנחנו לא משתפים אותם עם אף אחד.
                    </p>
                  </form>
                ) : (
                  <div className="success-message text-center py-8">
                    <div className="text-7xl mb-6">🎉</div>
                    <h3 className="text-3xl lg:text-4xl font-black mb-4">
                      תודה <span className="shimmer-text">{formData.name}!</span>
                    </h3>
                    <p className="text-lg text-white/80 mb-2">קיבלנו את הפרטים שלך.</p>
                    <p className="text-base text-white/70 mb-8">נחזור אליך תוך 24 שעות עם הצעה אישית מותאמת לעסק שלך.</p>
                    <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 text-sm text-[#5EEAD4]">
                      <span>📱</span>
                      <span>תקבל אישור באימייל</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-white/60">
              <span className="flex items-center gap-2"><span className="text-[#5EEAD4]">⚡</span><span>תגובה תוך 24 שעות</span></span>
              <span className="flex items-center gap-2"><span className="text-[#5EEAD4]">🛡️</span><span>בלי התחייבות</span></span>
              <span className="flex items-center gap-2"><span className="text-[#5EEAD4]">🇮🇱</span><span>שירות בעברית</span></span>
            </div>
          </div>
        </section>

        {/* === FAQ === */}
        <section id="faq" className="relative py-32 px-6 lg:px-12">
          <div className="max-w-[900px] mx-auto relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full px-4 py-2 mb-6 text-sm text-[#5EEAD4]">
                <span>שאלות נפוצות</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                יש לך שאלות? <span className="shimmer-text">יש לנו תשובות.</span>
              </h2>

              <p className="text-base lg:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                התשובות לשאלות הנפוצות שאנחנו מקבלים. אם משהו לא ברור - תמיד אפשר לפנות אלינו.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-item rounded-2xl ${openFaq === index ? "faq-open" : ""}`}
                >
                  <button
                    className="faq-button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaq === index}
                  >
                    <span className="text-base lg:text-lg font-bold text-right flex-1">
                      {faq.question}
                    </span>
                    <span className="faq-icon">+</span>
                  </button>
                  {openFaq === index && (
                    <div className="faq-answer text-sm lg:text-base text-right">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-base text-white/60 mb-4">
                יש לך שאלה אחרת?
              </p>
              <a
                href="#cta"
                className="inline-block bg-white/5 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition"
              >
                בוא נדבר ←
              </a>
            </div>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="relative border-t border-white/10 bg-[#07111A]/60 backdrop-blur-md mt-12">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#22D3B0]/8 blur-[140px] rounded-full"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-14 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">

              {/* עמודה 1: לוגו + תיאור */}
              <div className="text-center md:text-right">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <div className="relative w-10 h-10">
                    <Image src="/spike-mascot.png" alt="Spike AI" fill sizes="40px" className="object-contain mix-blend-screen" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">Spike AI</span>
                    <span className="text-[10px] font-bold tracking-widest text-[#5EEAD4] bg-[#14B8A6]/15 border border-[#14B8A6]/30 px-2 py-0.5 rounded-full">
                      AGENTS
                    </span>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto md:mx-0">
                  צוות שעובד בשבילך, בלי לבקש משכורת.
                </p>
              </div>

              {/* עמודה 2: קישורים */}
              <div className="text-center md:text-right">
                <h4 className="text-sm font-bold text-white/90 mb-4 tracking-wide">ניווט</h4>
                <ul className="space-y-2.5">
                  <li>
                    <a href="#how" className="text-sm text-white/60 hover:text-[#5EEAD4] transition-colors">
                      איך זה עובד
                    </a>
                  </li>
                  <li>
                    <a href="#agents" className="text-sm text-white/60 hover:text-[#5EEAD4] transition-colors">
                      סוכנים
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-sm text-white/60 hover:text-[#5EEAD4] transition-colors">
                      החבילה
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-sm text-white/60 hover:text-[#5EEAD4] transition-colors">
                      שאלות נפוצות
                    </a>
                  </li>
                </ul>
              </div>

              {/* עמודה 3: יצירת קשר */}
              <div className="text-center md:text-right">
                <h4 className="text-sm font-bold text-white/90 mb-4 tracking-wide">יצירת קשר</h4>
                <a
                  href="mailto:spikeaistudio@gmail.com"
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#5EEAD4] transition-colors"
                  dir="ltr"
                >
                  <span>spikeaistudio@gmail.com</span>
                </a>
                <p className="text-xs text-white/40 mt-3 leading-relaxed">
                  נחזור אליך תוך 24 שעות
                </p>
              </div>

            </div>

            {/* שורת copyright */}
            <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-white/40">
                © 2026 Spike AI Agents. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
