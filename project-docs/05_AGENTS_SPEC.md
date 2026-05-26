# 🤖 Spike Agents — 9 Agents Specification

> **המסמך הזה מגדיר את 9 הסוכנים בפירוט.** מודל, prompt, schema, behaviors.

---

## Master config table

| # | id | name_he | model | thinking | cache_ttl | schedule | tier |
|---|---|---|---|---|---|---|---|
| 1 | `morning` | סוכן בוקר | claude-haiku-4-5 | – | 1h | `0 7 * * *` | Starter+ |
| 2 | `reviews` | סוכן ביקורות | claude-sonnet-4-6 | – | 1h | `0 */2 * * *` | Starter+ |
| 3 | `social` | סוכן רשתות | claude-sonnet-4-6 | – | 1h | `0 6 * * *` | Starter+ |
| 4 | `manager` | סוכן מנהל | **claude-sonnet-4-6** | **8000** | 1h | `0 19 * * *` | Pro+ |
| 5 | `watcher` | סוכן מעקב | claude-haiku-4-5 | – | 5m | `*/15 * * * *` | Pro+ |
| 6 | `cleanup` | סוכן ניקיון | claude-haiku-4-5 | – | 1h | `0 9 * * 0` | Pro+ |
| 7 | `sales` | סוכן מכירות | claude-sonnet-4-6 | – | 1h | `0 10 * * 0-4` | Pro+ |
| 8 | `inventory` | סוכן מלאי | claude-haiku-4-5 | **2048** | 1h | `0 8 * * *` | Pro+ |
| 9 | `hot_leads` | סוכן לידים חמים | claude-haiku-4-5 | – | 5m | `*/30 * * * *` | Starter+ |

**Manager Business override:**
ב-Business tier, Manager משתמש ב-`claude-opus-4-7` במקום Sonnet. זה ההבדל המרכזי שמצדיק ₪500 הנוסף.

---

## 1. ☀️ Morning Agent (`morning`)

**משך עבודה צפוי:** 5-15 שניות
**Cost בערך:** ~$0.0008 פר run (cached)
**Cost חודשי per tenant:** ~$0.024 (30 runs × $0.0008)

### Description
דוח יומי שמחכה לבעל העסק כל בוקר ב-7:00. **לא רק נתונים — אלא תמצית קצרה ופוקסת על מה היה אתמול ומה חשוב היום.**

### Input
```ts
{
  tenant: { name, business_type, user_gender },
  yesterday: {
    total_revenue_ils,
    new_leads_count,
    completed_orders_count,
    pending_drafts_count,
    failed_runs_count,
  },
  today: {
    scheduled_meetings: [...],
    expected_orders_count,
  },
  open_anomalies: [...]   // from watcher agent's alerts
}
```

### Output Schema (Native JSON Schema)
```json
{
  "type": "object",
  "properties": {
    "greeting": {
      "type": "string",
      "description": "Hebrew greeting matching user gender (e.g. 'בוקר טוב, רחל!')"
    },
    "yesterday_highlights": {
      "type": "array",
      "items": {"type": "string"},
      "description": "2-3 short bullet points in Hebrew",
      "minItems": 1, "maxItems": 4
    },
    "today_priorities": {
      "type": "array",
      "items": {"type": "string"},
      "description": "2-3 actionable Hebrew bullets",
      "minItems": 1, "maxItems": 4
    },
    "anomalies": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Things that need attention (empty if none)"
    },
    "suggested_focus": {
      "type": "string",
      "description": "Single sentence: 'היום שווה להתמקד ב...'"
    }
  },
  "required": ["greeting", "yesterday_highlights", "today_priorities", "suggested_focus"],
  "additionalProperties": false
}
```

### System Prompt Structure
```
[CACHE BREAKPOINT — system, ttl: 1h]

You are the Morning Briefing agent for {{TENANT_NAME}}, a {{BUSINESS_TYPE}} in Israel.

Generate a concise daily brief in natural Hebrew.

CRITICAL: The user's grammatical gender is {{USER_GENDER}} (זכר/נקבה/רבים).
Always use matching forms. If unknown, use לשון סתמית ("אפשר", "ניתן", "כדאי").

Style:
- Direct, friendly, professional
- 2-3 highlights from yesterday (real data only)
- 2-3 priorities for today (concrete actions)
- Highlight any anomalies the watcher caught
- End with a single focus sentence

DO NOT:
- Mention you're an AI
- Suggest the user check the dashboard ("you can see in the dashboard...")
- Use English idioms translated to Hebrew
- Praise excessively

[/CACHE BREAKPOINT]

YESTERDAY DATA: {{YESTERDAY_JSON}}
TODAY SCHEDULE: {{TODAY_JSON}}
OPEN ANOMALIES: {{ANOMALIES_JSON}}
```

### Edge cases
- **שבת/חג:** דלג ב-`@hebcal/core` check לפני trigger
- **לקוח חדש (אין נתונים):** "ברוך הבא! היום נתחיל לאסוף נתונים..."
- **כשלון של agent אחר:** הזכר ב-anomalies

---

## 2. ⭐ Reviews Agent (`reviews`)

**משך עבודה:** 10-30 שניות לכל ביקורת
**Cost בערך:** ~$0.005 פר run
**Cost חודשי per tenant:** ~$2.4 (480 reviews × $0.005)

### Description
סורק ביקורות חדשות (Google Business Profile, Instagram comments) **לוקח את אלה שצריכות תגובה**, ומכין טיוטה בעברית.

### Input
```ts
{
  tenant: { name, business_tone },
  review: {
    source: 'google' | 'instagram' | 'facebook',
    rating: number,                    // 1-5
    text: string,
    author_name: string,
    posted_at: string,
  },
  business_context: {
    services: [...],
    common_complaints: [...]
  }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "sentiment": {"type": "string", "enum": ["positive", "neutral", "negative", "mixed"]},
    "response_he": {
      "type": "string",
      "description": "Reply in Hebrew, 200-400 chars. Match business tone."
    },
    "requires_human_review": {
      "type": "boolean",
      "description": "true if: legal threats, medical claims, severe complaints, requires refund decisions"
    },
    "escalation_reason": {
      "type": "string",
      "description": "If requires_human_review=true, explain why"
    },
    "tags": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Topics: service, food_quality, staff, delivery..."
    }
  },
  "required": ["sentiment", "response_he", "requires_human_review", "tags"],
  "additionalProperties": false
}
```

### Critical rules
- **Always escalate:**
  - Legal claims ("אני אתבע", "עוה\"ד שלי")
  - Medical claims ("הרעלה", "אלרגיה")
  - Threats ("אבוא לחנות")
- **Never include:**
  - Compensation offers ("נחזיר לך")
  - Specific employee names
  - Discounts not pre-approved
- **Tone:**
  - 5 stars: warm thanks
  - 4 stars: thanks + ask for what could be better
  - 3 stars: empathetic + offer to talk privately
  - 1-2 stars: apologetic + escalate

---

## 3. 📱 Social Posts Agent (`social`)

**משך עבודה:** 30-60 שניות (Batch API)
**Cost בערך:** ~$0.012 פר day (3 posts batch, 50% discount)
**Cost חודשי per tenant:** ~$0.36

### Description
3 פוסטים עבריים יומיים, כל אחד מותאם לפלטפורמה.

### Input
```ts
{
  tenant: { name, business_type, user_gender, voice_examples },
  yesterday_winners: [...],           // top performing recent posts
  business_calendar: {                 // Hebrew calendar awareness
    is_holiday: boolean,
    is_shabbat_eve: boolean,
    upcoming_events: [...]
  }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "posts": {
      "type": "array",
      "minItems": 3,
      "maxItems": 3,
      "items": {
        "type": "object",
        "properties": {
          "platform": {"type": "string", "enum": ["instagram", "facebook", "tiktok"]},
          "text_he": {
            "type": "string",
            "description": "Post body in Hebrew. Length per platform conventions."
          },
          "hashtags": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Hebrew hashtags relevant to topic"
          },
          "scheduled_for": {
            "type": "string",
            "description": "ISO time. Avoid Shabbat for non-targeted businesses."
          },
          "image_suggestion": {
            "type": "string",
            "description": "Brief description of recommended image (no generation)"
          }
        },
        "required": ["platform", "text_he", "hashtags", "scheduled_for"]
      }
    }
  },
  "required": ["posts"],
  "additionalProperties": false
}
```

### Use Batch API
```ts
// 50% off, 24h SLA — perfect for daily 3-post schedule
const batch = await anthropic.messages.batches.create({
  requests: [
    { custom_id: `${runId}-instagram`, params: {...} },
    { custom_id: `${runId}-facebook`, params: {...} },
    { custom_id: `${runId}-tiktok`, params: {...} },
  ]
});
```

---

## 4. 🧠 Manager Agent (`manager`)

**משך עבודה:** 60-120 שניות (extended thinking)
**Cost בערך (Pro):** ~$0.07 פר run
**Cost חודשי per tenant (Pro):** ~$2.1
**Cost (Business עם Opus):** ~$0.18 פר run = $5.4/חודש

### Description
**הסוכן המקצוע ביותר של Spike.** סיכום אסטרטגי יומי שמסנתז את הפעילות של 8 הסוכנים האחרים, מסמן trends, מציע החלטות.

### Why Sonnet 4.6 + thinking 8000 (not Opus)
- 95% מהאיכות של Opus 4.7 לעברית
- 60% מהעלות
- Opus 4.7 tokenizer מנפח עברית ב-25-35%
- Opus שמור ל-Business tier כ-differentiator

### Input
```ts
{
  tenant: {...},
  today_runs: [...],                    // all 8 other agents' outputs
  weekly_metrics: {
    runs_count, drafts_approved, drafts_rejected,
    revenue, leads_converted
  },
  trends: {
    week_over_week_revenue_change,
    avg_response_time_change,
    sentiment_trend
  }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "headline": {
      "type": "string",
      "description": "One-sentence verdict on the day in Hebrew"
    },
    "weekly_trend": {
      "type": "string",
      "description": "What's improving / what's declining"
    },
    "top_decisions": {
      "type": "array",
      "minItems": 1, "maxItems": 5,
      "items": {
        "type": "object",
        "properties": {
          "title_he": {"type": "string"},
          "rationale_he": {"type": "string"},
          "urgency": {"type": "string", "enum": ["low", "medium", "high"]}
        },
        "required": ["title_he", "rationale_he", "urgency"]
      }
    },
    "red_flags": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Things that need owner's attention"
    },
    "opportunities": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Specific revenue/efficiency opportunities"
    },
    "agent_health": {
      "type": "object",
      "description": "Quick status of each of the 8 other agents"
    }
  },
  "required": ["headline", "top_decisions"],
  "additionalProperties": false
}
```

### Extended thinking config
```ts
thinking: {
  type: 'enabled',
  budget_tokens: 8000
}
```

---

## 5. 🎯 Watcher Agent (`watcher`)

**משך עבודה:** 1-3 שניות (low effort, streaming)
**Cost בערך:** ~$0.0003 פר run
**Cost חודשי per tenant:** ~$1.0 (~3000 runs/month)

### Description
**Real-time triage.** מקבל events מ-`events` table, מחליט: alert / queue / ignore.

### Input
```ts
{
  event: {
    source, event_type, payload, received_at
  },
  recent_alerts: [...]    // last 1h of alerts (avoid duplicates)
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "should_alert": {"type": "boolean"},
    "severity": {"type": "string", "enum": ["info", "warn", "urgent"]},
    "headline_he": {
      "type": "string",
      "description": "Push-notification-style headline (max 80 chars)"
    },
    "recommended_action": {
      "type": "string",
      "description": "What the owner should do next"
    },
    "is_duplicate": {"type": "boolean"}
  },
  "required": ["should_alert", "severity", "is_duplicate"],
  "additionalProperties": false
}
```

### Cache: 5min (high frequency)
Events come every 30s sometimes. 1h cache wastes money on stale prompts. 5min = good balance.

---

## 6. 🧹 Cleanup Agent (`cleanup`)

**משך עבודה:** 30-60 שניות
**Cost בערך:** ~$0.005 פר run (weekly)
**Cost חודשי per tenant:** ~$0.02 (4 runs/month)

### Description
ניקוי שבועי של pipeline — לידים מתים, כפולים, follow-ups חסרים.

### Input
```ts
{
  leads: [...],            // all leads in pipeline
  age_thresholds: { stale_days: 30, dead_days: 90 }
}
```

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "stale_leads": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "lead_id": {"type": "string"},
          "reason_he": {"type": "string"},
          "recommended_action": {
            "type": "string",
            "enum": ["archive", "send_followup", "manual_review"]
          }
        }
      }
    },
    "duplicates": {
      "type": "array",
      "items": {"type": "object"}
    },
    "missing_followup": {
      "type": "array",
      "items": {"type": "object"}
    }
  }
}
```

---

## 7. 💰 Sales Agent (`sales`)

**משך עבודה:** 20-40 שניות
**Cost בערך:** ~$0.018 פר run
**Cost חודשי per tenant:** ~$0.4

### Description
ניתוח deals פתוחים ויצירת follow-up emails בעברית.

### Critical: Cached brand voice
```ts
{
  type: 'text',
  text: BRAND_VOICE_EXAMPLES,  // 6K tokens of past successful emails
  cache_control: { type: 'ephemeral', ttl: '1h' }
}
```

### Input
```ts
{
  open_deals: [...],
  brand_voice_examples: [...],   // cached
  recent_wins: [...]
}
```

### Output
```json
{
  "type": "object",
  "properties": {
    "deals": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "deal_id": {"type": "string"},
          "stage": {"type": "string"},
          "recommended_action": {"type": "string"},
          "draft_message_he": {"type": "string"},
          "urgency": {"type": "string", "enum": ["this_week", "next_week", "later"]}
        }
      }
    }
  }
}
```

---

## 8. 📦 Inventory Agent (`inventory`)

**משך עבודה:** 30-60 שניות (extended thinking 2048)
**Cost בערך:** ~$0.005 פר run
**Cost חודשי per tenant:** ~$0.15

### Description
תחזית ביקוש + alert על מלאי נמוך + סימון מוצרים שמתחילים לרדת.

### Why thinking?
Forecasting דורש reasoning — לא רק כללי-אצבע. Haiku ללא thinking נכשל ב-edge cases (חגים, עונתיות).

### Output
```json
{
  "type": "object",
  "properties": {
    "low_stock": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product_id": {"type": "string"},
          "current_qty": {"type": "integer"},
          "reorder_point": {"type": "integer"},
          "days_until_stockout": {"type": "integer"}
        }
      }
    },
    "demand_forecast_next_7d": {
      "type": "array",
      "items": {"type": "object"}
    },
    "underperforming": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product_id": {"type": "string"},
          "decline_pct": {"type": "number"},
          "suggestion_he": {"type": "string"}
        }
      }
    }
  }
}
```

---

## 9. 🔥 Hot Leads Agent (`hot_leads`)

**משך עבודה:** 2-5 שניות
**Cost בערך:** ~$0.0008 פר run
**Cost חודשי per tenant:** ~$0.5 (~600 runs/month)

### Description
**הסוכן הכי קריטי לאיכות.** מדרג לידים נכנסים, מסמן את החמים ביותר.

### Critical: BUCKETED output (NOT 0-100)
מודלים קטנים (Haiku) מתקבצים סביב 50/70/85 ב-freeform 0-100. **חובה enum.**

### Output Schema
```json
{
  "type": "object",
  "properties": {
    "lead_id": {"type": "string"},
    "bucket": {
      "type": "string",
      "enum": ["cold", "warm", "hot", "burning"],
      "description": "cold=0-25, warm=26-50, hot=51-80, burning=81-100"
    },
    "confidence": {
      "type": "number",
      "minimum": 0, "maximum": 1
    },
    "signals": {
      "type": "object",
      "properties": {
        "recency": {"type": "integer", "minimum": 0, "maximum": 25},
        "engagement": {"type": "integer", "minimum": 0, "maximum": 25},
        "fit": {"type": "integer", "minimum": 0, "maximum": 25},
        "intent": {"type": "integer", "minimum": 0, "maximum": 25}
      },
      "required": ["recency", "engagement", "fit", "intent"]
    },
    "recommended_first_message_he": {
      "type": "string",
      "description": "Opening line for owner to send"
    }
  },
  "required": ["lead_id", "bucket", "signals"],
  "additionalProperties": false
}
```

**Numeric score = sum of signals (deterministic).** Bucket מ-LLM, score from arithmetic.

---

## 10. Cost Summary

### Per-tenant per-month (cached, all 9 active)

| Agent | Cost ($) | Cost (₪) |
|---|---|---|
| Morning | 0.024 | 0.09 |
| Reviews | 2.40 | 8.85 |
| Social | 0.36 | 1.33 |
| Manager (Sonnet+thinking) | 2.10 | 7.74 |
| Watcher | 1.00 | 3.69 |
| Cleanup | 0.02 | 0.07 |
| Sales | 0.40 | 1.48 |
| Inventory | 0.15 | 0.55 |
| Hot leads | 0.50 | 1.84 |
| **Pro Total** | **$6.96** | **₪25.65** |

**Pro tier (₪499): 95% margin** at 100 customers.

**Business tier (₪999) with Opus Manager:** add ~$3/month → ~$10/month total cost = 99% margin.

---

## 11. Build order (per Day-3 onwards)

1. **Day 3:** Morning
2. **Day 5:** Reviews
3. **Day 6:** Social, Sales, Hot leads
4. **Day 7:** Manager, Watcher, Cleanup, Inventory

**Each agent reuses `runAgent()` infrastructure built in Day 3.**
